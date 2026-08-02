import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Firestore } from '@google-cloud/firestore';

const router = express.Router();
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0992165942'
});

const USERS_COLLECTION = firestore.collection('students');
const RATE_LIMIT_COLLECTION = firestore.collection('auth_rate_limits');
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_AUTH_ATTEMPTS = 10;

export function computeRateLimitState(record, now, windowMs = RATE_LIMIT_WINDOW_MS, maxAttempts = MAX_AUTH_ATTEMPTS) {
  if (!record || now - record.startTime > windowMs) {
    return { newRecord: { count: 1, startTime: now }, limited: false };
  }
  const count = record.count + 1;
  return { newRecord: { count, startTime: record.startTime }, limited: count > maxAttempts };
}

function rateLimitKeyFromIp(rawIp) {
  const first = String(rawIp).split(',')[0].trim();
  return first || '127.0.0.1';
}

async function isAuthRateLimited(rawIp) {
  const docRef = RATE_LIMIT_COLLECTION.doc(rateLimitKeyFromIp(rawIp));
  return firestore.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    const record = snap.exists ? snap.data() : null;
    const { newRecord, limited } = computeRateLimitState(record, Date.now());
    tx.set(docRef, newRecord);
    return limited;
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (await isAuthRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many authentication attempts. Please try again in 15 minutes.' });
    }

    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const userDoc = await USERS_COLLECTION.doc(email.toLowerCase()).get();
    if (userDoc.exists) {
      return res.status(400).json({ error: 'Student email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      enrollments: [], // No free course access without verified purchase
      createdAt: new Date().toISOString()
    };

    await USERS_COLLECTION.doc(email.toLowerCase()).set(newStudent);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('CRITICAL: JWT_SECRET environment variable is missing.');
    }

    const token = jwt.sign(
      { email: newStudent.email, fullName: newStudent.fullName },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { fullName, email: newStudent.email, enrollments: newStudent.enrollments }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (await isAuthRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many authentication attempts. Please try again in 15 minutes.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userRef = USERS_COLLECTION.doc(email.toLowerCase());
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const student = doc.data();
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('CRITICAL: JWT_SECRET environment variable is missing.');
    }

    const token = jwt.sign(
      { email: student.email, fullName: student.fullName },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        fullName: student.fullName,
        email: student.email,
        enrollments: student.enrollments || []
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

export default router;

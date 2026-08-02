import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRef = db.collection('users').doc(cleanEmail);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userData = {
      name,
      email: cleanEmail,
      role: 'student',
      createdAt: new Date().toISOString()
    };

    await userRef.set(userData);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      user: { email: cleanEmail, name, role: 'student' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRef = db.collection('users').doc(cleanEmail);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = doc.data();

    res.json({
      success: true,
      user: {
        id: doc.id,
        name: user?.name,
        email: user?.email,
        role: user?.role || 'student'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

export default router;

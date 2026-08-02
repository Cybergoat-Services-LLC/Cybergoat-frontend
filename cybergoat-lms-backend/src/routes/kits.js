import express from 'express';
import { Storage } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const storage = new Storage();
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0992165942'
});

const USERS_COLLECTION = firestore.collection('students');
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'cybergoat-course-kits-prod';

const COURSE_KITS = {
  chfi: 'chfi-digital-kit-v12.zip',
  cciso: 'cciso-executive-kit-v6.zip'
};

// GET /api/kits/download?track=chfi
router.get('/download', authenticateToken, async (req, res) => {
  try {
    const { track } = req.query;
    const requestedTrack = track?.toLowerCase();
    const fileName = COURSE_KITS[requestedTrack];

    if (!fileName) {
      return res.status(400).json({ error: 'Invalid course track requested.' });
    }

    // 1. Entitlement Gate: Check if student has purchased / is enrolled in this course track
    const userEmail = req.user.email;
    const userDoc = await USERS_COLLECTION.doc(userEmail.toLowerCase()).get();

    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Student record not found.' });
    }

    const studentData = userDoc.data();
    const studentEnrollments = studentData?.enrollments || [];

    if (!studentEnrollments.includes(requestedTrack)) {
      return res.status(403).json({ 
        error: `Access Denied: You are not enrolled in the ${requestedTrack.toUpperCase()} course kit. Please complete enrollment to access this courseware.` 
      });
    }

    // 2. Generate 60-Minute Signed V4 Download URL directly from GCP Storage
    const [downloadUrl] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // 1 Hour
      });

    res.json({ track, downloadUrl, expires: '60 minutes' });
  } catch (error) {
    console.error('Signed URL Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate secure download link.' });
  }
});

export default router;

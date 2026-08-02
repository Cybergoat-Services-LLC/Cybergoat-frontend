import express from 'express';
import { Storage } from '@google-cloud/storage';
import { db } from '../config/firebase.js';

const router = express.Router();
const storage = new Storage();
const BUCKET_NAME = 'cybergoat-course-kits-prod';

const COURSE_KITS = {
  'chfi': 'chfi-digital-kit-v12.zip',
  'cciso': 'cciso-executive-kit-v6.zip',
  'ceh': 'ceh-v12-labs-kit.zip'
};

// GET /api/kits/download?track=chfi&studentId=xxx
router.get('/download', async (req, res) => {
  try {
    const { track, studentId } = req.query;

    if (!track || typeof track !== 'string') {
      return res.status(400).json({ error: 'Valid course track parameter is required.' });
    }

    const fileName = COURSE_KITS[track.toLowerCase()];

    if (!fileName) {
      return res.status(400).json({ error: `Invalid course track specified: ${track}` });
    }

    // 1. Verify Student Enrollment in Firestore (if studentId provided)
    if (studentId) {
      try {
        const enrollmentRef = db.collection('enrollments').doc(`${studentId}_${track.toLowerCase()}`);
        const doc = await enrollmentRef.get();

        if (doc.exists && doc.data().status !== 'active') {
          return res.status(403).json({ error: 'Student enrollment has expired or is inactive.' });
        }
      } catch (dbErr) {
        console.warn('Firestore enrollment verification notice:', dbErr);
      }
    }

    // 2. Generate 60-Minute V4 Signed Download URL
    const [signedUrl] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 60 minutes
      });

    res.json({
      success: true,
      track: track.toLowerCase(),
      downloadUrl: signedUrl,
      expiresIn: '60 minutes'
    });
  } catch (error) {
    console.error('GCP Storage Signed URL Error:', error);
    res.status(500).json({ error: 'Failed to generate secure download link from GCP Cloud Storage.' });
  }
});

export default router;

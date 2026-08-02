import express from 'express';
import { Firestore } from '@google-cloud/firestore';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0992165942'
});

const PROGRESS_COLLECTION = firestore.collection('student_progress');

// POST /api/progress/update
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { courseId, completedModules, quizScores } = req.body;
    const userEmail = req.user.email;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required.' });
    }

    const docId = `${userEmail}_${courseId}`;
    const progressData = {
      userEmail,
      courseId,
      completedModules: completedModules || [],
      quizScores: quizScores || {},
      lastUpdated: new Date().toISOString()
    };

    await PROGRESS_COLLECTION.doc(docId).set(progressData, { merge: true });

    res.json({ message: 'Progress saved successfully.', progress: progressData });
  } catch (error) {
    console.error('Progress Update Error:', error);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

// GET /api/progress/:courseId
router.get('/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = req.user.email;

    const docId = `${userEmail}_${courseId}`;
    const doc = await PROGRESS_COLLECTION.doc(docId).get();

    if (!doc.exists) {
      return res.json({ completedModules: [], quizScores: {} });
    }

    res.json(doc.data());
  } catch (error) {
    console.error('Fetch Progress Error:', error);
    res.status(500).json({ error: 'Failed to retrieve progress.' });
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import kitRoutes from './routes/kits.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Security Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://cybergoat.ae',
  'https://lms.cybergoat.ae',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoint (For Cloud Run Liveness Probes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CyberGOAT LMS Backend API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/progress', progressRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`CyberGOAT LMS API running on port ${PORT}`);
});

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import kitsRoutes from './routes/kits.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; // GCP Cloud Run injects PORT automatically

// Enable CORS for Vercel production frontend & localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://cybergoat.ae',
  'https://www.cybergoat.ae',
  'https://cybergoat-frontend.vercel.app',
  'https://lms.cybergoat.ae'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all during dev transition
    }
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CyberGOAT Services LLC — GCP Cloud Run LMS API',
    project: 'gen-lang-client-0992165942',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kits', kitsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CyberGOAT Cloud Run Backend listening on port ${PORT}`);
});

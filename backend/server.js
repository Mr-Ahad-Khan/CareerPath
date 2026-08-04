import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './db/mongodb.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import simulationRoutes from './routes/simulations.js';
import mentorRoutes from './routes/mentors.js';
import connectionRoutes from './routes/connections.js';
import milestoneRoutes from './routes/milestones.js';
import journalRoutes from './routes/journal.js';
import resumeRoutes from './routes/resume.js';
import adminRoutes from './routes/admin.js';
import { seedIfEmpty } from './scripts/seed.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const app = express();
const PORT = process.env.API_PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Slow down and try again shortly.' },
});
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'careerpath-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, _req, res, _next) => {
  console.error('[api error]', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error.' });
});

async function start() {
  try {
    await connectDatabase();
    await seedIfEmpty();
    app.listen(PORT, () => console.log(`[api] CareerPath API on :${PORT}`));
  } catch (err) {
    console.error('[startup] failed', err);
    process.exit(1);
  }
}

start();

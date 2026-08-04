import { Router } from 'express';
import { Mentor } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const { industry, specialty, q } = req.query;
    const filter = {};
    if (industry && industry !== 'all') filter.industry = industry;
    if (specialty && specialty !== 'all') filter.specialty = specialty;
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'i');
      filter.$or = [{ name: pattern }, { specialty: pattern }, { company: pattern }, { bio: pattern }];
    }
    const mentors = await Mentor.find(filter).sort({ rating: -1, menteeCount: -1 });
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
});

router.get('/industries', async (_req, res, next) => {
  try {
    const mentors = await Mentor.find();
    const industries = [...new Set(mentors.map((m) => m.industry))].sort();
    const specialties = [...new Set(mentors.map((m) => m.specialty))].sort();
    res.json({ industries, specialties });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });
    res.json({ mentor });
  } catch (err) {
    next(err);
  }
});

export default router;

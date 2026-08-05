import { Router } from 'express';
import mongoose from 'mongoose';
import Milestone from '../models/Milestone.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const { pathId } = req.query;
    const filter = { userId: req.user.id };
    if (pathId) filter.pathId = pathId;
    const milestones = await Milestone.find(filter).sort({ year: 1, orderIndex: 1 });
    res.json({ milestones });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const milestone = await Milestone.findOne({ _id: req.params.id, userId: req.user.id });
    if (!milestone) return res.status(404).json({ error: 'Milestone not found.' });
    const allowed = ['status', 'title', 'description'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
    Object.assign(milestone, updates);
    await milestone.save();
    res.json({ milestone });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const m = req.body || {};
    const title = typeof m.title === 'string' ? m.title.trim() : '';
    const quarter = typeof m.quarter === 'string' ? m.quarter.trim() : '';
    const year = Number(m.year);

    if (!title || !quarter) {
      return res.status(400).json({ error: 'Title and quarter are required.' });
    }
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      return res.status(400).json({ error: 'Quarter must be Q1, Q2, Q3, or Q4.' });
    }
    if (!Number.isInteger(year) || year < 0 || year > 5) {
      return res.status(400).json({ error: 'Year must be a whole number from 0 to 5.' });
    }
    if (m.pathId && !mongoose.isObjectIdOrHexString(m.pathId)) {
      return res.status(400).json({ error: 'Path ID is invalid.' });
    }

    const milestone = await Milestone.create({
      userId: req.user.id,
      pathId: m.pathId || null,
      quarter,
      year,
      category: typeof m.category === 'string' && m.category.trim() ? m.category.trim() : 'Learning',
      title,
      description: typeof m.description === 'string' ? m.description.trim() : '',
      status: 'todo',
      orderIndex: Number.isInteger(Number(m.orderIndex)) ? Number(m.orderIndex) : 0,
    });
    res.status(201).json({ milestone });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Milestone.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (!deleted.deletedCount) return res.status(404).json({ error: 'Milestone not found.' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

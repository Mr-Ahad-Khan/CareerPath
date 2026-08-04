import { Router } from 'express';
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
    const m = req.body;
    if (!m.title || !m.quarter) {
      return res.status(400).json({ error: 'Title and quarter are required.' });
    }
    const milestone = await Milestone.create({
      userId: req.user.id,
      pathId: m.pathId || null,
      quarter: m.quarter,
      year: m.year || 0,
      category: m.category || 'Learning',
      title: m.title,
      description: m.description || '',
      status: 'todo',
      orderIndex: m.orderIndex || 0,
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

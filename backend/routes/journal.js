import { Router } from 'express';
import JournalEntry from '../models/JournalEntry.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const entries = await JournalEntry.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC'], ['id', 'DESC']],
    });
    res.json({ entries });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { activity, skill, durationMinutes, note, date } = req.body;
    if (!activity) return res.status(400).json({ error: 'Activity is required.' });
    const entry = await JournalEntry.create({
      userId: req.user.id,
      activity,
      skill: skill || null,
      durationMinutes: durationMinutes || 30,
      note: note || null,
      date: date || new Date().toISOString().slice(0, 10),
    });
    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await JournalEntry.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ error: 'Entry not found.' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const entries = await JournalEntry.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    const dates = [...new Set(entries.map((e) => e.date))];
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let cursor = today;
    const dateSet = new Set(dates);
    while (dateSet.has(cursor)) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    }
    const last7 = [...new Set(
      entries
        .filter((e) => {
          const diff = (new Date(today) - new Date(e.date)) / 86400000;
          return diff <= 7;
        })
        .map((e) => e.date)
    )].length;

    res.json({
      streak,
      activeDaysLast7: last7,
      totalSessions: entries.length,
      totalMinutes: entries.reduce((s, e) => s + e.durationMinutes, 0),
    });
  } catch (err) {
    next(err);
  }
});

export default router;

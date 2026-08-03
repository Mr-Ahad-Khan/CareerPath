import { Router } from 'express';
import { Mentor } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const { industry, specialty, q } = req.query;
    const where = {};
    if (industry && industry !== 'all') where.industry = industry;
    if (specialty && specialty !== 'all') where.specialty = specialty;
    if (q) {
      const { Op } = await import('sequelize');
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { specialty: { [Op.like]: `%${q}%` } },
        { company: { [Op.like]: `%${q}%` } },
        { bio: { [Op.like]: `%${q}%` } },
      ];
    }
    const mentors = await Mentor.findAll({
      where,
      order: [['rating', 'DESC'], ['mentee_count', 'DESC']],
    });
    res.json({ mentors });
  } catch (err) {
    next(err);
  }
});

router.get('/industries', async (_req, res, next) => {
  try {
    const mentors = await Mentor.findAll();
    const industries = [...new Set(mentors.map((m) => m.industry))].sort();
    const specialties = [...new Set(mentors.map((m) => m.specialty))].sort();
    res.json({ industries, specialties });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mentor = await Mentor.findByPk(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });
    res.json({ mentor });
  } catch (err) {
    next(err);
  }
});

export default router;

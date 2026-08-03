import { Router } from 'express';
import SkillProfile from '../models/SkillProfile.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const profiles = await SkillProfile.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']],
    });
    res.json({ profiles });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const profile = await SkillProfile.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const p = req.body;
    if (!p.educationLevel || !p.educationField || !p.skills) {
      return res.status(400).json({ error: 'Education and skills are required.' });
    }
    const profile = await SkillProfile.create({
      userId: req.user.id,
      educationLevel: p.educationLevel,
      educationField: p.educationField,
      graduationYear: p.graduationYear || null,
      currentRole: p.currentRole || null,
      experienceYears: p.experienceYears || 0,
      skills: p.skills || [],
      interests: p.interests || [],
      constraints: p.constraints || {},
      location: p.location || null,
      targetRole: p.targetRole || null,
      currency: p.currency || 'INR',
    });
    res.status(201).json({ profile });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const profile = await SkillProfile.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    await profile.update(req.body);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await SkillProfile.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ error: 'Profile not found.' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

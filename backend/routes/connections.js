import { Router } from 'express';
import { ConnectionRequest, Mentor } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const requests = await ConnectionRequest.find({ studentId: req.user.id })
      .populate('mentorId').sort({ createdAt: -1 });
    const output = requests.map((request) => ({ ...request.toObject(), mentor: request.mentorId }));
    res.json({ requests: output });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { mentorId, message } = req.body;
    if (!mentorId || !message) {
      return res.status(400).json({ error: 'Mentor and message are required.' });
    }
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });

    const existing = await ConnectionRequest.findOne({ studentId: req.user.id, mentorId, status: 'pending' });
    if (existing) {
      return res.status(409).json({ error: 'You already have a pending request with this mentor.' });
    }

    const request = await ConnectionRequest.create({
      studentId: req.user.id,
      mentorId,
      message,
    });
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const request = await ConnectionRequest.findOne({ _id: req.params.id, studentId: req.user.id });
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    request.status = 'declined';
    await request.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

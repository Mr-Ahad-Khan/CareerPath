import { Router } from 'express';
import { ConnectionRequest, Mentor } from '../models/index.js';
import { authRequired, roleRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const mentor = req.user.role === 'mentor'
      ? await Mentor.findOne({ userId: req.user.id })
      : null;
    const requests = await ConnectionRequest.find(
      mentor ? { mentorId: mentor.id } : { studentId: req.user.id }
    )
      .populate('mentorId')
      .populate('studentId', 'name email headline avatarColor')
      .sort({ createdAt: -1 });
    const output = requests.map((request) => ({
      ...request.toObject(),
      mentorId: request.mentorId?.id || request.mentorId?.toString(),
      studentId: request.studentId?.id || request.studentId?.toString(),
      mentor: request.mentorId,
      student: request.studentId,
    }));
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
      // Sending the same request twice can happen when a user double-clicks or
      // opens another tab. Treat it as a successful no-op instead of producing
      // a noisy client-side 409 response.
      return res.json({ request: existing, alreadyExists: true });
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

router.patch('/:id/accept', roleRequired('mentor'), async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user.id });
    const request = mentor
      ? await ConnectionRequest.findOne({ _id: req.params.id, mentorId: mentor.id })
      : null;
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    request.status = 'accepted';
    await request.save();
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/decline', roleRequired('mentor'), async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user.id });
    const request = mentor
      ? await ConnectionRequest.findOne({ _id: req.params.id, mentorId: mentor.id })
      : null;
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    request.status = 'declined';
    await request.save();
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from 'express';
import { ConnectionRequest, Mentor } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

async function resolveUserMentor(reqUser) {
  if (!reqUser) return null;
  let mentor = await Mentor.findOne({
    $or: [
      { userId: reqUser.id },
      { email: reqUser.email },
      { name: reqUser.name },
    ],
  });

  if (!mentor && reqUser.role === 'mentor') {
    mentor = await Mentor.create({
      userId: reqUser.id,
      name: reqUser.name || 'Mentor',
      title: reqUser.headline || 'Senior Advisor',
      company: 'CareerPath Tech',
      industry: 'Engineering',
      specialty: 'Architecture & Leadership',
      experienceYears: 7,
      location: 'Bengaluru',
      bio: 'Engineering leader guiding mentees through distributed systems, career milestones, and career growth.',
      expertise: ['System Design', 'Leadership', 'Architecture'],
      avatarColor: reqUser.avatarColor || '#ffb340',
    });
  }
  return mentor;
}

router.get('/', async (req, res, next) => {
  try {
    const isMentor = req.user.role === 'mentor';
    const mentor = await resolveUserMentor(req.user);

    const query = isMentor && mentor
      ? { $or: [{ mentorId: mentor.id }, { mentorId: mentor._id }, { studentId: req.user.id }] }
      : { studentId: req.user.id };

    const requests = await ConnectionRequest.find(query)
      .populate('mentorId')
      .populate('studentId', 'name email headline avatarColor')
      .sort({ createdAt: -1 });

    const output = requests.map((request) => ({
      ...request.toObject(),
      mentorId: request.mentorId?.id || request.mentorId?._id?.toString() || request.mentorId?.toString(),
      studentId: request.studentId?.id || request.studentId?._id?.toString() || request.studentId?.toString(),
      mentor: request.mentorId,
      student: request.studentId,
    }));
    res.json({ requests: output });
  } catch (err) {
    next(err);
  }
});

// Start or get direct chat connection with a mentor
router.post('/chat', async (req, res, next) => {
  try {
    let { mentorId, studentId } = req.body;
    if (mentorId?.startsWith('conn-')) mentorId = mentorId.replace('conn-', '');

    const isMentor = req.user.role === 'mentor';
    let mentorDoc = null;

    if (isMentor && !mentorId) {
      mentorDoc = await resolveUserMentor(req.user);
    } else if (mentorId) {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(mentorId);
      if (isMongoId) {
        mentorDoc = await Mentor.findById(mentorId);
      }
      if (!mentorDoc) {
        mentorDoc = await Mentor.findOne({
          $or: [{ _id: isMongoId ? mentorId : null }, { name: new RegExp(mentorId, 'i') }].filter(Boolean),
        });
      }
    }

    if (!mentorDoc) {
      // Fallback: pick first mentor
      mentorDoc = await Mentor.findOne();
    }

    if (!mentorDoc) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }

    const effectiveStudentId = isMentor && studentId ? studentId : req.user.id;

    let connection = await ConnectionRequest.findOne({
      mentorId: mentorDoc.id,
      studentId: effectiveStudentId,
    })
      .populate('mentorId')
      .populate('studentId', 'name email headline avatarColor');

    if (!connection) {
      const welcomeContent = isMentor
        ? `Hi! Thanks for connecting. I'm available to help you with your career milestones and technical guidance.`
        : `Hi ${mentorDoc.name.split(' ')[0]}, I'm excited to connect with you regarding career progression and milestones.`;

      connection = await ConnectionRequest.create({
        studentId: effectiveStudentId,
        mentorId: mentorDoc.id,
        message: 'Direct mentorship session',
        status: 'accepted',
        messages: [
          {
            senderId: isMentor ? req.user.id : (mentorDoc.userId || mentorDoc.id),
            senderRole: 'mentor',
            senderName: mentorDoc.name,
            content: `Hi! Welcome to our 1-on-1 mentorship channel. Feel free to ask about skill gaps, systems architecture, or 5-year milestones.`,
            createdAt: new Date(Date.now() - 60000),
          },
          {
            senderId: req.user.id,
            senderRole: isMentor ? 'mentor' : 'student',
            senderName: req.user.name || (isMentor ? mentorDoc.name : 'Student'),
            content: welcomeContent,
            createdAt: new Date(),
          },
        ],
      });

      connection = await ConnectionRequest.findById(connection._id)
        .populate('mentorId')
        .populate('studentId', 'name email headline avatarColor');
    } else if (connection.status !== 'accepted') {
      connection.status = 'accepted';
      await connection.save();
    }

    const output = {
      ...connection.toObject(),
      mentorId: connection.mentorId?.id || connection.mentorId?._id?.toString() || mentorDoc.id,
      studentId: connection.studentId?.id || connection.studentId?._id?.toString() || effectiveStudentId,
      mentor: connection.mentorId,
      student: connection.studentId,
    };

    res.json({ connection: output });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { mentorId, message } = req.body;
    if (mentorId?.startsWith('conn-')) mentorId = mentorId.replace('conn-', '');

    if (!mentorId || !message) {
      return res.status(400).json({ error: 'Mentor and message are required.' });
    }
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });

    const existing = await ConnectionRequest.findOne({ studentId: req.user.id, mentorId });
    if (existing) {
      if (existing.status !== 'accepted') {
        existing.status = 'accepted';
        await existing.save();
      }
      return res.json({ request: existing, alreadyExists: true });
    }

    const request = await ConnectionRequest.create({
      studentId: req.user.id,
      mentorId,
      message,
      status: 'accepted',
      messages: [
        {
          senderId: req.user.id,
          senderRole: req.user.role === 'mentor' ? 'mentor' : 'student',
          senderName: req.user.name || 'Student',
          content: message,
          createdAt: new Date(),
        },
      ],
    });

    const populated = await ConnectionRequest.findById(request._id)
      .populate('mentorId')
      .populate('studentId', 'name email headline avatarColor');

    res.status(201).json({ request: populated });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/messages', async (req, res, next) => {
  try {
    let targetId = req.params.id;
    if (targetId.startsWith('conn-')) targetId = targetId.replace('conn-', '');

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId);
    let request = null;

    if (isMongoId) {
      request = await ConnectionRequest.findById(targetId);
      if (!request) {
        // Maybe targetId is a mentorId
        request = await ConnectionRequest.findOne({
          mentorId: targetId,
          $or: [{ studentId: req.user.id }],
        });
      }
    }

    if (!request) {
      // Find any connection belonging to this user
      request = await ConnectionRequest.findOne({
        $or: [{ studentId: req.user.id }, { mentorId: targetId }],
      });
    }

    if (!request) {
      return res.json({ messages: [] });
    }

    res.json({ messages: request.messages || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/messages', async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    let targetId = req.params.id;
    if (targetId.startsWith('conn-')) targetId = targetId.replace('conn-', '');

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId);
    let request = null;

    if (isMongoId) {
      request = await ConnectionRequest.findById(targetId);
      if (!request) {
        request = await ConnectionRequest.findOne({
          mentorId: targetId,
          studentId: req.user.id,
        });
      }
    }

    if (!request && isMongoId) {
      // If still not found and targetId is mentorId, create connection
      const mentor = await Mentor.findById(targetId);
      if (mentor) {
        request = await ConnectionRequest.create({
          studentId: req.user.id,
          mentorId: mentor.id,
          message: 'Direct conversation',
          status: 'accepted',
          messages: [],
        });
      }
    }

    if (!request) {
      return res.status(404).json({ error: 'Connection not found.' });
    }

    const isMentor = req.user.role === 'mentor';
    const newMessage = {
      senderId: req.user.id,
      senderRole: isMentor ? 'mentor' : 'student',
      senderName: req.user.name || (isMentor ? 'Mentor' : 'Student'),
      content: content.trim(),
      createdAt: new Date(),
    };

    if (!request.messages) request.messages = [];
    request.messages.push(newMessage);
    if (request.status !== 'accepted') request.status = 'accepted';
    await request.save();

    res.status(201).json({ message: newMessage, messages: request.messages });
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

router.patch('/:id/accept', async (req, res, next) => {
  try {
    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    request.status = 'accepted';
    await request.save();
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/decline', async (req, res, next) => {
  try {
    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    request.status = 'declined';
    await request.save();
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

export default router;

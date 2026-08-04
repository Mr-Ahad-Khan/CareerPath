import { Router } from 'express';
import User from '../models/User.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = Router();

function setCookie(res, token) {
  res.cookie('cp_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    headline: user.headline,
    avatarColor: user.avatarColor,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, headline } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const allowedRoles = ['student', 'mentor', 'admin'];
    const finalRole = allowedRoles.includes(role) ? role : 'student';
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: finalRole,
      headline: headline || null,
    });
    const token = signToken(user);
    setCookie(res, token);
    res.status(201).json({ user: publicUser(user), token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const token = signToken(user);
    setCookie(res, token);
    res.json({ user: publicUser(user), token });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('cp_token');
  res.json({ ok: true });
});

router.get('/me', authRequired, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;

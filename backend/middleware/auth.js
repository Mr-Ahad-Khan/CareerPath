import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SECRET = process.env.JWT_SECRET || 'careerpath-dev-secret-change-in-prod';

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: '7d',
  });
}

export async function authRequired(req, _res, next) {
  const header = req.headers.authorization;
  const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const cookieToken = req.cookies?.cp_token;
  const token = bearer || cookieToken;

  if (!token) {
    return next({ status: 401, message: 'Authentication required.' });
  }
  try {
    const payload = jwt.verify(token, SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return next({ status: 401, message: 'Session invalid.' });
    req.user = user;
    next();
  } catch {
    next({ status: 401, message: 'Session expired. Please sign in again.' });
  }
}

export function roleRequired(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next({ status: 401, message: 'Authentication required.' });
    if (!roles.includes(req.user.role)) {
      return next({ status: 403, message: 'You do not have access to this section.' });
    }
    next();
  };
}

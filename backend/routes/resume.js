import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { parseResume, realityCheck } from '../engine/resume.js';

const router = Router();
router.use(authRequired);

router.post('/analyze', (req, res, next) => {
  try {
    const { resumeText, skillGaps } = req.body;
    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required.' });
    }
    if (resumeText.length < 20) {
      return res.status(400).json({ error: 'That looks too short to parse. Paste your full resume text.' });
    }
    const parsed = parseResume(resumeText);
    const check = realityCheck(parsed.skills, skillGaps || []);
    res.json({ parsed, realityCheck: check });
  } catch (err) {
    next(err);
  }
});

export default router;

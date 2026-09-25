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
    const effectiveSkillGaps = (Array.isArray(skillGaps) && skillGaps.length > 0)
      ? skillGaps
      : [
          { skill: 'System Design', demand: 0.85, category: 'Architecture' },
          { skill: 'Docker', demand: 0.78, category: 'Cloud' },
          { skill: 'Kubernetes', demand: 0.74, category: 'Cloud' },
          { skill: 'TypeScript', demand: 0.89, category: 'Technical' },
          { skill: 'Distributed Systems', demand: 0.82, category: 'Architecture' },
          { skill: 'CI/CD', demand: 0.80, category: 'DevOps' },
        ];
    const check = realityCheck(parsed.skills, effectiveSkillGaps);
    res.json({ parsed, realityCheck: check });
  } catch (err) {
    next(err);
  }
});

export default router;

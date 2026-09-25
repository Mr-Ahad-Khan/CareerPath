import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { parseResume, realityCheck } from '../engine/resume.js';

const router = Router();
router.use(authRequired);

router.post('/analyze', (req, res, next) => {
  try {
    const { resumeText, skillGaps, targetRole } = req.body;
    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required.' });
    }
    if (resumeText.length < 20) {
      return res.status(400).json({ error: 'That looks too short to parse. Paste your full resume text.' });
    }
    const parsed = parseResume(resumeText);

    let effectiveSkillGaps = Array.isArray(skillGaps) && skillGaps.length > 0 ? skillGaps : null;

    if (!effectiveSkillGaps) {
      const roleKey = String(targetRole || '').toLowerCase();
      if (roleKey.includes('front')) {
        effectiveSkillGaps = [
          { skill: 'React', demand: 0.95, category: 'Frontend' },
          { skill: 'JavaScript', demand: 0.92, category: 'Language' },
          { skill: 'TypeScript', demand: 0.90, category: 'Language' },
          { skill: 'CSS', demand: 0.88, category: 'Styling' },
          { skill: 'Next.js', demand: 0.85, category: 'Frontend' },
          { skill: 'Web Performance', demand: 0.82, category: 'Performance' },
          { skill: 'REST API', demand: 0.80, category: 'Networking' },
          { skill: 'Testing', demand: 0.78, category: 'Quality' },
          { skill: 'Accessibility', demand: 0.75, category: 'Standards' },
        ];
      } else if (roleKey.includes('back')) {
        effectiveSkillGaps = [
          { skill: 'Node.js', demand: 0.92, category: 'Backend' },
          { skill: 'SQL', demand: 0.90, category: 'Database' },
          { skill: 'System Design', demand: 0.88, category: 'Architecture' },
          { skill: 'PostgreSQL', demand: 0.85, category: 'Database' },
          { skill: 'Docker', demand: 0.82, category: 'Cloud' },
          { skill: 'Distributed Systems', demand: 0.80, category: 'Architecture' },
          { skill: 'Redis', demand: 0.78, category: 'Caching' },
          { skill: 'REST API', demand: 0.85, category: 'Networking' },
          { skill: 'Kubernetes', demand: 0.74, category: 'Cloud' },
        ];
      } else {
        // Full-Stack Developer default
        effectiveSkillGaps = [
          { skill: 'React', demand: 0.92, category: 'Frontend' },
          { skill: 'Node.js', demand: 0.90, category: 'Backend' },
          { skill: 'TypeScript', demand: 0.88, category: 'Language' },
          { skill: 'SQL', demand: 0.85, category: 'Database' },
          { skill: 'REST API', demand: 0.86, category: 'Backend' },
          { skill: 'Docker', demand: 0.78, category: 'Cloud' },
          { skill: 'System Design', demand: 0.82, category: 'Architecture' },
          { skill: 'Next.js', demand: 0.80, category: 'Frontend' },
          { skill: 'CI/CD', demand: 0.75, category: 'DevOps' },
        ];
      }
    }

    const check = realityCheck(parsed.skills, effectiveSkillGaps);
    res.json({ parsed, realityCheck: check });
  } catch (err) {
    next(err);
  }
});

export default router;

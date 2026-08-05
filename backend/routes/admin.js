import { Router } from 'express';
import { User, SkillProfile, Simulation, SimulationPath, ConnectionRequest, Mentor } from '../models/index.js';
import { authRequired, roleRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired, roleRequired('admin'));

router.get('/overview', async (_req, res, next) => {
  try {
    const [userCount, profileCount, simCount, mentorCount, pendingCount] = await Promise.all([
      User.count(),
      SkillProfile.count(),
      Simulation.count(),
      Mentor.count(),
      ConnectionRequest.countDocuments({ status: 'pending' }),
    ]);
    res.json({ userCount, profileCount, simCount, mentorCount, pendingCount });
  } catch (err) {
    next(err);
  }
});

router.get('/trends', async (_req, res, next) => {
  try {
    const sims = await Simulation.find();
    const profiles = await SkillProfile.find();

    const roleCount = {};
    const skillCount = {};
    let salaryGrowthSum = 0;
    let salaryGrowthCount = 0;

    for (const sim of sims) {
      const paths = await SimulationPath.find({ simulationId: sim._id });
      for (const path of paths) {
        const finalRole = path.trajectory?.[path.trajectory.length - 1]?.role;
        if (finalRole) roleCount[finalRole] = (roleCount[finalRole] || 0) + 1;
        if (path.startSalary && path.finalSalary) {
          salaryGrowthSum += (path.finalSalary - path.startSalary) / path.startSalary;
          salaryGrowthCount++;
        }
        for (const gap of path.skillGaps || []) {
          skillCount[gap.skill] = (skillCount[gap.skill] || 0) + 1;
        }
      }
    }

    const topRoles = Object.entries(roleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([role, count]) => ({ role, count }));

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    const avgSalaryGrowth = salaryGrowthCount
      ? Math.round((salaryGrowthSum / salaryGrowthCount) * 100)
      : 0;

    const interestCount = {};
    for (const p of profiles) {
      for (const i of p.interests || []) {
        interestCount[i] = (interestCount[i] || 0) + 1;
      }
    }
    const topInterests = Object.entries(interestCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([interest, count]) => ({ interest, count }));

    res.json({
      topRoles,
      topSkills,
      topInterests,
      avgSalaryGrowth,
      totalSimulations: sims.length,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find().select('name email role headline createdAt').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from 'express';
import { Simulation, SimulationPath, SkillProfile, Milestone } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';
import { generateSimulation, buildMilestones } from '../engine/simulation.js';

const router = Router();
router.use(authRequired);

async function serializeSimulation(sim) {
  const paths = await SimulationPath.findAll({
    where: { simulationId: sim.id },
    order: [['id', 'ASC']],
  });
  return {
    id: sim.id,
    name: sim.name,
    profileId: sim.profileId,
    whatIf: sim.whatIf,
    summary: sim.summary,
    isStarred: sim.isStarred,
    createdAt: sim.createdAt,
    paths: paths.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      description: p.description,
      riskLevel: p.riskLevel,
      satisfactionScore: p.satisfactionScore,
      confidenceScore: p.confidenceScore,
      startSalary: p.startSalary,
      finalSalary: p.finalSalary,
      trajectory: p.trajectory,
      skillGaps: p.skillGaps,
    })),
  };
}

router.get('/', async (req, res, next) => {
  try {
    const sims = await Simulation.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']],
    });
    const out = [];
    for (const s of sims) {
      const paths = await SimulationPath.findAll({
        where: { simulationId: s.id },
        order: [['id', 'ASC']],
      });
      out.push({
        id: s.id,
        name: s.name,
        isStarred: s.isStarred,
        createdAt: s.createdAt,
        whatIf: s.whatIf,
        summary: s.summary,
        pathCount: paths.length,
        topSalary: Math.max(...paths.map((p) => p.finalSalary), 0),
        pathTitles: paths.map((p) => p.title),
      });
    }
    res.json({ simulations: out });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    const serialized = await serializeSimulation(sim);
    if (sim.profileId) {
      const profile = await SkillProfile.findByPk(sim.profileId);
      serialized.profile = profile;
    }
    res.json({ simulation: serialized });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { profileId, whatIf, name } = req.body;
    let profile;
    if (profileId) {
      profile = await SkillProfile.findOne({
        where: { id: profileId, userId: req.user.id },
      });
    }
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const { paths, summary } = generateSimulation(profile, whatIf);

    const sim = await Simulation.create({
      userId: req.user.id,
      profileId: profile.id,
      name: name || `${profile.educationField} simulation`,
      whatIf: whatIf || null,
      summary,
    });

    for (const path of paths) {
      const created = await SimulationPath.create({
        simulationId: sim.id,
        code: path.code,
        title: path.title,
        description: path.description,
        riskLevel: path.riskLevel,
        satisfactionScore: path.satisfactionScore,
        confidenceScore: path.confidenceScore,
        trajectory: path.trajectory,
        skillGaps: path.skillGaps,
        startSalary: path.startSalary,
        finalSalary: path.finalSalary,
      });

      const milestones = buildMilestones(path, req.user.id, created.id);
      await Milestone.bulkCreate(milestones);
    }

    res.status(201).json({ simulation: await serializeSimulation(sim) });
  } catch (err) {
    next(err);
  }
});

router.post('/preview', async (req, res, next) => {
  try {
    const { profile, whatIf } = req.body;
    if (!profile || !profile.skills) {
      return res.status(400).json({ error: 'A profile payload is required.' });
    }
    const { paths, summary } = generateSimulation(profile, whatIf);
    res.json({ paths, summary });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/star', async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    await sim.update({ isStarred: !sim.isStarred });
    res.json({ isStarred: sim.isStarred });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    await Milestone.destroy({ where: { userId: req.user.id } });
    await SimulationPath.destroy({ where: { simulationId: sim.id } });
    await sim.destroy();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

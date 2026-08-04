import { Router } from 'express';
import { Simulation, SimulationPath, SkillProfile, Milestone } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';
import { generateSimulation, buildMilestones } from '../engine/simulation.js';

const router = Router();
router.use(authRequired);

async function serializeSimulation(sim) {
  const paths = await SimulationPath.find({ simulationId: sim.id }).sort({ _id: 1 });
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
    const sims = await Simulation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const out = [];
    for (const s of sims) {
      const paths = await SimulationPath.find({ simulationId: s.id }).sort({ _id: 1 });
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
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    const serialized = await serializeSimulation(sim);
    if (sim.profileId) {
      const profile = await SkillProfile.findById(sim.profileId);
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
      profile = await SkillProfile.findOne({ _id: profileId, userId: req.user.id });
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
      await Milestone.insertMany(milestones);
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
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    sim.isStarred = !sim.isStarred;
    await sim.save();
    res.json({ isStarred: sim.isStarred });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!sim) return res.status(404).json({ error: 'Simulation not found.' });
    const pathIds = (await SimulationPath.find({ simulationId: sim.id }).select('_id')).map((path) => path._id);
    await Milestone.deleteMany({ userId: req.user.id, pathId: { $in: pathIds } });
    await SimulationPath.deleteMany({ simulationId: sim.id });
    await sim.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

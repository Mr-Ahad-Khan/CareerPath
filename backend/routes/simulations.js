import { Router } from "express";
import {
  Milestone,
  Simulation,
  SimulationPath,
  SkillProfile,
} from "../models/index.js";
import { authRequired } from "../middleware/auth.js";
import { buildMilestones, generateSimulation } from "../engine/simulation.js";

const router = Router();

router.use(authRequired);

const userIdFor = (req) => req.user?._id || req.user?.id;

function serializePath(path) {
  return {
    _id: path._id,
    id: path._id.toString(),
    code: path.code,
    title: path.title,
    description: path.description,
    riskLevel: path.riskLevel,
    satisfactionScore: path.satisfactionScore,
    confidenceScore: path.confidenceScore,
    startSalary: path.startSalary,
    finalSalary: path.finalSalary,
    trajectory: path.trajectory || [],
    skillGaps: path.skillGaps || [],
  };
}

function runLabel(name, runNumber, totalRuns) {
  return totalRuns > 1 ? `${name} · Run ${runNumber}` : name;
}

async function serializeSimulation(sim, displayName = sim.name) {
  const paths = await SimulationPath.find({ simulationId: sim._id }).sort({
    _id: 1,
  });

  return {
    _id: sim._id,
    id: sim._id.toString(),
    name: displayName,
    profileId: sim.profileId,
    whatIf: sim.whatIf,
    summary: sim.summary,
    isStarred: sim.isStarred,
    createdAt: sim.createdAt,
    updatedAt: sim.updatedAt,
    paths: paths.map(serializePath),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const userId = userIdFor(req);
    const simulations = await Simulation.find({ userId }).sort({
      createdAt: -1,
    });
    const nameTotals = simulations.reduce((totals, sim) => {
      totals.set(sim.name, (totals.get(sim.name) || 0) + 1);
      return totals;
    }, new Map());
    const nameRuns = new Map();
    const response = await Promise.all(
      simulations.map(async (sim) => {
        const runNumber = (nameRuns.get(sim.name) || 0) + 1;
        nameRuns.set(sim.name, runNumber);
        const paths = await SimulationPath.find({ simulationId: sim._id })
          .select("title finalSalary")
          .sort({ _id: 1 });

        return {
          _id: sim._id,
          id: sim._id.toString(),
          name: runLabel(sim.name, runNumber, nameTotals.get(sim.name)),
          isStarred: sim.isStarred,
          createdAt: sim.createdAt,
          whatIf: sim.whatIf,
          summary: sim.summary,
          pathCount: paths.length,
          topSalary: Math.max(...paths.map((path) => path.finalSalary), 0),
          pathTitles: paths.map((path) => path.title),
        };
      }),
    );

    return res.json({ simulations: response });
  } catch (error) {
    next(error);
  }
});

// This precedes GET /:id so "preview" is never interpreted as an ObjectId.
router.post("/preview", async (req, res, next) => {
  try {
    const { profile, whatIf } = req.body;
    if (!profile || !Array.isArray(profile.skills)) {
      return res
        .status(400)
        .json({ error: "A profile payload with skills is required." });
    }

    const { paths, summary } = generateSimulation(profile, whatIf);
    return res.json({ paths, summary });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({
      _id: req.params.id,
      userId: userIdFor(req),
    });
    if (!sim) return res.status(404).json({ error: "Simulation not found." });

    const siblingRuns = await Simulation.find({
      userId: userIdFor(req),
      name: sim.name,
    })
      .sort({ createdAt: -1 })
      .select("_id");
    const runNumber =
      siblingRuns.findIndex((sibling) => sibling.id === sim.id) + 1;
    const simulation = await serializeSimulation(
      sim,
      runLabel(sim.name, runNumber, siblingRuns.length),
    );
    if (sim.profileId)
      simulation.profile = await SkillProfile.findById(sim.profileId);
    return res.json({ simulation });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = userIdFor(req);
    const { profileId, whatIf, name } = req.body;
    const profile = await SkillProfile.findOne({ _id: profileId, userId });
    if (!profile) return res.status(404).json({ error: "Profile not found." });

    const { paths, summary } = generateSimulation(profile, whatIf);
    const baseName = name || `${profile.educationField} simulation`;
    const existingRuns = await Simulation.countDocuments({
      userId,
      name: baseName,
    });
    const sim = await Simulation.create({
      userId,
      profileId: profile._id,
      name: existingRuns ? `${baseName} · Run ${existingRuns + 1}` : baseName,
      whatIf: whatIf || null,
      summary,
    });

    for (const path of paths) {
      const savedPath = await SimulationPath.create({
        simulationId: sim._id,
        code: path.code,
        title: path.title,
        description: path.description,
        riskLevel: path.riskLevel,
        satisfactionScore: path.satisfactionScore,
        confidenceScore: path.confidenceScore,
        trajectory: path.trajectory || [],
        skillGaps: path.skillGaps || [],
        startSalary: path.startSalary,
        finalSalary: path.finalSalary,
      });

      const milestones = buildMilestones(path, userId, savedPath._id);
      if (milestones.length) await Milestone.insertMany(milestones);
    }

    return res.status(201).json({ simulation: await serializeSimulation(sim) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/star", async (req, res, next) => {
  try {
    const sim = await Simulation.findOne({
      _id: req.params.id,
      userId: userIdFor(req),
    });
    if (!sim) return res.status(404).json({ error: "Simulation not found." });

    sim.isStarred = !sim.isStarred;
    await sim.save();
    return res.json({ isStarred: sim.isStarred });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = userIdFor(req);
    const sim = await Simulation.findOne({ _id: req.params.id, userId });
    if (!sim) return res.status(404).json({ error: "Simulation not found." });

    const pathIds = (
      await SimulationPath.find({ simulationId: sim._id }).select("_id")
    ).map((path) => path._id);
    await Milestone.deleteMany({ userId, pathId: { $in: pathIds } });
    await SimulationPath.deleteMany({ simulationId: sim._id });
    await sim.deleteOne();

    return res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;

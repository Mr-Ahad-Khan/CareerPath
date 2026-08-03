import {
  ROLE_TREES,
  SKILL_DEMAND,
  SALARY_BASELINES,
  INDUSTRY_MULTIPLIERS,
  SATISFACTION_FACTORS,
} from './data.js';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const round = (n, p = 0) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

function skillMatchScore(currentSkills, targetSkills) {
  if (!targetSkills?.length) return 0.5;
  let total = 0;
  for (const t of targetSkills) {
    const owned = currentSkills.find((s) => s.name.toLowerCase() === t.name.toLowerCase());
    const proficiency = owned ? owned.proficiency / 5 : 0;
    const weight = t.weight || 1;
    total += (proficiency * weight) / weight;
  }
  return clamp(total / targetSkills.length, 0, 1);
}

function applyWhatIf(base, whatIf) {
  if (!whatIf) return base;
  const w = { ...base };
  w.experienceYears = (w.experienceYears || 0) + (whatIf.extraExperienceMonths || 0) / 12;
  w.locationMultiplier = (whatIf.cityTier === 'metro' ? 1.25 :
    whatIf.cityTier === 'tier2' ? 0.9 : 1) || 1;
  w.upskillingBoost = clamp((whatIf.upskillingHoursPerWeek || 0) / 20, 0, 1.5);
  w.timePenalty = (whatIf.extraLearningMonths || 0) / 12;
  w.networkBoost = whatIf.networkStrength === 'strong' ? 1.08 :
    whatIf.networkStrength === 'weak' ? 0.94 : 1;
  return w;
}

function buildTrajectory(branch, ctx, whatIf) {
  const base = ROLE_TREES[branch];
  if (!base) throw new Error(`Unknown branch: ${branch}`);
  const years = 5;
  const trajectory = [];
  const multiplier = ctx.locationMultiplier || 1;
  const industryMult = INDUSTRY_MULTIPLIERS[ctx.industry] || 1;
  const startSalary = round(
    SALARY_BASELINES[ctx.entryPoint] * multiplier * industryMult *
      (1 + (ctx.experienceYears || 0) * 0.08)
  );

  let salary = startSalary;
  let level = 0;
  const roleChain = base.roles;
  let skillsAcquired = [...ctx.coreSkills.map((s) => s.name.toLowerCase())];

  for (let y = 0; y <= years; y++) {
    const roleIdx = Math.min(level, roleChain.length - 1);
    const role = roleChain[roleIdx];

    const growthFactor =
      base.salaryGrowthCurve(y + (ctx.timePenalty || 0)) *
      (1 + (ctx.upskillingBoost || 0) * 0.06) *
      (ctx.networkBoost || 1);

    salary = round(startSalary * growthFactor);

    const targetSkills = role.requiredSkills || [];
    const gaps = targetSkills
      .filter((s) => !skillsAcquired.includes(s.name.toLowerCase()))
      .map((s) => ({
        skill: s.name,
        importance: s.weight || 1,
        currentLevel: 0,
        targetLevel: 4,
      }));

    const match = skillMatchScore(
      ctx.coreSkills,
      targetSkills
    );

    trajectory.push({
      year: y,
      role: role.title,
      companyArchetype: role.companyArchetype,
      salary,
      salaryLow: round(salary * 0.85),
      salaryHigh: round(salary * 1.2),
      seniority: role.seniority,
      skillsToAcquire: gaps.map((g) => g.skill),
      skillMatch: round(match, 2),
      milestones: (role.milestones[y] || []).map((m) => ({
        ...m,
        year: y,
      })),
    });

    if (y < years) {
      level = Math.min(level + base.promotionPace, roleChain.length - 1);
      const newSkills = role.requiredSkills
        .filter((s) => !skillsAcquired.includes(s.name.toLowerCase()))
        .slice(0, base.skillsPerYear || 2)
        .map((s) => s.name.toLowerCase());
      skillsAcquired = [...skillsAcquired, ...newSkills];
    }
  }

  const finalRole = trajectory[trajectory.length - 1];
  const totalGaps = [...new Set(
    trajectory.flatMap((t) => t.skillsToAcquire)
  )].map((skill) => {
    const def = SKILL_DEMAND[skill] || { demand: 0.5, category: 'Technical' };
    return {
      skill,
      demand: def.demand,
      category: def.category,
      requiredBy: trajectory
        .filter((t) => t.skillsToAcquire.includes(skill))
        .map((t) => `Year ${t.year}`),
    };
  });

  const confidence = clamp(
    0.4 +
      skillMatchScore(ctx.coreSkills, base.roles[base.roles.length - 1].requiredSkills) * 0.3 +
      (ctx.upskillingBoost || 0) * 0.15 +
      (ctx.experienceYears || 0) * 0.03 -
      (ctx.timePenalty || 0) * 0.1,
    0.1,
    0.97
  );

  const satisfaction = clamp(
    SATISFACTION_FACTORS[branch] * 0.6 +
      matchInterest(ctx.interests, base.interests) * 0.4,
    0.3,
    0.98
  );

  return {
    code: branch,
    title: base.title,
    description: base.description,
    riskLevel: base.riskLevel,
    satisfactionScore: round(satisfaction, 2),
    confidenceScore: round(confidence, 2),
    startSalary,
    finalSalary: finalRole.salary,
    trajectory,
    skillGaps: totalGaps,
  };
}

function matchInterest(userInterests, branchInterests) {
  if (!branchInterests?.length) return 0.5;
  const hit = userInterests?.filter((i) =>
    branchInterests.some((b) => b.toLowerCase() === i.toLowerCase())
  ).length || 0;
  return clamp(hit / branchInterests.length, 0, 1);
}

export function generateSimulation(profileInput, whatIf) {
  const ctx = applyWhatIf(
    {
      coreSkills: profileInput.skills || [],
      interests: profileInput.interests || [],
      experienceYears: profileInput.experienceYears || 0,
      entryPoint: deriveEntryPoint(profileInput),
      industry: deriveIndustry(profileInput),
      locationMultiplier: 1,
    },
    whatIf
  );

  const branches = pickBranches(ctx);
  const paths = branches.map((b) => buildTrajectory(b, ctx, whatIf));

  const summary = {
    branches: paths.length,
    bestSalaryPath: paths.reduce((a, b) => (b.finalSalary > a.finalSalary ? b : a)).code,
    safestPath: paths.reduce((a, b) => (b.riskLevel < a.riskLevel ? b : a)).code,
    highestSatisfaction: paths.reduce((a, b) =>
      b.satisfactionScore > a.satisfactionScore ? b : a
    ).code,
    averageConfidence: round(
      paths.reduce((s, p) => s + p.confidenceScore, 0) / paths.length,
      2
    ),
  };

  return { paths, summary };
}

function deriveEntryPoint(profile) {
  const yrs = profile.experienceYears || 0;
  if (profile.educationLevel === 'Postgraduate' && yrs < 1) return 'pg-fresh';
  if (yrs < 1) return 'fresher';
  if (yrs < 3) return 'junior';
  if (yrs < 6) return 'mid';
  return 'senior';
}

function deriveIndustry(profile) {
  const interests = (profile.interests || []).join(' ').toLowerCase();
  if (interests.includes('finance') || interests.includes('fintech')) return 'fintech';
  if (interests.includes('health') || interests.includes('medical')) return 'healthtech';
  if (interests.includes('ai') || interests.includes('ml') || interests.includes('data'))
    return 'ai';
  if (interests.includes('product') || interests.includes('design')) return 'product';
  return 'general';
}

function pickBranches(ctx) {
  const all = Object.keys(ROLE_TREES);
  const interests = (ctx.interests || []).join(' ').toLowerCase();
  const primary = all
    .map((b) => ({
      b,
      score: matchInterest(ctx.interests, ROLE_TREES[b].interests) +
        (ctx.coreSkills.length > 0 ? skillMatchScore(ctx.coreSkills, ROLE_TREES[b].roles[0].requiredSkills) * 0.3 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  const picked = [primary[0].b];
  if (primary[1] && primary[1].score > 0.15) picked.push(primary[1].b);
  const divergent = all.find((b) => !picked.includes(b) && ROLE_TREES[b].divergent);
  if (divergent) picked.push(divergent);
  while (picked.length < 3 && all.length > picked.length) {
    const next = all.find((b) => !picked.includes(b));
    if (next) picked.push(next);
    else break;
  }
  return picked.slice(0, 3);
}

export function buildMilestones(path, userId, pathId) {
  const out = [];
  let order = 0;
  path.trajectory.forEach((node) => {
    node.milestones.forEach((m) => {
      out.push({
        userId,
        pathId,
        quarter: `Q${Math.min(4, Math.floor(m.quarter || 1))}`,
        year: node.year,
        category: m.category || 'Learning',
        title: m.title,
        description: m.description,
        status: 'todo',
        orderIndex: order++,
      });
    });
  });
  return out;
}

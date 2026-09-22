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
  w.locationMultiplier = (whatIf.cityTier === 'metro' ? 1.15 :
    whatIf.cityTier === 'tier2' ? 0.92 : 1) || 1;
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
  const experienceYears = Math.max(0, ctx.experienceYears || 0);

  // Realistic experienced compensation calculation
  const baselineFromTier = SALARY_BASELINES[ctx.entryPoint] || 1300000;
  const baselineSalary = ctx.currentSalary && ctx.currentSalary > baselineFromTier * 0.5
    ? Math.max(ctx.currentSalary, baselineFromTier * 0.8)
    : baselineFromTier;

  const experiencePremium = 1 + Math.min(experienceYears, 14) * 0.025;
  const marketTierMultiplier = ctx.marketTier === 'tier1-faang' ? 1.25 :
    ctx.marketTier === 'growth-product' ? 1.10 : 1.0;

  const startSalary = round(
    baselineSalary * multiplier * industryMult * (ctx.currentSalary ? 1.05 : experiencePremium * marketTierMultiplier)
  );

  const roleChain = base.roles;
  let salary = startSalary;

  // Intelligent starting level based on experience
  let level = 0;
  if (ctx.entryPoint === 'principal' || ctx.entryPoint === 'staff') {
    level = Math.max(0, roleChain.length - 1);
  } else if (ctx.entryPoint === 'lead' || ctx.entryPoint === 'senior') {
    level = Math.min(Math.max(1, roleChain.length - 2), roleChain.length - 1);
  } else if (ctx.entryPoint === 'mid') {
    level = Math.min(1, roleChain.length - 1);
  }

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

    // Intelligent role naming for high experience in later years
    let roleTitle = role.title;
    if (experienceYears >= 7 && roleIdx === roleChain.length - 1 && y >= 3) {
      if (branch === 'deep-specialist') roleTitle = y >= 4 ? 'Principal Software Architect' : 'Staff Systems Engineer';
      else if (branch === 'management-track') roleTitle = y >= 4 ? 'VP of Engineering' : 'Senior Director of Engineering';
      else if (branch === 'data-scientist') roleTitle = y >= 4 ? 'Distinguished AI Architect' : 'Staff Machine Learning Engineer';
      else if (branch === 'founder-path') roleTitle = 'Technical Co-Founder & CTO';
    }

    trajectory.push({
      year: y,
      role: roleTitle,
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

  // AI & Career Intelligence Metrics
  const techGaps = totalGaps.filter((g) => g.category === 'Technical' || g.category === 'Architecture').length;
  const aiReadinessIndex = round(
    clamp(0.68 + (ctx.coreSkills.some((s) => (s.name || '').toLowerCase().includes('design') || (s.name || '').toLowerCase().includes('lead')) ? 0.2 : 0.05) - (techGaps > 3 ? 0.08 : 0), 0.5, 0.98),
    2
  );
  const criticalSkillBottleneck = totalGaps[0]?.skill || 'Distributed System Design';
  const primaryGrowthVector = branch === 'management-track' ? 'Engineering Scale & Executive Leadership' :
    branch === 'data-scientist' ? 'Applied Intelligence & Neural Modeling' :
    branch === 'founder-path' ? '0-to-1 Product & Equity Velocity' :
    branch === 'pivot-adjacent' ? 'Cloud Infrastructure Resilience' :
    'Deep Technical Systems Architecture';

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
    aiReadinessIndex,
    criticalSkillBottleneck,
    primaryGrowthVector,
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
      experienceYears: Number(profileInput.experienceYears) || 0,
      currentSalary: Number(profileInput.currentSalary) || null,
      marketTier: profileInput.marketTier || 'growth-product',
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
  const yrs = Number(profile.experienceYears) || 0;
  if (profile.educationLevel === 'Postgraduate' && yrs < 1) return 'pg-fresh';
  if (yrs < 1) return 'fresher';
  if (yrs < 3) return 'junior';
  if (yrs < 6) return 'mid';
  if (yrs < 9) return 'senior';
  if (yrs < 12) return 'lead';
  if (yrs < 15) return 'staff';
  return 'principal';
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
  const primary = all
    .map((b) => ({
      b,
      score: matchInterest(ctx.interests, ROLE_TREES[b].interests) +
        (ctx.coreSkills.length > 0 ? skillMatchScore(ctx.coreSkills, ROLE_TREES[b].roles[0].requiredSkills) * 0.3 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  const picked = [];
  for (const item of primary) {
    if (!picked.includes(item.b)) {
      picked.push(item.b);
    }
    if (picked.length >= 4) break;
  }
  const divergent = all.find((b) => !picked.includes(b) && ROLE_TREES[b].divergent);
  if (divergent && picked.length < 5) {
    picked.push(divergent);
  }
  for (const b of all) {
    if (!picked.includes(b) && picked.length < 5) {
      picked.push(b);
    }
  }
  return picked;
}

export function buildMilestones(path, userId = 'offline-user', pathId = 'offline-path') {
  const out = [];
  let order = 0;
  path.trajectory.forEach((node) => {
    node.milestones.forEach((m) => {
      out.push({
        _id: `ms-local-${Date.now()}-${order}`,
        id: `ms-local-${Date.now()}-${order}`,
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

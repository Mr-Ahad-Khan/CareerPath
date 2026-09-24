import {
  ROLE_TREES,
  SKILL_DEMAND,
  SALARY_BASELINES,
  INDUSTRY_MULTIPLIERS,
  SATISFACTION_FACTORS,
  CITY_TIERS,
  EXPERIENCE_BRACKETS,
} from './data.js';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const round = (n, p = 0) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

export function getCityMultiplier(inputCity) {
  if (!inputCity) return 1.0;
  const key = String(inputCity).toLowerCase().trim();
  if (CITY_TIERS[key]) return CITY_TIERS[key].multiplier;

  if (key.includes('lucknow')) return CITY_TIERS.lucknow.multiplier;
  if (key.includes('bangalore') || key.includes('bengaluru')) return CITY_TIERS.bangalore.multiplier;
  if (key.includes('delhi') || key.includes('gurgaon') || key.includes('noida') || key.includes('ncr')) return CITY_TIERS.delhi.multiplier;
  if (key.includes('mumbai') || key.includes('thane') || key.includes('bombay')) return CITY_TIERS.mumbai.multiplier;
  if (key.includes('pune')) return CITY_TIERS.pune.multiplier;
  if (key.includes('hyderabad')) return CITY_TIERS.hyderabad.multiplier;
  if (key.includes('chennai') || key.includes('madras')) return CITY_TIERS.chennai.multiplier;
  if (key.includes('kolkata') || key.includes('calcutta')) return CITY_TIERS.kolkata.multiplier;
  if (key.includes('ahmedabad') || key.includes('gift')) return CITY_TIERS.ahmedabad.multiplier;
  if (key.includes('jaipur')) return CITY_TIERS.jaipur.multiplier;
  if (key.includes('indore')) return CITY_TIERS.indore.multiplier;
  if (key.includes('kochi') || key.includes('trivandrum') || key.includes('kerala')) return CITY_TIERS.kochi.multiplier;
  if (key.includes('remote') || key.includes('wfh')) return CITY_TIERS.remote.multiplier;
  if (key.includes('us') || key.includes('global') || key.includes('international') || key.includes('europe') || key.includes('uk')) return CITY_TIERS.global.multiplier;

  if (key === 'metro' || key === 'tier1') return 1.08;
  if (key === 'tier2') return 0.65;
  if (key === 'tier3') return 0.58;
  return 0.88;
}

export function getExperienceBracket(years) {
  const y = Math.max(0, Number(years) || 0);
  for (const b of EXPERIENCE_BRACKETS) {
    if (y >= b.minYears && y < b.maxYears) return b;
  }
  return EXPERIENCE_BRACKETS[EXPERIENCE_BRACKETS.length - 1];
}

function skillMatchScore(currentSkills, targetSkills) {
  if (!targetSkills?.length) return 0.5;
  let total = 0;
  for (const t of targetSkills) {
    const owned = currentSkills.find((s) => (s.name || '').toLowerCase() === t.name.toLowerCase());
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
  const cityKey = whatIf.city || whatIf.cityTier || base.location || 'bangalore';
  w.location = cityKey;
  w.locationMultiplier = getCityMultiplier(cityKey);
  w.upskillingBoost = clamp((whatIf.upskillingHoursPerWeek || 0) / 20, 0, 1.5);
  w.timePenalty = (whatIf.extraLearningMonths || 0) / 12;
  w.networkBoost = whatIf.networkStrength === 'strong' ? 1.06 :
    whatIf.networkStrength === 'weak' ? 0.95 : 1;
  return w;
}

function buildTrajectory(branch, ctx, whatIf) {
  const base = ROLE_TREES[branch];
  if (!base) throw new Error(`Unknown branch: ${branch}`);
  const years = 5;
  const trajectory = [];
  const cityMult = ctx.locationMultiplier || 1.0;
  const industryMult = INDUSTRY_MULTIPLIERS[ctx.industry] || 1.0;
  const experienceYears = Math.max(0, ctx.experienceYears || 0);

  // Realistic experienced compensation calculation with experience brackets
  const startBracket = getExperienceBracket(experienceYears);
  const marketTierMultiplier = ctx.marketTier === 'tier1-faang' ? 1.20 :
    ctx.marketTier === 'growth-product' ? 1.05 : 0.95;

  let startSalary;
  if (ctx.currentSalary && ctx.currentSalary > 100000) {
    // If user provided salary, use it as baseline but anchor with soft sanity cap to prevent runaways
    const maxRealisticStart = Math.round(startBracket.maxRealistic * cityMult * marketTierMultiplier);
    startSalary = round(Math.min(ctx.currentSalary, maxRealisticStart));
  } else {
    // Standard grounded baseline for their experience bracket in this city
    const calculatedBase = startBracket.baseSalary * cityMult * industryMult * marketTierMultiplier;
    const minBound = Math.round(startBracket.minRealistic * cityMult * 0.9);
    const maxBound = Math.round(startBracket.maxRealistic * cityMult * marketTierMultiplier);
    startSalary = round(clamp(calculatedBase, minBound, maxBound));
  }

  const roleChain = base.roles;
  let salary = startSalary;

  // Intelligent starting level based on experience
  let level = 0;
  if (experienceYears >= 12 || ctx.entryPoint === 'principal' || ctx.entryPoint === 'staff') {
    level = Math.max(0, roleChain.length - 1);
  } else if (experienceYears >= 6 || ctx.entryPoint === 'lead' || ctx.entryPoint === 'senior') {
    level = Math.min(Math.max(1, roleChain.length - 2), roleChain.length - 1);
  } else if (experienceYears >= 2 || ctx.entryPoint === 'mid') {
    level = Math.min(1, roleChain.length - 1);
  }

  let skillsAcquired = [...ctx.coreSkills.map((s) => (s.name || '').toLowerCase())];

  for (let y = 0; y <= years; y++) {
    const roleIdx = Math.min(level, roleChain.length - 1);
    const role = roleChain[roleIdx];

    // Cumulative continuous experience in the field
    const effectiveExperience = experienceYears + y;
    const currBracket = getExperienceBracket(effectiveExperience);

    if (y === 0) {
      salary = startSalary;
    } else {
      // Annual compounding bounded by realistic experience bracket growth rate
      const annualRate = Math.min(currBracket.annualGrowthCap, 0.08) *
        (1 + (ctx.upskillingBoost || 0) * 0.04) *
        (ctx.networkBoost || 1);

      const projectedNext = salary * (1 + annualRate);

      // Upper ceiling bound for this city and experience bracket to guarantee grounded results
      const ceilingForYear = currBracket.maxRealistic * cityMult * marketTierMultiplier * (branch === 'founder-path' ? 1.15 : 1.0);
      salary = round(Math.min(projectedNext, ceilingForYear));
    }

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
    if (effectiveExperience >= 8 && roleIdx === roleChain.length - 1 && y >= 3) {
      if (branch === 'deep-specialist') roleTitle = y >= 4 ? 'Principal Software Architect' : 'Staff Systems Engineer';
      else if (branch === 'management-track') roleTitle = y >= 4 ? 'VP of Engineering' : 'Senior Director of Engineering';
      else if (branch === 'data-scientist') roleTitle = y >= 4 ? 'Distinguished AI Architect' : 'Staff Machine Learning Engineer';
      else if (branch === 'founder-path') roleTitle = 'Technical Co-Founder & CTO';
      else if (branch === 'cybersecurity-architect') roleTitle = y >= 4 ? 'Chief Information Security Officer (CISO)' : 'Principal Security Architect';
      else if (branch === 'fullstack-solopreneur') roleTitle = 'Principal AI Consultant & Tech Founder';
      else if (branch === 'qa-automation-sdet') roleTitle = y >= 4 ? 'VP of Quality & Engineering Excellence' : 'Staff SDET Architect';
      else if (branch === 'mobile-ecosystem-lead') roleTitle = y >= 4 ? 'Head of Mobile Engineering' : 'Staff Mobile Systems Architect';
    }

    trajectory.push({
      year: y,
      role: roleTitle,
      companyArchetype: role.companyArchetype,
      salary,
      salaryLow: round(salary * 0.88),
      salaryHigh: round(salary * 1.14),
      seniority: role.seniority,
      experienceBracket: currBracket.label,
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
  const cityKey = whatIf?.city || whatIf?.cityTier || profileInput.location || 'bangalore';
  const ctx = applyWhatIf(
    {
      coreSkills: profileInput.skills || [],
      interests: profileInput.interests || [],
      experienceYears: Number(profileInput.experienceYears) || 0,
      currentSalary: Number(profileInput.currentSalary) || null,
      marketTier: profileInput.marketTier || 'growth-product',
      location: profileInput.location || cityKey,
      entryPoint: deriveEntryPoint(profileInput),
      industry: deriveIndustry(profileInput),
      locationMultiplier: getCityMultiplier(cityKey),
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
    continuousWorkAssumption: "Calculations reflect continuous specialized employment in this domain without multi-year career gaps or major domain resets.",
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
  if (yrs < 18) return 'director';
  if (yrs < 22) return 'sr-director';
  if (yrs < 26) return 'vp';
  if (yrs < 30) return 'svp';
  if (yrs < 35) return 'cto';
  if (yrs < 42) return 'evp-advisor';
  return 'elder-board';
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
    if (picked.length >= 6) break;
  }
  const divergent = all.filter((b) => !picked.includes(b) && ROLE_TREES[b].divergent);
  for (const d of divergent) {
    if (picked.length < 8) picked.push(d);
  }
  for (const b of all) {
    if (!picked.includes(b) && picked.length < 8) {
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

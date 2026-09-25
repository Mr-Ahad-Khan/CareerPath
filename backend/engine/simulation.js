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

const BRANCH_DYNAMICS = {
  'data-scientist': {
    annualRate: 0.125,
    promotionStep: 0.12,
    ceilingBoost: 1.25,
    baseMult: 1.08,
  },
  'deep-specialist': {
    annualRate: 0.088,
    promotionStep: 0.10,
    ceilingBoost: 1.15,
    baseMult: 1.0,
  },
  'management-track': {
    annualRate: 0.098,
    promotionStep: 0.16,
    ceilingBoost: 1.22,
    baseMult: 1.02,
  },
  'founder-path': {
    annualRate: 0.055,
    promotionStep: 0.24,
    lateAcceleration: 0.22,
    ceilingBoost: 1.40,
    baseMult: 0.88,
  },
  'pivot-adjacent': {
    annualRate: 0.102,
    promotionStep: 0.11,
    ceilingBoost: 1.18,
    baseMult: 1.04,
  },
  'cybersecurity-architect': {
    annualRate: 0.108,
    promotionStep: 0.12,
    ceilingBoost: 1.20,
    baseMult: 1.05,
  },
  'mobile-ecosystem-lead': {
    annualRate: 0.082,
    promotionStep: 0.09,
    ceilingBoost: 1.12,
    baseMult: 0.98,
  },
  'qa-automation-sdet': {
    annualRate: 0.072,
    promotionStep: 0.08,
    ceilingBoost: 1.08,
    baseMult: 0.94,
  },
  'product-track': {
    annualRate: 0.092,
    promotionStep: 0.12,
    ceilingBoost: 1.16,
    baseMult: 1.02,
  },
  'fullstack-developer': {
    annualRate: 0.098,
    promotionStep: 0.13,
    ceilingBoost: 1.20,
    baseMult: 1.02,
  },
  'frontend-developer': {
    annualRate: 0.088,
    promotionStep: 0.11,
    ceilingBoost: 1.15,
    baseMult: 1.0,
  },
  'backend-developer': {
    annualRate: 0.096,
    promotionStep: 0.13,
    ceilingBoost: 1.22,
    baseMult: 1.04,
  },
  'fullstack-solopreneur': {
    annualRate: 0.095,
    promotionStep: 0.15,
    ceilingBoost: 1.20,
    baseMult: 0.96,
  },
};

function buildTrajectory(branch, ctx, whatIf) {
  const base = ROLE_TREES[branch];
  if (!base) throw new Error(`Unknown branch: ${branch}`);
  const years = 5;
  const trajectory = [];
  const cityMult = ctx.locationMultiplier || 1.0;
  const industryMult = INDUSTRY_MULTIPLIERS[ctx.industry] || 1.0;
  const experienceYears = Math.max(0, ctx.experienceYears || 0);

  const dynamics = BRANCH_DYNAMICS[branch] || {
    annualRate: 0.085,
    promotionStep: 0.10,
    ceilingBoost: 1.15,
    baseMult: 1.0,
  };

  // Realistic experienced compensation calculation with experience brackets
  const startBracket = getExperienceBracket(experienceYears);
  const marketTierMultiplier = ctx.marketTier === 'tier1-faang' ? 1.20 :
    ctx.marketTier === 'growth-product' ? 1.05 : 0.95;

  let startSalary;
  if (ctx.currentSalary && ctx.currentSalary > 100000) {
    // If user provided salary, anchor accurately to their starting baseline
    startSalary = round(ctx.currentSalary);
  } else {
    // Standard grounded baseline for their experience bracket in this city and track
    const calculatedBase = startBracket.baseSalary * cityMult * industryMult * marketTierMultiplier * (dynamics.baseMult || 1.0);
    const minBound = Math.round(startBracket.minRealistic * cityMult * 0.85);
    const maxBound = Math.round(startBracket.maxRealistic * cityMult * marketTierMultiplier * (dynamics.baseMult || 1.0));
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

  let prevRoleIdx = level;
  for (let y = 0; y <= years; y++) {
    const roleIdx = Math.min(level, roleChain.length - 1);
    const role = roleChain[roleIdx];

    // Cumulative continuous experience in the field
    const effectiveExperience = experienceYears + y;
    const currBracket = getExperienceBracket(effectiveExperience);

    if (y === 0) {
      salary = startSalary;
    } else {
      // Annual compounding bounded by branch-specific velocity, promotions, and upskilling
      const isPromoted = roleIdx > prevRoleIdx;
      const promotionBonus = isPromoted ? dynamics.promotionStep : 0;
      const founderLateBonus = (branch === 'founder-path' && y >= 3) ? (dynamics.lateAcceleration || 0.22) * (y - 2) * 0.4 : 0;
      const upskillingImpact = 1 + (ctx.upskillingBoost || 0) * 0.05;
      const networkImpact = ctx.networkBoost || 1;

      const rate = (dynamics.annualRate + promotionBonus + founderLateBonus) * upskillingImpact * networkImpact;
      const projectedNext = salary * (1 + rate);

      // Upper ceiling bound for this city and experience bracket to guarantee grounded results
      const ceilingForYear = Math.max(
        salary * 1.04,
        currBracket.maxRealistic * cityMult * marketTierMultiplier * (dynamics.ceilingBoost || 1.15)
      );
      salary = round(Math.min(projectedNext, ceilingForYear));
    }
    prevRoleIdx = roleIdx;

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
      else if (branch === 'fullstack-developer') roleTitle = y >= 4 ? 'Principal Full-Stack Architect' : 'Staff Full-Stack Engineer';
      else if (branch === 'frontend-developer') roleTitle = y >= 4 ? 'Principal Frontend Architect' : 'Staff Web Systems Engineer';
      else if (branch === 'backend-developer') roleTitle = y >= 4 ? 'Principal Backend Architect' : 'Staff Distributed Systems Engineer';
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

  // 1. Skill Match (40% weight): Entry readiness + progressive track skill alignment + interest affinity
  const entryRoleSkills = base.roles[0]?.requiredSkills || [];
  const entrySkillMatch = skillMatchScore(ctx.coreSkills, entryRoleSkills);
  const allTrackSkills = base.roles.flatMap((r) => r.requiredSkills || []);
  const trackSkillMatch = skillMatchScore(ctx.coreSkills, allTrackSkills);
  const domainInterestMatch = matchInterest(ctx.interests, base.interests);
  const effectiveSkillMatch = clamp(
    entrySkillMatch * 0.50 + trackSkillMatch * 0.30 + domainInterestMatch * 0.20,
    0.15,
    0.98
  );

  // 2. Experience Baseline (25% weight): Tenure grounded against entry seniority
  const requiredEntrySeniority = base.roles[0]?.seniority || 1;
  const normalizedTenure = experienceYears / Math.max(1, requiredEntrySeniority * 1.8);
  const experienceScore = clamp(0.38 + Math.min(normalizedTenure, 1.0) * 0.54, 0.35, 0.96);

  // 3. Upskilling Discipline (20% weight): Committed study schedule
  const weeklyHours = whatIf?.upskillingHoursPerWeek ?? 10;
  const upskillingScore = clamp(0.35 + (weeklyHours / 20) * 0.58, 0.35, 0.96);

  // 4. Career Continuity & Risk Stability (15% weight): Track volatility & transition penalties
  const riskStabilityMap = { 1: 0.92, 2: 0.85, 3: 0.74, 4: 0.62, 5: 0.48 };
  const baseStability = riskStabilityMap[base.riskLevel] || 0.75;
  const timePenalty = (ctx.timePenalty || 0) * 0.15;
  const continuityScore = clamp(baseStability - timePenalty, 0.30, 0.95);

  const confidence = clamp(
    effectiveSkillMatch * 0.40 +
    experienceScore * 0.25 +
    upskillingScore * 0.20 +
    continuityScore * 0.15,
    0.35,
    0.95
  );

  const confidenceBreakdown = {
    overallPercentage: round(confidence * 100),
    skillMatchPercentage: round(effectiveSkillMatch * 100),
    experienceYears: experienceYears,
    experienceScorePercentage: round(experienceScore * 100),
    upskillingHoursPerWeek: weeklyHours,
    upskillingPercentage: round(upskillingScore * 100),
    continuityPercentage: round(continuityScore * 100),
    factors: [
      { name: 'Core Skill Match', weight: '40%', score: `${round(effectiveSkillMatch * 100)}%`, description: 'Coverage of immediate & progressive tech competencies' },
      { name: 'Experience Baseline', weight: '25%', score: `${round(experienceScore * 100)}%`, description: `${experienceYears} yrs domain tenure grounding` },
      { name: 'Upskilling Discipline', weight: '20%', score: `${round(upskillingScore * 100)}%`, description: `${weeklyHours}h / week committed practice` },
      { name: 'Career Continuity', weight: '15%', score: `${round(continuityScore * 100)}%`, description: `${base.riskLevel <= 2 ? 'Low-Mid' : base.riskLevel === 3 ? 'Moderate' : 'High'} track risk stability` },
    ],
  };

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
    branch === 'fullstack-developer' ? 'End-to-End Product Architecture & Systems' :
    branch === 'frontend-developer' ? 'High-Performance Web Systems & Frontend Architecture' :
    branch === 'backend-developer' ? 'Distributed Microservices & Cloud Scale Engineering' :
    branch === 'pivot-adjacent' ? 'Cloud Infrastructure Resilience' :
    'Deep Technical Systems Architecture';

  return {
    code: branch,
    title: base.title,
    description: base.description,
    riskLevel: base.riskLevel,
    satisfactionScore: round(satisfaction, 2),
    confidenceScore: round(confidence, 2),
    confidenceBreakdown,
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
      targetRole: profileInput.targetRole || '',
      currentRole: profileInput.currentRole || '',
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
  const roleText = `${ctx.targetRole || ''} ${ctx.currentRole || ''}`.toLowerCase();
  const scored = all
    .map((b) => {
      const tree = ROLE_TREES[b];
      const interestScore = matchInterest(ctx.interests, tree.interests);
      const entryMatch = ctx.coreSkills.length > 0 ? skillMatchScore(ctx.coreSkills, tree.roles[0].requiredSkills) : 0.5;
      let roleBonus = 0;
      if (b === 'fullstack-developer' && (roleText.includes('full') || roleText.includes('stack'))) roleBonus += 1.0;
      if (b === 'frontend-developer' && (roleText.includes('front') || roleText.includes('ui') || roleText.includes('web'))) roleBonus += 1.0;
      if (b === 'backend-developer' && (roleText.includes('back') || roleText.includes('api') || roleText.includes('server') || roleText.includes('distributed'))) roleBonus += 1.0;
      return {
        b,
        score: interestScore * 0.6 + entryMatch * 0.4 + roleBonus,
      };
    })
    .sort((a, b) => b.score - a.score);

  const picked = [];
  for (const item of scored) {
    if (!picked.includes(item.b)) {
      picked.push(item.b);
    }
  }
  return picked;
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

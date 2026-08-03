import { SKILL_DEMAND } from './data.js';

const SKILL_SYNONYMS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  'react.js': 'React',
  react: 'React',
  'reactjs': 'React',
  'node': 'Node.js',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'ai': 'Machine Learning',
  'deep learning': 'Machine Learning',
  sql: 'SQL',
  mysql: 'SQL',
  postgres: 'SQL',
  postgresql: 'SQL',
  aws: 'AWS',
  'amazon web services': 'AWS',
  azure: 'AWS',
  gcp: 'AWS',
  docker: 'Docker',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  figma: 'Figma',
  graphql: 'GraphQL',
  'a/b testing': 'A/B Testing',
  abtesting: 'A/B Testing',
  'powerbi': 'Power BI',
  'power bi': 'Power BI',
  tableau: 'Tableau',
};

const ALL_SKILLS = Object.keys(SKILL_DEMAND).map((s) => s.toLowerCase());

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseResume(text) {
  const lower = text.toLowerCase();
  const found = new Set();

  for (const [key, canonical] of Object.entries(SKILL_SYNONYMS)) {
    const pattern = new RegExp(`\\b${escapeRegex(key)}\\b`, 'i');
    if (pattern.test(lower)) found.add(canonical);
  }

  const foundLower = new Set([...found].map((s) => s.toLowerCase()));
  for (const skill of ALL_SKILLS) {
    if (foundLower.has(skill)) continue;
    const pattern = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
    if (pattern.test(lower)) {
      const def = SKILL_DEMAND[skill];
      if (def) found.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }

  const yearsMatch = text.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
  const yearsExperience = yearsMatch ? parseInt(yearsMatch[1], 10) : null;

  const degreeMatch = text.match(/\b(b\.?tech|m\.?tech|mca|bca|b\.?e\.?|m\.?sc|ph\.?d|bachelor|master)\b/i);
  const detectedDegree = degreeMatch ? degreeMatch[0] : null;

  return {
    skills: [...found],
    yearsExperience,
    detectedDegree,
  };
}

export function realityCheck(resumeSkills, simulationSkillGaps) {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const gaps = simulationSkillGaps || [];

  const matched = [];
  const missing = [];
  const surplus = [];

  for (const gap of gaps) {
    if (resumeSet.has(gap.skill.toLowerCase())) {
      matched.push({ ...gap, status: 'covered' });
    } else {
      missing.push({ ...gap, status: 'gap' });
    }
  }

  const gapSet = new Set(gaps.map((g) => g.skill.toLowerCase()));
  for (const skill of resumeSkills) {
    if (!gapSet.has(skill.toLowerCase())) surplus.push({ skill, status: 'surplus' });
  }

  const coverageScore = gaps.length
    ? Math.round((matched.length / gaps.length) * 100)
    : 100;

  return {
    matched,
    missing,
    surplus,
    coverageScore,
    resumeSkillCount: resumeSkills.length,
    gapCount: missing.length,
  };
}

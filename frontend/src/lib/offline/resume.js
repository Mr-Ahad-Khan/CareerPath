import { SKILL_DEMAND } from "./data.js";

export const SKILL_SYNONYMS = {
  // Languages & Runtimes
  js: "JavaScript",
  javascript: "JavaScript",
  ecmascript: "JavaScript",
  es6: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  python3: "Python",
  golang: "Go",
  go: "Go",
  rust: "Rust",
  java: "Java",
  jvm: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  csharp: "C#",
  "c#": "C#",
  dotnet: ".NET Core",
  ".net": ".NET Core",
  ".net core": ".NET Core",
  cpp: "C++",
  "c++": "C++",
  php: "PHP",
  ruby: "Ruby",
  rails: "Ruby on Rails",
  "ruby on rails": "Ruby on Rails",
  scala: "Scala",
  elixir: "Elixir",

  // Modern Frontend & Web
  html: "HTML",
  html5: "HTML",
  "hypertext markup language": "HTML",
  css: "CSS",
  css3: "CSS",
  "cascading style sheets": "CSS",
  react: "React",
  "react.js": "React",
  reactjs: "React",
  next: "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  vue: "Vue.js",
  vuejs: "Vue.js",
  "vue.js": "Vue.js",
  nuxt: "Nuxt.js",
  nuxtjs: "Nuxt.js",
  "nuxt.js": "Nuxt.js",
  angular: "Angular",
  angularjs: "Angular",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  remix: "Remix",
  "remix.run": "Remix",
  astro: "Astro",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  sass: "SASS/SCSS",
  scss: "SASS/SCSS",
  redux: "Redux",
  "redux toolkit": "Redux Toolkit",
  rtk: "Redux Toolkit",
  zustand: "Zustand",
  mobx: "MobX",
  "react query": "TanStack Query",
  "tanstack query": "TanStack Query",
  webpack: "Webpack",
  vite: "Vite",
  rollup: "Rollup",
  storybook: "Storybook",
  pwa: "Progressive Web Apps",
  "progressive web apps": "Progressive Web Apps",
  "responsive design": "Responsive Design",
  accessibility: "Accessibility",
  a11y: "Accessibility",
  webgl: "WebGL",
  threejs: "Three.js",
  "three.js": "Three.js",

  // Modern Backend & APIs
  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  express: "Express",
  expressjs: "Express",
  "express.js": "Express",
  nestjs: "NestJS",
  "nest.js": "NestJS",
  fastapi: "FastAPI",
  django: "Django",
  flask: "Flask",
  "spring boot": "Spring Boot",
  spring: "Spring Boot",
  springboot: "Spring Boot",
  fastify: "Fastify",
  graphql: "GraphQL",
  apollo: "GraphQL",
  "rest api": "REST API",
  "rest apis": "REST API",
  rest: "REST API",
  api: "REST API",
  apis: "REST API",
  restful: "REST API",
  grpc: "gRPC",
  protobuf: "Protobuf",
  websockets: "WebSockets",
  websocket: "WebSockets",
  webrtc: "WebRTC",
  trpc: "tRPC",

  // Generative AI, LLMs & Machine Learning
  ai: "Machine Learning",
  "artificial intelligence": "Machine Learning",
  ml: "Machine Learning",
  "machine learning": "Machine Learning",
  "deep learning": "Deep Learning",
  genai: "Generative AI",
  "generative ai": "Generative AI",
  llm: "Large Language Models (LLMs)",
  llms: "Large Language Models (LLMs)",
  "large language models": "Large Language Models (LLMs)",
  rag: "RAG",
  "retrieval augmented generation": "RAG",
  "retrieval-augmented generation": "RAG",
  langchain: "LangChain",
  llamaindex: "LlamaIndex",
  "llama index": "LlamaIndex",
  huggingface: "Hugging Face",
  "hugging face": "Hugging Face",
  openai: "OpenAI API",
  "openai api": "OpenAI API",
  claude: "Anthropic Claude",
  anthropic: "Anthropic Claude",
  gemini: "Google Gemini",
  ollama: "Ollama",
  vllm: "vLLM",
  bedrock: "AWS Bedrock",
  "vertex ai": "Vertex AI",
  pinecone: "Pinecone",
  chroma: "ChromaDB",
  chromadb: "ChromaDB",
  qdrant: "Qdrant",
  milvus: "Milvus",
  weaviate: "Weaviate",
  "vector database": "Vector Databases",
  "vector databases": "Vector Databases",
  "prompt engineering": "Prompt Engineering",
  "fine tuning": "Fine-Tuning",
  "fine-tuning": "Fine-Tuning",
  lora: "LoRA",
  pytorch: "PyTorch",
  tensorflow: "TensorFlow",
  keras: "Keras",
  nlp: "NLP",
  "natural language processing": "NLP",
  "computer vision": "Computer Vision",
  scikit: "Scikit-Learn",
  "scikit-learn": "Scikit-Learn",
  sklearn: "Scikit-Learn",
  pandas: "Pandas",
  numpy: "NumPy",
  polars: "Polars",
  statistics: "Statistics",

  // Cloud, Platform, DevOps & SRE
  aws: "AWS",
  "amazon web services": "AWS",
  azure: "Azure",
  gcp: "GCP",
  "google cloud": "GCP",
  "google cloud platform": "GCP",
  docker: "Docker",
  containerization: "Docker",
  k8s: "Kubernetes",
  kubernetes: "Kubernetes",
  terraform: "Terraform",
  ansible: "Ansible",
  pulumi: "Pulumi",
  helm: "Helm",
  argocd: "ArgoCD",
  "argo cd": "ArgoCD",
  git: "Git",
  github: "GitHub",
  "github actions": "GitHub Actions",
  gitlab: "GitLab",
  "gitlab ci": "GitLab CI",
  jenkins: "Jenkins",
  "ci/cd": "CI/CD",
  "ci-cd": "CI/CD",
  cicd: "CI/CD",
  "continuous integration": "CI/CD",
  serverless: "Serverless",
  lambda: "AWS Lambda",
  "aws lambda": "AWS Lambda",
  sre: "Site Reliability Engineering (SRE)",
  "site reliability engineering": "Site Reliability Engineering (SRE)",
  prometheus: "Prometheus",
  grafana: "Grafana",
  datadog: "Datadog",
  opentelemetry: "OpenTelemetry",
  otel: "OpenTelemetry",
  cloudflare: "Cloudflare",
  nginx: "NGINX",
  linux: "Linux",
  bash: "Bash/Shell",
  shell: "Bash/Shell",

  // Databases, Caching & Big Data
  sql: "SQL",
  mysql: "MySQL",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  sqlite: "SQLite",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  redis: "Redis",
  memcached: "Memcached",
  kafka: "Apache Kafka",
  "apache kafka": "Apache Kafka",
  rabbitmq: "RabbitMQ",
  elasticsearch: "Elasticsearch",
  cassandra: "Cassandra",
  dynamodb: "DynamoDB",
  snowflake: "Snowflake",
  bigquery: "BigQuery",
  databricks: "Databricks",
  spark: "Apache Spark",
  "apache spark": "Apache Spark",
  airflow: "Apache Airflow",
  "apache airflow": "Apache Airflow",
  dbt: "dbt",
  prisma: "Prisma",
  drizzle: "Drizzle ORM",
  supabase: "Supabase",
  firebase: "Firebase",
  neo4j: "Neo4j",
  clickhouse: "ClickHouse",
  "data analysis": "Data Analysis",
  "data analytics": "Data Analysis",
  tableau: "Tableau",
  powerbi: "Power BI",
  "power bi": "Power BI",

  // Security & Identity
  security: "Cybersecurity",
  cybersecurity: "Cybersecurity",
  "application security": "Application Security",
  appsec: "Application Security",
  devsecops: "DevSecOps",
  "penetration testing": "Penetration Testing",
  pentesting: "Penetration Testing",
  oauth: "OAuth 2.0",
  "oauth 2.0": "OAuth 2.0",
  oauth2: "OAuth 2.0",
  jwt: "JWT",
  iam: "IAM",
  "zero trust": "Zero Trust",
  owasp: "OWASP",
  "owasp top 10": "OWASP",
  snyk: "Snyk",
  sonarqube: "SonarQube",
  cryptography: "Cryptography",
  "soc 2": "SOC 2",

  // Architecture & Engineering Rigor
  "system design": "System Design",
  "software architecture": "System Design",
  microservices: "Microservices",
  "event driven architecture": "Event-Driven Architecture",
  "event-driven architecture": "Event-Driven Architecture",
  "domain driven design": "Domain-Driven Design (DDD)",
  "domain-driven design": "Domain-Driven Design (DDD)",
  "distributed systems": "Distributed Systems",
  caching: "Caching Strategies",
  "rate limiting": "Rate Limiting",
  "load balancing": "Load Balancing",

  // Testing & QA
  testing: "Testing",
  "test automation": "Test Automation",
  "automation testing": "Test Automation",
  jest: "Jest",
  vitest: "Vitest",
  cypress: "Cypress",
  playwright: "Playwright",
  selenium: "Selenium",
  postman: "Postman",
  jmeter: "JMeter",
  tdd: "TDD",
  "unit testing": "Unit Testing",
  "integration testing": "Integration Testing",
  "e2e testing": "E2E Testing",

  // Mobile
  "react native": "React Native",
  reactnative: "React Native",
  flutter: "Flutter",
  ios: "iOS",
  android: "Android",
  expo: "Expo",

  // Product, Design, Soft & Methodologies
  figma: "Figma",
  "ui/ux": "UI/UX Design",
  "ui/ux design": "UI/UX Design",
  "product strategy": "Product Strategy",
  "user research": "User Research",
  "a/b testing": "A/B Testing",
  abtesting: "A/B Testing",
  agile: "Agile",
  scrum: "Scrum",
  kanban: "Kanban",
  jira: "JIRA",
  leadership: "Leadership",
  mentoring: "Mentoring",
  "code review": "Code Reviews",
  "code reviews": "Code Reviews",
  "stakeholder management": "Stakeholder Management",
  "project management": "Project Management",
  "problem solving": "Problem Solving",
  communication: "Communication",
  budgeting: "Budgeting",
  negotiation: "Negotiation",
  okrs: "OKRs",
};

const ALL_SKILLS = Object.keys(SKILL_DEMAND).map((s) => s.toLowerCase());

const ROLE_SIGNALS = [
  {
    role: "Frontend Developer",
    patterns: ["frontend developer", "front end developer", "ui engineer", "web developer"],
  },
  {
    role: "Full-Stack Developer",
    patterns: ["full stack developer", "full-stack developer", "fullstack engineer"],
  },
  {
    role: "Backend Engineer",
    patterns: ["backend engineer", "back end developer", "api engineer", "server engineer"],
  },
  {
    role: "AI / Machine Learning Engineer",
    patterns: ["machine learning engineer", "ml engineer", "ai engineer", "data scientist", "deep learning engineer"],
  },
  {
    role: "Cloud / DevOps Engineer",
    patterns: ["devops engineer", "cloud engineer", "sre", "site reliability engineer", "platform engineer"],
  },
  {
    role: "UI/UX Designer",
    patterns: ["ui designer", "ux designer", "ui/ux designer", "product designer"],
  },
  {
    role: "Project / Product Manager",
    patterns: ["project manager", "project management", "product manager", "scrum master"],
  },
  {
    role: "Software Engineer",
    patterns: ["software engineer", "software developer", "sde", "systems engineer"],
  },
];

// Helper to escape regex special characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Custom word boundary regex that supports special characters like C++, C#, .NET, CI/CD
function createBoundaryRegex(term) {
  const escaped = escapeRegex(term);
  const startBoundary = /^[a-zA-Z0-9]/.test(term) ? "(?:^|[^a-zA-Z0-9_])" : "";
  const endBoundary = /[a-zA-Z0-9]$/.test(term) ? "(?=[^a-zA-Z0-9_]|$)" : "";
  return new RegExp(`${startBoundary}${escaped}${endBoundary}`, "i");
}

// Categorize skills into clear domain clusters
function categorizeSkill(skillName) {
  const lower = skillName.toLowerCase();
  const def = SKILL_DEMAND[lower];
  if (def?.category) {
    if (def.category === "AI/ML") return "AI & Machine Learning";
    if (def.category === "Cloud" || def.category === "DevOps") return "Cloud & DevOps";
    if (def.category === "Frontend" || def.category === "Design") return "Frontend & UI/UX";
    if (def.category === "Security") return "Cybersecurity & Security";
    if (def.category === "Architecture") return "Architecture & Systems";
    if (def.category === "QA") return "Testing & Quality Assurance";
    if (def.category === "Data") return "Data & Databases";
    if (def.category === "Soft" || def.category === "Product") return "Leadership & Strategy";
    if (def.category === "Mobile") return "Mobile Engineering";
    return "Technical Engineering";
  }

  // Fallback heuristic based on keywords
  if (/ai|ml|rag|llm|langchain|vision|gpt|deep learning|pytorch|tensorflow/i.test(lower)) return "AI & Machine Learning";
  if (/docker|kubernetes|aws|cloud|terraform|ci\/cd|devops|sre|prometheus/i.test(lower)) return "Cloud & DevOps";
  if (/react|vue|angular|html|css|tailwind|svelte|next|frontend|figma/i.test(lower)) return "Frontend & UI/UX";
  if (/sql|postgres|mongo|redis|kafka|database|bigquery|snowflake/i.test(lower)) return "Data & Databases";
  if (/security|oauth|jwt|auth|owasp|iam/i.test(lower)) return "Cybersecurity & Security";
  if (/test|jest|cypress|playwright|qa/i.test(lower)) return "Testing & Quality Assurance";
  if (/leadership|agile|scrum|product|management/i.test(lower)) return "Leadership & Strategy";
  return "Core Software Engineering";
}

// Detect candidate seniority level
function detectSeniority(text, yearsExperience) {
  const lower = text.toLowerCase();
  if (/\b(principal|distinguished|architect|director|vp|head of)\b/i.test(lower) || (yearsExperience !== null && yearsExperience >= 10)) {
    return { level: "Principal / Leadership", badge: "Principal / Architect Track", icon: "Crown" };
  }
  if (/\b(staff engineer|lead engineer|team lead|tech lead)\b/i.test(lower) || (yearsExperience !== null && yearsExperience >= 7)) {
    return { level: "Lead / Staff Engineer", badge: "Lead / Staff (7+ yrs)", icon: "Shield" };
  }
  if (/\b(senior software|senior engineer|sr\.|senior developer)\b/i.test(lower) || (yearsExperience !== null && yearsExperience >= 4)) {
    return { level: "Senior Engineer", badge: "Senior (4-7 yrs)", icon: "Zap" };
  }
  if (/\b(mid[- ]level|software engineer ii|sde ii)\b/i.test(lower) || (yearsExperience !== null && yearsExperience >= 2)) {
    return { level: "Mid-Level Engineer", badge: "Mid-Level (2-4 yrs)", icon: "Compass" };
  }
  if (/\b(junior|associate|entry[- ]level|fresher|intern|trainee)\b/i.test(lower) || (yearsExperience !== null && yearsExperience < 2)) {
    return { level: "Junior / Entry-Level", badge: "Early Career (0-2 yrs)", icon: "GraduationCap" };
  }
  return { level: "Emerging Professional", badge: "Practical Practitioner", icon: "Code" };
}

// Detect quantifiable impact bullets (metrics intelligence)
function extractImpactMetrics(text) {
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  const metricsFound = [];

  const impactRegex = /(\b\d+(\.\d+)?\s*(%|percent|x|k|m|million|billion|users|req\/sec|rps|tps|ms|seconds|minutes|hours)\b|\$\s*\d+[\d,]*|\b(reduced|increased|scaled|optimized|decreased|accelerated|improved|automated)\b[^\n.!?]{5,80})/i;

  for (const sentence of sentences) {
    const clean = sentence.trim();
    if (clean.length > 20 && clean.length < 220 && impactRegex.test(clean)) {
      metricsFound.push(clean);
      if (metricsFound.length >= 4) break;
    }
  }

  const score = metricsFound.length >= 3 ? "High (Metric-Driven)" : metricsFound.length >= 1 ? "Moderate (Some Metrics)" : "Descriptive (Needs Metrics)";
  return {
    metrics: metricsFound,
    score,
    count: metricsFound.length,
  };
}

export function parseResume(text) {
  if (!text || typeof text !== "string") {
    return {
      skills: [],
      skillCategories: {},
      roles: [],
      yearsExperience: null,
      detectedDegree: null,
      seniority: { level: "Not Specified", badge: "Pending" },
      impactMetrics: { metrics: [], score: "None", count: 0 },
      totalKeywordsDetected: 0,
    };
  }

  const lower = text.toLowerCase();
  const found = new Set();

  // 1. Check all synonyms with intelligent boundary matcher
  for (const [key, canonical] of Object.entries(SKILL_SYNONYMS)) {
    const pattern = createBoundaryRegex(key);
    if (pattern.test(lower)) {
      found.add(canonical);
    }
  }

  // 2. Check canonical skills from SKILL_DEMAND
  const foundLower = new Set([...found].map((s) => s.toLowerCase()));
  for (const skill of ALL_SKILLS) {
    if (foundLower.has(skill)) continue;
    const pattern = createBoundaryRegex(skill);
    if (pattern.test(lower)) {
      const canonical = skill
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      found.add(canonical);
    }
  }

  // 3. Years of experience detection
  const yearsMatch = text.match(/(\d+(\.\d+)?)\+?\s*years?\s*(of)?\s*(experience|work|industry)/i) ||
                     text.match(/experience:\s*(\d+(\.\d+)?)\s*years?/i);
  const yearsExperience = yearsMatch ? parseFloat(yearsMatch[1]) : null;

  // 4. Degree detection
  const degreeMatch = text.match(
    /\b(b\.?tech|m\.?tech|mca|bca|b\.?e\.?|m\.?sc|ph\.?d|bachelor('s)?|master('s)?|diploma)\b/i
  );
  const detectedDegree = degreeMatch ? degreeMatch[0] : null;

  // 5. Role detection
  const roles = ROLE_SIGNALS.filter(({ patterns }) =>
    patterns.some((pattern) => lower.includes(pattern))
  ).map(({ role }) => role);

  // 6. Seniority detection
  const seniority = detectSeniority(text, yearsExperience);

  // 7. Impact metrics analysis
  const impactMetrics = extractImpactMetrics(text);

  // 8. Group detected skills into categories
  const skillCategories = {};
  for (const skill of found) {
    const cat = categorizeSkill(skill);
    if (!skillCategories[cat]) skillCategories[cat] = [];
    skillCategories[cat].push(skill);
  }

  return {
    skills: [...found].sort((a, b) => a.localeCompare(b)),
    skillCategories,
    roles,
    yearsExperience,
    detectedDegree,
    seniority,
    impactMetrics,
    totalKeywordsDetected: found.size,
  };
}

export function realityCheck(resumeSkills = [], simulationSkillGaps = []) {
  const safeResumeSkills = (resumeSkills || []).map((s) => (typeof s === 'string' ? s : s?.name || s?.skill || '')).filter(Boolean);
  const resumeSet = new Set(safeResumeSkills.map((s) => s.toLowerCase()));
  
  const gaps = (simulationSkillGaps || []).map((g) => {
    if (typeof g === 'string') return { skill: g, category: 'Technical' };
    return { skill: g?.skill || g?.name || 'Core Skill', ...g };
  }).filter((g) => Boolean(g.skill));

  const matched = [];
  const missing = [];
  const surplus = [];

  for (const gap of gaps) {
    if (resumeSet.has(gap.skill.toLowerCase())) {
      matched.push({ ...gap, status: "covered" });
    } else {
      missing.push({ ...gap, status: "gap" });
    }
  }

  const gapSet = new Set(gaps.map((g) => g.skill.toLowerCase()));
  for (const skill of safeResumeSkills) {
    if (!gapSet.has(skill.toLowerCase())) {
      surplus.push({ skill, status: "surplus" });
    }
  }

  const coverageScore = gaps.length
    ? Math.round((matched.length / gaps.length) * 100)
    : 100;

  // Intelligent Actionable Recommendations for missing skills
  const smartSuggestions = missing.slice(0, 3).map((item) => {
    return {
      skill: item.skill,
      advice: `Highlight hands-on project experience with ${item.skill} and quantify its production impact (e.g. latency, scale, test coverage).`,
    };
  });

  return {
    matched,
    missing,
    surplus,
    coverageScore,
    resumeSkillCount: safeResumeSkills.length,
    gapCount: missing.length,
    smartSuggestions,
  };
}

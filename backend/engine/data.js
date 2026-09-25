export const CITY_TIERS = {
  bangalore: { code: "bangalore", name: "Bangalore / Bengaluru", multiplier: 1.15, tier: "Tier 1 Tech Capital", description: "Top tech compensation, FAANG & unicorn hub" },
  delhi: { code: "delhi", name: "Delhi NCR (Gurgaon / Noida)", multiplier: 1.08, tier: "Tier 1 Hub", description: "High corporate & growth product presence" },
  mumbai: { code: "mumbai", name: "Mumbai (MMR)", multiplier: 1.06, tier: "Tier 1 Commercial Hub", description: "Fintech, BFSI & large enterprise scale" },
  hyderabad: { code: "hyderabad", name: "Hyderabad", multiplier: 1.02, tier: "Tier 1 Tech Hub", description: "Major cloud MNCs & GCC centers" },
  pune: { code: "pune", name: "Pune", multiplier: 0.90, tier: "Major Tech Hub", description: "Core engineering, automotive & SaaS centers" },
  chennai: { code: "chennai", name: "Chennai", multiplier: 0.88, tier: "Major Tech Hub", description: "SaaS capital & deep enterprise software" },
  kolkata: { code: "kolkata", name: "Kolkata", multiplier: 0.72, tier: "Tier 2 Hub", description: "Emerging IT services & analytics" },
  lucknow: { code: "lucknow", name: "Lucknow", multiplier: 0.62, tier: "Tier 2 Emerging Hub", description: "Growing IT state capital, cost-effective base" },
  ahmedabad: { code: "ahmedabad", name: "Ahmedabad / GIFT City", multiplier: 0.70, tier: "Tier 2 Hub", description: "Fintech SEZ & regional tech growth" },
  jaipur: { code: "jaipur", name: "Jaipur", multiplier: 0.64, tier: "Tier 2 Hub", description: "Software export & digital agencies" },
  indore: { code: "indore", name: "Indore", multiplier: 0.63, tier: "Tier 2 Hub", description: "Fast-growing central Indian IT corridor" },
  kochi: { code: "kochi", name: "Kochi / Trivandrum", multiplier: 0.72, tier: "Tier 2 Hub", description: "Infopark / Technopark ecosystems" },
  remote: { code: "remote", name: "Remote (Pan-India)", multiplier: 0.88, tier: "Distributed", description: "Flexible location-independent compensation" },
  other: { code: "other", name: "Other Tier-2 / Tier-3 Cities", multiplier: 0.58, tier: "Tier 2/3 Regional", description: "Lower living expenses, localized bands" },
  global: { code: "global", name: "Remote (Global / US / EU)", multiplier: 1.80, tier: "International", description: "Cross-border USD-denominated contracts" },
};

export const EXPERIENCE_BRACKETS = [
  { minYears: 0, maxYears: 1, key: "entry", label: "Fresher / Entry (0-1 yrs)", baseSalary: 270000, minRealistic: 180000, maxRealistic: 450000, annualGrowthCap: 0.12 },
  { minYears: 1, maxYears: 3, key: "junior", label: "Junior (1-3 yrs)", baseSalary: 450000, minRealistic: 300000, maxRealistic: 720000, annualGrowthCap: 0.11 },
  { minYears: 3, maxYears: 5, key: "mid", label: "Mid-Level (3-5 yrs)", baseSalary: 750000, minRealistic: 500000, maxRealistic: 1080000, annualGrowthCap: 0.09 },
  { minYears: 5, maxYears: 8, key: "senior", label: "Senior Engineer (5-8 yrs)", baseSalary: 1100000, minRealistic: 780000, maxRealistic: 1550000, annualGrowthCap: 0.08 },
  { minYears: 8, maxYears: 11, key: "lead", label: "Lead / Staff Engineer (8-11 yrs)", baseSalary: 1500000, minRealistic: 1080000, maxRealistic: 2100000, annualGrowthCap: 0.07 },
  { minYears: 11, maxYears: 15, key: "principal", label: "Principal / Architect (11-15 yrs)", baseSalary: 1980000, minRealistic: 1440000, maxRealistic: 2750000, annualGrowthCap: 0.06 },
  { minYears: 15, maxYears: 18, key: "director", label: "Engineering Director / Head of Tech (15-18 yrs)", baseSalary: 2500000, minRealistic: 1800000, maxRealistic: 3480000, annualGrowthCap: 0.050 },
  { minYears: 18, maxYears: 22, key: "sr-director", label: "Senior Director / Distinguished Engineer (18-22 yrs)", baseSalary: 2900000, minRealistic: 2100000, maxRealistic: 4000000, annualGrowthCap: 0.045 },
  { minYears: 22, maxYears: 26, key: "vp", label: "VP of Engineering / Principal Fellow (22-26 yrs)", baseSalary: 3350000, minRealistic: 2400000, maxRealistic: 4680000, annualGrowthCap: 0.040 },
  { minYears: 26, maxYears: 30, key: "svp", label: "Senior VP of Tech / Chief Architect (26-30 yrs)", baseSalary: 3800000, minRealistic: 2750000, maxRealistic: 5300000, annualGrowthCap: 0.035 },
  { minYears: 30, maxYears: 35, key: "cto", label: "Chief Technology Officer (CTO) (30-35 yrs)", baseSalary: 4300000, minRealistic: 3100000, maxRealistic: 6100000, annualGrowthCap: 0.032 },
  { minYears: 35, maxYears: 42, key: "evp-advisor", label: "Executive VP / Chief Technology Strategist (35-42 yrs)", baseSalary: 4800000, minRealistic: 3480000, maxRealistic: 6900000, annualGrowthCap: 0.028 },
  { minYears: 42, maxYears: 99, key: "elder-board", label: "Senior Board Advisor / Tech Elder & Patriarch (42-99 yrs)", baseSalary: 5200000, minRealistic: 3800000, maxRealistic: 7600000, annualGrowthCap: 0.024 },
];

export const SALARY_BASELINES = {
  fresher: 270000,
  "pg-fresh": 340000,
  junior: 450000,
  mid: 750000,
  senior: 1100000,
  lead: 1500000,
  staff: 1980000,
  principal: 2500000,
  director: 2500000,
  "sr-director": 2900000,
  vp: 3350000,
  svp: 3800000,
  cto: 4300000,
  "evp-advisor": 4800000,
  "elder-board": 5200000,
};

export const INDUSTRY_MULTIPLIERS = {
  ai: 1.15,
  fintech: 1.10,
  healthtech: 1.04,
  product: 1.08,
  general: 1,
};

export const SKILL_DEMAND = {
  javascript: { demand: 0.92, category: "Technical" },
  html: { demand: 0.78, category: "Frontend" },
  css: { demand: 0.78, category: "Frontend" },
  react: { demand: 0.9, category: "Technical" },
  "node.js": { demand: 0.85, category: "Technical" },
  php: { demand: 0.7, category: "Technical" },
  python: { demand: 0.93, category: "Technical" },
  sql: { demand: 0.82, category: "Technical" },
  "rest api": { demand: 0.8, category: "Technical" },
  git: { demand: 0.84, category: "Tools" },
  aws: { demand: 0.88, category: "Cloud" },
  docker: { demand: 0.78, category: "Cloud" },
  kubernetes: { demand: 0.74, category: "Cloud" },
  "machine learning": { demand: 0.95, category: "AI/ML" },
  tensorflow: { demand: 0.7, category: "AI/ML" },
  pytorch: { demand: 0.78, category: "AI/ML" },
  nlp: { demand: 0.8, category: "AI/ML" },
  statistics: { demand: 0.76, category: "AI/ML" },
  "data analysis": { demand: 0.84, category: "Data" },
  tableau: { demand: 0.6, category: "Data" },
  "power bi": { demand: 0.65, category: "Data" },
  "system design": { demand: 0.82, category: "Architecture" },
  leadership: { demand: 0.86, category: "Soft" },
  "project management": { demand: 0.8, category: "Soft" },
  "stakeholder management": { demand: 0.74, category: "Soft" },
  "product strategy": { demand: 0.79, category: "Product" },
  "user research": { demand: 0.6, category: "Product" },
  "a/b testing": { demand: 0.66, category: "Product" },
  go: { demand: 0.72, category: "Technical" },
  java: { demand: 0.81, category: "Technical" },
  typescript: { demand: 0.89, category: "Technical" },
  graphql: { demand: 0.68, category: "Technical" },
  cypress: { demand: 0.65, category: "QA" },
  playwright: { demand: 0.78, category: "QA" },
  "test automation": { demand: 0.82, category: "QA" },
  "ci/cd": { demand: 0.85, category: "DevOps" },
  figma: { demand: 0.58, category: "Design" },
  "responsive design": { demand: 0.72, category: "Frontend" },
  accessibility: { demand: 0.68, category: "Frontend" },
  testing: { demand: 0.76, category: "QA" },
  communication: { demand: 0.88, category: "Soft" },
  mentoring: { demand: 0.7, category: "Soft" },
  budgeting: { demand: 0.62, category: "Soft" },
  negotiation: { demand: 0.68, category: "Soft" },
  security: { demand: 0.85, category: "Security" },
  "application security": { demand: 0.88, category: "Security" },
  devsecops: { demand: 0.86, category: "Security" },
  "penetration testing": { demand: 0.78, category: "Security" },
  "react native": { demand: 0.84, category: "Mobile" },
  flutter: { demand: 0.8, category: "Mobile" },
  "ios / swift": { demand: 0.79, category: "Mobile" },
  "android / kotlin": { demand: 0.78, category: "Mobile" },
  "full-stack": { demand: 0.9, category: "Technical" },
  "next.js": { demand: 0.88, category: "Technical" },
  "generative ai": { demand: 0.92, category: "AI/ML" },
  // 100+ Trending & Modern Tech Skills
  langchain: { demand: 0.94, category: "AI/ML" },
  llamaindex: { demand: 0.89, category: "AI/ML" },
  huggingface: { demand: 0.91, category: "AI/ML" },
  rag: { demand: 0.95, category: "AI/ML" },
  "vector databases": { demand: 0.9, category: "AI/ML" },
  pinecone: { demand: 0.87, category: "AI/ML" },
  chromadb: { demand: 0.86, category: "AI/ML" },
  qdrant: { demand: 0.84, category: "AI/ML" },
  milvus: { demand: 0.83, category: "AI/ML" },
  weaviate: { demand: 0.84, category: "AI/ML" },
  "prompt engineering": { demand: 0.88, category: "AI/ML" },
  "fine-tuning": { demand: 0.89, category: "AI/ML" },
  lora: { demand: 0.86, category: "AI/ML" },
  ollama: { demand: 0.85, category: "AI/ML" },
  vllm: { demand: 0.87, category: "AI/ML" },
  "deep learning": { demand: 0.93, category: "AI/ML" },
  "computer vision": { demand: 0.88, category: "AI/ML" },
  "openai api": { demand: 0.92, category: "AI/ML" },
  bedrock: { demand: 0.86, category: "AI/ML" },
  "vertex ai": { demand: 0.87, category: "AI/ML" },
  "scikit-learn": { demand: 0.85, category: "AI/ML" },
  pandas: { demand: 0.86, category: "Data" },
  numpy: { demand: 0.84, category: "Data" },
  polars: { demand: 0.82, category: "Data" },
  terraform: { demand: 0.91, category: "DevOps" },
  ansible: { demand: 0.8, category: "DevOps" },
  pulumi: { demand: 0.82, category: "DevOps" },
  helm: { demand: 0.83, category: "DevOps" },
  argocd: { demand: 0.85, category: "DevOps" },
  "github actions": { demand: 0.89, category: "DevOps" },
  "gitlab ci": { demand: 0.84, category: "DevOps" },
  jenkins: { demand: 0.8, category: "DevOps" },
  prometheus: { demand: 0.85, category: "DevOps" },
  grafana: { demand: 0.86, category: "DevOps" },
  opentelemetry: { demand: 0.88, category: "DevOps" },
  datadog: { demand: 0.85, category: "DevOps" },
  serverless: { demand: 0.84, category: "Cloud" },
  "aws lambda": { demand: 0.86, category: "Cloud" },
  sre: { demand: 0.89, category: "DevOps" },
  "cloud architecture": { demand: 0.92, category: "Cloud" },
  cloudflare: { demand: 0.82, category: "Cloud" },
  nginx: { demand: 0.79, category: "DevOps" },
  linux: { demand: 0.86, category: "Systems" },
  bash: { demand: 0.82, category: "Systems" },
  azure: { demand: 0.86, category: "Cloud" },
  gcp: { demand: 0.85, category: "Cloud" },
  "tailwind css": { demand: 0.9, category: "Frontend" },
  "vue.js": { demand: 0.82, category: "Frontend" },
  angular: { demand: 0.8, category: "Frontend" },
  svelte: { demand: 0.83, category: "Frontend" },
  sveltekit: { demand: 0.82, category: "Frontend" },
  remix: { demand: 0.81, category: "Frontend" },
  astro: { demand: 0.8, category: "Frontend" },
  zustand: { demand: 0.85, category: "Frontend" },
  redux: { demand: 0.83, category: "Frontend" },
  "tanstack query": { demand: 0.87, category: "Frontend" },
  vite: { demand: 0.88, category: "Frontend" },
  webpack: { demand: 0.78, category: "Frontend" },
  storybook: { demand: 0.79, category: "Frontend" },
  websockets: { demand: 0.84, category: "Technical" },
  webrtc: { demand: 0.81, category: "Technical" },
  "progressive web apps": { demand: 0.76, category: "Frontend" },
  "ui/ux design": { demand: 0.84, category: "Design" },
  webgl: { demand: 0.77, category: "Frontend" },
  "three.js": { demand: 0.79, category: "Frontend" },
  fastapi: { demand: 0.91, category: "Technical" },
  django: { demand: 0.83, category: "Technical" },
  flask: { demand: 0.79, category: "Technical" },
  express: { demand: 0.84, category: "Technical" },
  nestjs: { demand: 0.88, category: "Technical" },
  "spring boot": { demand: 0.89, category: "Technical" },
  golang: { demand: 0.92, category: "Technical" },
  rust: { demand: 0.9, category: "Technical" },
  "c#": { demand: 0.83, category: "Technical" },
  ".net core": { demand: 0.84, category: "Technical" },
  "c++": { demand: 0.82, category: "Technical" },
  kotlin: { demand: 0.85, category: "Technical" },
  swift: { demand: 0.84, category: "Mobile" },
  "ruby on rails": { demand: 0.75, category: "Technical" },
  microservices: { demand: 0.93, category: "Architecture" },
  grpc: { demand: 0.87, category: "Technical" },
  "event-driven architecture": { demand: 0.9, category: "Architecture" },
  "domain-driven design": { demand: 0.86, category: "Architecture" },
  "distributed systems": { demand: 0.94, category: "Architecture" },
  postgresql: { demand: 0.92, category: "Data" },
  mongodb: { demand: 0.86, category: "Data" },
  redis: { demand: 0.91, category: "Data" },
  kafka: { demand: 0.93, category: "Data" },
  rabbitmq: { demand: 0.83, category: "Data" },
  elasticsearch: { demand: 0.85, category: "Data" },
  snowflake: { demand: 0.89, category: "Data" },
  bigquery: { demand: 0.88, category: "Data" },
  databricks: { demand: 0.9, category: "Data" },
  "apache spark": { demand: 0.89, category: "Data" },
  "apache airflow": { demand: 0.88, category: "Data" },
  dbt: { demand: 0.87, category: "Data" },
  prisma: { demand: 0.86, category: "Technical" },
  supabase: { demand: 0.85, category: "Technical" },
  firebase: { demand: 0.81, category: "Technical" },
  dynamodb: { demand: 0.85, category: "Cloud" },
  cassandra: { demand: 0.8, category: "Data" },
  clickhouse: { demand: 0.86, category: "Data" },
  "oauth 2.0": { demand: 0.88, category: "Security" },
  jwt: { demand: 0.84, category: "Security" },
  "zero trust": { demand: 0.87, category: "Security" },
  iam: { demand: 0.86, category: "Security" },
  owasp: { demand: 0.87, category: "Security" },
  "soc 2": { demand: 0.81, category: "Security" },
  snyk: { demand: 0.8, category: "Security" },
  sonarqube: { demand: 0.79, category: "Security" },
  cryptography: { demand: 0.82, category: "Security" },
  jest: { demand: 0.83, category: "QA" },
  vitest: { demand: 0.85, category: "QA" },
  selenium: { demand: 0.76, category: "QA" },
  postman: { demand: 0.82, category: "QA" },
  jmeter: { demand: 0.75, category: "QA" },
  tdd: { demand: 0.81, category: "QA" },
  "load testing": { demand: 0.8, category: "QA" },
  "performance optimization": { demand: 0.89, category: "Technical" },
  agile: { demand: 0.87, category: "Soft" },
  scrum: { demand: 0.85, category: "Soft" },
  kanban: { demand: 0.8, category: "Soft" },
  jira: { demand: 0.82, category: "Tools" },
  okrs: { demand: 0.81, category: "Product" },
  "code review": { demand: 0.88, category: "Soft" },
  "technical writing": { demand: 0.81, category: "Soft" },
  "cross-functional leadership": { demand: 0.89, category: "Soft" },
  "incident management": { demand: 0.84, category: "DevOps" },
};

export const SATISFACTION_FACTORS = {
  "deep-specialist": 0.82,
  "management-track": 0.74,
  "pivot-adjacent": 0.69,
  "product-track": 0.78,
  "founder-path": 0.66,
  "data-scientist": 0.80,
  "cybersecurity-architect": 0.81,
  "fullstack-solopreneur": 0.77,
  "fullstack-developer": 0.83,
  "qa-automation-sdet": 0.75,
  "mobile-ecosystem-lead": 0.79,
};

export const ROLE_TREES = {
  "fullstack-developer": {
    title: "The Full-Stack Developer",
    description:
      "You master end-to-end web engineering, seamlessly connecting responsive frontend user experiences, scalable backend microservices, robust databases, and automated cloud deployments.",
    riskLevel: 2,
    divergent: false,
    interests: ["coding", "full-stack", "web", "systems", "architecture", "problem solving", "react", "node"],
    salaryGrowthCurve: (y) => 1 + 0.072 * y + 0.007 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Full-Stack Software Engineer",
        seniority: 1,
        companyArchetype: "product scale-up / modern tech SaaS",
        requiredSkills: [
          { name: "JavaScript", weight: 1.2 },
          { name: "React", weight: 1.1 },
          { name: "Node.js", weight: 1.1 },
          { name: "SQL", weight: 0.9 },
          { name: "REST API", weight: 1.0 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Deploy end-to-end full-stack feature",
              category: "Delivery",
              description: "Build reactive UI in React, backend REST endpoints in Node.js, and integrate SQL schema migrations.",
            },
            {
              quarter: 3,
              title: "Implement JWT authentication & RBAC",
              category: "Craft",
              description: "Architect secure token auth middleware and protected client-side route guards.",
            },
          ],
          1: [
            {
              quarter: 1,
              title: "Full-stack latency & bundle optimization",
              category: "Performance",
              description: "Reduce frontend initial bundle size by 35% and implement server-side Redis caching.",
            },
            {
              quarter: 3,
              title: "Real-time bidirectional WebSocket service",
              category: "Architecture",
              description: "Design low-latency live synchronization pipeline with automated reconnection fallbacks.",
            },
          ],
        },
      },
      {
        title: "Senior Full-Stack Engineer",
        seniority: 2,
        companyArchetype: "growth-stage unicorn / tier-1 product platform",
        requiredSkills: [
          { name: "TypeScript", weight: 1.3 },
          { name: "Next.js", weight: 1.2 },
          { name: "Docker", weight: 1.0 },
          { name: "System Design", weight: 1.2 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Architect micro-frontends & API gateway",
              category: "Architecture",
              description: "Decouple monolithic application into independent domain micro-frontends with a unified gateway.",
            },
            {
              quarter: 3,
              title: "Zero-downtime CI/CD container pipeline",
              category: "DevOps",
              description: "Orchestrate Docker containerized builds with automated integration testing gates.",
            },
          ],
          3: [
            {
              quarter: 1,
              title: "Full-stack engineering mentorship program",
              category: "Mentoring",
              description: "Coach 3 junior engineers on clean architecture, full-stack debugging, and testing best practices.",
            },
            {
              quarter: 4,
              title: "Scale data layer for 10x peak throughput",
              category: "Reliability",
              description: "Optimize database read replicas, connection pooling, and asynchronous background worker queues.",
            },
          ],
        },
      },
      {
        title: "Staff Full-Stack Architect",
        seniority: 3,
        companyArchetype: "global tech enterprise / high-scale cloud provider",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Cloud Architecture", weight: 1.2 },
          { name: "Leadership", weight: 1.2 },
          { name: "Kubernetes", weight: 1.0 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Multi-year technical architecture strategy & RFC",
              category: "Strategy",
              description: "Formulate technical strategy across frontend, backend, and platform teams for next 2 years.",
            },
            {
              quarter: 3,
              title: "Event-driven distributed systems migration",
              category: "Influence",
              description: "Lead company-wide migration from sync HTTP to event-driven streaming architecture.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Engineering bar & hiring loop lead",
              category: "Team building",
              description: "Establish company-wide evaluation rubric and lead principal promotion panel reviews.",
            },
            {
              quarter: 4,
              title: "Resilient active-active multi-region deployment",
              category: "Career",
              description: "Ship edge-rendered, active-active multi-region web platform serving millions of global users.",
            },
          ],
        },
      },
    ],
  },

  "frontend-developer": {
    title: "Frontend Developer & Web Systems Lead",
    description:
      "You spearhead cutting-edge web interfaces, reactive frontend architectures, fluid micro-interactions, high-performance rendering engines, and accessible design systems.",
    riskLevel: 2,
    divergent: false,
    interests: ["frontend", "ui", "ux", "web", "react", "javascript", "design", "coding", "client-side"],
    salaryGrowthCurve: (y) => 1 + 0.068 * y + 0.0065 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Frontend Software Engineer",
        seniority: 1,
        companyArchetype: "modern SaaS / product platform",
        requiredSkills: [
          { name: "JavaScript", weight: 1.3 },
          { name: "React", weight: 1.2 },
          { name: "CSS", weight: 1.1 },
          { name: "TypeScript", weight: 1.1 },
          { name: "REST API", weight: 1.0 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Deliver modular design system components",
              category: "Craft",
              description: "Build accessible, responsive UI primitives adhering to WCAG 2.1 AA standards.",
            },
            {
              quarter: 3,
              title: "State management & caching pipeline",
              category: "Delivery",
              description: "Implement normalized client caching and optimistic UI updates using Zustand/Redux.",
            },
          ],
          1: [
            {
              quarter: 1,
              title: "Core Web Vitals performance audit",
              category: "Performance",
              description: "Achieve sub-second LCP and zero CLS across mobile and desktop viewpoints.",
            },
            {
              quarter: 3,
              title: "Interactive data visualization dashboard",
              category: "Delivery",
              description: "Build canvas/SVG real-time chart pipelines for complex user analytics.",
            },
          ],
        },
      },
      {
        title: "Senior Frontend Engineer",
        seniority: 2,
        companyArchetype: "tier-1 product unicorn / high-traffic consumer web",
        requiredSkills: [
          { name: "TypeScript", weight: 1.3 },
          { name: "Next.js", weight: 1.2 },
          { name: "Web Performance", weight: 1.2 },
          { name: "Testing", weight: 1.0 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Micro-frontend orchestration architecture",
              category: "Architecture",
              description: "Migrate legacy frontend into modular module-federation based micro-apps.",
            },
            {
              quarter: 3,
              title: "End-to-end automated testing matrix",
              category: "Reliability",
              description: "Establish automated Playwright and Cypress regression test pipelines.",
            },
          ],
          3: [
            {
              quarter: 1,
              title: "Cross-functional frontend mentoring",
              category: "Mentoring",
              description: "Lead frontend guilds, code review standards, and technical onboarding.",
            },
            {
              quarter: 4,
              title: "Server-side streaming & Edge rendering",
              category: "Architecture",
              description: "Implement Next.js streaming SSR and Edge caching for global sub-100ms TTFB.",
            },
          ],
        },
      },
      {
        title: "Staff Frontend Architect",
        seniority: 3,
        companyArchetype: "global tech leader / consumer internet powerhouse",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Architecture", weight: 1.3 },
          { name: "Leadership", weight: 1.2 },
          { name: "Accessibility", weight: 1.1 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Company-wide web framework roadmap",
              category: "Strategy",
              description: "Standardize client telemetry, error monitoring, and global rendering infrastructure.",
            },
            {
              quarter: 4,
              title: "Cross-platform web/native unified experience",
              category: "Leadership",
              description: "Drive technical vision across mobile web, PWA, and desktop web applications.",
            },
          ],
        },
      },
    ],
  },

  "backend-developer": {
    title: "Backend Developer & Distributed Systems Architect",
    description:
      "You architect mission-critical backend microservices, resilient distributed databases, high-throughput event queues, and fault-tolerant cloud APIs that power massive scale.",
    riskLevel: 2,
    divergent: false,
    interests: ["backend", "systems", "databases", "architecture", "coding", "cloud", "distributed systems", "apis"],
    salaryGrowthCurve: (y) => 1 + 0.075 * y + 0.0075 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Backend Software Engineer",
        seniority: 1,
        companyArchetype: "high-scale cloud SaaS / fintech platform",
        requiredSkills: [
          { name: "Node.js", weight: 1.2 },
          { name: "SQL", weight: 1.2 },
          { name: "REST API", weight: 1.1 },
          { name: "PostgreSQL", weight: 1.1 },
          { name: "Docker", weight: 1.0 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Build resilient REST & gRPC endpoints",
              category: "Delivery",
              description: "Implement typed API schemas with validation, rate-limiting, and error handling.",
            },
            {
              quarter: 3,
              title: "Relational database schema & indexing",
              category: "Craft",
              description: "Design normalized PostgreSQL schemas with optimized query execution plans.",
            },
          ],
          1: [
            {
              quarter: 1,
              title: "Asynchronous task queue & pub/sub pipeline",
              category: "Reliability",
              description: "Implement Redis/RabbitMQ message queues with dead-letter retries.",
            },
            {
              quarter: 3,
              title: "Backend API security & observability",
              category: "DevOps",
              description: "Add OpenTelemetry distributed tracing, structured logging, and Prometheus metrics.",
            },
          ],
        },
      },
      {
        title: "Senior Backend Engineer",
        seniority: 2,
        companyArchetype: "hyper-growth fintech / mission-critical tier-1 infrastructure",
        requiredSkills: [
          { name: "Distributed Systems", weight: 1.4 },
          { name: "System Design", weight: 1.3 },
          { name: "Kubernetes", weight: 1.2 },
          { name: "Kafka", weight: 1.1 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Event-driven microservices transformation",
              category: "Architecture",
              description: "Migrate synchronous API bottlenecks to high-throughput Kafka streaming events.",
            },
            {
              quarter: 3,
              title: "Zero-data-loss database failover architecture",
              category: "Reliability",
              description: "Set up multi-region read replicas, automated failover, and disaster recovery.",
            },
          ],
          3: [
            {
              quarter: 1,
              title: "Backend team engineering mentorship",
              category: "Mentoring",
              description: "Mentor mid-level engineers on concurrency models, database isolation, and profiling.",
            },
            {
              quarter: 4,
              title: "Scale distributed API to 100K+ RPS",
              category: "Performance",
              description: "Eliminate N+1 bottlenecks, optimize memory buffers, and tune database connection pools.",
            },
          ],
        },
      },
      {
        title: "Principal Backend Systems Architect",
        seniority: 3,
        companyArchetype: "global tier-1 cloud platform / enterprise infrastructure",
        requiredSkills: [
          { name: "System Design", weight: 1.5 },
          { name: "Cloud Architecture", weight: 1.4 },
          { name: "Distributed Systems", weight: 1.4 },
          { name: "Leadership", weight: 1.2 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Global multi-cloud distributed system blueprint",
              category: "Strategy",
              description: "Design active-active multi-region cloud topology with partitioned data stores.",
            },
            {
              quarter: 4,
              title: "Define enterprise backend engineering vision",
              category: "Leadership",
              description: "Drive architectural reviews, reliability SLOs (99.99%), and engineering standards.",
            },
          ],
        },
      },
    ],
  },

  "deep-specialist": {
    title: "The Deep Specialist",
    description:
      "You double down on technical depth, becoming the person people call when a system is genuinely hard. Slower title changes, steeper salary curve after year two, and high respect equity.",
    riskLevel: 2,
    divergent: false,
    interests: ["coding", "architecture", "problem solving", "systems"],
    salaryGrowthCurve: (y) => 1 + 0.065 * y + 0.006 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Software Engineer",
        seniority: 1,
        companyArchetype: "product-led mid-size SaaS",
        requiredSkills: [
          { name: "JavaScript", weight: 1.2 },
          { name: "React", weight: 1 },
          { name: "Node.js", weight: 0.9 },
          { name: "SQL", weight: 0.8 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Ship first production feature",
              category: "Delivery",
              description:
                "Own a small end-to-end feature with tests and a deploy.",
            },
            {
              quarter: 2,
              title: "Internal tech talk",
              category: "Visibility",
              description: "Present something you learned to your team.",
            },
          ],
          1: [
            {
              quarter: 1,
              title: "Lead a code review circle",
              category: "Craft",
              description: "Mentor two juniors through review patterns.",
            },
            {
              quarter: 3,
              title: "Reduce p95 latency by 20%",
              category: "Performance",
              description: "Profile and optimise a hot path.",
            },
          ],
        },
      },
      {
        title: "Senior Engineer",
        seniority: 2,
        companyArchetype: "Series B startup",
        requiredSkills: [
          { name: "System Design", weight: 1.3 },
          { name: "TypeScript", weight: 1 },
          { name: "AWS", weight: 1.1 },
          { name: "Docker", weight: 0.9 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Design a service end-to-end",
              category: "Architecture",
              description: "Own an RFC from problem to approved design.",
            },
            {
              quarter: 3,
              title: "On-call rotation ownership",
              category: "Reliability",
              description: "Lead incident response for your domain.",
            },
          ],
          3: [
            {
              quarter: 1,
              title: "Mentor an intern to full-time offer",
              category: "Mentoring",
              description: "Run a 3-month structured mentorship.",
            },
            {
              quarter: 4,
              title: "Conference talk submission",
              category: "Visibility",
              description: "Submit a talk to a regional dev conference.",
            },
          ],
        },
      },
      {
        title: "Staff Engineer",
        seniority: 3,
        companyArchetype: "scale-up or established tech firm",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Kubernetes", weight: 1 },
          { name: "Leadership", weight: 1.1 },
          { name: "Communication", weight: 1 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Cross-team technical initiative",
              category: "Influence",
              description: "Drive a multi-team architectural change.",
            },
            {
              quarter: 3,
              title: "Author engineering vision doc",
              category: "Strategy",
              description: "Write a 12-month technical roadmap for your area.",
            },
            {
              quarter: 4,
              title: "Patent or open-source release",
              category: "Recognition",
              description: "Ship something the wider community can use.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Hire and onboard two engineers",
              category: "Team building",
              description: "Own hiring loop for your domain.",
            },
            {
              quarter: 4,
              title: "Principal-track case study",
              category: "Career",
              description: "Document impact for a principal promotion case.",
            },
          ],
        },
      },
    ],
  },

  "management-track": {
    title: "The Management Track",
    description:
      "You trade some hands-on coding for scope and people. Titles move faster early, salary catches up through equity and team size, and your leverage compounds with headcount.",
    riskLevel: 3,
    divergent: false,
    interests: ["leadership", "people", "strategy", "communication"],
    salaryGrowthCurve: (y) => 1 + 0.075 * y + 0.007 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Engineering Lead",
        seniority: 2,
        companyArchetype: "growth-stage startup",
        requiredSkills: [
          { name: "Leadership", weight: 1.3 },
          { name: "Project Management", weight: 1.1 },
          { name: "Communication", weight: 1.2 },
          { name: "JavaScript", weight: 0.8 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Run sprint planning for a squad",
              category: "Process",
              description: "Own ceremonies for a 4-person team.",
            },
            {
              quarter: 3,
              title: "First 1:1 rotation",
              category: "People",
              description: "Hold structured 1:1s with each report monthly.",
            },
          ],
          1: [
            {
              quarter: 1,
              title: "Hire your first report",
              category: "Hiring",
              description: "Own sourcing through offer for one role.",
            },
            {
              quarter: 4,
              title: "Quarterly team OKRs",
              category: "Planning",
              description: "Set and ship measurable team goals.",
            },
          ],
        },
      },
      {
        title: "Engineering Manager",
        seniority: 3,
        companyArchetype: "Series C scale-up",
        requiredSkills: [
          { name: "Leadership", weight: 1.4 },
          { name: "Stakeholder Management", weight: 1.2 },
          { name: "Project Management", weight: 1 },
          { name: "Mentoring", weight: 1 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Manage a team of five",
              category: "Scope",
              description: "Own performance for a full squad.",
            },
            {
              quarter: 3,
              title: "Cross-functional roadmap",
              category: "Strategy",
              description: "Align engineering with product and design.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Performance calibration lead",
              category: "People",
              description: "Run calibration for two teams.",
            },
            {
              quarter: 4,
              title: "Budget ownership",
              category: "Operations",
              description: "Own a team-level annual budget.",
            },
          ],
        },
      },
      {
        title: "Director of Engineering",
        seniority: 4,
        companyArchetype: "mid-size enterprise or late-stage startup",
        requiredSkills: [
          { name: "Leadership", weight: 1.5 },
          { name: "Stakeholder Management", weight: 1.3 },
          { name: "Budgeting", weight: 1 },
          { name: "Product Strategy", weight: 0.9 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Manage managers",
              category: "Org",
              description: "Have two EMs reporting to you.",
            },
            {
              quarter: 3,
              title: "Org-wide engineering strategy",
              category: "Strategy",
              description: "Set a 6-quarter engineering strategy.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Headcount plan for 30+ engineers",
              category: "Planning",
              description: "Build and defend an annual hiring plan.",
            },
            {
              quarter: 4,
              title: "Board-level engineering update",
              category: "Visibility",
              description: "Present engineering health to leadership.",
            },
          ],
        },
      },
    ],
  },

  "pivot-adjacent": {
    title: "Platform & Cloud Systems Architect",
    description:
      "You bridge core software development and cloud operations. You master Kubernetes, infrastructure-as-code, and distributed systems resilience — commanding top-tier market compensation as companies scale.",
    riskLevel: 3,
    divergent: true,
    interests: ["systems", "architecture", "coding", "problem solving", "cloud"],
    salaryGrowthCurve: (y) => 1 + 0.055 * y + 0.006 * y * y,
    promotionPace: 1,
    skillsPerYear: 3,
    roles: [
      {
        title: "Cloud Infrastructure Engineer",
        seniority: 1,
        companyArchetype: "cloud-native scale-up",
        requiredSkills: [
          { name: "AWS", weight: 1.3 },
          { name: "Docker", weight: 1.2 },
          { name: "Python", weight: 1 },
          { name: "Linux", weight: 0.9 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Automate CI/CD pipeline",
              category: "Delivery",
              description: "Build zero-downtime deployment pipelines with automated rollback.",
            },
            {
              quarter: 3,
              title: "Containerize core services",
              category: "Architecture",
              description: "Standardize microservices deployment containers with Docker.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Terraform infrastructure as code",
              category: "Architecture",
              description: "Codify 100% of cloud resources in declarative Terraform modules.",
            },
            {
              quarter: 4,
              title: "AWS Solutions Architect Associate",
              category: "Credential",
              description: "Obtain recognized cloud certification.",
            },
          ],
        },
      },
      {
        title: "Senior Site Reliability Engineer (SRE)",
        seniority: 2,
        companyArchetype: "Series C fintech or SaaS enterprise",
        requiredSkills: [
          { name: "Kubernetes", weight: 1.4 },
          { name: "System Design", weight: 1.3 },
          { name: "Security", weight: 1.1 },
          { name: "Go", weight: 0.9 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Multi-cluster Kubernetes setup",
              category: "Architecture",
              description: "Architect high-availability EKS/GKE clusters across multiple regions.",
            },
            {
              quarter: 3,
              title: "Chaos engineering and SLOs",
              category: "Reliability",
              description: "Define error budgets, latency SLOs, and run automated chaos experiments.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Cloud cost optimization (FinOps)",
              category: "Operations",
              description: "Reduce annual cloud infrastructure expenditure by 30%.",
            },
            {
              quarter: 4,
              title: "SRE on-call playbook",
              category: "Process",
              description: "Standardize incident management and run post-mortem workshops.",
            },
          ],
        },
      },
      {
        title: "Principal Platform Architect",
        seniority: 3,
        companyArchetype: "high-scale tech unicorn",
        requiredSkills: [
          { name: "System Design", weight: 1.5 },
          { name: "Kubernetes", weight: 1.3 },
          { name: "Leadership", weight: 1.2 },
          { name: "Security", weight: 1.1 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Internal developer platform (IDP)",
              category: "Architecture",
              description: "Build internal PaaS enabling 50+ engineers to ship securely.",
            },
            {
              quarter: 3,
              title: "Zero-trust network architecture",
              category: "Security",
              description: "Implement service-mesh mutual TLS and role-based zero-trust security.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Global multi-cloud disaster recovery",
              category: "Reliability",
              description: "Demonstrate 15-minute global disaster recovery across cloud providers.",
            },
            {
              quarter: 4,
              title: "Distinguished engineer promotion doc",
              category: "Career",
              description: "Deliver platform reliability case study to company executive committee.",
            },
          ],
        },
      },
    ],
  },

  "product-track": {
    title: "The Product Track",
    description:
      "You move from building software to shaping what gets built. A product-minded engineer path — strong on strategy and stakeholder work, with compensation driven by outcomes rather than depth.",
    riskLevel: 3,
    divergent: false,
    interests: ["product", "users", "strategy", "design"],
    salaryGrowthCurve: (y) => 1 + 0.065 * y + 0.006 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Associate Product Manager",
        seniority: 1,
        companyArchetype: "product-led startup",
        requiredSkills: [
          { name: "Product Strategy", weight: 1.3 },
          { name: "Communication", weight: 1.1 },
          { name: "User Research", weight: 1 },
          { name: "A/B Testing", weight: 0.9 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Ship a PRD end-to-end",
              category: "Delivery",
              description: "Own one product spec from research to launch.",
            },
            {
              quarter: 3,
              title: "Run five user interviews",
              category: "Discovery",
              description: "Conduct structured user interviews and synthesize.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Own a feature metric",
              category: "Outcomes",
              description: "Pick a KPI and move it measurably.",
            },
            {
              quarter: 4,
              title: "Roadmap input for next quarter",
              category: "Strategy",
              description: "Contribute to quarterly planning with data.",
            },
          ],
        },
      },
      {
        title: "Product Manager",
        seniority: 2,
        companyArchetype: "Series B/C startup",
        requiredSkills: [
          { name: "Product Strategy", weight: 1.4 },
          { name: "Stakeholder Management", weight: 1.2 },
          { name: "A/B Testing", weight: 1 },
          { name: "Communication", weight: 1.1 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Own a product area",
              category: "Scope",
              description: "Be the DRI for a full product surface.",
            },
            {
              quarter: 3,
              title: "Launch a revenue-moving feature",
              category: "Outcomes",
              description: "Ship something tied to a business metric.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Quarterly roadmap owner",
              category: "Strategy",
              description: "Set and defend a quarter roadmap.",
            },
            {
              quarter: 4,
              title: "Cross-team dependency lead",
              category: "Influence",
              description: "Coordinate a multi-team launch.",
            },
          ],
        },
      },
      {
        title: "Senior Product Manager",
        seniority: 3,
        companyArchetype: "growth-stage or enterprise SaaS",
        requiredSkills: [
          { name: "Product Strategy", weight: 1.5 },
          { name: "Leadership", weight: 1.1 },
          { name: "Stakeholder Management", weight: 1.3 },
          { name: "Budgeting", weight: 0.8 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Define a product vision",
              category: "Strategy",
              description: "Write a 12-month vision for your area.",
            },
            {
              quarter: 3,
              title: "Mentor an APM",
              category: "Mentoring",
              description: "Run a structured APM development plan.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Lead a product launch",
              category: "Delivery",
              description: "Own a go-to-market for a major release.",
            },
            {
              quarter: 4,
              title: "Group PM case study",
              category: "Career",
              description: "Build the case for managing a PM team.",
            },
          ],
        },
      },
    ],
  },

  "data-scientist": {
    title: "The AI & Data Specialist",
    description:
      "You develop core algorithms, machine learning models, and analytical pipelines. Surging enterprise demand with steep compensation scaling as you transition from model training to production architecture.",
    riskLevel: 3,
    divergent: false,
    interests: ["data", "ai", "machine learning", "statistics", "coding", "research"],
    salaryGrowthCurve: (y) => 1 + 0.075 * y + 0.007 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Junior Data & ML Engineer",
        seniority: 1,
        companyArchetype: "AI-driven product company",
        requiredSkills: [
          { name: "Python", weight: 1.3 },
          { name: "SQL", weight: 1.1 },
          { name: "Statistics", weight: 1 },
          { name: "Data Analysis", weight: 1 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Deploy first feature pipeline",
              category: "Delivery",
              description: "Build an automated data ingestion and cleaning pipeline.",
            },
            {
              quarter: 3,
              title: "Model benchmarking study",
              category: "Learning",
              description: "Benchmark open-source foundational models for internal use.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Production model endpoint",
              category: "Delivery",
              description: "Serve predictions behind a scalable REST API with monitoring.",
            },
            {
              quarter: 4,
              title: "Deep learning certification",
              category: "Credential",
              description: "Earn a recognized cloud or deep learning specialization.",
            },
          ],
        },
      },
      {
        title: "Machine Learning Engineer",
        seniority: 2,
        companyArchetype: "Series B tech scale-up",
        requiredSkills: [
          { name: "Machine Learning", weight: 1.5 },
          { name: "PyTorch", weight: 1.3 },
          { name: "System Design", weight: 1.1 },
          { name: "Docker", weight: 0.9 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "End-to-end MLOps pipeline",
              category: "Architecture",
              description: "Implement CI/CD for automated training, evaluation, and rollout.",
            },
            {
              quarter: 3,
              title: "Feature store integration",
              category: "Architecture",
              description: "Establish shared real-time and batch feature stores.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Latency optimization initiative",
              category: "Reliability",
              description: "Reduce model p99 inference latency by 40%.",
            },
            {
              quarter: 4,
              title: "Mentor junior data scientists",
              category: "Mentoring",
              description: "Lead onboarding for two incoming junior engineers.",
            },
          ],
        },
      },
      {
        title: "Staff AI & Data Architect",
        seniority: 3,
        companyArchetype: "enterprise AI team or unicorn",
        requiredSkills: [
          { name: "System Design", weight: 1.5 },
          { name: "Machine Learning", weight: 1.4 },
          { name: "Leadership", weight: 1.2 },
          { name: "Communication", weight: 1 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Company AI infrastructure vision",
              category: "Strategy",
              description: "Author the multi-year distributed training and inference roadmap.",
            },
            {
              quarter: 3,
              title: "Keynote presentation at AI summit",
              category: "Visibility",
              description: "Deliver an industry case study on production model reliability.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "LLM fine-tuning infrastructure",
              category: "Innovation",
              description: "Scale proprietary domain-adapted LLM workflows across squads.",
            },
            {
              quarter: 4,
              title: "Principal-level evaluation case",
              category: "Career",
              description: "Document business ROI exceeding 10x compute expenditure.",
            },
          ],
        },
      },
    ],
  },

  "founder-path": {
    title: "The Early-Stage Founder",
    description:
      "High agency, rapid breadth over narrow specialization. You go from founding technical engineer to shaping product, team, and company culture with high upside equity.",
    riskLevel: 5,
    divergent: true,
    interests: ["leadership", "strategy", "product", "creativity", "coding", "problem solving"],
    salaryGrowthCurve: (y) => 1 + 0.035 * y + 0.012 * y * y,
    promotionPace: 1,
    skillsPerYear: 3,
    roles: [
      {
        title: "Founding Full-Stack Engineer",
        seniority: 1,
        companyArchetype: "seed-stage venture backed startup",
        requiredSkills: [
          { name: "JavaScript", weight: 1.2 },
          { name: "React", weight: 1.1 },
          { name: "Node.js", weight: 1.1 },
          { name: "Product Strategy", weight: 1 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Ship MVP from blank repo",
              category: "Delivery",
              description: "Design and ship v1 of the product to first 100 pilot users.",
            },
            {
              quarter: 3,
              title: "Customer feedback iteration cycle",
              category: "Discovery",
              description: "Run weekly user feedback cycles and iterate core value loop.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "First paid customer conversion",
              category: "Outcomes",
              description: "Instrument telemetry and validate product-market fit metrics.",
            },
            {
              quarter: 4,
              title: "Seed funding technical presentation",
              category: "Strategy",
              description: "Co-present architecture and technical moats to venture investors.",
            },
          ],
        },
      },
      {
        title: "Head of Engineering",
        seniority: 2,
        companyArchetype: "Series A high-growth startup",
        requiredSkills: [
          { name: "System Design", weight: 1.3 },
          { name: "Leadership", weight: 1.4 },
          { name: "AWS", weight: 1 },
          { name: "Communication", weight: 1.2 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Scale core infrastructure 10x",
              category: "Architecture",
              description: "Re-architect monolithic core for multi-region microservices.",
            },
            {
              quarter: 3,
              title: "Hire initial engineering team",
              category: "People",
              description: "Interview, hire, and onboard first 6 full-time engineers.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Security and compliance audit",
              category: "Operations",
              description: "Achieve SOC2 compliance to unlock enterprise client deals.",
            },
            {
              quarter: 4,
              title: "Engineering leveling and culture framework",
              category: "Org",
              description: "Establish career ladders, equity grant schedules, and review cadence.",
            },
          ],
        },
      },
      {
        title: "Chief Technology Officer (CTO)",
        seniority: 3,
        companyArchetype: "Series B venture-backed firm",
        requiredSkills: [
          { name: "Leadership", weight: 1.5 },
          { name: "Stakeholder Management", weight: 1.3 },
          { name: "Budgeting", weight: 1.1 },
          { name: "Product Strategy", weight: 1.2 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Board-level technical roadmap",
              category: "Strategy",
              description: "Define annual technical vision and defend capital budget.",
            },
            {
              quarter: 3,
              title: "Executive management recruiting",
              category: "Org",
              description: "Recruit VP of Engineering and Staff Architects.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Strategic enterprise integration",
              category: "Influence",
              description: "Deliver high-value enterprise partnerships and ecosystem integrations.",
            },
            {
              quarter: 4,
              title: "Series C readiness & growth trajectory",
              category: "Career",
              description: "Align technology reliability metrics for growth-stage institutional rounds.",
            },
          ],
        },
      },
    ],
  },

  "cybersecurity-architect": {
    title: "Cybersecurity & DevSecOps Architect",
    description:
      "You safeguard mission-critical systems, secure cloud perimeters, and engineer automated DevSecOps pipelines. High scarcity skill set commanding premier enterprise compensation and regulatory respect.",
    riskLevel: 2,
    divergent: true,
    interests: ["security", "cloud", "systems", "architecture", "coding"],
    salaryGrowthCurve: (y) => 1 + 0.060 * y + 0.005 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Application Security & DevSecOps Engineer",
        seniority: 1,
        companyArchetype: "enterprise cloud / fintech security",
        requiredSkills: [
          { name: "Security", weight: 1.3 },
          { name: "Application Security", weight: 1.2 },
          { name: "DevSecOps", weight: 1.1 },
          { name: "Docker", weight: 0.9 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Automate SAST/DAST in CI/CD pipeline",
              category: "Delivery",
              description: "Integrate security scanners into deployment workflows with automated PR gatekeeping.",
            },
            {
              quarter: 3,
              title: "OWASP Top-10 remediation audit",
              category: "Learning",
              description: "Perform vulnerability audits across core backend endpoints and remediate injection vectors.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "SOC-2 Type II readiness controls",
              category: "Visibility",
              description: "Implement audit trails, secrets rotation, and identity access management policies.",
            },
            {
              quarter: 4,
              title: "Threat modeling framework rollout",
              category: "Strategy",
              description: "Run threat modeling sessions for high-risk payment and auth microservices.",
            },
          ],
        },
      },
      {
        title: "Senior Cloud Security Engineer",
        seniority: 2,
        companyArchetype: "regulated SaaS / financial platform",
        requiredSkills: [
          { name: "AWS", weight: 1.3 },
          { name: "Kubernetes", weight: 1.2 },
          { name: "Penetration Testing", weight: 1.1 },
          { name: "System Design", weight: 1.0 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Zero-Trust network architecture implementation",
              category: "Architecture",
              description: "Migrate internal cluster services to mutual TLS and strict least-privilege IAM.",
            },
            {
              quarter: 3,
              title: "Bug bounty program triage lead",
              category: "Org",
              description: "Direct third-party hacker vulnerability submissions and manage SLA response times.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Chaos engineering red-team drill",
              category: "Delivery",
              description: "Orchestrate simulated adversarial intrusion drills and evaluate blue-team incident response.",
            },
            {
              quarter: 4,
              title: "Security council champion",
              category: "Mentoring",
              description: "Train 20+ product engineers on defensive coding and cryptographic key management.",
            },
          ],
        },
      },
      {
        title: "Principal Security Architect",
        seniority: 3,
        companyArchetype: "global tech unicorn / enterprise tier",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Leadership", weight: 1.3 },
          { name: "Stakeholder Management", weight: 1.2 },
          { name: "Security", weight: 1.5 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Global cryptographic governance standard",
              category: "Strategy",
              description: "Architect post-quantum ready encryption and data-at-rest governance across cloud regions.",
            },
            {
              quarter: 4,
              title: "CISO advisory & compliance defense",
              category: "Influence",
              description: "Represent cybersecurity posture before external compliance regulators and enterprise auditors.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Autonomous security remediation engine",
              category: "Architecture",
              description: "Deploy AI-assisted auto-patching for critical CVEs without customer-facing downtime.",
            },
            {
              quarter: 4,
              title: "Enterprise security roadmap",
              category: "Career",
              description: "Define multi-year defense posture and secure multi-million security infrastructure budget.",
            },
          ],
        },
      },
    ],
  },

  "fullstack-solopreneur": {
    title: "Full-Stack AI Product Builder & Consultant",
    description:
      "High-agency autonomy blending modern full-stack development, Generative AI models, and high-ticket technical consulting or scalable SaaS products.",
    riskLevel: 4,
    divergent: true,
    interests: ["coding", "full-stack", "product", "creativity", "ai"],
    salaryGrowthCurve: (y) => 1 + 0.055 * y + 0.008 * y * y,
    promotionPace: 1,
    skillsPerYear: 3,
    roles: [
      {
        title: "Full-Stack AI Product Engineer",
        seniority: 1,
        companyArchetype: "modern AI venture / digital studio",
        requiredSkills: [
          { name: "Full-Stack", weight: 1.3 },
          { name: "Next.js", weight: 1.2 },
          { name: "TypeScript", weight: 1.1 },
          { name: "Generative AI", weight: 1.0 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Ship production AI full-stack application",
              category: "Delivery",
              description: "Launch Next.js application with streaming LLM responses, Stripe subscriptions, and auth.",
            },
            {
              quarter: 3,
              title: "API rate-limiting & caching architecture",
              category: "Learning",
              description: "Implement Redis semantic caching to slash AI inference costs by 40%.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Acquire first 1,000 active users",
              category: "Product",
              description: "Optimize conversion funnels, onboarding flows, and automated retention emails.",
            },
            {
              quarter: 4,
              title: "High-ticket consulting contract delivery",
              category: "Delivery",
              description: "Deliver a 4-week modernization sprint for an enterprise client looking to adopt AI tooling.",
            },
          ],
        },
      },
      {
        title: "Senior Product Architect & Solo Builder",
        seniority: 2,
        companyArchetype: "independent software venture / high-growth SaaS",
        requiredSkills: [
          { name: "System Design", weight: 1.2 },
          { name: "Product Strategy", weight: 1.3 },
          { name: "Generative AI", weight: 1.2 },
          { name: "Full-Stack", weight: 1.1 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Multi-tenant architecture refactoring",
              category: "Architecture",
              description: "Scale database isolation and tenant billing to support enterprise B2B customer tiers.",
            },
            {
              quarter: 3,
              title: "Automated distribution flywheel",
              category: "Visibility",
              description: "Publish technical teardowns and open-source boilerplates attracting 50k+ views.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Profitable recurring revenue milestone",
              category: "Career",
              description: "Achieve stable monthly recurring revenue or sustained $150+/hr advisory rate.",
            },
            {
              quarter: 4,
              title: "Autonomous deployment workflows",
              category: "Process",
              description: "Construct zero-touch staging and canary deployment automation for lightning-fast feature releases.",
            },
          ],
        },
      },
      {
        title: "Principal AI Consultant & Tech Founder",
        seniority: 3,
        companyArchetype: "boutique consulting firm / portfolio holding",
        requiredSkills: [
          { name: "Product Strategy", weight: 1.4 },
          { name: "Leadership", weight: 1.2 },
          { name: "Stakeholder Management", weight: 1.3 },
          { name: "System Design", weight: 1.2 },
        ],
        milestones: {
          4: [
            {
              quarter: 2,
              title: "Fractional CTO engagements",
              category: "Influence",
              description: "Advise series-A founders on tech stack selection, hiring pipelines, and AI defensibility.",
            },
            {
              quarter: 4,
              title: "SaaS micro-acquisition or strategic partnership",
              category: "Strategy",
              description: "Negotiate licensing or integration terms with institutional software buyers.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Automated portfolio operations",
              category: "Org",
              description: "Delegate routine engineering ops to trusted contractors while retaining creative direction.",
            },
            {
              quarter: 4,
              title: "Sustainable freedom & premium compensation",
              category: "Career",
              description: "Establish location-independent high income with compounding intellectual property equity.",
            },
          ],
        },
      },
    ],
  },

  "qa-automation-sdet": {
    title: "SDET & Quality Platform Architect",
    description:
      "You build automated test platforms, CI/CD verification gates, and chaos engineering tools that keep massive distributed systems reliable under high load.",
    riskLevel: 1,
    divergent: false,
    interests: ["testing", "coding", "systems", "problem solving"],
    salaryGrowthCurve: (y) => 1 + 0.052 * y + 0.005 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Software Development Engineer in Test (SDET)",
        seniority: 1,
        companyArchetype: "product scale-up / fintech platform",
        requiredSkills: [
          { name: "Test Automation", weight: 1.3 },
          { name: "Playwright", weight: 1.2 },
          { name: "JavaScript", weight: 1.0 },
          { name: "CI/CD", weight: 1.1 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "End-to-End test suite framework setup",
              category: "Delivery",
              description: "Build robust Playwright regression framework executing in parallel CI runners.",
            },
            {
              quarter: 3,
              title: "API contract testing with mock servers",
              category: "Learning",
              description: "Implement contract tests ensuring zero broken microservice contracts during deployments.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Slash test pipeline runtime by 50%",
              category: "Process",
              description: "Implement smart test sharding, selective test execution, and caching in GitHub Actions.",
            },
            {
              quarter: 4,
              title: "Flaky test quarantine mechanism",
              category: "Visibility",
              description: "Create automated metrics dashboard monitoring flaky tests and auto-quarantining false alarms.",
            },
          ],
        },
      },
      {
        title: "Senior SDET & Quality Platform Lead",
        seniority: 2,
        companyArchetype: "high-throughput distributed tech company",
        requiredSkills: [
          { name: "System Design", weight: 1.2 },
          { name: "Docker", weight: 1.1 },
          { name: "CI/CD", weight: 1.3 },
          { name: "Python", weight: 1.0 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Load & stress testing test harness",
              category: "Architecture",
              description: "Design automated performance test harnesses simulating 50,000 concurrent API users.",
            },
            {
              quarter: 3,
              title: "Developer experience tooling",
              category: "Delivery",
              description: "Provide one-click ephemeral preview environments with seeded test data for engineers.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Chaos testing & disaster recovery validation",
              category: "Delivery",
              description: "Inject network latency and node failures in staging environments to verify resilient fallbacks.",
            },
            {
              quarter: 4,
              title: "Cross-team quality standards champion",
              category: "Mentoring",
              description: "Mentor 15+ backend and frontend developers on effective unit and integration testing habits.",
            },
          ],
        },
      },
      {
        title: "Staff Quality Platform Architect",
        seniority: 3,
        companyArchetype: "Tier-1 tech enterprise / global cloud",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Leadership", weight: 1.2 },
          { name: "CI/CD", weight: 1.3 },
          { name: "Stakeholder Management", weight: 1.1 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Organization-wide zero-defect gatekeeping",
              category: "Strategy",
              description: "Architect automated release confidence score enabling continuous production deployments.",
            },
            {
              quarter: 3,
              title: "AI-powered test generation platform",
              category: "Architecture",
              description: "Deploy generative AI agent that parses PR diffs and automatically generates edge-case test cases.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Executive quality & reliability SLA metrics",
              category: "Influence",
              description: "Report production uptime, mean-time-to-detection, and regression impact to VP of Engineering.",
            },
            {
              quarter: 4,
              title: "Industry conference keynote on reliability",
              category: "Career",
              description: "Present testing innovations at premier DevOps and testing conferences.",
            },
          ],
        },
      },
    ],
  },

  "mobile-ecosystem-lead": {
    title: "Mobile Systems & Cross-Platform Lead",
    description:
      "You master high-performance mobile apps across React Native, Flutter, iOS, and Android — delivering fluid user experiences to millions of active consumers.",
    riskLevel: 2,
    divergent: false,
    interests: ["mobile", "frontend", "coding", "product", "users"],
    salaryGrowthCurve: (y) => 1 + 0.058 * y + 0.006 * y * y,
    promotionPace: 1,
    skillsPerYear: 2,
    roles: [
      {
        title: "Mobile Application Engineer",
        seniority: 1,
        companyArchetype: "consumer tech / digital commerce app",
        requiredSkills: [
          { name: "React Native", weight: 1.3 },
          { name: "TypeScript", weight: 1.1 },
          { name: "JavaScript", weight: 1.0 },
          { name: "Responsive Design", weight: 1.0 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Ship cross-platform feature to App Store & Play Store",
              category: "Delivery",
              description: "Deliver pixel-perfect mobile features supporting both iOS and Android navigation paradigms.",
            },
            {
              quarter: 3,
              title: "Offline-first database sync implementation",
              category: "Learning",
              description: "Implement local SQLite / WatermelonDB cache with conflict resolution for low-connectivity users.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "60 FPS rendering & memory leak profiling",
              category: "Delivery",
              description: "Profile app memory and JS thread bottlenecks to eliminate frame drops in heavy scrolling lists.",
            },
            {
              quarter: 4,
              title: "Deep link & push notification infrastructure",
              category: "Process",
              description: "Set up universal deep linking and targeted push notification campaigns boosting retention by 25%.",
            },
          ],
        },
      },
      {
        title: "Senior Mobile Platform Engineer",
        seniority: 2,
        companyArchetype: "high-scale B2C app / FinTech unicorn",
        requiredSkills: [
          { name: "React Native", weight: 1.3 },
          { name: "iOS / Swift", weight: 1.1 },
          { name: "Android / Kotlin", weight: 1.1 },
          { name: "System Design", weight: 1.0 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "Native bridge & custom C++/Swift modules",
              category: "Architecture",
              description: "Write high-performance native modules bridging device hardware and encryption directly.",
            },
            {
              quarter: 3,
              title: "Mobile CI/CD Fastlane deployment automation",
              category: "Process",
              description: "Automate code signing, beta distribution via TestFlight, and phased production app store releases.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Design system mobile component library",
              category: "Delivery",
              description: "Build shared token-based mobile UI library used across 4 distinct company mobile apps.",
            },
            {
              quarter: 4,
              title: "Crash-free sessions metric over 99.8%",
              category: "Visibility",
              description: "Lead mobile observability and bug triage to maintain industry-leading crash-free session stability.",
            },
          ],
        },
      },
      {
        title: "Staff Mobile Systems Architect",
        seniority: 3,
        companyArchetype: "global consumer app / streaming giant",
        requiredSkills: [
          { name: "System Design", weight: 1.4 },
          { name: "Leadership", weight: 1.2 },
          { name: "Stakeholder Management", weight: 1.1 },
          { name: "React Native", weight: 1.3 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Micro-frontend or SuperApp modular architecture",
              category: "Architecture",
              description: "Decouple monolithic mobile codebase into independent feature mini-apps maintained by distinct squads.",
            },
            {
              quarter: 3,
              title: "Over-The-Air (OTA) update safety architecture",
              category: "Strategy",
              description: "Deploy instant bugfix OTA rollouts with automated rollbacks if crash anomalies are detected.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Mobile engineering hiring standard & culture",
              category: "Org",
              description: "Hire and mentor 12+ junior and senior mobile specialists across iOS and Android verticals.",
            },
            {
              quarter: 4,
              title: "Executive mobile product roadmapping",
              category: "Career",
              description: "Partner with CPO to define next-generation device features including on-device AI and spatial UI.",
            },
          ],
        },
      },
    ],
  },
};

export const MILESTONE_CATEGORIES = [
  "Learning",
  "Delivery",
  "Visibility",
  "Mentoring",
  "Strategy",
  "People",
  "Career",
];

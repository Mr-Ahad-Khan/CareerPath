export const SALARY_BASELINES = {
  fresher: 420000,
  "pg-fresh": 560000,
  junior: 720000,
  mid: 1200000,
  senior: 2100000,
};

export const INDUSTRY_MULTIPLIERS = {
  ai: 1.35,
  fintech: 1.22,
  healthtech: 1.1,
  product: 1.18,
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
  cypress: { demand: 0.55, category: "QA" },
  figma: { demand: 0.58, category: "Design" },
  "responsive design": { demand: 0.72, category: "Frontend" },
  accessibility: { demand: 0.68, category: "Frontend" },
  testing: { demand: 0.76, category: "QA" },
  communication: { demand: 0.88, category: "Soft" },
  mentoring: { demand: 0.7, category: "Soft" },
  budgeting: { demand: 0.62, category: "Soft" },
  negotiation: { demand: 0.68, category: "Soft" },
  security: { demand: 0.77, category: "Security" },
};

export const SATISFACTION_FACTORS = {
  "deep-specialist": 0.82,
  "management-track": 0.74,
  "pivot-adjacent": 0.69,
  "product-track": 0.78,
  "founder-path": 0.66,
  "data-scientist": 0.8,
};

export const ROLE_TREES = {
  "deep-specialist": {
    title: "The Deep Specialist",
    description:
      "You double down on technical depth, becoming the person people call when a system is genuinely hard. Slower title changes, steeper salary curve after year two, and high respect equity.",
    riskLevel: 2,
    divergent: false,
    interests: ["coding", "architecture", "problem solving", "systems"],
    salaryGrowthCurve: (y) => 1 + 0.08 * y + 0.01 * y * y,
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
    salaryGrowthCurve: (y) => 1 + 0.1 * y + 0.012 * y * y,
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
    title: "Pivot to an Adjacent Field",
    description:
      "You leverage transferable skills but switch domains — backend to ML, QA to SRE, or engineering to product. A reset in seniority early, a faster ceiling later if the pivot lands.",
    riskLevel: 4,
    divergent: true,
    interests: ["learning", "variety", "data", "research"],
    salaryGrowthCurve: (y) => 1 + 0.07 * y + 0.012 * y * y,
    promotionPace: 1,
    skillsPerYear: 3,
    roles: [
      {
        title: "Junior Data Analyst",
        seniority: 1,
        companyArchetype: "data-driven mid-size company",
        requiredSkills: [
          { name: "Python", weight: 1.3 },
          { name: "SQL", weight: 1.2 },
          { name: "Statistics", weight: 1 },
          { name: "Data Analysis", weight: 1.1 },
        ],
        milestones: {
          0: [
            {
              quarter: 1,
              title: "Complete a data analytics bootcamp",
              category: "Learning",
              description: "Structured 12-week fundamentals program.",
            },
            {
              quarter: 3,
              title: "Ship a business dashboard",
              category: "Delivery",
              description: "Build a Tableau/Power BI dashboard used by a team.",
            },
          ],
          1: [
            {
              quarter: 2,
              title: "Run an A/B test end-to-end",
              category: "Experimentation",
              description: "Design, ship, and analyse one experiment.",
            },
            {
              quarter: 4,
              title: "SQL deep-dive certification",
              category: "Credential",
              description: "Earn a recognised SQL/analytics certification.",
            },
          ],
        },
      },
      {
        title: "Data Scientist",
        seniority: 2,
        companyArchetype: "Series B startup or analytics consultancy",
        requiredSkills: [
          { name: "Machine Learning", weight: 1.4 },
          { name: "Python", weight: 1.2 },
          { name: "Statistics", weight: 1.1 },
          { name: "NLP", weight: 0.9 },
        ],
        milestones: {
          2: [
            {
              quarter: 1,
              title: "First production ML model",
              category: "Delivery",
              description: "Train and deploy a model serving real users.",
            },
            {
              quarter: 3,
              title: "Kaggle or hackathon top finish",
              category: "Credential",
              description: "Compete and place in a public competition.",
            },
          ],
          3: [
            {
              quarter: 2,
              title: "Own a modelling roadmap",
              category: "Strategy",
              description: "Define ML opportunities for a product area.",
            },
            {
              quarter: 4,
              title: "Mentor a junior analyst",
              category: "Mentoring",
              description: "Onboard a new analyst into your stack.",
            },
          ],
        },
      },
      {
        title: "Senior Data Scientist",
        seniority: 3,
        companyArchetype: "AI-first startup or enterprise AI team",
        requiredSkills: [
          { name: "Machine Learning", weight: 1.5 },
          { name: "PyTorch", weight: 1.2 },
          { name: "System Design", weight: 0.9 },
          { name: "Leadership", weight: 0.9 },
        ],
        milestones: {
          4: [
            {
              quarter: 1,
              title: "Lead a model rebuild",
              category: "Architecture",
              description: "Re-architect a production model for scale.",
            },
            {
              quarter: 3,
              title: "Conference talk on your work",
              category: "Visibility",
              description: "Present a case study at a data conference.",
            },
          ],
          5: [
            {
              quarter: 2,
              title: "Define ML ops practices",
              category: "Process",
              description: "Establish deployment and monitoring standards.",
            },
            {
              quarter: 4,
              title: "Staff/principal ML case",
              category: "Career",
              description: "Build the case for a staff-level ML role.",
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
    salaryGrowthCurve: (y) => 1 + 0.09 * y + 0.01 * y * y,
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
    salaryGrowthCurve: (y) => 1 + 0.11 * y + 0.014 * y * y,
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
    salaryGrowthCurve: (y) => 1 + 0.05 * y + 0.025 * y * y,
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

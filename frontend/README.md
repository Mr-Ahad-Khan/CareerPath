# CareerPath — The 5-Year Simulator

A full-stack web application where a student or job-seeker inputs their current skills, education, and interests, and the system simulates their next five years across multiple divergent career paths — showing realistic role progression, salary trajectory, required skill gaps, and time-to-achieve milestones.

Part career counselor, part financial projection tool, part game. Built as an MCA capstone project.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite, plain JavaScript), React Router, Recharts, Tailwind CSS |
| Backend | Node.js, Express.js, REST API, plain JavaScript |
| Database | Sequelize ORM — MySQL (`CareerPath` schema) |
| Auth | JWT in httpOnly cookies, role-based access (Student / Mentor / Admin) |
| Charts | Recharts (salary trajectory, skill-gap radar, admin analytics) |
| Simulation | Weighted-scoring rule engine (optional LLM layer) |

## Project structure

```
careerpath/
├── frontend/          # React + Vite frontend (root directory)
│   ├── src/
│   │   ├── components/    # Shared UI (Navbar, Logo, charts, Spinner, etc.)
│   │   ├── lib/           # API client, auth context, theme, toast, currency
│   │   └── pages/         # All page components
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/           # Express + Sequelize backend
│   ├── db/                # Sequelize instance
│   ├── models/            # Normalized models with foreign keys
│   ├── routes/            # REST API routes
│   ├── middleware/        # JWT auth + role guards
│   ├── engine/            # Simulation engine + resume parser
│   ├── scripts/           # Database seeder
│   └── server.js          # Express entry point
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm start
```

The API runs on `http://localhost:5050`. On first start it connects to the MySQL `CareerPath` database, syncs the schema, and seeds mentors, a demo student account, and an admin account.

### Frontend

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend.

### MySQL Workbench connection

Edit `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=CareerPath
DB_USER=root
DB_PASSWORD=your_mysql_password
```

Create the `CareerPath` schema in MySQL Workbench first, then save these values as `backend/.env`. The API no longer supports SQLite.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | ishaan.verma@demo.careerpath.app | demo1234 |
| Admin / Faculty | admin@careerpath.app | admin1234 |

You can also click "Load demo profile" on the login page or the intake wizard for a one-click demo during presentations.

## Features

1. **Skill Intake Wizard** — Multi-step onboarding with proficiency sliders, not just checkboxes.
2. **5-Year Simulation Engine** — Generates 2-3 divergent career branches with year-by-year timelines.
3. **Interactive Trajectory Chart** — Recharts area chart comparing salary across paths with hover tooltips.
4. **Skill Gap Radar** — Spider chart comparing current skills against target role requirements.
5. **Fork the Path Comparator** — Side-by-side diff of any two paths (salary, risk, satisfaction).
6. **Milestone Roadmap Board** — Kanban-style board with quarterly milestones, mark as in-progress/complete.
7. **Mentor Matching Directory** — Searchable mentor profiles with connection request flow.
8. **Resume Reality-Check** — Paste or upload a resume; system parses skills and cross-references against gaps.
9. **What-If Sliders** — Adjust learning time, city tier, network strength and watch projections re-render live.
10. **Admin Analytics Dashboard** — Aggregate trends: target roles, requested skills, average salary growth.
11. **Personal Dashboard** — Saved simulations, milestone completion, upskilling streak tracker.
12. **Export & Share** — Generate a printable summary card of any career path.

## How the simulation engine works

The engine uses weighted scoring across three dimensions:

1. **Skill match** — Each target role defines required skills with importance weights. Your self-rated proficiency is compared against these to produce a 0-1 match score.
2. **Market demand signals** — Every skill carries a demand coefficient. Industry multipliers (AI, fintech, etc.) layer on top of base salaries.
3. **Salary progression curves** — Each branch uses its own non-linear growth function. Specialists accelerate after year two; pivots start lower but compound faster once the domain switch lands.

The what-if sliders adjust context variables (location multiplier, upskilling intensity, time penalty, network strength) that feed directly into these functions, so projections recompute live.

An optional OpenAI-compatible LLM layer can replace the rule-based engine for narrative roadmaps. When no API key is configured, the weighted-scoring engine runs entirely offline with zero cost.

See the in-app "How it works" page for the full explanation.

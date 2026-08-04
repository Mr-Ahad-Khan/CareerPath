# CareerPath — The 5-Year Simulator

An AI-powered career simulation platform that turns a student's skills and interests into personalized 5-year career roadmaps. Compare divergent career paths side by side, visualize salary and skill-gap projections, adjust real-time "what-if" scenarios, track milestones, and connect with mentors — all in one interactive dashboard.

---

## Overview

Most career guidance tools give static advice. CareerPath simulates the future — taking a user's current skills, education, and constraints, and projecting multiple realistic 5-year trajectories with year-by-year role progression, salary bands, and skill gaps to close. It's built to feel like a real product, not a form-and-report tool.

## Key Features

- **Skill Intake Wizard** — multi-step onboarding with proficiency sliders, interests, and constraints
- **5-Year Simulation Engine** — generates 2–3 divergent career path branches with yearly milestones
- **Interactive Trajectory Charts** — salary and seniority growth compared across paths
- **Skill Gap Radar** — visual comparison of current vs. required skills
- **Fork the Path Comparator** — side-by-side diff between any two simulated paths
- **Milestone Roadmap Board** — quarterly plan broken into trackable milestones
- **Mentor Matching Directory** — searchable mentor profiles with connection requests
- **Resume Reality-Check** — cross-references resume content against skill gaps
- **What-If Scenario Sliders** — instantly re-renders projections as variables change
- **Admin Analytics Dashboard** — aggregated trends across all users
- **Personal Dashboard** — saved simulations and milestone progress tracking
- **Export & Share** — generate a shareable summary of any chosen career path

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), JavaScript, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (httpOnly cookies), role-based access |
| Charts | Recharts |

## Project Structure

```
careerpath/
├── frontend/     # React client application
├── backend/      # Express REST API and database models
└── README.md     # You are here
```

Each of `frontend/` and `backend/` contains its own README with setup and run instructions specific to that part of the stack.

## Getting Started

Clone the repository, then set up each side of the stack:

```bash
git clone https://github.com/Mr-Ahad-Khan/CareerPath.git
cd careerpath
```

**Backend**
```bash
cd backend
npm install
# configure your .env file (see backend/README.md)
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Refer to `backend/README.md` and `frontend/README.md` for environment variables, database setup, and detailed configuration.

## Roles

- **Student** — builds a profile, runs simulations, tracks milestones
- **Mentor** — appears in the directory, receives connection requests
- **Admin** — views aggregated analytics across all users

## License

This project was built as an academic capstone project.

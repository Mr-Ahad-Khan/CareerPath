import { User, SkillProfile, Mentor } from "../models/index.js";
import bcrypt from "bcryptjs";

const AVATAR_COLORS = [
  "#ffb340",
  "#3ddc97",
  "#5dade2",
  "#e74c8b",
  "#9b7ed4",
  "#f4845f",
  "#5ab1bb",
  "#d4a017",
];

const MENTORS = [
  {
    name: "Ananya Iyer",
    title: "Principal Engineer",
    company: "series-C fintech",
    industry: "Fintech",
    specialty: "Distributed Systems",
    experienceYears: 12,
    location: "Bengaluru",
    bio: "Built payment rails that move money for 40 million users. I mentor engineers who want to go deep on system design without losing sight of the business.",
    expertise: [
      "System Design",
      "Distributed Systems",
      "AWS",
      "Kubernetes",
      "Mentoring",
    ],
    languages: ["English", "Tamil", "Hindi"],
    rating: 4.9,
    menteeCount: 27,
    avatarColor: "#ffb340",
  },
  {
    name: "Rohan Mehta",
    title: "Director of Engineering",
    company: "growth-stage SaaS",
    industry: "SaaS",
    specialty: "Engineering Management",
    experienceYears: 15,
    location: "Pune",
    bio: "Went from IC to managing 45 engineers across five teams. I help technical people figure out whether the management track is actually right for them.",
    expertise: [
      "Leadership",
      "Hiring",
      "Stakeholder Management",
      "OKRs",
      "Strategy",
    ],
    languages: ["English", "Hindi", "Marathi"],
    rating: 4.8,
    menteeCount: 41,
    avatarColor: "#3ddc97",
  },
  {
    name: "Sara Cherian",
    title: "Staff Data Scientist",
    company: "AI-first healthtech",
    industry: "Healthtech",
    specialty: "Applied Machine Learning",
    experienceYears: 9,
    location: "Bengaluru",
    bio: "Productionised ML models for diagnostic imaging. I work with people pivoting into data science who need a realistic map of what the first two years look like.",
    expertise: ["Machine Learning", "Python", "PyTorch", "Statistics", "MLOps"],
    languages: ["English", "Malayalam"],
    rating: 4.9,
    menteeCount: 33,
    avatarColor: "#5dade2",
  },
  {
    name: "Dev Patel",
    title: "Senior Product Manager",
    company: "product-led marketplace",
    industry: "Product",
    specialty: "Product Strategy",
    experienceYears: 8,
    location: "Mumbai",
    bio: "Shipped products used by 12 million people. I mentor engineers curious about the PM track and PMs trying to move from feature factory to outcomes.",
    expertise: [
      "Product Strategy",
      "User Research",
      "A/B Testing",
      "Stakeholder Management",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.7,
    menteeCount: 22,
    avatarColor: "#e74c8b",
  },
  {
    name: "Meera Krishnan",
    title: "Engineering Manager",
    company: "Series B logistics startup",
    industry: "Logistics",
    specialty: "Career Transitions",
    experienceYears: 11,
    location: "Hyderabad",
    bio: "Pivoted from QA to SRE to engineering management. I specialise in helping people navigate adjacent-field moves without starting from zero.",
    expertise: ["Career Pivots", "SRE", "Leadership", "Communication"],
    languages: ["English", "Telugu", "Tamil"],
    rating: 4.8,
    menteeCount: 35,
    avatarColor: "#9b7ed4",
  },
  {
    name: "Arjun Nair",
    title: "Staff Frontend Engineer",
    company: "design-led consumer app",
    industry: "Consumer Tech",
    specialty: "Frontend Architecture",
    experienceYears: 10,
    location: "Bengaluru",
    bio: "Care about performance and accessibility the way most people care about features. I mentor frontend engineers who want to reach staff level through craft.",
    expertise: [
      "React",
      "TypeScript",
      "Performance",
      "Accessibility",
      "System Design",
    ],
    languages: ["English", "Malayalam", "Hindi"],
    rating: 4.7,
    menteeCount: 19,
    avatarColor: "#f4845f",
  },
  {
    name: "Priya Saxena",
    title: "Head of Data",
    company: "mid-size e-commerce",
    industry: "E-commerce",
    specialty: "Data Leadership",
    experienceYears: 13,
    location: "Gurugram",
    bio: "Built the analytics function from one analyst to a team of eighteen. I help data professionals decide between going deeper technically versus leading a team.",
    expertise: ["Data Strategy", "Leadership", "SQL", "Statistics", "Hiring"],
    languages: ["English", "Hindi"],
    rating: 4.9,
    menteeCount: 28,
    avatarColor: "#5ab1bb",
  },
  {
    name: "Kabir Anand",
    title: "Senior SRE",
    company: "global cloud provider",
    industry: "Cloud Infrastructure",
    specialty: "Reliability Engineering",
    experienceYears: 7,
    location: "Remote",
    bio: "On-call for systems that cannot go down. I mentor engineers moving into SRE who want to understand reliability as a product, not a checkbox.",
    expertise: [
      "SRE",
      "Kubernetes",
      "Observability",
      "Go",
      "Incident Response",
    ],
    languages: ["English", "Hindi", "Punjabi"],
    rating: 4.6,
    menteeCount: 15,
    avatarColor: "#d4a017",
  },
];

const DEMO_PROFILE = {
  name: "Ishaan Verma",
  email: "ishaan.verma@demo.careerpath.app",
  password: "demo1234",
  role: "student",
  headline: "MCA final-year student exploring software and data paths",
  avatarColor: "#ffb340",
  profile: {
    educationLevel: "Postgraduate",
    educationField: "Computer Applications",
    graduationYear: 2026,
    currentRole: "Intern — Backend Developer",
    experienceYears: 0.5,
    location: "Pune",
    targetRole: "Senior Engineer or Data Scientist",
    currency: "INR",
    skills: [
      { name: "JavaScript", proficiency: 3 },
      { name: "React", proficiency: 2 },
      { name: "Node.js", proficiency: 3 },
      { name: "Python", proficiency: 3 },
      { name: "SQL", proficiency: 4 },
      { name: "Communication", proficiency: 3 },
    ],
    interests: ["coding", "data", "problem solving", "systems"],
    constraints: {
      upskillingBudget: 15000,
      timeAvailability: "15 hours/week",
      locationFlexibility: "open to relocate",
    },
  },
};

const ADMIN = {
  name: "Faculty Reviewer",
  email: "admin@careerpath.app",
  password: "admin1234",
  role: "admin",
  headline: "Project evaluation account",
  avatarColor: "#3ddc97",
};

export async function seedIfEmpty() {
  const mentorCount = await Mentor.countDocuments();
  if (mentorCount > 0) {
    console.log("[seed] mentors already present, skipping");
    return;
  }

  console.log("[seed] seeding database...");
  {
    await Mentor.insertMany(MENTORS);

    const demoUser = await User.create({
      name: DEMO_PROFILE.name,
      email: DEMO_PROFILE.email,
      passwordHash: await bcrypt.hash(DEMO_PROFILE.password, 10),
      role: DEMO_PROFILE.role,
      headline: DEMO_PROFILE.headline,
      avatarColor: DEMO_PROFILE.avatarColor,
    });
    await SkillProfile.create({ ...DEMO_PROFILE.profile, userId: demoUser.id });

    await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      passwordHash: await bcrypt.hash(ADMIN.password, 10),
      role: ADMIN.role,
      headline: ADMIN.headline,
      avatarColor: ADMIN.avatarColor,
    });
  }

  console.log("[seed] done — mentors, demo student, and admin created");
}

export { DEMO_PROFILE };

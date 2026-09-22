import {
  DEFAULT_MENTORS,
  DEFAULT_INDUSTRIES,
  DEFAULT_SPECIALTIES,
  DEMO_ACCOUNTS,
  DEMO_STUDENT_PROFILE,
} from './offlineData.js';
import { generateSimulation, buildMilestones } from './simulation.js';
import { parseResume, realityCheck } from './resume.js';

const STORAGE_KEYS = {
  SIMULATIONS: 'cp-offline-simulations',
  MILESTONES: 'cp-offline-milestones',
  JOURNAL: 'cp-offline-journal',
  PROFILES: 'cp-offline-profiles',
  CONNECTIONS: 'cp-offline-connections',
  INITIALIZED: 'cp-offline-initialized-v3',
};

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }
}

// Generate unique client IDs
export function generateId(prefix = 'local') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Initialize starter data if empty
export function initOfflineStore() {
  if (typeof window === 'undefined') return;

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  const existingSims = read(STORAGE_KEYS.SIMULATIONS, []);

  if (!initialized || existingSims.length === 0) {
    // 1. Create Demo Student Profile
    const profile = { ...DEMO_STUDENT_PROFILE };
    const profiles = [profile];
    write(STORAGE_KEYS.PROFILES, profiles);

    // 2. Generate starter simulation
    const result = generateSimulation(profile);
    const simId = 'sim-starter-demo';
    const paths = result.paths.map((p, idx) => ({
      _id: `path-starter-${idx}`,
      id: `path-starter-${idx}`,
      simulationId: simId,
      code: p.code,
      title: p.title,
      description: p.description,
      riskLevel: p.riskLevel,
      satisfactionScore: p.satisfactionScore,
      confidenceScore: p.confidenceScore,
      startSalary: p.startSalary,
      finalSalary: p.finalSalary,
      trajectory: p.trajectory,
      skillGaps: p.skillGaps,
    }));

    const starterSim = {
      _id: simId,
      id: simId,
      name: 'Computer Applications — 5-year plan',
      profileId: profile.id,
      whatIf: {
        cityTier: 'tier1',
        upskillingHoursPerWeek: 10,
        extraLearningMonths: 0,
        networkStrength: 'moderate',
        extraExperienceMonths: 0,
      },
      summary: result.summary,
      isStarred: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      paths,
    };

    write(STORAGE_KEYS.SIMULATIONS, [starterSim]);

    // 3. Generate starter milestones from primary path
    const starterMilestones = buildMilestones(paths[0], profile.userId, paths[0].id);
    if (starterMilestones[0]) starterMilestones[0].status = 'complete';
    if (starterMilestones[1]) starterMilestones[1].status = 'in_progress';
    write(STORAGE_KEYS.MILESTONES, starterMilestones);

    // 4. Starter journal entries
    const starterJournal = [
      {
        _id: 'jr-starter-1',
        id: 'jr-starter-1',
        userId: profile.userId,
        activity: 'Code review and system profiling',
        skill: 'Architecture',
        durationMinutes: 90,
        note: 'Completed module on state machine architecture and caching patterns.',
        date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        _id: 'jr-starter-2',
        id: 'jr-starter-2',
        userId: profile.userId,
        activity: 'Database query tuning',
        skill: 'SQL',
        durationMinutes: 120,
        note: 'Analyzed query execution plans and indexed high-frequency join columns.',
        date: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10),
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        _id: 'jr-starter-3',
        id: 'jr-starter-3',
        userId: profile.userId,
        activity: 'Self-directed upskilling',
        skill: 'React',
        durationMinutes: 60,
        note: 'Explored React 18 concurrent features and offline-first state.',
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      },
    ];
    write(STORAGE_KEYS.JOURNAL, starterJournal);

    // 5. Starter accepted mentor connection with message history
    const starterConnections = [
      {
        _id: 'conn-starter-1',
        id: 'conn-starter-1',
        mentorId: 'm1',
        mentor: {
          id: 'm1',
          name: 'Ananya Sharma',
          title: 'Staff Software Engineer',
          company: 'Razorpay',
          avatarColor: '#5dade2',
        },
        studentId: profile.userId,
        student: {
          id: profile.userId,
          name: profile.fullName || 'Demo Student',
          headline: 'MCA Student · Software & AI Aspirant',
          avatarColor: '#ffb340',
        },
        message: 'Hi Ananya, I am exploring the software engineering path and would value your perspective on backend system design.',
        status: 'accepted',
        statusText: 'Connected mentor',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        messages: [
          {
            id: 'msg-starter-1',
            senderId: profile.userId,
            senderRole: 'student',
            senderName: 'You',
            content: 'Hi Ananya, I am exploring the software engineering path and would value your perspective on backend system design.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'msg-starter-2',
            senderId: 'm1',
            senderRole: 'mentor',
            senderName: 'Ananya Sharma',
            content: 'Hey! Glad to connect. Transitioning from foundational coding to production systems is all about understanding trade-offs in data consistency and caching. Have you looked at your Year 2 trajectory milestones yet?',
            createdAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
          },
        ],
      },
    ];
    write(STORAGE_KEYS.CONNECTIONS, starterConnections);

    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export const offlineStore = {
  // Profiles
  getProfiles() {
    initOfflineStore();
    return read(STORAGE_KEYS.PROFILES, []);
  },

  getProfile(profileId) {
    initOfflineStore();
    const profiles = read(STORAGE_KEYS.PROFILES, []);
    const found = profiles.find((p) => (p.id === profileId || p._id === profileId));
    if (found) return found;
    return { ...DEMO_STUDENT_PROFILE, id: profileId, _id: profileId };
  },

  createProfile(profileData) {
    initOfflineStore();
    const profiles = read(STORAGE_KEYS.PROFILES, []);
    const newProfile = {
      _id: generateId('prof'),
      id: generateId('prof'),
      createdAt: new Date().toISOString(),
      ...profileData,
    };
    profiles.push(newProfile);
    write(STORAGE_KEYS.PROFILES, profiles);
    return newProfile;
  },

  // Simulations
  getSimulations() {
    initOfflineStore();
    const list = read(STORAGE_KEYS.SIMULATIONS, []);
    return list.map((sim) => ({
      _id: sim._id || sim.id,
      id: sim.id || sim._id,
      name: sim.name,
      isStarred: Boolean(sim.isStarred),
      createdAt: sim.createdAt || new Date().toISOString(),
      whatIf: sim.whatIf,
      summary: sim.summary,
      pathCount: sim.paths?.length || 0,
      topSalary: Math.max(...(sim.paths?.map((p) => p.finalSalary) || [0]), 0),
      pathTitles: (sim.paths || []).map((p) => p.title),
    }));
  },

  getSimulationById(id) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.SIMULATIONS, []);
    const found = list.find((s) => s.id === id || s._id === id);
    if (!found) {
      return list[0] || null;
    }
    return found;
  },

  createSimulation({ profileId, name, whatIf }) {
    initOfflineStore();
    const profile = this.getProfile(profileId);
    const result = generateSimulation(profile, whatIf);
    const simId = generateId('sim');

    const paths = result.paths.map((p, idx) => ({
      _id: `${simId}-path-${idx}`,
      id: `${simId}-path-${idx}`,
      simulationId: simId,
      code: p.code,
      title: p.title,
      description: p.description,
      riskLevel: p.riskLevel,
      satisfactionScore: p.satisfactionScore,
      confidenceScore: p.confidenceScore,
      startSalary: p.startSalary,
      finalSalary: p.finalSalary,
      trajectory: p.trajectory,
      skillGaps: p.skillGaps,
    }));

    const newSim = {
      _id: simId,
      id: simId,
      name: name || `${profile.educationField || 'Career'} — 5-year plan`,
      profileId: profile._id || profile.id,
      whatIf: whatIf || {
        cityTier: 'tier1',
        upskillingHoursPerWeek: 10,
        extraLearningMonths: 0,
        networkStrength: 'moderate',
        extraExperienceMonths: 0,
      },
      summary: result.summary,
      isStarred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paths,
    };

    const list = read(STORAGE_KEYS.SIMULATIONS, []);
    list.unshift(newSim);
    write(STORAGE_KEYS.SIMULATIONS, list);

    // Auto-generate milestones for this new simulation's top path
    if (paths[0]) {
      const generated = buildMilestones(paths[0], profile.userId || 'offline-user', paths[0].id);
      const existingMs = read(STORAGE_KEYS.MILESTONES, []);
      write(STORAGE_KEYS.MILESTONES, [...generated, ...existingMs]);
    }

    return newSim;
  },

  previewSimulation({ profile, whatIf }) {
    return generateSimulation(profile || DEMO_STUDENT_PROFILE, whatIf);
  },

  toggleStar(id) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.SIMULATIONS, []);
    let updatedStar = false;
    const updated = list.map((sim) => {
      if (sim.id === id || sim._id === id) {
        updatedStar = !sim.isStarred;
        return { ...sim, isStarred: updatedStar };
      }
      return sim;
    });
    write(STORAGE_KEYS.SIMULATIONS, updated);
    return { isStarred: updatedStar };
  },

  // Milestones
  getMilestones() {
    initOfflineStore();
    const list = read(STORAGE_KEYS.MILESTONES, []);
    return list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },

  addMilestone(payload) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.MILESTONES, []);
    const newMs = {
      _id: generateId('ms'),
      id: generateId('ms'),
      userId: 'offline-user',
      quarter: payload.quarter || 'Q1',
      year: payload.year !== undefined ? Number(payload.year) : 0,
      category: payload.category || 'Learning',
      title: payload.title,
      description: payload.description || payload.title,
      status: payload.status || 'todo',
      orderIndex: list.length,
      custom: true,
      createdAt: new Date().toISOString(),
    };
    list.push(newMs);
    write(STORAGE_KEYS.MILESTONES, list);
    return newMs;
  },

  updateMilestone(id, updates) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.MILESTONES, []);
    let target = null;
    const updated = list.map((ms) => {
      if (ms.id === id || ms._id === id) {
        target = { ...ms, ...updates, updatedAt: new Date().toISOString() };
        return target;
      }
      return ms;
    });
    write(STORAGE_KEYS.MILESTONES, updated);
    return target;
  },

  // Journal
  getJournal() {
    initOfflineStore();
    return read(STORAGE_KEYS.JOURNAL, []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  getJournalStats() {
    initOfflineStore();
    const entries = read(STORAGE_KEYS.JOURNAL, []);
    const dates = [...new Set(entries.map((e) => e.date || e.createdAt.slice(0, 10)))];
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let cursor = today;
    const dateSet = new Set(dates);

    while (dateSet.has(cursor)) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    }

    // If streak is 0, check if yesterday was logged to preserve streak until today's end
    if (streak === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      cursor = yesterday.toISOString().slice(0, 10);
      while (dateSet.has(cursor)) {
        streak++;
        const d = new Date(cursor);
        d.setDate(d.getDate() - 1);
        cursor = d.toISOString().slice(0, 10);
      }
    }

    const last7 = [...new Set(
      entries
        .filter((e) => {
          const entryDate = new Date(e.date || e.createdAt);
          const diff = (new Date(today) - entryDate) / 86400000;
          return diff >= 0 && diff <= 7;
        })
        .map((e) => e.date || e.createdAt.slice(0, 10))
    )].length;

    const totalMinutes = entries.reduce((s, e) => s + (Number(e.durationMinutes) || Number(e.minutesSpent) || 30), 0);

    return {
      streak: Math.max(streak, 1),
      activeDaysLast7: Math.max(last7, 1),
      totalSessions: entries.length,
      totalMinutes,
    };
  },

  addJournalEntry(entry) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.JOURNAL, []);
    const newEntry = {
      _id: generateId('jr'),
      id: generateId('jr'),
      userId: 'offline-user',
      activity: entry.activity || 'Upskilling session',
      skill: entry.skill || 'Self-directed',
      durationMinutes: Number(entry.durationMinutes) || 45,
      note: entry.note || '',
      date: entry.date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    write(STORAGE_KEYS.JOURNAL, list);
    return newEntry;
  },

  // Mentors
  getMentors({ industry, specialty, q } = {}) {
    let result = [...DEFAULT_MENTORS];
    if (industry && industry !== 'all') {
      result = result.filter((m) => m.industry.toLowerCase() === industry.toLowerCase());
    }
    if (specialty && specialty !== 'all') {
      result = result.filter((m) => m.specialty.toLowerCase() === specialty.toLowerCase());
    }
    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.specialty.toLowerCase().includes(query) ||
          m.company.toLowerCase().includes(query) ||
          m.bio.toLowerCase().includes(query)
      );
    }
    return result;
  },

  getMentorIndustries() {
    return {
      industries: DEFAULT_INDUSTRIES,
      specialties: DEFAULT_SPECIALTIES,
    };
  },

  getMentorById(id) {
    return DEFAULT_MENTORS.find((m) => m.id === id || m._id === id) || DEFAULT_MENTORS[0];
  },

  // Connections
  getConnections() {
    initOfflineStore();
    return read(STORAGE_KEYS.CONNECTIONS, []);
  },

  addConnection({ mentorId, message }) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.CONNECTIONS, []);
    const mentor = this.getMentorById(mentorId);
    const initialMsg = {
      id: generateId('msg'),
      senderId: 'offline-user',
      senderRole: 'student',
      senderName: 'You',
      content: message,
      createdAt: new Date().toISOString(),
    };
    const newConn = {
      _id: generateId('conn'),
      id: generateId('conn'),
      mentorId,
      mentor: {
        id: mentor.id,
        name: mentor.name,
        title: mentor.title,
        company: mentor.company,
        avatarColor: mentor.avatarColor,
      },
      studentId: 'offline-user',
      student: {
        id: 'offline-user',
        name: 'Demo Student',
        headline: 'Exploring Software & AI tracks',
        avatarColor: '#ffb340',
      },
      message,
      status: 'accepted',
      statusText: 'Connected mentor',
      createdAt: new Date().toISOString(),
      messages: [initialMsg],
    };
    list.unshift(newConn);
    write(STORAGE_KEYS.CONNECTIONS, list);
    return newConn;
  },

  getConnectionMessages(connId) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.CONNECTIONS, []);
    const conn = list.find((c) => c.id === connId || c._id === connId);
    return conn?.messages || [];
  },

  sendConnectionMessage(connId, { content, senderRole = 'student', senderName = 'You' }) {
    initOfflineStore();
    const list = read(STORAGE_KEYS.CONNECTIONS, []);
    let target = null;
    const newMsg = {
      id: generateId('msg'),
      senderId: senderRole === 'mentor' ? 'mentor-id' : 'offline-user',
      senderRole,
      senderName,
      content,
      createdAt: new Date().toISOString(),
    };

    const updated = list.map((conn) => {
      if (conn.id === connId || conn._id === connId) {
        const msgs = conn.messages || [];
        target = {
          ...conn,
          messages: [...msgs, newMsg],
          updatedAt: new Date().toISOString(),
        };
        return target;
      }
      return conn;
    });

    write(STORAGE_KEYS.CONNECTIONS, updated);
    return { message: newMsg, connection: target };
  },

  // Resume Reality Check
  analyzeResume({ text, simulationId }) {
    const parsed = parseResume(text || '');
    let simulationSkillGaps = [];

    if (simulationId) {
      const sim = this.getSimulationById(simulationId);
      if (sim?.paths?.[0]?.skillGaps) {
        simulationSkillGaps = sim.paths[0].skillGaps;
      }
    }

    if (simulationSkillGaps.length === 0) {
      simulationSkillGaps = [
        { skill: 'System Design', demand: 0.85, category: 'Architecture' },
        { skill: 'Docker', demand: 0.78, category: 'Cloud' },
        { skill: 'Kubernetes', demand: 0.74, category: 'Cloud' },
        { skill: 'TypeScript', demand: 0.89, category: 'Technical' },
      ];
    }

    const check = realityCheck(parsed.skills, simulationSkillGaps);

    return {
      parsed,
      realityCheck: check,
    };
  },

  cacheServerData(type, data) {
    if (!data) return;
    try {
      if (type === 'simulations' && Array.isArray(data.simulations)) {
        const existing = read(STORAGE_KEYS.SIMULATIONS, []);
        const merged = data.simulations.map((s) => {
          const matched = existing.find((e) => (e.id === s.id || e._id === s._id));
          return matched ? { ...matched, ...s } : s;
        });
        write(STORAGE_KEYS.SIMULATIONS, merged);
      } else if (type === 'simulation_detail' && data.simulation) {
        const existing = read(STORAGE_KEYS.SIMULATIONS, []);
        const idx = existing.findIndex((e) => e.id === data.simulation.id || e._id === data.simulation._id);
        if (idx >= 0) {
          existing[idx] = data.simulation;
        } else {
          existing.unshift(data.simulation);
        }
        write(STORAGE_KEYS.SIMULATIONS, existing);
      } else if (type === 'milestones' && Array.isArray(data.milestones)) {
        write(STORAGE_KEYS.MILESTONES, data.milestones);
      }
    } catch (e) {
      console.warn('Failed to cache server data:', e);
    }
  },
};

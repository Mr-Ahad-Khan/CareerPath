// In development Vite proxies /api to localhost. On Vercel, set VITE_API_URL
// to the Render service origin, for example https://careerpath-api.onrender.com.
import { offlineStore } from './offline/offlineStore.js';
import { DEMO_ACCOUNTS } from './offline/offlineData.js';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const isMobileApp =
  typeof window !== 'undefined' &&
  (Boolean(window.Capacitor) ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && window.location.port === ''));
const isVercel =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('vercel.app');
const defaultRemoteApiUrl = 'https://careerpath-mew4.onrender.com';

const API_BASE = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/, '')}/api`
  : (isMobileApp || isVercel)
    ? `${defaultRemoteApiUrl}/api`
    : '/api';

export function getToken() {
  return localStorage.getItem('cp-token');
}

export function setToken(token) {
  if (token) localStorage.setItem('cp-token', token);
  else localStorage.removeItem('cp-token');
}

export function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// Transparent offline handler that serves and persists requests locally
function handleOfflineRequest(method, path, data = {}) {
  const cleanPath = path.split('?')[0].replace(/\/+$/, '');
  const searchParams = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');

  // 1. Auth routes
  if (cleanPath === '/auth/me') {
    const raw = localStorage.getItem('cp-user');
    const user = raw ? JSON.parse(raw) : DEMO_ACCOUNTS.student;
    return { user };
  }

  if (cleanPath === '/auth/login') {
    const email = data?.email?.toLowerCase() || '';
    let matchedUser = DEMO_ACCOUNTS.student;
    if (email.includes('mentor') || email.includes('ananya')) {
      matchedUser = DEMO_ACCOUNTS.mentor;
    } else if (email.includes('admin') || email.includes('faculty')) {
      matchedUser = DEMO_ACCOUNTS.admin;
    } else if (email) {
      matchedUser = {
        id: 'local-user-' + Date.now(),
        _id: 'local-user-' + Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: 'student',
        headline: 'CareerPath Offline Member',
        avatarColor: '#ffb340',
      };
    }
    return { token: 'cp-offline-token-' + Date.now(), user: matchedUser };
  }

  if (cleanPath === '/auth/register') {
    const user = {
      id: 'local-reg-' + Date.now(),
      _id: 'local-reg-' + Date.now(),
      name: data.name || 'Student',
      email: data.email || 'offline@careerpath.local',
      role: 'student',
      headline: data.headline || 'Exploring career possibilities',
      avatarColor: '#3ddc97',
    };
    return { token: 'cp-offline-token-' + Date.now(), user };
  }

  if (cleanPath === '/auth/logout') {
    return { ok: true };
  }

  // 2. Profiles
  if (cleanPath === '/profiles' && method === 'POST') {
    const profile = offlineStore.createProfile(data);
    return { profile };
  }

  const profileMatch = cleanPath.match(/^\/profiles\/([a-zA-Z0-9_-]+)$/);
  if (profileMatch && method === 'GET') {
    const profile = offlineStore.getProfile(profileMatch[1]);
    return { profile };
  }

  // 3. Simulations
  if (cleanPath === '/simulations/preview' && method === 'POST') {
    return offlineStore.previewSimulation(data);
  }

  if (cleanPath === '/simulations') {
    if (method === 'GET') {
      return { simulations: offlineStore.getSimulations() };
    }
    if (method === 'POST') {
      const simulation = offlineStore.createSimulation(data);
      return { simulation };
    }
  }

  const simStarMatch = cleanPath.match(/^\/simulations\/([a-zA-Z0-9_-]+)\/star$/);
  if (simStarMatch && (method === 'PATCH' || method === 'POST')) {
    return offlineStore.toggleStar(simStarMatch[1]);
  }

  const simDetailMatch = cleanPath.match(/^\/simulations\/([a-zA-Z0-9_-]+)$/);
  if (simDetailMatch && method === 'GET') {
    const simulation = offlineStore.getSimulationById(simDetailMatch[1]);
    return { simulation };
  }

  // 4. Milestones
  if (cleanPath === '/milestones') {
    if (method === 'GET') {
      return { milestones: offlineStore.getMilestones() };
    }
    if (method === 'POST') {
      const milestone = offlineStore.addMilestone(data);
      return { milestone };
    }
  }

  const msMatch = cleanPath.match(/^\/milestones\/([a-zA-Z0-9_-]+)$/);
  if (msMatch && method === 'PATCH') {
    const milestone = offlineStore.updateMilestone(msMatch[1], data);
    return { milestone };
  }

  // 5. Journal
  if (cleanPath === '/journal/stats' && method === 'GET') {
    return offlineStore.getJournalStats();
  }

  if (cleanPath === '/journal' && method === 'POST') {
    const entry = offlineStore.addJournalEntry(data);
    return { entry };
  }

  // 6. Mentors & Connections
  if (cleanPath === '/mentors/industries' && method === 'GET') {
    return offlineStore.getMentorIndustries();
  }

  if (cleanPath === '/mentors') {
    const industry = searchParams.get('industry');
    const specialty = searchParams.get('specialty');
    const q = searchParams.get('q');
    return { mentors: offlineStore.getMentors({ industry, specialty, q }) };
  }

  const mentorDetailMatch = cleanPath.match(/^\/mentors\/([a-zA-Z0-9_-]+)$/);
  if (mentorDetailMatch && method === 'GET') {
    return { mentor: offlineStore.getMentorById(mentorDetailMatch[1]) };
  }

  if (cleanPath === '/connections') {
    if (method === 'GET') {
      return { requests: offlineStore.getConnections() };
    }
    if (method === 'POST') {
      const request = offlineStore.addConnection(data);
      return { request };
    }
  }

  const connActionMatch = cleanPath.match(/^\/connections\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/);
  if (connActionMatch && method === 'PATCH') {
    return { ok: true, status: connActionMatch[2] };
  }

  // 7. Resume Analysis
  if (cleanPath === '/resume/analyze' && method === 'POST') {
    return offlineStore.analyzeResume(data);
  }

  // 8. Admin & Analytics fallbacks
  if (cleanPath === '/admin/overview' || cleanPath === '/analytics/overview') {
    return {
      userCount: 142,
      profileCount: 88,
      simCount: 384,
      mentorCount: 8,
      pendingCount: 5,
      overview: {
        totalUsers: 142,
        totalSimulations: 384,
        totalMilestonesCompleted: 119,
        activeMentorships: 48,
      },
    };
  }
  if (cleanPath === '/admin/trends' || cleanPath === '/analytics/trends') {
    return {
      topRoles: [
        { role: 'Staff Engineer', count: 48 },
        { role: 'Senior Data Scientist', count: 36 },
        { role: 'Director of Engineering', count: 28 },
        { role: 'Cloud Architect', count: 24 },
        { role: 'Product Manager (Tech)', count: 20 },
        { role: 'Full Stack Tech Lead', count: 18 },
      ],
      topSkills: [
        { skill: 'System Design', count: 72 },
        { skill: 'Leadership', count: 64 },
        { skill: 'Kubernetes', count: 52 },
        { skill: 'Machine Learning', count: 45 },
        { skill: 'Python', count: 42 },
        { skill: 'Cloud Architecture', count: 38 },
        { skill: 'Statistics', count: 34 },
        { skill: 'Stakeholder Management', count: 30 },
      ],
      topInterests: [
        { interest: 'coding', count: 94 },
        { interest: 'systems', count: 88 },
        { interest: 'data', count: 82 },
        { interest: 'problem solving', count: 78 },
        { interest: 'leadership', count: 46 },
        { interest: 'design', count: 35 },
      ],
      avgSalaryGrowth: 185,
      totalSimulations: 384,
      trends: [
        { branch: 'deep-specialist', count: 182 },
        { branch: 'product-track', count: 96 },
        { branch: 'management-track', count: 74 },
        { branch: 'pivot-adjacent', count: 32 },
      ],
    };
  }
  if (cleanPath === '/admin/users' || cleanPath === '/analytics/users') {
    return {
      users: [
        DEMO_ACCOUNTS.student,
        DEMO_ACCOUNTS.mentor,
        DEMO_ACCOUNTS.admin,
        {
          id: 'usr-demo-4',
          name: 'Priya Sharma',
          email: 'priya.sharma@demo.careerpath.app',
          role: 'student',
          headline: 'Aspiring Cloud & DevOps Engineer',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: 'usr-demo-5',
          name: 'Arjun Patel',
          email: 'arjun.patel@demo.careerpath.app',
          role: 'student',
          headline: 'Final-year MCA Data Analytics Major',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ],
    };
  }

  // Default fallback object
  return { ok: true };
}

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const data = options.body ? JSON.parse(options.body) : {};

  // If the browser/device explicitly knows it's offline, avoid waiting for fetch timeout
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return handleOfflineRequest(method, path, data);
  }

  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    // Add a reasonable timeout (6 seconds) so slow/dead network doesn't leave users hanging indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (err) {
    // Network failure / timeout / server unreachable -> Fallback smoothly to offline engine!
    console.info(`[Offline Fallback] Network request failed for ${method} ${path}. Serving locally.`);
    try {
      return handleOfflineRequest(method, path, data);
    } catch (offlineErr) {
      throw new ApiError('Network error — could not reach the server.', 0);
    }
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  if (!isJson) {
    // If an HTML SPA fallback was returned (e.g. Vercel SPA rewrite), serve offline fallback
    console.warn(`[API] Expected JSON but received ${res.headers.get('content-type') || 'HTML'} for ${method} ${path}. Serving offline fallback.`);
    return handleOfflineRequest(method, path, data);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    // If server responded with 500-504 (server down, gateway error, DB failure), fall back to offline
    if (res.status >= 500) {
      console.warn(`[API] Server error (${res.status}) for ${method} ${path}. Serving offline fallback.`);
      return handleOfflineRequest(method, path, data);
    }
    const message =
      body?.error || body?.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  // When online request succeeds, silently cache data into local store for offline use
  if (method === 'GET' && body) {
    if (path === '/simulations') {
      offlineStore.cacheServerData('simulations', body);
    } else if (path.startsWith('/simulations/')) {
      offlineStore.cacheServerData('simulation_detail', body);
    } else if (path === '/milestones') {
      offlineStore.cacheServerData('milestones', body);
    }
  }

  return body;
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

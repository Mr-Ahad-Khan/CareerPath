import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, getToken, setToken } from './api.js';
import { DEMO_ACCOUNTS } from './offline/offlineData.js';

const AuthContext = createContext(null);

export function getCachedUser() {
  try {
    const raw = localStorage.getItem('cp-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user) {
  if (user) localStorage.setItem('cp-user', JSON.stringify(user));
  else localStorage.removeItem('cp-user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getCachedUser() : null));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    // Authentication is token-backed. Avoid calling the protected endpoint
    // for visitors who have not signed in, which would otherwise produce an
    // expected-but-noisy 401 on every initial page load.
    const token = getToken();
    if (!token) {
      setUser(null);
      setCachedUser(null);
      setLoading(false);
      return;
    }

    // If it's an offline token, resolve immediately with cached user or demo student
    if (token.startsWith('cp-offline')) {
      const cached = getCachedUser() || DEMO_ACCOUNTS.student;
      setUser(cached);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
      setCachedUser(data.user);
    } catch (error) {
      // A JWT can expire or become invalid after a backend secret change.
      // Remove it only if explicitly unauthorized 401.
      if (error.status === 401) {
        setToken(null);
        setCachedUser(null);
        setUser(null);
      } else {
        // If network error / offline (status 0), preserve cached user session
        const cached = getCachedUser();
        if (cached) setUser(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setCachedUser(data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      // Fallback to offline demo accounts if network completely fails
      if (err.status === 0 || !navigator.onLine) {
        let fallbackUser = DEMO_ACCOUNTS.student;
        if (email.includes('mentor') || email.includes('ananya')) fallbackUser = DEMO_ACCOUNTS.mentor;
        else if (email.includes('admin') || email.includes('faculty')) fallbackUser = DEMO_ACCOUNTS.admin;
        setToken('cp-offline-token-' + Date.now());
        setCachedUser(fallbackUser);
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await api.post('/auth/register', payload);
    setToken(data.token);
    setCachedUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser = {
      ...DEMO_ACCOUNTS.guest,
      isOffline: true,
    };
    const token = 'cp-offline-guest-' + Date.now();
    setToken(token);
    setCachedUser(guestUser);
    setUser(guestUser);
    return guestUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      /* ignore */
    }
    setToken(null);
    setCachedUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        continueAsGuest,
        logout,
        refresh: fetchMe,
        isOfflineSession: Boolean(user?.isOffline || getToken()?.startsWith('cp-offline')),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

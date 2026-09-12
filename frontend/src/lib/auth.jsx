import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, getToken, setToken } from './api.js';

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
    if (!getToken()) {
      setUser(null);
      setCachedUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
      setCachedUser(data.user);
    } catch (error) {
      // A JWT can expire or become invalid after a backend secret change.
      // Remove it so subsequent loads remain cleanly signed out.
      if (error.status === 401) {
        setToken(null);
        setCachedUser(null);
        setUser(null);
      }
      // If network error / offline (status 0), preserve cached user session
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setCachedUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await api.post('/auth/register', payload);
    setToken(data.token);
    setCachedUser(data.user);
    setUser(data.user);
    return data.user;
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
      value={{ user, loading, login, signup, logout, refresh: fetchMe }}
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

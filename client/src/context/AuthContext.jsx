import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eh_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { token: tk, user: u } = res.data;
    localStorage.setItem('eh_token', tk);
    api.defaults.headers.common['Authorization'] = `Bearer ${tk}`;
    setToken(tk);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/register', { name, email, password });
    const { token: tk, user: u } = res.data;
    localStorage.setItem('eh_token', tk);
    api.defaults.headers.common['Authorization'] = `Bearer ${tk}`;
    setToken(tk);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('eh_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

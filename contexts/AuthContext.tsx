import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthContextType } from '../types';
import { fetchUserProfile, loginUser, registerUser } from '../services/api';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem('pharmaGardeToken');
    if (!token) {
        setLoading(false);
        return;
    }
    
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user, token might be invalid", error);
      localStorage.removeItem('pharmaGardeToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = async (email: string, password: string): Promise<void> => {
    const { token, user: userData } = await loginUser(email, password);
    localStorage.setItem('pharmaGardeToken', token);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const { token, user: userData } = await registerUser(name, email, password);
    localStorage.setItem('pharmaGardeToken', token);
    setUser(userData);
  }

  const logout = () => {
    localStorage.removeItem('pharmaGardeToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
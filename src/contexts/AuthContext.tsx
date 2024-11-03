// FILE: src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  user: { name: string, role: string } | null;
  login: (name: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const navigate = useNavigate();

  const login = async (name: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { name, password });
      const { token, user } = response.data;
      setUser(user);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Nom d\'utilisateur ou mot de passe incorrect', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
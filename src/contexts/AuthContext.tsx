import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  role: 'user' | 'admin';
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const defaultAdmin: User = { name: 'admin', role: 'admin', password: 'toto' };
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (name: string, password: string) => {
    if (name === defaultAdmin.name && password === defaultAdmin.password) {
      setUser({ name: defaultAdmin.name, role: defaultAdmin.role });
    } else {
      console.error('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const logout = () => {
    setUser(null);
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
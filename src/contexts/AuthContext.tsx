import React, { createContext, useState, useContext } from 'react';

// Définir le type pour le contexte d'authentification
interface AuthContextType {
  user: { name: string } | null;
  login: (name: string) => void;
  logout: () => void;
}

// Créer le contexte avec une valeur par défaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur de contexte d'authentification
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = (name: string) => {
    setUser({ name });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
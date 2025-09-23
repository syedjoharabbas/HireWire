import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: number | null;
  login: (token: string, role: string | null, userId: number | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem('role');
  });

  const [userId, setUserId] = useState<number | null>(() => {
    const v = localStorage.getItem('userId');
    return v ? parseInt(v, 10) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (userId !== null && userId !== undefined) {
      localStorage.setItem('userId', String(userId));
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const login = (newToken: string, newRole: string | null, newUserId: number | null) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = role === 'Admin';

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
      setIsAuth(isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    setUser,
    isAuth,
    setIsAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
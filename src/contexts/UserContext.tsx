import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data';

interface UserContextType {
  user: UserProfile;
  updateUser: (updatedUser: UserProfile) => void;
  getInitials: (name?: string) => string;
  handleOAuthLogin: (provider: 'google' | 'github', providerData: { displayName: string; photoURL: string }) => void;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zid_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('zid_user_profile', JSON.stringify(updatedUser));
  };

  const getInitials = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleOAuthLogin = (provider: 'google' | 'github', providerData: { displayName: string; photoURL: string }) => {
    const nextUser = {
      ...user,
      name: providerData.displayName || 'Member',
      avatarUrl: providerData.photoURL || undefined
    };
    updateUser(nextUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authName', nextUser.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authName');
    updateUser(INITIAL_USER);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, getInitials, handleOAuthLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

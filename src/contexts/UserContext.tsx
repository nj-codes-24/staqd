import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { signOut as apiSignOut } from '../lib/api/auth';
import {
  fetchProfileRow,
  getDerivedStats,
  assembleUserProfile,
  updateProfileFromUser,
  profileFieldsEqual,
} from '../lib/api/profile';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (updatedUser: UserProfile | null) => void;
  getInitials: (name?: string) => string;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mirror of `user` for the write-through diff without stale closures.
  const userRef = useRef<UserProfile | null>(null);
  userRef.current = user;

  // Assemble a UserProfile from a session (profile row + email + derived stats).
  const loadUser = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      // Keep legacy auth flag (read by Dashboard/BookmarkButton/ArticleView) in sync.
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authName');
      return;
    }
    try {
      const [row, stats] = await Promise.all([
        fetchProfileRow(session.user.id),
        getDerivedStats(session.user.id),
      ]);
      if (row) {
        const profile = assembleUserProfile(row, session.user.email ?? '', stats);
        setUser(profile);
        // Bridge real auth into the legacy localStorage flags the existing
        // frontend components still read.
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authName', profile.name || profile.handle);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Detect a return from an OAuth redirect (token in the URL hash, or ?code=).
    const isOAuthReturn =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('error') ||
      /[?&]code=/.test(window.location.search);

    // 1) Resolve any existing session on first load.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      loadUser(session).finally(() => {
        if (!mounted) return;
        setIsLoading(false);

        // On an OAuth return the session lands asynchronously, after components
        // that read the legacy localStorage flag have already mounted (e.g. the
        // Dashboard header). Strip the token from the URL and reload once so they
        // re-read with the session present. Guarded by isOAuthReturn (and the now
        // token-free URL) so it never loops.
        if (isOAuthReturn && session) {
          window.history.replaceState(null, '', window.location.pathname);
          window.location.reload();
        }
      });
    });

    // 2) React to sign-in / sign-out / token refresh. Defer the Supabase calls
    //    out of the callback to avoid the auth-lock deadlock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (mounted) loadUser(session);
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;

  // Updates local state immediately, then writes editable profile fields back to
  // the DB (only when something profile-relevant actually changed).
  const updateUser = (updatedUser: UserProfile | null) => {
    const prev = userRef.current;
    setUser(updatedUser);
    if (!updatedUser) return;
    if (prev && profileFieldsEqual(prev, updatedUser)) return;

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser) return;
      updateProfileFromUser(authUser.id, updatedUser).catch((e) =>
        console.error('Failed to save profile', e)
      );
    });
  };

  const getInitials = (name?: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  const handleLogout = async () => {
    try {
      await apiSignOut();
    } catch (e) {
      console.error('Sign out failed', e);
    }
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, isLoading, updateUser, getInitials, handleLogout }}
    >
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
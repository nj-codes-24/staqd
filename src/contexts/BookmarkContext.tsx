import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article } from '../types';
import { useUser } from './UserContext';
import { getSavedPapers, savePaper, unsavePaper } from '../lib/api/knowledge';

interface BookmarkContextType {
  savedArticles: Article[];
  toggleSave: (article: Article) => void;
  isSaved: (articleId: string) => boolean;
  toastMessage: string | null;
  uploadedArticles: Article[];
  saveUpload: (article: Article) => void;
  removeUpload: (articleId: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Uploads remain local for now (real upload pipeline is Phase 5).
  const [uploadedArticles, setUploadedArticles] = useState<Article[]>([]);

  // Load the user's saved papers from the DB whenever auth state changes.
  useEffect(() => {
    if (!user) {
      setSavedArticles([]);
      return;
    }
    getSavedPapers()
      .then(setSavedArticles)
      .catch((err) => console.error('Failed to load saved papers', err));
  }, [user]);

  // Hydrate uploads from localStorage on mount.
  useEffect(() => {
    try {
      const storedUploads = localStorage.getItem('[ staqd ]_uploaded_articles');
      if (storedUploads) setUploadedArticles(JSON.parse(storedUploads));
    } catch (err) {
      console.error('Failed to parse uploads from localStorage', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('[ staqd ]_uploaded_articles', JSON.stringify(uploadedArticles));
  }, [uploadedArticles]);

  const toggleSave = (article: Article) => {
    const exists = savedArticles.some((a) => a.id === article.id);
    if (exists) {
      // Optimistic remove, then persist.
      setSavedArticles((prev) => prev.filter((a) => a.id !== article.id));
      unsavePaper(article.id).catch((err) => {
        console.error('Failed to unsave', err);
        setSavedArticles((prev) => [article, ...prev]); // revert
      });
    } else {
      setSavedArticles((prev) => [article, ...prev]);
      showToast('Saved to profile.');
      savePaper(article.id).catch((err) => {
        console.error('Failed to save', err);
        setSavedArticles((prev) => prev.filter((a) => a.id !== article.id)); // revert
      });
    }
  };

  const isSaved = (articleId: string) => savedArticles.some((a) => a.id === articleId);

  const saveUpload = (article: Article) => {
    setUploadedArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      if (exists) return prev.map((a) => (a.id === article.id ? article : a));
      showToast('Saved to profile.');
      return [article, ...prev];
    });
  };

  const removeUpload = (articleId: string) => {
    setUploadedArticles((prev) => prev.filter((a) => a.id !== articleId));
    showToast('Removed from profile.');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <BookmarkContext.Provider
      value={{ savedArticles, toggleSave, isSaved, toastMessage, uploadedArticles, saveUpload, removeUpload }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
}
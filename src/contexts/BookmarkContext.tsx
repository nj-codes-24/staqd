import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article } from '../types';

interface BookmarkContextType {
  savedArticles: Article[];
  toggleSave: (article: Article) => void;
  isSaved: (articleId: string) => boolean;
  toastMessage: string | null;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ziddy_saved_articles');
      if (stored) {
        setSavedArticles(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse saved articles from localStorage', err);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('ziddy_saved_articles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const toggleSave = (article: Article) => {
    setSavedArticles(prev => {
      const exists = prev.some(a => a.id === article.id);
      if (exists) {
        return prev.filter(a => a.id !== article.id);
      } else {
        showToast('Saved to profile.');
        return [article, ...prev];
      }
    });
  };

  const isSaved = (articleId: string) => savedArticles.some(a => a.id === articleId);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  return (
    <BookmarkContext.Provider value={{ savedArticles, toggleSave, isSaved, toastMessage }}>
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

import React from 'react';
import { Bookmark } from 'lucide-react';
import { Article } from '../types';
import { useBookmark } from '../contexts/BookmarkContext';

interface BookmarkButtonProps {
  article: Article;
  className?: string;
  size?: number;
  onSaveAuthError?: () => void;
}

export default function BookmarkButton({ article, className = '', size = 20, onSaveAuthError }: BookmarkButtonProps) {
  const { isSaved, toggleSave } = useBookmark();
  const saved = isSaved(article.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuth) {
          if (onSaveAuthError) onSaveAuthError();
          return;
        }
        toggleSave(article);
      }}
      className={`relative inline-flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-transparent transition-all duration-300 cursor-pointer group ${className}`}
      aria-label={saved ? "Remove from saved" : "Save to profile"}
    >
      <style>{`
        @keyframes popIn {
          0% { transform: scale(1); }
          50% { transform: scale(0.85); }
          75% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: popIn 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <Bookmark
        size={size}
        strokeWidth={1.5}
        className={`transition-colors duration-200 ${saved ? 'animate-pop text-[#111827] dark:text-white fill-[#111827] dark:fill-white' : 'text-neutral-500 dark:text-[#9CA3AF] fill-transparent group-hover:text-neutral-800 dark:group-hover:text-white'}`}
      />
    </button>
  );
}

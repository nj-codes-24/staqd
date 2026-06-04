import React from 'react';
import { Bookmark } from 'lucide-react';
import { Article } from '../types';
import { useBookmark } from '../contexts/BookmarkContext';

interface BookmarkButtonProps {
  article: Article;
  className?: string;
  size?: number;
}

export default function BookmarkButton({ article, className = '', size = 20 }: BookmarkButtonProps) {
  const { isSaved, toggleSave } = useBookmark();
  const saved = isSaved(article.id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSave(article);
      }}
      className={`relative inline-flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer group ${className}`}
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
        className={`transition-colors duration-200 ${saved ? 'animate-pop text-[#111827] fill-[#111827]' : 'text-neutral-500 fill-transparent group-hover:text-neutral-800'}`}
      />
    </button>
  );
}

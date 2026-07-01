/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import ArticleView from './components/ArticleView';
import ProfileView from './components/ProfileView';
import SubTopicIndex from './components/SubTopicIndex';
import { UserProfile, Article } from './types';
import { INITIAL_USER } from './data';
import { getAllArticles, markPaperSeen } from './lib/api/knowledge';
import { BookmarkProvider } from './contexts/BookmarkContext';
import GlobalToast from './components/GlobalToast';
import { useUser } from './contexts/UserContext';

export default function App() {
  const { user, updateUser, handleLogout } = useUser();
  const [activeTab, setActiveTab] = useState<'hud' | 'saved' | 'profile'>('hud');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Load the live Knowledge Hub feed from Supabase.
  React.useEffect(() => {
    getAllArticles()
      .then(setArticles)
      .catch((e) => console.error('Failed to load articles', e));
  }, []);

  // Open an article and record it as seen (powers the fresh feed + articlesRead).
  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    if (!article.id.startsWith('upload-')) {
      markPaperSeen(article.id).catch((e) => console.error('Failed to mark seen', e));
    }
  };
  
  React.useEffect(() => {
    console.log("Current Auth State:", user);
  }, [user]);


  const handleStartProcessing = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
    setSelectedArticle(newArticle);
  };

  // Called by the upload flow once the document has really been processed.
  const handleProcessingComplete = (article: Article) => {
    setArticles((prev) => {
      const idx = prev.findIndex(a => a.id.startsWith('upload-'));
      if (idx !== -1) {
        const newArr = [...prev];
        newArr[idx] = article;
        return newArr;
      }
      return [article, ...prev];
    });
    
    setSelectedArticle((prevSelected) => {
      if (prevSelected && prevSelected.id.startsWith('upload-')) {
        return article;
      }
      return prevSelected;
    });
  };

  // Toggle bookmark function
  const handleToggleBookmark = (articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => {
        if (article.id === articleId) {
          const updatedBookmark = !article.isBookmarked;
          // Sync with reading statistics if bookmark is added
          if (updatedBookmark) {
            updateUser({
              ...user,
              stats: {
                ...user.stats,
                articlesRead: user.stats.articlesRead + 1
              }
            });
          }
          return { ...article, isBookmarked: updatedBookmark };
        }
        return article;
      })
    );
  };

  // Dispatch custom user post/insight
  const handleAddCustomArticle = (
    title: string, 
    excerpt: string, 
    category: string, 
    content: string
  ) => {
    const randomBannerIndex = Math.floor(Math.random() * 5) + 1;
    const bannerUrl = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    ][randomBannerIndex - 1];

    const finalId = `custom-${Date.now()}`;
    const newArticle: Article = {
      id: finalId,
      title,
      excerpt,
      content,
      category,
      readTime: '4 min read',
      author: {
        name: user.handle,
        avatar: user.avatarUrl,
        role: 'Verified Builder'
      },
      publishedAt: 'Today',
      imageUrl: bannerUrl,
      likes: 0,
      isBookmarked: false
    };

    setArticles(prev => [newArticle, ...prev]);
  };



  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-150 selection:text-indigo-805">
        <GlobalToast />
        <AnimatePresence mode="wait">
        
        {/* Logged in Workspace Stage */}
        <motion.div
          key="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {/* Conditional Subtree Routing */}
            {selectedArticle ? (
              <ArticleView 
                article={selectedArticle}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBack={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleBookmark={handleToggleBookmark}
              />
            ) : (activeTab === 'hud' && activeSubTopic) ? (
              <SubTopicIndex 
                subTopic={activeSubTopic}
                onBack={() => {
                  setActiveSubTopic(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectArticle={openArticle}
                onToggleBookmark={handleToggleBookmark}
                articles={articles}
                setActiveTab={(tab) => {
                  setActiveSubTopic(null);
                  setActiveTab(tab);
                }}
              />
            ) : activeTab === 'profile' ? (
              <ProfileView 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                articles={articles}
                onAddCustomArticle={handleAddCustomArticle}
                onSelectArticle={openArticle}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
              />
            ) : (
              <Dashboard 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSelectArticle={openArticle}
                articles={articles}
                onToggleBookmark={handleToggleBookmark}
                onViewSubTopicAll={(subTopic) => {
                  setActiveSubTopic(subTopic);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartProcessing={handleStartProcessing}
                onProcessingComplete={handleProcessingComplete}
                setIsEditingProfile={setIsEditingProfile}
              />
            )}
        </motion.div>

        </AnimatePresence>
      </div>
    </BookmarkProvider>
  );
}
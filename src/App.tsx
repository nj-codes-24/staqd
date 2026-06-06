/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import ArticleView from './components/ArticleView';
import ProfileView from './components/ProfileView';
import SubTopicIndex from './components/SubTopicIndex';
import { UserProfile, Article } from './types';
import { INITIAL_USER, MOCK_ARTICLES } from './data';
import { BookmarkProvider } from './contexts/BookmarkContext';
import GlobalToast from './components/GlobalToast';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
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
  const [activeTab, setActiveTab] = useState<'hud' | 'saved' | 'profile'>('hud');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [processingArticle, setProcessingArticle] = React.useState<Article | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  

  React.useEffect(() => {
    if (processingArticle) {
      const timer = setTimeout(() => {
        setArticles(prev => [processingArticle, ...prev]);
        setProcessingArticle(null);
        setSelectedArticle(processingArticle);
        setActiveSubTopic(null);
        setActiveTab('hud');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [processingArticle]);

  // Toggle bookmark function
  const handleToggleBookmark = (articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => {
        if (article.id === articleId) {
          const updatedBookmark = !article.isBookmarked;
          // Sync with reading statistics if bookmark is added
          if (updatedBookmark) {
            setUserProfile(prevUser => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                articlesRead: prevUser.stats.articlesRead + 1
              }
            }));
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
        name: userProfile.handle,
        avatar: userProfile.avatarUrl,
        role: 'Verified Builder'
      },
      publishedAt: 'Today',
      imageUrl: bannerUrl,
      likes: 0,
      isBookmarked: false
    };

    setArticles(prev => [newArticle, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authName');
    setActiveTab('hud');
    setSelectedArticle(null);
    setUserProfile(INITIAL_USER);
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    localStorage.setItem('zid_user_profile', JSON.stringify(updatedUser));
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
            {processingArticle ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <StudyView 
                  isGenerating={true}
                  onBack={() => setProcessingArticle(null)}
                />
              </motion.div>
            ) : selectedArticle ? (
              <ArticleView 
                article={selectedArticle}
                user={userProfile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBack={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleBookmark={handleToggleBookmark}
                onLogout={handleLogout}
              />
            ) : (activeTab === 'hud' && activeSubTopic) ? (
              <SubTopicIndex 
                subTopic={activeSubTopic}
                onBack={() => {
                  setActiveSubTopic(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectArticle={(article) => {
                  setSelectedArticle(article);
                }}
                onToggleBookmark={handleToggleBookmark}
                articles={articles}
                user={userProfile}
                setActiveTab={(tab) => {
                  setActiveSubTopic(null);
                  setActiveTab(tab);
                }}
              />
            ) : activeTab === 'profile' ? (
              <ProfileView 
                user={userProfile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                articles={articles}
                onAddCustomArticle={handleAddCustomArticle}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUserProfile}
                onSelectArticle={(article) => setSelectedArticle(article)}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
              />
            ) : (
              <Dashboard 
                user={userProfile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onUpdateUser={handleUpdateUserProfile}
                onSelectArticle={(article) => {
                  setSelectedArticle(article);
                }}
                onLogout={handleLogout}
                articles={articles}
                onToggleBookmark={handleToggleBookmark}
                onViewSubTopicAll={(subTopic) => {
                  setActiveSubTopic(subTopic);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartProcessing={(newArticle) => {
                  setProcessingArticle(newArticle);
                }}
                setIsEditingProfile={setIsEditingProfile}
              />
            )}
        </motion.div>

        </AnimatePresence>
      </div>
    </BookmarkProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ArticleView from './components/ArticleView';
import ProfileView from './components/ProfileView';
import SubTopicIndex from './components/SubTopicIndex';
import { UserProfile, Article } from './types';
import { INITIAL_USER, MOCK_ARTICLES } from './data';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'hud' | 'saved' | 'profile'>('hud');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  
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

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    setActiveTab('hud');
    setSelectedArticle(null);
  };

  const handleSkipOnboarding = () => {
    setUserProfile(INITIAL_USER);
    setIsOnboarded(true);
    setActiveTab('hud');
    setSelectedArticle(null);
  };

  const handleLogout = () => {
    setIsOnboarded(false);
    setSelectedArticle(null);
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-150 selection:text-indigo-805">
      <AnimatePresence mode="wait">
        
        {/* Onboarding View Stage */}
        {!isOnboarded && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Onboarding 
              onComplete={handleOnboardingComplete} 
              onSkip={handleSkipOnboarding} 
            />
          </motion.div>
        )}

        {/* Logged in Workspace Stage */}
        {isOnboarded && (
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
              />
            ) : (
              <Dashboard 
                user={userProfile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
                onPaperGenerated={(newArticle) => {
                  setArticles(prev => [newArticle, ...prev]);
                  setSelectedArticle(newArticle);
                  setActiveSubTopic(null);
                }}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

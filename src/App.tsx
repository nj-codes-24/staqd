/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, UploadCloud } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ArticleView from './components/ArticleView';
import ProfileView from './components/ProfileView';
import SubTopicIndex from './components/SubTopicIndex';
import StudyView from './components/StudyView';
import { UserProfile, Article } from './types';
import { INITIAL_USER, MOCK_ARTICLES } from './data';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'hud' | 'saved' | 'profile'>('hud');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  
  // Custom Paper Upload Feature States
  const [showStudyView, setShowStudyView] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = () => {
    setIsUploadModalOpen(false);
    setShowStudyView(true);
    setIsGenerating(true);
    setSelectedArticle(null);
    setActiveSubTopic(null);
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setShowStudyView(false);
      
      const newArticle: Article = {
        id: `custom-paper-${Date.now()}`,
        title: "Neural Sourcing Structures & Cryptographic Hallmark Registries in Sustainable Jewelry Manufacturing",
        authors: ["DR. EVELYN MOSS"],
        publishedDate: "MAY 2026",
        source: "SCIENCEDIRECT PUBLICATION",
        abstract: "Uploaded custom paper.",
        fullText: "Uploaded custom paper full text.",
        topics: ["Research", "Jewelry"],
        saved: true,
        summary: {
          points: [
            "Custom paper summary."
          ],
          audioUrl: "mock"
        },
        rating: 99,
        readTimeMinutes: 15
      };
      
      setArticles(prev => [newArticle, ...prev]);
      setSelectedArticle(newArticle);
    }, 6000); // Wait 6 seconds before revealing
  };

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
            {/* FAB Trigger for Custom Paper Upload */}
            {!showStudyView && !selectedArticle && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/60 flex items-center justify-center text-slate-800 hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-white"
              >
                <Plus size={32} strokeWidth={1.5} />
              </button>
            )}

            {/* Custom Paper Upload Modal */}
            <AnimatePresence>
              {isUploadModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF7F2]/60 backdrop-blur-md"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.1)] border border-white"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">Upload Document</h2>
                      <p className="text-stone-500 font-medium text-sm mt-2">Drag and drop your PDF or paper to generate a study session.</p>
                    </div>

                    <div 
                      className={`w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300 ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-stone-300 bg-stone-50/50 hover:bg-stone-100/50 hover:border-stone-400'}`}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); handleFileUpload(); }}
                      onClick={handleFileUpload}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-200/50 text-stone-500'}`}>
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-stone-600 font-medium text-sm">
                        {isDragActive ? "Drop file to upload" : "Click or drag paper here"}
                      </p>
                      <p className="text-stone-400 text-xs mt-1">Supports PDF, DOCX, TXT</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conditional Subtree Routing */}
            {showStudyView ? (
              <StudyView 
                isGenerating={isGenerating}
                onBack={() => setShowStudyView(false)}
              />
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
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

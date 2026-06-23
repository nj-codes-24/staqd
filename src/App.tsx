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

import { getAllArticles, markPaperSeen } from './lib/api/knowledge';
import { BookmarkProvider } from './contexts/BookmarkContext';
import GlobalToast from './components/GlobalToast';
import { useUser } from './contexts/UserContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { user, updateUser, handleLogout } = useUser();
  const [activeTab, setActiveTab] = useState<'hud' | 'saved' | 'profile'>('hud');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingArticle, setProcessingArticle] = React.useState<Article | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Load live data from Supabase
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const liveArticles = await getAllArticles();
        setArticles(liveArticles);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Called by the upload flow once the document has really been processed.
  const handleProcessingComplete = (article: Article) => {
    setArticles((prev) => [article, ...prev]);
    setProcessingArticle(null);
    setSelectedArticle(article);
    setActiveSubTopic(null);
    setActiveTab('hud');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#ded9d0] dark:bg-[#09090B]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Initializing Environment</p>
          </div>
        </div>
      );
    }

    if (processingArticle) {
      return (
        <ErrorBoundary>
          <StudyView 
            isGenerating={true}
            onBack={() => setProcessingArticle(null)}
          />
        </ErrorBoundary>
      );
    }

    if (activeSubTopic) {
      return (
        <ErrorBoundary>
          <SubTopicIndex 
            subTopic={activeSubTopic}
            onBack={() => {
              setActiveSubTopic(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectArticle={(article) => {
              setSelectedArticle(article);
              if (user) {
                markPaperSeen(article.id).catch(err => console.error("Failed to mark paper seen:", err));
              }
            }}
            onToggleBookmark={handleToggleBookmark}
            articles={articles}
            setActiveTab={(tab) => {
              setActiveSubTopic(null);
              setActiveTab(tab);
            }}
          />
        </ErrorBoundary>
      );
    }

    if (selectedArticle) {
      return (
        <ErrorBoundary>
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
        </ErrorBoundary>
      );
    }

    if (activeTab === 'profile') {
      return (
        <ErrorBoundary>
          <ProfileView 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            articles={articles}
            onAddCustomArticle={handleAddCustomArticle}
            onSelectArticle={(article) => {
              setSelectedArticle(article);
              if (user) {
                markPaperSeen(article.id).catch(err => console.error("Failed to mark paper seen:", err));
              }
            }}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
          />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Dashboard 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectArticle={(article) => {
            setSelectedArticle(article);
            if (user) {
              markPaperSeen(article.id).catch(err => console.error("Failed to mark paper seen:", err));
            }
          }}
          articles={articles}
          onToggleBookmark={handleToggleBookmark}
          onViewSubTopicAll={(subTopic) => {
            setActiveSubTopic(subTopic);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartProcessing={(newArticle) => {
            setProcessingArticle(newArticle);
          }}
          onProcessingComplete={handleProcessingComplete}
          setIsEditingProfile={setIsEditingProfile}
        />
      </ErrorBoundary>
    );
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
                onStartProcessing={(newArticle) => {
                  setProcessingArticle(newArticle);
                }}
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
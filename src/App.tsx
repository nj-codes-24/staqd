/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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
  const { user, updateUser } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate(`/article/${article.id}`);
  };

  const openArticle = (article: Article) => {
    if (user) {
      markPaperSeen(article.id).catch(err => console.error("Failed to mark paper seen:", err));
    }
    navigate(`/article/${article.id}`);
  };

  // Toggle bookmark function
  const handleToggleBookmark = (articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => {
        if (article.id === articleId) {
          const updatedBookmark = !article.isBookmarked;
          // Sync with reading statistics if bookmark is added
          if (updatedBookmark && user) {
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
    if (!user) return;
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
        name: user.handle || user.name || 'Anonymous',
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

  // Route Wrappers to map URL params to component props
  const ArticleRouteWrapper = () => {
    const { id } = useParams();
    const article = articles.find(a => a.id === id);
    
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#ded9d0] dark:bg-[#09090B]">Loading...</div>;
    if (!article) return <div className="min-h-screen flex items-center justify-center bg-[#ded9d0] dark:bg-[#09090B] text-neutral-500">Article not found.</div>;

    return (
      <ErrorBoundary>
        <ArticleView 
          article={article}
          activeTab="hud"
          setActiveTab={(tab) => {
            if (tab === 'profile') navigate('/profile');
            else navigate('/');
          }}
          onBack={() => {
            navigate(-1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleBookmark={handleToggleBookmark}
        />
      </ErrorBoundary>
    );
  };

  const TopicRouteWrapper = () => {
    const { name } = useParams();
    if (!name) return null;
    return (
      <ErrorBoundary>
        <SubTopicIndex 
          subTopic={name}
          onBack={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectArticle={openArticle}
          onToggleBookmark={handleToggleBookmark}
          articles={articles}
          setActiveTab={(tab) => {
            if (tab === 'profile') navigate('/profile');
            else navigate('/');
          }}
        />
      </ErrorBoundary>
    );
  };

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-150 selection:text-indigo-805">
        <GlobalToast />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={
                <ErrorBoundary>
                  <Dashboard 
                    activeTab="hud"
                    setActiveTab={(tab) => {
                      if (tab === 'profile') navigate('/profile');
                    }}
                    onSelectArticle={openArticle}
                    articles={articles}
                    onToggleBookmark={handleToggleBookmark}
                    onViewSubTopicAll={(subTopic) => {
                      navigate(`/topic/${encodeURIComponent(subTopic)}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onStartProcessing={() => {
                      navigate('/processing');
                    }}
                    onProcessingComplete={handleProcessingComplete}
                    setIsEditingProfile={setIsEditingProfile}
                  />
                </ErrorBoundary>
              } />
              
              <Route path="/article/:id" element={<ArticleRouteWrapper />} />
              
              <Route path="/topic/:name" element={<TopicRouteWrapper />} />
              
              <Route path="/profile" element={
                <ErrorBoundary>
                  <ProfileView 
                    activeTab="profile"
                    setActiveTab={(tab) => {
                      if (tab === 'hud') navigate('/');
                    }}
                    articles={articles}
                    onAddCustomArticle={handleAddCustomArticle}
                    onSelectArticle={openArticle}
                    isEditingProfile={isEditingProfile}
                    setIsEditingProfile={setIsEditingProfile}
                  />
                </ErrorBoundary>
              } />

              <Route path="/processing" element={
                <ErrorBoundary>
                  <StudyView 
                    isGenerating={true}
                    onBack={() => navigate('/')}
                  />
                </ErrorBoundary>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </BookmarkProvider>
  );
}
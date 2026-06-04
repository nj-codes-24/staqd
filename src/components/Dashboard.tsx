/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  Bookmark, 
  Heart,
  ChevronRight,
  Sparkles,
  Terminal,
  Activity,
  Filter,
  CheckCircle2,
  X,
  Plus,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StudyView from './StudyView';
import SubscriptionModal from './SubscriptionModal';
import { UserProfile, Article } from '../types';
import { KNOWLEDGE_HUB_DATA } from '../data';

const getArticleSource = (articleId: string) => {
  const sources = ['arXiv', 'IEEE Spec', 'Nature Portfolio', 'MIT Tech Review', 'ACM Library', 'ScienceDirect'];
  const hash = articleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sources[hash % sources.length];
};

interface DashboardProps {
  user: UserProfile;
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  onSelectArticle: (article: Article) => void;
  onLogout: () => void;
  articles: Article[];
  onToggleBookmark: (articleId: string) => void;
  onViewSubTopicAll?: (subTopic: string) => void;
  onPaperGenerated: (newArticle: Article) => void;
}

export default function Dashboard({ 
  user, 
  activeTab, 
  setActiveTab, 
  onSelectArticle, 
  onLogout,
  articles,
  onToggleBookmark,
  onViewSubTopicAll,
  onPaperGenerated
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Computer Sciences');
  const [isSearching, setIsSearching] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [currentMenuTab, setCurrentMenuTab] = useState<'hub' | 'hacks'>('hub');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isCheckRevealed, setIsCheckRevealed] = useState(false);

  // Custom Paper Upload Feature States (strictly bound inside Dashboard for Knowledge Hub)
  const [showStudyView, setShowStudyView] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFileUpload = () => {
    setIsUploadModalOpen(false);
    setShowStudyView(true);
    setIsGenerating(true);
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setShowStudyView(false);
      
      const newArticle: Article = {
        id: `custom-paper-${Date.now()}`,
        title: "Neural Sourcing Structures & Cryptographic Hallmark Registries in Sustainable Jewelry Manufacturing",
        author: {
          name: "DR. EVELYN MOSS",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
          role: "AUTHOR"
        },
        publishedAt: "MAY 2026",
        excerpt: "Custom uploaded paper.",
        content: "Uploaded custom paper full text.",
        category: "Research",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
        likes: 0,
        readTime: "15 min read",
        isBookmarked: true
      };
      
      onPaperGenerated(newArticle);
    }, 6000); // Wait 6 seconds before revealing
  };

  const handleOpenSubscriptionModal = () => {
    setIsBookOpen(false);
    setIsCheckRevealed(false);
    setIsSubscriptionModalOpen(true);
  };

  // Hardcoded category list exactly as requested
  const CATEGORIES = [
    'Computer Sciences',
    'Electrical',
    'Bioengineering',
    'Mechanical',
    'Civil',
    'Aerospace',
    'Psychology',
    'Health and Medical Sciences',
    'Biomedical',
    'Physics and Chemistry'
  ];

  // Developer Hacks data specifically built for ZID hacks tab
  const MASTER_HACKS = [
    {
      id: 'hack-1',
      title: 'Eliminating React Recoil & Context Multi-Rerenders via Selector Slices',
      desc: 'Bypass default state cascades by wrapping context values in custom memoized proxy structures.',
      code: 'const useSlice = (selector) => useContext(Ctx)[selector]; // Core Type-safe selector rule',
      difficulty: 'Hard core',
      rating: '9.8 / 10'
    },
    {
      id: 'hack-2',
      title: 'V8 Off-Heap Memory Streaming for Direct Socket Serialization',
      desc: 'Stream high-frequency binary charts directly through WebAssembly buffers to skip JSON transport bottlenecks.',
      code: 'Module._malloc(dataBuffer.byteLength); // Zero-copy serializations',
      difficulty: 'Expert',
      rating: '9.5 / 10'
    },
    {
      id: 'hack-3',
      title: 'LLM Response Streaming via SSE Transfer-Encoding Optimization',
      desc: 'Halve prompt first-token latency by shifting connection backplanes to raw chunked text/event-streams.',
      code: 'res.setHeader("Content-Type", "text/event-stream");',
      difficulty: 'Intermediate',
      rating: '9.2 / 10'
    }
  ];

  // Dynamically get the sub-topics for the currently selected category
  const currentSubTopics = useMemo(() => {
    return KNOWLEDGE_HUB_DATA[selectedCategory] || [];
  }, [selectedCategory]);

  const searchResults = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return articles.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.author.name.toLowerCase().includes(query) ||
      getArticleSource(a.id).toLowerCase().includes(query)
    );
  }, [isSearching, searchQuery, articles]);

  return (
    <div id="magazine-mockup-wrapper" className="min-h-screen bg-[#ded9cf] md:py-8 font-sans antialiased text-[#1c1c1c] selection:bg-[#c2b29f]">
      
      {/* Behance Presentation Header bar */}
      <div className="hidden md:flex max-w-[1240px] mx-auto items-center justify-between px-6 py-2.5 text-[10px] font-mono tracking-widest text-[#605a50] border-[#ccc5b6] mb-4">
        <span>01 / CORE WORKSPACE</span>
        <span className="uppercase text-center">ZID TECHNICAL HUD</span>
        <span className="uppercase">Design Concept V1</span>
      </div>

      {/* Main Container Sheet - Reclaiming Left Sidebar Space Completely */}
      <div 
        id="magazine-page-sheet" 
        className="max-w-[1240px] mx-auto w-full bg-[#fbfaf8] shadow-2xl flex flex-col relative border border-[#c2bba8] min-h-screen transition-all duration-300"
      >
        
        {/* TOP NAVBAR: Standard symmetric branded layout with sidebar removed */}
        <header className="h-16 border-b border-[#ece8df] px-6 md:px-10 flex items-center justify-between sticky top-0 bg-[#fbfaf8]/95 backdrop-blur-md z-20">
          
          {/* Logo element replacement - FLANELLE converted to ZID */}
          <div 
            onClick={() => {
              setCurrentMenuTab('hub');
              setSelectedCategory('Computer Sciences');
              setSearchQuery('');
            }}
            className="text-lg font-mono font-black tracking-[0.25em] text-neutral-900 cursor-pointer select-none"
          >
            ZID
          </div>

          {/* Top navigation - limited strictly to "Knowledge Hub" and "Hacks" */}
          <nav className="flex items-center space-x-8 text-[11px] font-mono uppercase tracking-widest">
            <button 
              onClick={() => setCurrentMenuTab('hub')} 
              className={`transition relative py-2 ${
                currentMenuTab === 'hub' 
                  ? 'text-black font-bold border-b-2 border-black' 
                  : 'text-[#7c7569] hover:text-black'
              }`}
            >
              Knowledge Hub
            </button>
            <button 
              onClick={() => setCurrentMenuTab('hacks')} 
              className={`transition relative py-2 ${
                currentMenuTab === 'hacks' 
                  ? 'text-black font-bold border-b-2 border-black' 
                  : 'text-[#7c7569] hover:text-black'
              }`}
            >
              Hacks
            </button>
          </nav>

          {/* Far Right widgets */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Subscribe Button */}
            <button 
              onClick={handleOpenSubscriptionModal}
              className="px-5 py-1.5 rounded-full border border-neutral-300 hover:border-neutral-400 bg-white shadow-sm hover:shadow-md text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-700 font-bold hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Subscribe
            </button>
            
            {/* Profile Avatar Trigger */}
            <button 
              id="head-avatar-circle"
              onClick={() => setActiveTab('profile')}
              className="h-8.5 w-8.5 rounded-full border border-neutral-300 overflow-hidden shadow-xs hover:scale-105 transition"
              title="Open Creator Profile"
            >
              <img 
                src={user.avatarUrl} 
                alt={user.handle} 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover" 
              />
            </button>
          </div>
        </header>

        {/* HERO TITLE SECTION - Dynamic based on active page with scaling support */}
        <div className="pt-12 pb-8 border-b border-[#ece8df]">
          <h1 className="font-serif font-black text-center text-neutral-950 uppercase leading-none tracking-tight select-none px-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8vw] transition-all duration-300">
            {currentMenuTab === 'hacks' ? 'DEVELOPER HACKS' : 'KNOWLEDGE HUB'}
          </h1>
        </div>

        {/* KNOWLEDGE HUB VIEW STAGE */}
        {currentMenuTab === 'hub' ? (
          <>
            {showStudyView ? (
              <StudyView 
                isGenerating={isGenerating}
                onBack={() => setShowStudyView(false)}
              />
            ) : (
              <div className="flex-1 flex flex-col">
                
                {/* CATEGORY SELECTOR + FILTER TRIGGER ROW */}
                <div className="border-b border-[#ece8df] py-4 px-6 md:px-10 flex items-center justify-between bg-[#faf9f6]/40 relative">
                  
                  <AnimatePresence mode="wait">
                    {!isSearching ? (
                      <React.Fragment key="default-search-header">
                        <motion.div 
                          key="pills"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -50, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 relative z-10 overflow-x-auto flex gap-2 py-1 no-scrollbar mr-4"
                          style={{ WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 80px), transparent 100%)', maskImage: 'linear-gradient(to right, black calc(100% - 80px), transparent 100%)' }}
                        >
                            {CATEGORIES.map((cat) => {
                              const isActive = selectedCategory === cat;
                              return (
                                <button
                                  key={cat}
                                  onClick={() => setSelectedCategory(cat)}
                                  className={`px-4.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-all duration-200 border cursor-pointer flex-shrink-0 ${
                                    isActive 
                                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                                      : 'bg-transparent text-[#7c7569] border-[#e1dacb] hover:border-[#1a1a1a] hover:text-black'
                                  }`}
                                >
                                  {cat}
                                </button>
                              );
                            })}
                        </motion.div>
                        
                        <div className="bg-[#fbfaf8] flex items-center justify-end flex-shrink-0 z-20 w-[40px]">
                          <button 
                            key="search-btn"
                            onClick={() => setIsSearching(true)}
                            className="flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer bg-transparent border-none"
                          >
                            <Search className="h-5 w-5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <motion.div
                        key="search-input"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex items-center bg-white border border-transparent rounded-full px-5 h-[42px] mr-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-10"
                      >
                        <Search className="w-4 h-4 text-neutral-400 mr-3" />
                        <input 
                          type="text"
                          placeholder="Search papers by title, topic, or publisher..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-sm font-sans placeholder-neutral-400 text-neutral-900"
                          autoFocus
                        />
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearching(false);
                          }}
                          className="text-neutral-500 hover:text-neutral-900 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MAIN CONTENT SPACE - POPULATE BY SELECTED CATEGORY'S SUB-TOPICS OR SEARCH */}
                <div className="flex-1 divide-y-2 divide-[#ece8df]/70 min-h-[400px] relative">
                  
                  {/* The Solid Overlay for Search Focus Mode */}
                  <AnimatePresence>
                    {isSearching && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-40"
                        style={{ backgroundColor: '#fbfaf8' }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Search Results Rendered ON TOP of the blur */}
                  <AnimatePresence>
                    {isSearching && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-50 overflow-y-auto"
                      >
                        {!searchQuery.trim() ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-[40px] px-6 md:px-10 w-full"
                          >
                            <h3 className="text-[#9CA3AF] text-[10px] font-sans font-bold tracking-[0.3em] uppercase mb-8 text-left">
                              TRENDING TOPICS
                            </h3>
                            <div className="flex flex-col space-y-6">
                              {[
                                "Autonomous Decision Systems",
                                "PPO Agents in Synthetics",
                                "Causal Deduction",
                                "Generative Architecture"
                              ].map((suggestion, i) => (
                                <button 
                                  key={i}
                                  onClick={() => setSearchQuery(suggestion)}
                                  className="text-left font-serif text-lg md:text-xl text-neutral-600 hover:text-black transition-colors"
                                >
                                  <span className="text-neutral-400 mr-4 font-sans text-sm">↳</span>
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        ) : searchResults && searchResults.length > 0 ? (
                          <div className="p-6 md:p-10">
                            <h2 className="text-sm md:text-base font-serif font-black uppercase text-[#1a1a1a] tracking-wider border-l-4 border-amber-800/80 pl-3 mb-6">
                              Search Results for "{searchQuery}"
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {searchResults.map((article) => (
                                <div 
                                  key={article.id}
                                  onClick={() => onSelectArticle(article)}
                                  className="group bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] cursor-pointer h-full border border-neutral-100"
                                >
                                  <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 relative">
                                    <img 
                                      src={article.imageUrl} 
                                      alt={article.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                                    />
                                  </div>
                                  <div className="p-5 flex-1 flex flex-col space-y-3">
                                    <div className="flex items-center justify-between text-[9px] font-mono text-[#8a8174] uppercase tracking-wider font-semibold">
                                      <span>{getArticleSource(article.id)}</span>
                                      <span>{article.readTime}</span>
                                    </div>
                                    <h3 className="text-[14px] md:text-[15px] font-sans font-bold text-[#1c1c1c] leading-tight line-clamp-3">
                                      {article.title}
                                    </h3>
                                    <div className="mt-auto pt-3">
                                      <p className="text-[11px] font-serif italic text-neutral-600 line-clamp-2 leading-relaxed">
                                        {article.excerpt}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 h-full min-h-[400px]">
                            <div 
                                className={`max-w-xl w-full p-12 rounded-2xl border-[1.5px] border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
                                  isDragActive 
                                    ? 'border-[#9CA3AF] bg-[#f0efec] scale-[1.02]' 
                                    : 'border-[#D1D5DB] bg-[#f8f7f5] hover:border-[#9CA3AF] hover:bg-[#f3f2ee]'
                                }`}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); handleFileUpload(); }}
                                onClick={handleFileUpload}
                              >
                                <div className="mb-5 text-neutral-400">
                                  <UploadCloud size={36} strokeWidth={1} />
                                </div>
                                <h3 className="font-serif font-bold text-xl text-neutral-700 mb-2">
                                  No such document found.
                                </h3>
                                <p className="text-[#6B7280] text-sm tracking-wide">
                                  If you have the document, drop it here and we will process it.
                                </p>
                              </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sub Topics always rendered in background */}
                  <div className="relative z-0 h-full">
                    {currentSubTopics.length > 0 ? (
                      currentSubTopics.map((subTopic, sIdx) => {
                        const featured = subTopic.featuredArticle;
                        const carousel = subTopic.carouselArticles;
                        const allArticles = [featured, ...carousel];

                        return (
                          <div key={`${subTopic.name}-${sIdx}`} className="p-6 md:p-10 space-y-6 text-left">
                            
                            {/* Sub-topic Section Title Header */}
                            <div className="flex items-center justify-between">
                              <h2 className="text-sm md:text-base font-serif font-black uppercase text-[#1a1a1a] tracking-wider border-l-4 border-amber-800/80 pl-3">
                                {subTopic.name}
                              </h2>
                              <button 
                                onClick={() => onViewSubTopicAll?.(subTopic.name)}
                                className="text-[10px] font-mono uppercase tracking-widest text-[#7c7569] hover:text-[#1a1a1a] transition font-bold"
                              >
                                View All →
                              </button>
                            </div>

                            {/* SWIPEABLE ROW OF CAROUSEL ITEMS FOR THIS SUB-TOPIC */}
                            <div className="space-y-3">
                              {/* Scrolling Container */}
                              <div className="overflow-x-auto flex gap-6 pb-4 no-scrollbar snap-x pt-1">
                                {allArticles.map((article) => (
                                  <div 
                                    key={article.id}
                                    onClick={() => onSelectArticle(article)}
                                    className="group w-[280px] sm:w-[320px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left flex-shrink-0 snap-start transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] cursor-pointer"
                                  >
                                    {/* Thumbnail */}
                                    <div 
                                      className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 relative"
                                    >
                                      <img 
                                        src={article.imageUrl} 
                                        alt={article.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                                      />
                                    </div>

                                    {/* Title / Description & Widgets */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[9px] font-mono text-[#8a8174] uppercase tracking-wider font-semibold">
                                          <span>{getArticleSource(article.id)} • {article.author.name}</span>
                                          <span>{article.publishedAt}</span>
                                        </div>
                                        <h4 
                                          className="text-xs sm:text-sm font-serif font-black text-neutral-900 group-hover:text-amber-900 leading-normal sm:leading-relaxed transition-colors"
                                        >
                                          {article.title}
                                        </h4>
                                        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>

                                      {/* Bottom widgets bar */}
                                      <div className="pt-3 border-t border-[#ece8df]/60 flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-auto">
                                        <span>{article.readTime}</span>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleBookmark(article.id);
                                          }}
                                          className="p-1 text-neutral-400 hover:text-black transition"
                                          title="Save index"
                                        >
                                          <Bookmark className={`h-3.5 w-3.5 ${article.isBookmarked ? 'fill-black text-black' : ''}`} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        );
                      })
                    ) : (
                      <div className="p-16 text-center">
                        <p className="text-sm font-mono text-[#7c7569]">No sub-topics are defined currently for {selectedCategory}.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* FAB Trigger for Custom Paper Upload */}
            {!showStudyView && (
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
          </>
        ) : (
          
          /* HACKS VIEW STAGE */
          <div className="p-6 md:p-10 space-y-8 text-left flex-1 animate-fade-in">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-amber-800 bg-[#fbfaf8] border border-[#e1dacb] px-3 py-1 rounded">
                High Frequency Developer Performance Hacks
              </span>
              <p className="text-sm font-serif italic text-neutral-600 leading-relaxed">
                A curated sequence of speed, network, and layout hacks gathered for building high speed technical portals. Click to apply formulas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MASTER_HACKS.map((hack) => (
                <div 
                  key={hack.id}
                  className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between text-left text-white shadow-xl min-h-[260px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-amber-200 border border-amber-900 bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                        {hack.difficulty}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400">
                        Score: {hack.rating}
                      </span>
                    </div>

                    <h3 className="text-sm font-serif font-bold text-[#fafafa] leading-snug">
                      {hack.title}
                    </h3>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {hack.desc}
                    </p>
                  </div>

                  <div className="bg-black/50 border border-neutral-800 p-2.5 rounded font-mono text-[9px] text-[#818cf8] overflow-x-auto whitespace-pre-wrap mt-4 select-all">
                    <code>{hack.code}</code>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border border-dashed border-[#e1dacb] p-6 rounded text-center">
              <span className="text-lg">⚡</span>
              <p className="text-xs font-mono text-neutral-500 mt-1">Want to contribute dynamic runtime compiler tricks? Connect your GitHub at Dashboard profile.</p>
            </div>
          </div>
        )}

        {/* BRUTALIST TECHNICAL FOOTER */}
        <footer className="mt-auto p-8 bg-[#141619] text-[#b8b3a9] border-t border-[#292c30]">
          <div className="space-y-6">
            
            <div className="border-t border-[#31353a] w-full"></div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-mono font-black tracking-widest text-[#fbfaf8] uppercase italic">
                  ZID*
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mt-1">
                  curated microscale research hub & terminal insights for absolute builders
                </p>
              </div>

              <div className="text-[10px] font-serif italic text-neutral-400 max-w-xs sm:text-right">
                "Deterministic state correctness under compile stress is ZID system policy."
              </div>
            </div>

            <div className="pt-4 border-t border-[#2d3136] text-[9px] font-mono uppercase tracking-widest flex flex-col sm:flex-row justify-between text-neutral-500 gap-2">
              <span>© {new Date().getFullYear()} ZID RESEARCH INDEX. ALL RIGHTS RESERVED.</span>
              <span>ESTABLISHED MAY 2026</span>
            </div>

          </div>
        </footer>

        {/* Subscription Modal Render */}
        <SubscriptionModal 
          isOpen={isSubscriptionModalOpen} 
          onClose={() => setIsSubscriptionModalOpen(false)} 
          isBookOpen={isBookOpen}
          setIsBookOpen={setIsBookOpen}
          isCheckRevealed={isCheckRevealed}
          setIsCheckRevealed={setIsCheckRevealed}
        />

      </div>
    </div>
  );
}

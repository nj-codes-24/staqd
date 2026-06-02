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
  CheckCircle2
} from 'lucide-react';
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
}

export default function Dashboard({ 
  user, 
  activeTab, 
  setActiveTab, 
  onSelectArticle, 
  onLogout,
  articles,
  onToggleBookmark,
  onViewSubTopicAll
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Computer Sciences');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentMenuTab, setCurrentMenuTab] = useState<'hub' | 'hacks'>('hub');

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
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-neutral-500 hover:text-black transition rounded cursor-pointer"
              title="Search database"
            >
              <Search className="h-4.5 w-4.5" />
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

        {/* Dynamic global search drawer */}
        {isSearchOpen && (
          <div className="bg-[#f5f1e8] border-b border-[#e5dec9] p-4 px-6 md:px-10 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3 w-full max-w-xl">
              <Search className="h-4.5 w-4.5 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Query articles, sub-topics, authors, formulas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none border-b border-[#c2bba8] text-sm text-neutral-900 placeholder-neutral-500 font-serif italic py-1"
                autoFocus
              />
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="text-xs font-mono uppercase text-neutral-500 hover:text-black ml-4"
            >
              Close
            </button>
          </div>
        )}

        {/* HERO TITLE SECTION - Dynamic based on active page with scaling support */}
        <div className="pt-12 pb-8 border-b border-[#ece8df]">
          <h1 className="font-serif font-black text-center text-neutral-950 uppercase leading-none tracking-tight select-none px-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8vw] transition-all duration-300">
            {currentMenuTab === 'hacks' ? 'DEVELOPER HACKS' : 'KNOWLEDGE HUB'}
          </h1>
        </div>

        {/* KNOWLEDGE HUB VIEW STAGE */}
        {currentMenuTab === 'hub' ? (
          <div className="flex-1 flex flex-col">
            
            {/* CATEGORY SELECTOR + FILTER TRIGGER ROW */}
            <div className="border-b border-[#ece8df] py-4 px-6 md:px-10 flex items-center justify-between gap-4 bg-[#faf9f6]/40">
              
              {/* Category horizontal scrolling pills */}
              <div className="flex-1 overflow-x-auto flex gap-2 py-1 no-scrollbar pr-4">
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
              </div>

              {/* On the far right: Replace entry count with "Filter" action */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-1.5 border border-[#e1dacb] hover:border-black text-[10px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-md transition bg-[#fbfaf8]/80 cursor-pointer text-neutral-700 flex-shrink-0"
              >
                <Filter className="h-3 w-3" />
                <span>Filter</span>
              </button>
            </div>

            {/* MAIN CONTENT SPACE - POPULATE BY SELECTED CATEGORY'S SUB-TOPICS */}
            <div className="flex-1 divide-y-2 divide-[#ece8df]/70">
              
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

      </div>
    </div>
  );
}

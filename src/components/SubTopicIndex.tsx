/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Bookmark, 
  RefreshCw,
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { UserProfile, Article } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface SubTopicIndexProps {
  subTopic: string;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  articles: Article[];
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
}

const getArticleSource = (articleId: string) => {
  const sources = ['arXiv', 'IEEE Spec', 'Nature Portfolio', 'MIT Tech Review', 'ACM Library', 'ScienceDirect'];
  const hash = articleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sources[hash % sources.length];
};

function PaperThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = React.useState(false);

  if (failed || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200/50 flex flex-col items-center justify-center text-neutral-400 dark:text-[#9CA3AF] select-none p-2 border border-neutral-200/30 rounded">
        <span className="text-[11px] font-mono font-black tracking-widest text-[#7c7569] dark:text-[#9CA3AF] uppercase">ZID</span>
        <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 dark:text-[#9CA3AF] font-bold mt-0.5">RESEARCH</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
    />
  );
}

const generateMockPapersForSubTopic = (subTopic: string, initialCount: number): Article[] => {
  const generated: Article[] = [];
  const titles = [
    `Quantum Error Correction Layers built on top of Zero-knowledge State Proofs`,
    `Thermal Waveguide Attenuation and Micro-stator Hysteresis in Low-loss Matrices`,
    `Multi-agent Consensus Routines on Fault-tolerant Byzantine Ring Schemas`,
    `A Comprehensive Study of Stochastic Invariant Guarantees in Dynamic Trajectories`,
    `Unsupervised Parameter Quantization on Embedded Micro-controller Silicon Rings`,
    `Near-vacuum Boundary Boundary Layer Flight Modeling via Adaptive Mesh Methods`,
    `Decoupling Telemetry Pipelines from Core Real-time Hardware Command Queues`,
    `Causal Logic Representation Layers inside Distributed Heterogeneous Networks`,
    `Optimal Flow Control and Fluid Shear Reduction over High-velocity Aerodynamic Skins`,
    `Next-generation Scaffolding Vascularization using Electrospun Synthetic Hydrogels`,
    `Highly Parallelized Raytrace Schedulers on Microscale Core Clusters`,
    `Dynamic Heap Compaction Performance Audits on V8-Adjacent Engines`,
    `A Formal Verification Model for Embedded Assembly Instruction Branching`,
    `Spatially Quantized Latent Spaces in Deep Generative Diffusion Pipelines`,
    `Optimized Routing inside Exabyte-Grade Graph Processing Frameworks`
  ];

  const excerpts = [
    `Analyzing topological invariants and physical constraints to establish high fidelity and safe execution thresholds in production runtimes.`,
    `Using adaptive Kalman estimators to filter system noise and measure state deviations from formal consensus parameters across remote nodes.`,
    `We document key microscale factors of physical transport boundaries, demonstrating formal proofs of structural health under persistent stress.`,
    `A detailed performance audit with concrete mathematical modeling, benchmark graphs, and recommended structural design configurations.`,
    `Structuring robust compiler optimization passes that safely strip redundant telemetry channels without compromising memory isolation walls.`,
    `This whitepaper profiles multi-layered compound materials to optimize mechanical load transmission and minimize energy dissipation rates.`,
    `A comprehensive engineering overview documenting key physical transport and telemetry latency limits at scale.`
  ];

  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600'
  ];

  const authors = [
    { name: 'Dr. Evelyn Moss', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', role: 'ZID Team Principal' },
    { name: 'Prof. Liam Vance', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', role: 'Senior Compiler Scientist' },
    { name: 'Hana Mitchell', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', role: 'V8 Hardware Architect' }
  ];

  const months = ['MAY 2026', 'APRIL 2026', 'MARCH 2026'];

  // Generate 45 high-quality papers - 15 per month (so total is 45)
  for (let i = 0; i < 45; i++) {
    const paperId = `gen-${subTopic.toLowerCase().replace(/\s+/g, '-')}-${i}`;
    const authorIndex = i % authors.length;
    const titleIndex = (i + initialCount) % titles.length;
    const excerptIndex = (i + initialCount) % excerpts.length;
    const imageIndex = (i + initialCount) % images.length;
    const month = months[Math.floor(i / 15)];
    
    generated.push({
      id: paperId,
      title: `${titles[titleIndex]} [V${i % 15 + 1}]`,
      excerpt: excerpts[excerptIndex],
      category: subTopic,
      readTime: `${4 + (i % 5)} min read`,
      publishedAt: month,
      likes: 120 + (i * 15),
      imageUrl: images[imageIndex],
      author: authors[authorIndex],
      content: `## ${titles[titleIndex]}\nDetailed research documentation exploring computational variables and real-world implementation matrices designed for advanced hardware controllers.`
    });
  }

  return generated;
};

export default function SubTopicIndex({
  subTopic,
  onBack,
  onSelectArticle,
  onToggleBookmark,
  articles,
  setActiveTab
}: SubTopicIndexProps) {
  const { user, getInitials } = useUser();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Popover Filter Dropdown visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Active filter states in use
  const [activeSortBy, setActiveSortBy] = useState('newest');
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [activeSubTopics, setActiveSubTopics] = useState<string[]>([]);
  const [activeAttributes, setActiveAttributes] = useState({
    hasCode: false,
    hasDataset: false,
    peerReviewed: false,
  });

  // Working draft states for popover modal interaction
  const [draftSortBy, setDraftSortBy] = useState('newest');
  const [draftSources, setDraftSources] = useState<string[]>([]);
  const [draftSubTopics, setDraftSubTopics] = useState<string[]>([]);
  const [draftAttributes, setDraftAttributes] = useState({
    hasCode: false,
    hasDataset: false,
    peerReviewed: false,
  });

  // Collapsible Month Groups (Accordions) state: Newest month (MAY 2026) is expanded by default
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    'MAY 2026': true,
  });

  // State to track load remaining for each specific month group
  const [monthLoadRemaining, setMonthLoadRemaining] = useState<Record<string, boolean>>({});

  // Filter existing state articles for this category/sub-topic, and augment with simulated articles
  const allSubTopicArticles = useMemo(() => {
    // Collect active state articles matched by subtopic/category
    const matched = articles.filter(
      (a) => a.category.toLowerCase().includes(subTopic.toLowerCase()) || 
             subTopic.toLowerCase().includes(a.category.toLowerCase())
    );

    // Complement with high-quality generated research papers to guarantee 30 papers
    const generatedPool = generateMockPapersForSubTopic(subTopic, matched.length);
    
    // Ensure all matched articles have standard month as MAY 2026 so they group beautifully
    const normalizedMatched = matched.map((a) => ({
      ...a,
      publishedAt: a.publishedAt || 'MAY 2026'
    }));

    let combined = [...normalizedMatched, ...generatedPool];

    // Filter by search query if active
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    // Apply active source filters
    if (activeSources.length > 0) {
      combined = combined.filter((a) => {
        const source = getArticleSource(a.id).toLowerCase();
        return activeSources.some(s => {
          const lowerS = s.toLowerCase();
          if (lowerS === 'ieee xplore') return source.includes('ieee') || source.includes('spec');
          if (lowerS === 'nature') return source.includes('nature');
          return source.includes(lowerS);
        });
      });
    }

    // Apply active sub-topic filters
    if (activeSubTopics.length > 0) {
      combined = combined.filter((a) => {
        return activeSubTopics.some(topic => {
          const lowerTopic = topic.toLowerCase();
          return a.title.toLowerCase().includes(lowerTopic) || 
                 a.excerpt.toLowerCase().includes(lowerTopic) ||
                 a.category.toLowerCase().includes(lowerTopic);
        });
      });
    }

    // Apply active attribute filters (deterministic and static)
    if (activeAttributes.hasCode || activeAttributes.hasDataset || activeAttributes.peerReviewed) {
      combined = combined.filter((a) => {
        const hash = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hasCodeValue = hash % 2 === 0;
        const hasDatasetValue = hash % 3 === 0;
        const isPeerReviewedValue = hash % 5 !== 0;

        if (activeAttributes.hasCode && !hasCodeValue) return false;
        if (activeAttributes.hasDataset && !hasDatasetValue) return false;
        if (activeAttributes.peerReviewed && !isPeerReviewedValue) return false;
        return true;
      });
    }

    // Apply active sort logic
    // Options: Newest First, Oldest First, Most Relevant, High Impact
    combined = [...combined].sort((a, b) => {
      const monthWeight = (monthStr: string) => {
        if (monthStr === 'MAY 2026') return 3;
        if (monthStr === 'APRIL 2026') return 2;
        if (monthStr === 'MARCH 2026') return 1;
        return 0;
      };

      const getArticleHash = (idStr: string) => {
        return idStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      };

      if (activeSortBy === 'oldest') {
        const diff = monthWeight(a.publishedAt || '') - monthWeight(b.publishedAt || '');
        if (diff !== 0) return diff;
        return getArticleHash(b.id) - getArticleHash(a.id);
      } else if (activeSortBy === 'relevant') {
        const likesA = a.likes || 0;
        const likesB = b.likes || 0;
        return likesB - likesA;
      } else if (activeSortBy === 'cited') {
        const hashA = getArticleHash(a.id);
        const hashB = getArticleHash(b.id);
        return (hashB % 370) - (hashA % 370);
      } else {
        // newest first (default)
        const diff = monthWeight(b.publishedAt || '') - monthWeight(a.publishedAt || '');
        if (diff !== 0) return diff;
        return getArticleHash(a.id) - getArticleHash(b.id);
      }
    });

    return combined;
  }, [subTopic, articles, searchQuery, activeSortBy, activeSources, activeSubTopics, activeAttributes]);

  const handleClearAll = () => {
    setDraftSortBy('newest');
    setDraftSources([]);
    setDraftSubTopics([]);
    setDraftAttributes({
      hasCode: false,
      hasDataset: false,
      peerReviewed: false,
    });

    setActiveSortBy('newest');
    setActiveSources([]);
    setActiveSubTopics([]);
    setActiveAttributes({
      hasCode: false,
      hasDataset: false,
      peerReviewed: false,
    });

    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setActiveSortBy(draftSortBy);
    setActiveSources(draftSources);
    setActiveSubTopics(draftSubTopics);
    setActiveAttributes(draftAttributes);
    setIsFilterOpen(false);
  };

  const handleOpenFilters = () => {
    // Copy active filter values to working drafts when opened
    setDraftSortBy(activeSortBy);
    setDraftSources(activeSources);
    setDraftSubTopics(activeSubTopics);
    setDraftAttributes(activeAttributes);
    setIsFilterOpen(!isFilterOpen);
  };

  // Group items by Month
  const groupedArticles = useMemo(() => {
    const groups: Record<string, Article[]> = {
      'MAY 2026': [],
      'APRIL 2026': [],
      'MARCH 2026': []
    };

    allSubTopicArticles.forEach((article) => {
      const month = article.publishedAt || 'MAY 2026';
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(article);
    });

    return Object.keys(groups)
      .map((monthName) => ({
        headingName: monthName,
        items: groups[monthName]
      }))
      .filter(group => group.items.length > 0);
  }, [allSubTopicArticles]);

  const toggleMonth = (monthName: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthName]: !prev[monthName]
    }));
  };

  const isMonthExpanded = (monthName: string) => {
    if (searchQuery.trim() !== '') return true; // show all matching on search
    return !!expandedMonths[monthName];
  };

  const isLoadedRemaining = (monthName: string) => {
    if (searchQuery.trim() !== '') return true; // show all on search
    return !!monthLoadRemaining[monthName];
  };

  const handleLoadRemaining = (monthName: string) => {
    setMonthLoadRemaining((prev) => ({
      ...prev,
      [monthName]: true
    }));
  };

  return (
    <div id="subtopic-catalog-wrapper" className="min-h-screen bg-[#ded9cf] dark:bg-[#09090B] md:py-8 font-sans antialiased text-[#1c1c1c] selection:bg-[#c2b29f]">
      
      {/* Behance Presentation Header bar */}
      <div className="hidden md:flex max-w-[1240px] mx-auto items-center justify-between px-6 py-2.5 text-[10px] font-mono tracking-widest text-[#605a50] dark:text-gray-400 border-[#ccc5b6] mb-4">
        <span>02 / TECHNICAL CATALOG INDEX</span>
        <span className="uppercase text-center">ZID SUB-TOPIC PORTAL</span>
        <span className="uppercase">COMPILER LEVEL {user?.level || 0}</span>
      </div>

      {/* Main Container Sheet */}
      <div 
        id="magazine-page-sheet" 
        className={`max-w-[1240px] mx-auto w-full bg-[#fbfaf8] dark:bg-[#121214] shadow-2xl dark:shadow-none flex flex-col relative border border-[#c2bba8] dark:border-[rgba(255,255,255,0.08)] min-h-screen transition-all duration-300 ${(isFocused || isSearching) && allSubTopicArticles.length === 0 ? 'overflow-hidden' : ''}`}
        style={(isFocused || isSearching) && allSubTopicArticles.length === 0 ? { minHeight: 'calc(100vh - 64px)' } : {}}
      >
        {/* Minimal header */}
        <header className="h-16 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-[#fbfaf8]/95 dark:bg-[rgba(18,20,23,0.75)] backdrop-blur-md dark:backdrop-blur-2xl dark:border-b dark:border-[rgba(255,255,255,0.05)] z-20">
          
          {/* Back button */}
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-gray-300 font-extrabold bg-neutral-100 dark:bg-transparent hover:bg-neutral-200/80 dark:hover:bg-white/5 dark:hover:text-white px-4 py-2 border border-neutral-300 dark:border-white/10 shadow-xs hover:border-neutral-400 rounded-md transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Back to Hub</span>
          </button>

          {/* Logo element replacement - centered */}
          <div 
            onClick={onBack}
            className="text-lg font-mono font-black tracking-[0.25em] text-neutral-900 dark:text-[#F3F4F6] cursor-pointer select-none absolute left-1/2 -translate-x-1/2"
          >
            ZID
          </div>

          {/* Far Right widgets */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Profile Avatar Trigger */}
            <button 
              id="head-avatar-circle"
              onClick={() => setActiveTab('profile')}
              className="h-8.5 w-8.5 rounded-full border border-neutral-300 overflow-hidden shadow-xs hover:scale-105 transition cursor-pointer"
              title="Open Creator Profile"
            >
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.handle} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <span className="text-white text-[10px] font-mono font-bold uppercase">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Content Section based EXACTLY on Reference Image */}
        <div className="p-6 md:p-12 space-y-10" style={{ paddingBottom: '120px' }}>
          
          {/* REFERENCE MOCKUP HEADER: Responsive text size aligned of metadata directly beneath title */}
          <div className="text-left space-y-1.5 mb-12">
            <h1 className="font-serif font-black uppercase text-2xl sm:text-4xl md:text-5xl tracking-tight text-[#111] dark:text-gray-100 leading-none">
              {subTopic}
            </h1>
            <div>
              <span className="text-[10px] md:text-xs font-mono tracking-widest text-[#7c7569] dark:text-[#9CA3AF] uppercase font-bold block">
                Updated Daily • Curated API Feed • {allSubTopicArticles.length} PAPERS ACTIVE
              </span>
            </div>
          </div>

          {/* COMMAND CENTER TOOLBAR */}
          <div className="relative flex gap-4 items-center w-full z-50">
            <div 
              className="flex-1 relative flex items-center space-x-3 transition-colors duration-300 bg-white dark:bg-[#1C1C1E] rounded-full h-[48px] px-6 focus-within:border-[#111827] dark:focus-within:border-[#F3F4F6] group dark:border-[rgba(255,255,255,0.1)]"
              style={{
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <Search className="h-5 w-5 text-neutral-800 dark:text-[#F3F4F6] shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search papers by title, topic, or publisher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent outline-none text-[13px] md:text-[14px] font-sans font-normal text-[#111827] dark:text-[#F3F4F6] placeholder-[#9CA3AF] dark:placeholder-gray-400 m-0 p-0"
                style={{ letterSpacing: '0.02em' }}
              />
              {(isFocused || searchQuery.length > 0) && (
                <button
                  onMouseDown={(e) => {
                    // Prevent blur before click registers
                    e.preventDefault();
                  }}
                  onClick={() => {
                    setSearchQuery('');
                    setIsFocused(false);
                    inputRef.current?.blur();
                  }}
                  className="group flex items-center justify-center p-2 rounded-full text-[#6B7280] hover:text-[#111827] dark:text-[#F3F4F6] hover:bg-[#F3F4F6] transition-all duration-200 cursor-pointer shrink-0 focus:outline-none ml-3"
                  title="Close Search"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    onClick={handleOpenFilters}
                    className={`flex items-center justify-center space-x-2 text-[13px] font-sans font-medium px-6 h-[48px] border transition duration-200 cursor-pointer rounded-full shrink-0 focus:outline-none ${
                      isFilterOpen || activeSources.length > 0 || activeSubTopics.length > 0 || activeAttributes.hasCode || activeAttributes.hasDataset || activeAttributes.peerReviewed
                        ? 'bg-[#111827] text-white border-[#111827]' 
                        : 'text-[#111827] dark:text-[#F3F4F6] bg-white dark:bg-transparent hover:bg-[#F9FAFB] dark:hover:bg-[#F3F4F6] dark:hover:text-[#0A0A0B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.1)] hover:border-[#D1D5DB]'
                    }`}
                    style={{
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    title="Filter Research Catalog"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Popover Dropdown Modal */}
            {isFilterOpen && (
              <div 
                className="absolute top-[calc(100%+16px)] left-0 right-0 bg-[#FFFFFF] dark:bg-[#121214]/80 backdrop-blur-[16px] border border-neutral-200 dark:border-white/10 shadow-[0_48px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.6)] rounded-xl z-[9999] p-6 md:p-8 text-left transition-all duration-300"
                style={{ contentVisibility: 'auto' }}
              >
                {/* Grid Layout inside Popover */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-6 border-b border-neutral-200">
                  
                  {/* Section 1: Sort By (Radio Buttons) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono tracking-widest font-black text-neutral-400 dark:text-gray-300 uppercase">SORT BY</h4>
                    <div className="space-y-2.5">
                      {[
                        { id: 'newest', label: 'Newest First' },
                        { id: 'oldest', label: 'Oldest First' },
                        { id: 'relevant', label: 'Most Relevant' },
                        { id: 'cited', label: 'High Impact' }
                      ].map(opt => (
                        <label key={opt.id} className="flex items-center space-x-2.5 text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="sortBy"
                            checked={draftSortBy === opt.id}
                            onChange={() => setDraftSortBy(opt.id)}
                            className="appearance-none w-4 h-4 rounded-full cursor-pointer bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 checked:bg-neutral-950 dark:checked:bg-gray-100 checked:border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:focus:ring-offset-[#121214] relative before:absolute before:inset-0 before:w-1.5 before:h-1.5 before:m-auto before:bg-white dark:before:bg-black before:rounded-full before:opacity-0 checked:before:opacity-100"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Publisher / Source (Checkboxes) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono tracking-widest font-black text-neutral-400 dark:text-gray-300 uppercase">PUBLISHER / SOURCE</h4>
                    <div className="space-y-2.5">
                      {['arXiv', 'IEEE Xplore', 'ACM Library', 'Nature', 'ScienceDirect'].map(src => {
                        const isChecked = draftSources.includes(src);
                        return (
                          <label key={src} className="flex items-center space-x-2.5 text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setDraftSources(draftSources.filter(s => s !== src));
                                } else {
                                  setDraftSources([...draftSources, src]);
                                }
                              }}
                              className="appearance-none w-4 h-4 rounded-sm cursor-pointer bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 checked:bg-neutral-950 dark:checked:bg-gray-100 checked:border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:focus:ring-offset-[#121214] relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 16 16%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M4 8L7 11L12 5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] dark:before:bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 16 16%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M4 8L7 11L12 5%22 stroke=%22black%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100"
                            />
                            <span>{src}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Sub-Topics (Checkboxes) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono tracking-widest font-black text-neutral-400 dark:text-gray-300 uppercase">SUB-TOPICS</h4>
                    <div className="space-y-2.5">
                      {['Large Language Models', 'Computer Vision', 'Reinforcement Learning', 'Neural Networks'].map(topic => {
                        const isChecked = draftSubTopics.includes(topic);
                        return (
                          <label key={topic} className="flex items-start space-x-2.5 text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setDraftSubTopics(draftSubTopics.filter(t => t !== topic));
                                } else {
                                  setDraftSubTopics([...draftSubTopics, topic]);
                                }
                              }}
                              className="appearance-none w-4 h-4 mt-0.5 shrink-0 rounded-sm cursor-pointer bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 checked:bg-neutral-950 dark:checked:bg-gray-100 checked:border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:focus:ring-offset-[#121214] relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 16 16%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M4 8L7 11L12 5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] dark:before:bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 16 16%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M4 8L7 11L12 5%22 stroke=%22black%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100"
                            />
                            <span className="leading-tight">{topic}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: Attributes (Toggle Switches) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono tracking-widest font-black text-neutral-400 dark:text-gray-300 uppercase">ATTRIBUTES</h4>
                    <div className="space-y-3.5">
                      
                      {/* Includes Code/GitHub Repo */}
                      <div className="flex items-center justify-between text-left gap-2">
                        <span className="text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-300">Includes Code/GitHub Repo</span>
                        <button 
                          type="button"
                          onClick={() => setDraftAttributes(prev => ({ ...prev, hasCode: !prev.hasCode }))}
                          className={`w-9 h-5 rounded-full transition-colors relative duration-200 shrink-0 cursor-pointer outline-none ${
                            draftAttributes.hasCode ? 'bg-neutral-950' : 'bg-neutral-300'
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${
                            draftAttributes.hasCode ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Includes Dataset */}
                      <div className="flex items-center justify-between text-left gap-2">
                        <span className="text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-300">Includes Dataset</span>
                        <button 
                          type="button"
                          onClick={() => setDraftAttributes(prev => ({ ...prev, hasDataset: !prev.hasDataset }))}
                          className={`w-9 h-5 rounded-full transition-colors relative duration-200 shrink-0 cursor-pointer outline-none ${
                            draftAttributes.hasDataset ? 'bg-neutral-950' : 'bg-neutral-300'
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${
                            draftAttributes.hasDataset ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Peer Reviewed Only */}
                      <div className="flex items-center justify-between text-left gap-2">
                        <span className="text-xs font-mono tracking-wide text-neutral-700 dark:text-gray-300">Peer Reviewed Only</span>
                        <button 
                          type="button"
                          onClick={() => setDraftAttributes(prev => ({ ...prev, peerReviewed: !prev.peerReviewed }))}
                          className={`w-9 h-5 rounded-full transition-colors relative duration-200 shrink-0 cursor-pointer outline-none ${
                            draftAttributes.peerReviewed ? 'bg-neutral-950' : 'bg-neutral-300'
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${
                            draftAttributes.peerReviewed ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Footer block */}
                <div className="pt-4 flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-mono font-bold tracking-widest text-neutral-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 uppercase underline transition cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button 
                    type="button"
                    onClick={handleApplyFilters}
                    className="bg-neutral-950 dark:bg-gray-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-md transition-all dark:hover:scale-105 cursor-pointer font-bold"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* RESEARCH ROWS LIST / SEARCH CANVAS SWAP */}
          <div className="space-y-12">
            
            {(!isFocused && !isSearching) ? (
              groupedArticles.length > 0 ? (
                groupedArticles.map((group) => {
                  const expanded = isMonthExpanded(group.headingName);
                  const loadedRemaining = isLoadedRemaining(group.headingName);
                  const maxVisible = loadedRemaining ? group.items.length : 10;
                  const displayedItems = group.items.slice(0, maxVisible);
                  const showLoadRemainingButton = group.items.length > maxVisible;

                  return (
                    <div key={group.headingName} className="space-y-6">
                      
                      {/* Collapsible Monthly Separator Bar (Clickable Accordion Header) */}
                      <div className="pt-6" style={{ marginTop: '32px' }}>
                        <button
                          onClick={() => toggleMonth(group.headingName)}
                          className="w-full pb-2.5 flex items-center justify-start cursor-pointer transition-colors focus:outline-none border-b border-[#E5E7EB] dark:border-white/10"
                          style={{
                            gap: '8px',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <span 
                            style={{
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                              fontSize: '14px',
                              color: isDarkMode ? "#F3F4F6" : "#111",
                            }}
                            className="font-sans uppercase"
                          >
                            {group.headingName}
                          </span>
                          <svg 
                            className={`h-4 w-4 text-[#111] dark:text-[#F3F4F6] transition-transform duration-300 transform ${expanded ? 'rotate-180' : 'rotate-0'}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Accordion Content Block */}
                      {expanded && (
                        <div className="transition-all duration-300">
                          {/* List Rows - Styled as a production-grade strict flush CSS grid */}
                          <div 
                            className="bg-white dark:bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                            style={{
                              gap: '32px',
                            }}
                          >
                            {displayedItems.map((article, idx) => {
                               // Realistic dates for this month's publications
                              const daysList = ['28', '25', '22', '20', '18', '15', '12', '09', '06', '03'];
                              const dayNum = daysList[idx % daysList.length];

                              return (
                                <div 
                                  key={article.id}
                                  onClick={() => onSelectArticle(article)}
                                  className="group bg-white dark:bg-[#1C1C1E] hover:bg-[#F4F4F5] dark:hover:bg-[#22262B] transition-colors duration-200 cursor-pointer text-left flex flex-col"
                                  style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    padding: '24px 20px',
                                    transition: 'background-color 0.2s ease',
                                  }}
                                >


                                  {/* The Date */}
                                  <div 
                                    className="font-sans"
                                    style={{
                                      fontSize: '32px',
                                      fontWeight: 800,
                                      lineHeight: 1,
                                      color: isDarkMode ? "#F3F4F6" : "#111",
                                      marginBottom: '16px',
                                    }}
                                  >
                                    {dayNum}
                                  </div>

                                  {/* The Title */}
                                  <h3 
                                    className="font-sans text-[#111] dark:text-[#F3F4F6]"
                                    style={{
                                      fontSize: '15px',
                                      fontWeight: 600,
                                      lineHeight: 1.4,
                                      marginBottom: '8px',
                                    }}
                                  >
                                    {article.title}
                                  </h3>

                                  {/* The Description */}
                                  <p 
                                    className="font-sans text-[#71717A] dark:text-[#9CA3AF]"
                                    style={{
                                      fontSize: '12px',
                                      lineHeight: 1.4,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 4,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {article.excerpt}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Centered pagination load more button directly below the grid container */}
                          {showLoadRemainingButton && (
                            <div 
                              className="!flex justify-center items-center w-full !my-[64px] clear-both relative z-[100] !visible"
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: '64px',
                                marginBottom: '64px',
                                clear: 'both',
                                position: 'relative',
                                zIndex: 100,
                                visibility: 'visible',
                              }}
                            >
                              <button
                                onClick={() => {
                                  handleLoadRemaining(group.headingName);
                                }}
                                className="hover:bg-[#333] transition duration-200 !bg-[#111] !text-white !rounded-none !shadow-none"
                                style={{
                                  backgroundColor: '#111',
                                  color: '#FFF',
                                  padding: '16px 36px',
                                  borderRadius: '0px',
                                  boxShadow: 'none',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'none';
                                }}
                              >
                                ↓ SEE MORE PAPERS
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center space-y-3 bg-white/40 dark:bg-transparent border border-dashed border-[#e1dacb] rounded-lg">
                  <span className="text-3xl">🔍</span>
                  <p className="text-sm font-mono text-neutral-500 dark:text-[#9CA3AF]">No matching technical research papers found</p>
                </div>
              )
            ) : (
              /* SEARCH CANVAS */
              <div className="w-full animate-fade-in">
                {(isFocused && !isSearching) ? (
                  // Blank Canvas / Search Suggestions
                  <div className="w-full h-full min-h-[400px]" style={{ marginTop: '48px' }}>
                    <h4 className="font-mono text-neutral-400 dark:text-[#9CA3AF]" style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 700 }}>
                      SUGGESTED SEARCHES
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {["Support Vector Machines", "Algorithm Implementations", "Causal Logic Networks", "Dimensionality Reduction"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onMouseDown={(e) => {
                            // Use onMouseDown to prevent the blur event from firing before the click registers
                            e.preventDefault(); 
                            setSearchQuery(suggestion);
                          }}
                          className="bg-transparent border border-[#E5E7EB] dark:border-white/20 rounded-full px-4 py-2 text-[13px] text-[#374151] dark:text-gray-300 hover:bg-[#111827] hover:text-white hover:border-[#111827] dark:hover:bg-white/10 dark:hover:border-white/30 dark:hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : allSubTopicArticles.length > 0 ? (
                  // Flat Grid
                  <div 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '24px',
                      paddingTop: '32px'
                    }}
                  >
                    {allSubTopicArticles.map((article, idx) => {
                      const daysList = ['28', '25', '22', '20', '18', '15', '12', '09', '06', '03'];
                      const dayNum = daysList[idx % daysList.length];

                      return (
                        <div 
                          key={article.id}
                          onClick={() => onSelectArticle(article)}
                          className="group bg-white dark:bg-[#1C1C1E] hover:bg-[#F4F4F5] dark:hover:bg-[#22262B] transition-colors duration-200 cursor-pointer text-left flex flex-col"
                          style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            padding: '24px 20px',
                            transition: 'background-color 0.2s ease',
                          }}
                        >

                          
                          <div 
                            className="font-sans"
                            style={{
                              fontSize: '32px',
                              fontWeight: 800,
                              lineHeight: 1,
                              color: isDarkMode ? "#F3F4F6" : "#111",
                              marginBottom: '16px',
                            }}
                          >
                            {dayNum}
                          </div>

                          <h3 
                            className="font-sans text-[#111] dark:text-[#F3F4F6]"
                            style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              lineHeight: 1.4,
                              marginBottom: '8px',
                            }}
                          >
                            {article.title}
                          </h3>

                          <p 
                            className="font-sans text-[#71717A] dark:text-[#9CA3AF]"
                            style={{
                              fontSize: '12px',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '24px',
                              flexGrow: 1,
                            }}
                          >
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-[#71717A] dark:text-[#9CA3AF]" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span className="font-mono">{getArticleSource(article.id)}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-black transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // No Results
                  <div className="w-full pt-8">
                    <div className="py-20 text-center space-y-3 bg-white/40 dark:bg-transparent border border-dashed border-[#e1dacb] rounded-lg">
                      <span className="text-3xl">🔍</span>
                      <p className="text-sm font-mono text-neutral-500 dark:text-[#9CA3AF]">No matching technical research papers found</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* BRUTALIST TECHNICAL FOOTER */}
        <footer className="mt-auto p-8 bg-[#141619] text-[#b8b3a9] border-t border-[#292c30]">
          <div className="space-y-6">
            <div className="border-t border-[#31353a] w-full"></div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-mono font-black tracking-widest text-[#fbfaf8] uppercase italic">
                  ZID*
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-gray-300 uppercase mt-1">
                  curated microscale research hub & terminal insights for absolute builders
                </p>
              </div>
              <div className="text-[10px] font-serif italic text-neutral-400 dark:text-[#9CA3AF] max-w-xs sm:text-right">
                "Deterministic state correctness under compile stress is ZID system policy."
              </div>
            </div>
            <div className="pt-4 border-t border-[#2d3136] text-[9px] font-mono uppercase tracking-widest flex flex-col sm:flex-row justify-between text-neutral-500 dark:text-[#9CA3AF] gap-2">
              <span>© {new Date().getFullYear()} ZID RESEARCH INDEX. ALL RIGHTS RESERVED.</span>
              <span>ESTABLISHED MAY 2026</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

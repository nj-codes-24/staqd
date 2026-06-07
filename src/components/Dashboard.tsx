/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  UploadCloud,
  SlidersHorizontal,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SubscriptionModal from './SubscriptionModal';
import { useTheme } from '../contexts/ThemeContext';
import { User } from 'lucide-react';
import AuthModal from './AuthModal';
import { UserProfile, Article } from '../types';
import { INITIAL_USER, KNOWLEDGE_HUB_DATA } from '../data';
import BookmarkButton from './BookmarkButton';
import { useUser } from '../contexts/UserContext';
import Logo from './Logo';

const getArticleSource = (articleId: string) => {
  const sources = ['arXiv', 'IEEE Spec', 'Nature Portfolio', 'MIT Tech Review', 'ACM Library', 'ScienceDirect'];
  const hash = articleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sources[hash % sources.length];
};

interface DashboardProps {
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  onSelectArticle: (article: Article) => void;
  articles: Article[];
  onToggleBookmark: (articleId: string) => void;
  onViewSubTopicAll?: (subTopic: string) => void;
  onStartProcessing: (newArticle: Article) => void;
  setIsEditingProfile: (val: boolean) => void;
}

export default function Dashboard({ 
  activeTab, 
  setActiveTab, 
  onSelectArticle, 
  articles,
  onToggleBookmark,
  onViewSubTopicAll,
  onStartProcessing,
  setIsEditingProfile
}: DashboardProps) {
  const { user, updateUser, getInitials } = useUser();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Computer Sciences');
  const [isSearching, setIsSearching] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const defaultFilters = {
    sortBy: 'Relevance',
    publishers: [] as string[],
    subTopics: [] as string[],
    attributes: {
      'Includes Code': false,
      'Includes Dataset': false
    }
  };
  const [filters, setFilters] = useState(defaultFilters);
  

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isCheckRevealed, setIsCheckRevealed] = useState(false);

  // Custom Paper Upload Feature States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthGuardedAction = (actionFn: () => void) => {
    if (isAuthenticated) {
      actionFn();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement> | null = null) => {
    setIsUploadModalOpen(false);
    
    let file: File | null = null;
    if (e) {
      if ('dataTransfer' in e && e.dataTransfer.files.length > 0) {
        file = e.dataTransfer.files[0];
      } else if ('target' in e) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          file = target.files[0];
        }
      }
    }
    
    const fallbackText = `NEURAL SOURCING STRUCTURES & CRYPTOGRAPHIC HALLMARK REGISTRIES IN SUSTAINABLE JEWELRY MANUFACTURING

Abstract
This paper explores the intersection of high-frequency assay diagnostic laboratories and decentralized ledger protocols to establish immutable sourcing chains in the fine jewelry sector. By combining localized XRF spectrometry with block-by-block verification, we eliminate supply chain vulnerabilities, bypassing traditional certification bottlenecks and ensuring complete ethical compliance.

1. Introduction
The global jewelry supply chain has historically suffered from opaque sourcing, particularly concerning conflict minerals and unverified carat density metrics. Consumers and regulatory bodies increasingly demand absolute transparency. Traditional paper-based certification, such as the Kimberley Process certificates, are prone to forgery, loss, and delays. 

In response, we propose a Neural Sourcing Structure (NSS)—a hybrid framework utilizing machine learning algorithms to predict supply chain bottlenecks, coupled with a Cryptographic Hallmark Registry (CHR) that records real-time assay testing data onto a secure ledger.

2. Operational Strategies: Gold Purity Assay & Labs
Recent research highlights that securing gold pureness metrics demands a structured, end-to-end trace mechanism. Assay diagnostic laboratories increasingly leverage advanced high-frequency spectrometers on the operational floor. 

By validating metal compositions dynamically prior to custom shaping, companies can successfully bypass expensive middleman certification bottlenecks. These high-frequency devices use X-ray fluorescence (XRF) to analyze the elemental composition of alloys non-destructively.

The data generated from each XRF scan is immediately hashed and pushed to the CHR. This ensures that the exact purity percentage—down to the decimal—is permanently attached to the specific batch of raw material before it even reaches the crucible.

3. Sourcing Ethics & The Kimberley Process Traceability
Ethical logistics protocols must rigidly adhere to standard international governance guidelines. Implementing block-by-block ledger verification secures diamond provenance, totally preventing conflict gemstones from entering retail pipelines. 

Our operational model integrates a centralized digital certificate track that maps Kimberley invoices with active carat density certifications. Such strategies shield brands from systemic sourcing vulnerabilities while guaranteeing uncompromised product authenticity.

4. Implementation of the Cryptographic Hallmark Registry
The CHR is designed as a permissioned blockchain. Only vetted assay laboratories and certified wholesale suppliers are granted writing privileges. When a batch of rough diamonds is processed, the system generates a unique non-fungible token (NFT) representing the physical asset.

As the gemstone moves from the cutter to the setter to the final retail display, the token is transferred across the network. Retailers can eventually provide end-consumers with a QR code. Scanning this code reveals the entire lifecycle of the piece, from the exact mine of origin to the date of the final polish.

5. Machine Learning in Supply Chain Optimization
The "Neural" aspect of our proposed structure involves predictive modeling. By analyzing years of logistical data, shipping delays, and assay testing times, our neural network can predict the optimal routing for raw materials.

For example, if a specific assay lab in Antwerp is experiencing a backlog, the system automatically reroutes shipments to an available facility in Mumbai, factoring in shipping costs, insurance premiums, and turnaround times. This reduces the overall time-to-market by an estimated 14%.

6. Consumer Trust and the Verification Interface
Enhancing customer engagement hinges on absolute corporate transparency. Discerning clientele require vetted proof of hallmark credentials before finalizing transactions. Clearly displaying gold assays, Kimberley certifications, and carat metrics inside custom jewelry concierge dashboards significantly advances buyer trust index ratings.

Future developments aim to empower buyers with direct QR scans of the assay certificate log, establishing a direct emotional link between custom craftsmanship, material authenticity, and ethical production values.

7. Conclusion
The integration of Neural Sourcing Structures and Cryptographic Hallmark Registries represents a paradigm shift in jewelry manufacturing. It transforms a historically opaque industry into a model of transparency and efficiency.

8. References
[1] Moss, E. (2025). Decentralized Ledgers in Luxury Goods. Journal of Supply Chain Tech.
[2] Chen, L. & Smith, R. (2024). XRF Spectrometry in Modern Assaying. Metallurgy Today.
[3] The Kimberley Process Certification Scheme: A Review. (2023). Global Trade Reports.
[4] AI Routing Protocols. (2026). Logistics Weekly.`;
    const docUrl = file ? URL.createObjectURL(file) : "data:text/plain;charset=utf-8," + encodeURIComponent(fallbackText);
    
    const newArticle: Article = {
      id: `custom-paper-${Date.now()}`,
      title: file ? file.name : "mock_document.txt",
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
      isBookmarked: true,
      documentUrl: docUrl
    };
    
    onStartProcessing(newArticle);
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
    <div id="magazine-mockup-wrapper" className="min-h-screen bg-[#ded9cf] dark:bg-[#09090B] md:py-8 font-sans antialiased text-[#1c1c1c] dark:text-[#F3F4F6] selection:bg-[#c2b29f]">
      
      {/* Behance Presentation Header bar */}
      <div className="hidden md:flex max-w-[1240px] mx-auto items-center justify-between px-6 py-2.5 text-[10px] font-mono tracking-widest text-[#605a50] dark:text-[#9CA3AF] border-[#ccc5b6] mb-4">
        <span>01 / CORE WORKSPACE</span>
        <span className="uppercase text-center"><span className="font-sans font-black tracking-[0.2em] whitespace-nowrap">[ STΛQD ]</span> TECHNICAL HUD</span>
        <span className="uppercase">Design Concept V1</span>
      </div>

      {/* Main Container Sheet - Reclaiming Left Sidebar Space Completely */}
      <div 
        id="magazine-page-sheet" 
        className="max-w-[1240px] mx-auto w-full bg-[#fbfaf8] dark:bg-[#121214] shadow-2xl flex flex-col relative border border-[#c2bba8] dark:border-[rgba(255,255,255,0.08)] min-h-screen transition-all duration-300"
      >
        
        {/* Main Dashboard Navigation Header */}
        <header className="h-16 border-b border-[#ece8df] dark:border-[rgba(255,255,255,0.08)] px-6 md:px-10 flex items-center justify-between sticky top-0 bg-[#fbfaf8] dark:bg-[#121214]/95 backdrop-blur-md z-50 relative transition-colors">
          
          {/* Logo element replacement - FLANELLE converted to [ STAQD ] */}
          <div className="flex-1 flex items-center justify-start relative z-10">
            <Logo />
          </div>

          {/* Top navigation - limited strictly to "Knowledge Hub" */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8 text-[11px] font-mono uppercase tracking-widest z-0">
            <button 
              className="transition relative py-2 text-black dark:text-white font-bold border-b-2 border-black dark:border-white"
            >
              Knowledge Hub
            </button>
          </nav>

          {/* Far Right widgets */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6 relative z-10">
            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 hover:rotate-12 cursor-pointer"
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2 rounded-full border border-neutral-300 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-neutral-800 dark:text-white cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="px-6 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105 text-[11px] font-mono uppercase tracking-[0.2em] font-bold cursor-pointer"
                >
                  Subscribe
                </button>
                <div 
                  onClick={() => {
                    setActiveTab('profile');
                    setIsEditingProfile(false);
                  }}
                  className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-700 flex items-center justify-center cursor-pointer overflow-hidden relative hover:scale-105 transition-transform"
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.handle || 'Profile'} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        {/* HERO TITLE SECTION */}
        <div className="pt-12 pb-8 border-b border-[#ece8df] dark:border-[rgba(255,255,255,0.08)]">
          <h1 className="font-serif font-black text-center text-neutral-950 dark:text-gray-100 uppercase leading-none tracking-tight select-none px-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8vw] transition-all duration-300">
            KNOWLEDGE HUB
          </h1>
        </div>

        {/* KNOWLEDGE HUB VIEW STAGE */}
        <>
            <div className="flex-1 flex flex-col">
                
                {/* CATEGORY SELECTOR + FILTER TRIGGER ROW */}
                <div className="border-b border-[#ece8df] dark:border-[rgba(255,255,255,0.08)] py-4 px-6 md:px-10 flex items-center justify-between bg-[#faf9f6]/40 dark:bg-transparent relative z-[50]">
                  
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
                                      ? 'bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-black border-[#1a1a1a] dark:border-gray-100' 
                                      : 'bg-transparent text-[#7c7569] dark:text-gray-400 border-[#e1dacb] dark:border-white/10 hover:border-[#1a1a1a] hover:text-black dark:hover:text-white dark:bg-transparent'
                                  }`}
                                >
                                  {cat}
                                </button>
                              );
                            })}
                        </motion.div>
                        
                        <div className="bg-[#fbfaf8] dark:bg-[#121214] flex items-center justify-end flex-shrink-0 z-20 w-[40px]">
                          <button 
                            key="search-btn"
                            onClick={() => setIsSearching(true)}
                            className="flex items-center justify-center w-8 h-8 text-black dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white rounded-full transition-all cursor-pointer border-none"
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
                        className="w-full relative z-50 flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      >
                        <div className="flex-grow flex items-center bg-white dark:bg-[#1C1C1E] border border-transparent rounded-full px-5 h-[42px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                          <Search className="w-4 h-4 text-neutral-400 mr-3" />
                          <input 
                            type="text"
                            placeholder="Search papers by title, topic, or publisher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm font-sans placeholder-neutral-400 dark:placeholder-gray-400 text-neutral-900 dark:text-gray-100"
                            autoFocus
                          />
                          <button 
                            onClick={() => {
                              setSearchQuery('');
                              setIsSearching(false);
                              setIsFilterOpen(false);
                            }}
                            className="text-neutral-500 dark:text-[#9CA3AF] hover:text-neutral-900 dark:text-gray-100 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <AnimatePresence>
                          {searchQuery.trim().length > 0 && (
                            <motion.button 
                              initial={{ opacity: 0, x: 10, width: 0, marginLeft: 0 }}
                              animate={{ opacity: 1, x: 0, width: 120, marginLeft: 16 }}
                              exit={{ opacity: 0, x: 10, width: 0, marginLeft: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              onClick={() => setIsFilterOpen(!isFilterOpen)}
                              className={`flex items-center justify-center space-x-2 h-[42px] rounded-full transition-colors text-sm font-medium shadow-sm flex-shrink-0 border overflow-hidden whitespace-nowrap cursor-pointer ${
                                isFilterOpen 
                                  ? 'bg-[#111827] text-white dark:bg-white/10 dark:text-white border-[#111827] dark:border-white/20' 
                                  : 'bg-white dark:bg-white/5 text-[#111827] dark:text-gray-300 border-[#E5E7EB] dark:border-white/20 hover:bg-[#F9FAFB] dark:hover:bg-white/10 dark:hover:text-white'
                              }`}
                            >
                              <SlidersHorizontal size={14} strokeWidth={2} />
                              <span>Filter</span>
                            </motion.button>
                          )}
                        </AnimatePresence>

                        {/* MEGA PANEL DROPDOWN */}
                        <AnimatePresence>
                          {isFilterOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 w-full z-[9999] flex flex-col overflow-hidden bg-[#F9FAFB] dark:bg-[#121214]/80 backdrop-blur-[16px] border border-[#E5E7EB] dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.6)] rounded-[16px]"
                              style={{ 
                                top: 'calc(100% + 16px)'
                              }}
                            >
                              <div className="p-8 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                  {/* SORT BY */}
                                  <div>
                                    <h3 className="text-[#9CA3AF] text-[11px] font-sans font-bold tracking-[0.1em] uppercase mb-6">Sort By</h3>
                                    <div className="space-y-4">
                                      {['Relevance', 'Newest First', 'Most Cited'].map(option => (
                                          <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                                            <input 
                                              type="radio" 
                                              name="sortBy"
                                              className="hidden"
                                              checked={filters.sortBy === option}
                                              onChange={() => setFilters({ ...filters, sortBy: option })}
                                            />
                                            <div className="w-4 h-4 rounded-full border border-[#D1D5DB] dark:border-white/30 dark:bg-white/5 flex items-center justify-center group-hover:border-[#111827] dark:group-hover:border-white transition-colors">
                                              {filters.sortBy === option && <div className="w-2 h-2 rounded-full bg-[#111827] dark:bg-white" />}
                                            </div>
                                            <span className={`text-[13px] font-mono transition-colors ${filters.sortBy === option ? 'text-[#111827] dark:text-white font-bold' : 'text-[#374151] dark:text-gray-400'}`}>{option}</span>
                                          </label>
                                      ))}
                                    </div>
                                  </div>

                                  {/* PUBLISHER / SOURCE */}
                                  <div>
                                    <h3 className="text-[#9CA3AF] text-[11px] font-sans font-bold tracking-[0.1em] uppercase mb-6">Publisher / Source</h3>
                                    <div className="space-y-4">
                                      {['arXiv', 'IEEE', 'Nature', 'ScienceDirect'].map(option => {
                                        const isChecked = filters.publishers.includes(option);
                                        return (
                                        <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                                          <input 
                                            type="checkbox"
                                            className="hidden"
                                            checked={isChecked}
                                            onChange={() => {
                                              const newPublishers = isChecked 
                                                ? filters.publishers.filter(p => p !== option) 
                                                : [...filters.publishers, option];
                                              setFilters({ ...filters, publishers: newPublishers });
                                            }}
                                          />
                                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#111827] dark:bg-white border-[#111827] dark:border-white text-white dark:text-black' : 'border-[#D1D5DB] dark:border-white/30 dark:bg-white/5 group-hover:border-[#111827] dark:group-hover:border-white'}`}>
                                            {isChecked && <Check size={12} color="currentColor" strokeWidth={3} />}
                                          </div>
                                          <span className={`text-[13px] font-mono transition-colors ${isChecked ? 'text-[#111827] dark:text-white font-bold' : 'text-[#374151] dark:text-gray-400'}`}>{option}</span>
                                        </label>
                                      )})}
                                    </div>
                                  </div>

                                  {/* SUB-TOPICS */}
                                  <div>
                                    <h3 className="text-[#9CA3AF] text-[11px] font-sans font-bold tracking-[0.1em] uppercase mb-6">Sub-Topics</h3>
                                    <div className="space-y-4">
                                      {['Computer Sciences', 'Electrical', 'Mechanical', 'Aerospace'].map(option => {
                                        const isChecked = filters.subTopics.includes(option);
                                        return (
                                        <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                                          <input 
                                            type="checkbox"
                                            className="hidden"
                                            checked={isChecked}
                                            onChange={() => {
                                              const newSubTopics = isChecked 
                                                ? filters.subTopics.filter(t => t !== option) 
                                                : [...filters.subTopics, option];
                                              setFilters({ ...filters, subTopics: newSubTopics });
                                            }}
                                          />
                                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#111827] dark:bg-white border-[#111827] dark:border-white text-white dark:text-black' : 'border-[#D1D5DB] dark:border-white/30 dark:bg-white/5 group-hover:border-[#111827] dark:group-hover:border-white'}`}>
                                            {isChecked && <Check size={12} color="currentColor" strokeWidth={3} />}
                                          </div>
                                          <span className={`text-[13px] font-mono transition-colors ${isChecked ? 'text-[#111827] dark:text-white font-bold' : 'text-[#374151] dark:text-gray-400'}`}>{option}</span>
                                        </label>
                                      )})}
                                    </div>
                                  </div>

                                  {/* ATTRIBUTES */}
                                  <div>
                                    <h3 className="text-[#9CA3AF] text-[11px] font-sans font-bold tracking-[0.1em] uppercase mb-6">Attributes</h3>
                                    <div className="space-y-5">
                                      {['Includes Code', 'Includes Dataset'].map((asset) => {
                                          const isChecked = filters.attributes[asset as keyof typeof filters.attributes];
                                          return (
                                          <label key={asset} className="flex items-center justify-between cursor-pointer group">
                                            <input 
                                              type="checkbox"
                                              className="hidden"
                                              checked={isChecked}
                                              onChange={() => {
                                                setFilters({
                                                  ...filters,
                                                  attributes: {
                                                    ...filters.attributes,
                                                    [asset]: !isChecked
                                                  }
                                                });
                                              }}
                                            />
                                            <span className={`text-[13px] font-mono transition-colors ${isChecked ? 'text-[#111827] dark:text-white font-bold' : 'text-[#374151] dark:text-gray-400'}`}>{asset}</span>
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isChecked ? 'bg-[#111827] dark:bg-white' : 'bg-[#D1D5DB] dark:bg-white/10'}`}>
                                              <div className={`absolute top-0.5 w-3 h-3 rounded-full shadow-sm transition-all ${isChecked ? 'right-0.5 bg-white dark:bg-gray-900' : 'left-0.5 bg-white dark:bg-gray-400'}`} />
                                            </div>
                                          </label>
                                      )})}
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t border-[#E5E7EB] pt-6 mt-6 flex justify-between items-center">
                                  <button 
                                    onClick={() => setFilters(defaultFilters)}
                                    className="text-[11px] font-mono uppercase underline text-[#9CA3AF] hover:text-[#374151] transition-colors"
                                  >
                                    Clear All
                                  </button>
                                  <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="px-6 py-2.5 bg-[#111827] dark:bg-gray-100 text-white dark:text-black rounded-full font-sans font-bold text-[11px] uppercase hover:bg-black dark:hover:bg-white transition-all dark:hover:scale-105"
                                  >
                                    Apply Filters
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MAIN CONTENT SPACE - POPULATE BY SELECTED CATEGORY'S SUB-TOPICS OR SEARCH */}
                <div 
                  className={`flex-1 divide-y-2 divide-[#ece8df]/70 relative flex flex-col z-[1] ${
                    searchQuery.trim().length > 0 && searchResults && searchResults.length === 0 
                      ? 'h-[calc(100vh-160px)] overflow-hidden' 
                      : 'min-h-[calc(100vh-160px)]'
                  }`}
                >
                  
                  {/* The Solid Overlay for Search Focus Mode */}
                  <AnimatePresence>
                    {isSearching && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-40 bg-[#fbfaf8] dark:bg-[#121214]"
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
                        className="relative z-50 w-full flex-1 flex flex-col"
                      >
                        {!searchQuery.trim() ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-[40px] px-6 md:px-10 w-full grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12"
                          >
                            {/* Left Column: Trending */}
                            <div>
                              <h3 className="text-[#9CA3AF] dark:text-gray-400 text-[10px] font-sans font-bold tracking-[0.3em] uppercase mb-8 text-left">
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
                                    className="text-left font-serif text-lg md:text-xl text-neutral-600 hover:text-black dark:text-gray-100 dark:hover:text-white transition-all duration-200 hover:pl-4 hover:bg-black/5 dark:hover:bg-white/5 py-2 -my-2 rounded-r"
                                  >
                                    <span className="text-neutral-400 mr-4 font-sans text-sm">↳</span>
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Right Column: Discover */}
                            <div className="hidden md:block pr-8 lg:pr-20">
                              <h3 className="text-[#9CA3AF] dark:text-gray-400 text-[10px] font-sans font-bold tracking-[0.3em] uppercase mb-8 text-left">
                                DISCOVER
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                {articles.slice(0, 2).map((article, idx) => (
                                  <div 
                                    key={article.id}
                                    onClick={() => onSelectArticle(article)}
                                    className="group bg-[#fcfcfb] dark:bg-[#1C1C1E] flex flex-col cursor-pointer border border-neutral-200 dark:border-[rgba(255,255,255,0.08)] transition-colors hover:border-neutral-300 dark:border-[rgba(255,255,255,0.08)] h-full p-5 relative"
                                  >
                                    <div className="w-[24px] h-[3px] bg-black mb-4" />
                                    
                                    <div className="font-serif font-black text-4xl text-neutral-200 leading-none mb-3 tracking-tighter">
                                      {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    
                                    <h4 className="text-[13px] font-bold text-neutral-900 dark:text-gray-100 line-clamp-3 leading-snug mb-3 pr-2">
                                      {article.title}
                                    </h4>
                                    
                                    <p className="text-[10px] text-[#6B7280] font-sans tracking-widest uppercase mt-auto">
                                      {article.readTime}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ) : searchResults && searchResults.length > 0 ? (
                          <div className="p-6 md:p-10">
                            <h2 className="text-sm md:text-base font-serif font-black uppercase text-[#1a1a1a] dark:text-gray-100 tracking-wider border-l-4 border-amber-800/80 dark:border-white pl-3 mb-6">
                              Search Results for "{searchQuery}"
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {searchResults.map((article) => (
                                <div 
                                  key={article.id}
                                  onClick={() => onSelectArticle(article)}
                                  className="group bg-white dark:bg-[#1C1C1E] rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] cursor-pointer h-full border border-neutral-100 dark:border-white/5"
                                >
                                  <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-[#27272A] relative">
                                    {article.imageUrl ? (
                                      <img className="dark:brightness-90 transition-all duration-300 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103" 
                                        src={article.imageUrl} 
                                        alt={article.title}
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center border border-white/5 group-hover:scale-103 transition-transform duration-500 ease-out">
                                        <span className="text-[40px] font-sans font-black text-white/5 uppercase tracking-widest whitespace-nowrap">[ STΛQD ]</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-5 flex-1 flex flex-col space-y-3">
                                    <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                                      <span>{getArticleSource(article.id)}</span>
                                      <span>{article.readTime}</span>
                                    </div>
                                    <h3 className="text-[14px] md:text-[15px] font-sans font-bold text-[#1c1c1c] dark:text-gray-100 leading-tight line-clamp-3">
                                      {article.title}
                                    </h3>
                                    <div className="mt-auto pt-3">
                                      <p className="text-[11px] font-serif text-neutral-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                        {article.excerpt}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : searchQuery.trim().length > 0 && searchResults && searchResults.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '80px', paddingBottom: '80px', flexGrow: 1, position: 'relative', overflow: 'hidden', paddingLeft: '24px', paddingRight: '24px' }}>
                            <label 
                              className={`group flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 w-full max-w-lg mx-auto ${
                                isDragActive 
                                  ? 'border-[#4b3e33] bg-[#F9FAFB] dark:bg-white/10 dark:border-white/40 scale-[1.02]' 
                                  : 'border-[#e5e7eb] dark:border-white/20 bg-white dark:bg-white/5 hover:border-[#4b3e33] dark:hover:border-white/30 hover:bg-[#F9FAFB] dark:hover:bg-white/10'
                              }`}
                              style={{ border: '2px dashed', borderRadius: '24px', padding: '64px 48px' }}
                              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); }}
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); handleFileUpload(e); }}
                            >
                              <input type="file" accept=".pdf,.txt,.pptx" className="hidden" onChange={handleFileUpload} />
                              
                              <div className="bg-[#f3f4f6] dark:bg-[#27272A] rounded-full p-5 mb-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                                <UploadCloud size={32} className="text-[#4b3e33] dark:text-white" strokeWidth={2} />
                              </div>
                              
                              <h3 className="font-sans font-medium text-[20px] text-[#4b3e33] dark:text-gray-300 leading-tight mb-2">
                                Click or drag paper here
                              </h3>
                              <p className="text-[#9CA3AF] dark:text-gray-400 text-[14px] font-normal tracking-wide">
                                Supports PDF, TXT, PPTX
                              </p>
                            </label>
                          </div>
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sub Topics (Hidden during search to prevent phantom scroll) */}
                  <div className={`relative z-0 h-full ${isSearching ? 'hidden' : 'block'}`}>
                    {currentSubTopics.length > 0 ? (
                      currentSubTopics.map((subTopic, sIdx) => {
                        const featured = subTopic.featuredArticle;
                        const carousel = subTopic.carouselArticles;
                        const allArticles = [featured, ...carousel];

                        return (
                          <div key={`${subTopic.name}-${sIdx}`} className="p-6 md:p-10 space-y-6 text-left">
                            
                            {/* Sub-topic Section Title Header */}
                            <div className="flex items-center justify-between">
                              <h2 className="text-sm md:text-base font-serif font-black uppercase text-[#1a1a1a] dark:text-gray-100 tracking-wider border-l-4 border-amber-800/80 dark:border-amber-500 pl-3">
                                {subTopic.name}
                              </h2>
                              <button 
                                onClick={() => onViewSubTopicAll?.(subTopic.name)}
                                className="text-[10px] font-mono uppercase tracking-widest text-[#7c7569] dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors cursor-pointer font-bold"
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
                                    className="group w-[280px] sm:w-[320px] bg-white dark:bg-[#1C1C1E] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left flex-shrink-0 snap-start transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] cursor-pointer"
                                  >
                                    {/* Thumbnail */}
                                    <div 
                                      className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-[#27272A] relative"
                                    >
                                      {article.imageUrl ? (
                                        <img className="dark:brightness-90 transition-all duration-300 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103" 
                                          src={article.imageUrl} 
                                          alt={article.title}
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center border border-white/5 group-hover:scale-103 transition-transform duration-500 ease-out">
                                          <span className="text-[40px] font-sans font-black text-white/5 uppercase tracking-widest whitespace-nowrap">[ STΛQD ]</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Title / Description & Widgets */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                                          <span>{getArticleSource(article.id)} • {article.author.name}</span>
                                          <span>{article.publishedAt}</span>
                                        </div>
                                        <h4 
                                          className="text-xs sm:text-sm font-serif font-black text-neutral-900 dark:text-gray-100 group-hover:text-amber-900 leading-normal sm:leading-relaxed transition-colors"
                                        >
                                          {article.title}
                                        </h4>
                                        <p className="text-[11px] font-serif text-neutral-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                          {article.excerpt}
                                        </p>
                                      </div>

                                      {/* Bottom widgets bar */}
                                      <div className="pt-3 border-t border-[#ece8df] dark:border-[rgba(255,255,255,0.08)]/60 flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-auto">
                                        <span>{article.readTime}</span>
                                        <div className="-mr-1">
                                          <BookmarkButton article={article} size={14} onSaveAuthError={() => setIsAuthModalOpen(true)} />
                                        </div>
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
                        <p className="text-sm font-mono text-[#7c7569] dark:text-[#9CA3AF]">No sub-topics are defined currently for {selectedCategory}.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            {/* FAB Trigger for Custom Paper Upload */}
            <button 
              onClick={() => handleAuthGuardedAction(() => setIsUploadModalOpen(true))}
              className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-white dark:bg-white/5 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-white transition-all duration-300 ease-out hover:bg-white dark:hover:bg-white/5 dark:hover:border-white/60 hover:scale-110 dark:hover:shadow-[inset_0_0_2px_rgba(255,255,255,0.2)] dark:hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] active:scale-95 group"
            >
              <Plus size={32} strokeWidth={2} className="dark:text-white/80 dark:group-hover:text-white transition-all duration-300 ease-out" />
            </button>

            {/* Custom Paper Upload Modal */}
            <AnimatePresence>
              {isUploadModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF7F2]/60 dark:bg-black/60 backdrop-blur-md"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] backdrop-blur-xl rounded-[32px] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-white dark:border-white/10"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-serif font-bold uppercase text-slate-900 dark:text-gray-100 tracking-tight">Upload Document</h2>
                      <p className="text-stone-500 dark:text-gray-400 font-medium text-sm mt-2">Drag and drop your PDF or paper to generate a study session.</p>
                    </div>

                    <div 
                      className={`group w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-white/10 dark:border-gray-300' : 'border-stone-300 dark:border-white/20 dark:bg-white/5 bg-stone-50/50 hover:bg-stone-100/50 dark:hover:bg-white/10 dark:hover:border-gray-300 hover:border-stone-400'}`}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); handleFileUpload(); }}
                      onClick={handleFileUpload}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`p-4 rounded-full mb-4 transition-all duration-200 group-hover:scale-105 ${isDragActive ? 'bg-indigo-100 text-indigo-600 dark:bg-[#27272A] dark:text-white scale-105' : 'bg-stone-200/50 text-stone-500 dark:bg-[#27272A] dark:text-white'}`}>
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-stone-600 dark:text-gray-300 font-medium text-sm">
                        {isDragActive ? "Drop file to upload" : "Click or drag paper here"}
                      </p>
                      <p className="text-stone-400 dark:text-gray-400 text-xs mt-1">Supports PDF, DOCX, TXT</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>


        {/* BRUTALIST TECHNICAL FOOTER */}
        <footer className="mt-auto p-8 bg-[#141619] text-[#b8b3a9] border-t border-[#292c30]">
          <div className="space-y-6">
            
            <div className="border-t border-[#31353a] w-full"></div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-sans font-black tracking-widest text-[#fbfaf8] uppercase italic whitespace-nowrap">
                  [ STΛQD ]*
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mt-1">
                  curated microscale research hub & terminal insights for absolute builders
                </p>
              </div>

              <div className="text-[10px] font-serif italic text-neutral-400 max-w-xs sm:text-right">
                "Deterministic state correctness under compile stress is <span className="font-sans font-black tracking-[0.1em] whitespace-nowrap">[ STΛQD ]</span> system policy."
              </div>
            </div>

            <div className="pt-4 border-t border-[#2d3136] text-[9px] font-mono uppercase tracking-widest flex flex-col sm:flex-row justify-between text-neutral-500 dark:text-[#9CA3AF] gap-2">
              <span>© {new Date().getFullYear()} <span className="font-sans font-black tracking-[0.1em] whitespace-nowrap">[ STΛQD ]</span> RESEARCH INDEX. ALL RIGHTS RESERVED.</span>
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
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={(isSignup) => {
            setIsAuthenticated(true);
            if (isSignup) {
              const authName = localStorage.getItem('authName') || 'MEMBER';
              updateUser(user ? {
                ...user,
                name: authName,
                bio: '',
                avatarUrl: ''
              } : {
                ...INITIAL_USER,
                name: authName,
                bio: '',
                avatarUrl: ''
              });
              setActiveTab('profile');
              setIsEditingProfile(false); // Make sure modal does NOT auto-open
            } else {
              setActiveTab('hud');
            }
          }}
        />

      </div>
    </div>
  );
}

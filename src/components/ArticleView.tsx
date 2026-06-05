/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bookmark, 
  ThumbsUp, 
  Share2, 
  Heart,
  BookOpen,
  Calendar,
  Compass,
  BookMarked,
  User,
  LogOut,
  Clock,
  Menu,
  ChevronLeft,
  ChevronRight,
  Github,
  Award,
  Send,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Play,
  Pause,
  ArrowRight,
  Volume2,
  RotateCcw,
  FileText,
  Flame,
  Activity,
  Layers,
  Bot,
  Maximize2,
  Plus,
  SkipForward,
  SkipBack,
  Mail,
  Phone,
  Tag,
  Search,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  VolumeX,
  X,
} from 'lucide-react';
import { Article, UserProfile } from '../types';
import BookmarkButton from './BookmarkButton';
import { useBookmark } from '../contexts/BookmarkContext';

interface ArticleViewProps {
  article: Article;
  user: UserProfile;
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  onBack: () => void;
  onToggleBookmark: (articleId: string) => void;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface CueCardItem {
  id: number;
  term: string;
  desc: string;
  status: string;
  colorName: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  tagColor: string;
  icon: React.ComponentType<any>;
}

export default function ArticleView({ 
  article, 
  user, 
  activeTab, 
  setActiveTab, 
  onBack, 
  onToggleBookmark,
  onLogout 
}: ArticleViewProps) {
  // Volume state
  const [volumeVal, setVolumeVal] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const { saveUpload, uploadedArticles } = useBookmark();
  const isUploadedDocument = article.id.startsWith('custom-paper');
  const hasSavedUpload = uploadedArticles.some(a => a.id === article.id);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(article.title);
  const [modalDesc, setModalDesc] = useState(article.excerpt);

  const handleConfirmSave = () => {
    saveUpload({
      ...article,
      title: modalTitle,
      excerpt: modalDesc
    });
    setShowSaveModal(false);
  };


  // Sleek audio player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<string>('1.0x');
  const [audioProgress, setAudioProgress] = useState<number>(36);

  // Cue Cards Horizontal Scroll Ref
  const cueCardsScrollRef = useRef<HTMLDivElement>(null);
  
  // Custom stacked card system index
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Audio chapter tracklist details
  const chapters = [
    { title: "Chapter 1: Metal Sourcing & Fineness", duration: "03:15", startSec: 0, endSec: 195 },
    { title: "Chapter 2: Spectroscopic Testing Methodologies", duration: "04:30", startSec: 195, endSec: 465 },
    { title: "Chapter 3: Kimberley Process Ledger Trace", duration: "03:35", startSec: 465, endSec: 680 },
    { title: "Chapter 4: Customer Dashboard Integration Specs", duration: "04:10", startSec: 680, endSec: 930 }
  ];

  // Helper to get active chapter index based on audio progress (totalDurationSeconds = 930)
  const totalDurationSeconds = 930; // 15:30
  const getChapterIndexFromProgress = (progress: number) => {
    const elapsed = (progress / 100) * totalDurationSeconds;
    const idx = chapters.findIndex(ch => elapsed >= ch.startSec && elapsed <= ch.endSec);
    return idx !== -1 ? idx : 0;
  };

  const currentChapterIdx = getChapterIndexFromProgress(audioProgress);

  const selectChapter = (index: number) => {
    const startPercent = Math.round((chapters[index].startSec / totalDurationSeconds) * 100);
    setAudioProgress(startPercent);
    setIsPlaying(true);
    triggerToast(`Playing chapter: ${chapters[index].title.split(': ')[1] || chapters[index].title}`);
  };

  const scrollCueCards = (direction: 'left' | 'right') => {
    if (cueCardsScrollRef.current) {
      const scrollAmount = 400; // Step scroll distance matching card width
      const currentScroll = cueCardsScrollRef.current.scrollLeft;
      cueCardsScrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getColorsByStatus = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Finalized':
        return {
          borderColor: 'border-l-4 border-l-emerald-600 border-neutral-200 dark:border-[rgba(255,255,255,0.08)]/90',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'Needs Review':
        return {
          borderColor: 'border-l-4 border-l-amber-500 border-neutral-200 dark:border-[rgba(255,255,255,0.08)]/90',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      case 'High Priority':
      default:
        return {
          borderColor: 'border-l-4 border-l-rose-500 border-neutral-200 dark:border-[rgba(255,255,255,0.08)]/90',
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
        };
    }
  };

  // Interaction Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Grid / Modal Details State (Cue Cards Expansion)
  const [selectedCueCard, setSelectedCueCard] = useState<CueCardItem | null>(null);
  
  // Custom Cue Cards State
  const [cueCards, setCueCards] = useState<CueCardItem[]>([
    {
      id: 1,
      term: 'Gold Purity',
      desc: 'Ethical sourcing standards & karat weight certification logs.',
      status: 'Needs Review',
      colorName: 'orange',
      bgColor: 'bg-[#fcdcb6]',
      borderColor: 'border-[#f3be84]',
      textColor: 'text-amber-950',
      tagColor: 'bg-amber-500/10 text-amber-900 border-amber-500/30',
      icon: Award
    },
    {
      id: 2,
      term: 'Hallmark Standards',
      desc: 'Official fineness stamp mappings and legal jewelry audit logs.',
      status: 'Approved',
      colorName: 'blue',
      bgColor: 'bg-[#b9d5f7]',
      borderColor: 'border-[#8ebff3]',
      textColor: 'text-blue-950',
      tagColor: 'bg-blue-500/10 text-blue-900 border-blue-500/30',
      icon: CheckCircle
    },
    {
      id: 3,
      term: 'Carat Density',
      desc: 'Solid metal alloy fractional weight audits and standardizations.',
      status: 'Approved',
      colorName: 'purple',
      bgColor: 'bg-[#d9bbf9]',
      borderColor: 'border-[#bd91f4]',
      textColor: 'text-purple-950',
      tagColor: 'bg-purple-500/10 text-purple-900 border-purple-500/30',
      icon: Layers
    },
    {
      id: 4,
      term: 'Conflict Diamonds',
      desc: 'Kimberley Process certificate logs and supplier provenance traces.',
      status: 'Needs Review',
      colorName: 'peach',
      bgColor: 'bg-[#f7c2aa]',
      borderColor: 'border-[#f19b74]',
      textColor: 'text-orange-950',
      tagColor: 'bg-orange-500/10 text-orange-900 border-orange-500/30',
      icon: Flame
    },
    {
      id: 5,
      term: 'Assay Testing',
      desc: 'XRF spectrometer metal verification benchmarks in registry labs.',
      status: 'High Priority',
      colorName: 'pink',
      bgColor: 'bg-[#f3b5ef]',
      borderColor: 'border-[#e88ee3]',
      textColor: 'text-fuchsia-950',
      tagColor: 'bg-fuchsia-500/10 text-fuchsia-900 border-fuchsia-500/30',
      icon: Activity
    },
    {
      id: 6,
      term: 'Traceability Proof',
      desc: 'Decentralized source ledger registries for wholesale shipping security.',
      status: 'Finalized',
      colorName: 'coral',
      bgColor: 'bg-[#fbaaae]',
      borderColor: 'border-[#f68085]',
      textColor: 'text-rose-950',
      tagColor: 'bg-rose-500/10 text-rose-900 border-rose-500/30',
      icon: Compass
    }
  ]);

  // Add Cue Card Form State
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
  const [newCardTerm, setNewCardTerm] = useState<string>('');
  const [newCardDesc, setNewCardDesc] = useState<string>('');
  const [newCardStatus, setNewCardStatus] = useState<string>('Needs Review');
  const [newCardColor, setNewCardColor] = useState<string>('orange');

  // Simulated Chat Bot Features
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Trigger brief floating notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Chat message load initial is omitted to show the Zero State first

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Audio Duration Calculations
  const elapsedSeconds = Math.round((audioProgress / 100) * totalDurationSeconds);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Generate chatbot reply based on query matching
  const generateResponse = (userText: string) => {
    const textLower = userText.toLowerCase();

    if (textLower.includes('summar') || textLower.includes('order') || textLower.includes('custom') || textLower.includes('last month')) {
      return `### Sourcing & Custom Orders Summary\n\nLast month, we registered **12 custom orders** with approved assays:\n\n* **Gold Purity validation:** 5 orders (all matching standard gold purity compliance specs).\n* **Carat Density analysis:** 3 orders (certified under standard laboratory scales).\n* **Custom designs:** 4 orders verified conflict-free compliant.\n\nAll sourcing reports indicate pristine quality levels. What other aspects of our operations should we check?`;
    }

    if (textLower.includes('gold') || textLower.includes('purity') || textLower.includes('assay') || textLower.includes('hallmark')) {
      return `### Material Verification Logs\n\nMaterial testing results from our decentralized registries:\n\n1. **XRF Spectrometer Audits:** Standard gold purity was measured consistently above catalog thresholds.\n2. **Official Hallmarking:** Verification labels have been minted across all approved batches.\n3. **Vendor Compliance:** Suppliers certified ethical logs align with our sustainability metrics.\n\nWould you like me to display the **Operational Strategies** text summary or review other **Cue Cards**?`;
    }

    if (textLower.includes('conflict') || textLower.includes('diamond') || textLower.includes('ethical') || textLower.includes('sourcing')) {
      return `### Sourcing Ethics & Traceability Report\n\n* **Kimberley Process Tracking:** Zero conflict materials entered the processing network.\n* **Ledger Validation:** Blockchain verification checks confirm high integrity for 100% of gemstone imports.\n* **Audit Interval:** Checks are scheduled fortnightly in compliance with global trade boards.\n\nLet me know if you would like to run another database analysis.`;
    }

    if (textLower.includes('help') || textLower.includes('concierge') || textLower.includes('what can you do')) {
      return `### Welcome to the Jewelry Concierge AI Assistant\n\nI can analyze logistical operations, material assays, and diamond provenance logs instantly. Common triggers:\n* Type **"summarize orders"** for custom order highlights.\n* Type **"gold purity"** for XRF metal assay details.\n* Type **"conflict diamonds"** to retrieve Kimberley Process compliance sheets.\n\nHow can I facilitate your work today?`;
    }

    return `### Concierge Analysis Insight\n\nRegarding your question on **"${userText}"**:\n\nI've run a keyword query through last month's operational records. We are keeping high-fidelity logs of:\n* **Gold Purity Standards** (Ethical sourcing active)\n* **Carat Density Audits** (All assays finalized)\n* **Traceability ledgers** (Block-by-block secure origin tracks)\n\nLet me know if I should summarize these categories further, or outline our customer engagement models.`;
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userQuery = inputValue.trim();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateResponse(userQuery);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleTriggerTag = (tagLabel: string, userText: string) => {
    if (isTyping) return;
    
    const userMsg: ChatMessage = {
      id: `user-tag-${Date.now()}`,
      sender: 'user',
      text: tagLabel,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateResponse(userText);
      const botMsg: ChatMessage = {
        id: `bot-tag-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  // Create a custom cue card
  const handleCreateCueCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTerm.trim() || !newCardDesc.trim()) {
      triggerToast('Please provide a Term and Description.');
      return;
    }

    let bgColor = 'bg-[#fcdcb6]';
    let borderColor = 'border-[#f3be84]';
    let textColor = 'text-amber-950';
    let tagColor = 'bg-amber-500/10 text-amber-900 border-amber-500/30';
    let iconSelected = HelpCircle;

    if (newCardColor === 'blue') {
      bgColor = 'bg-[#b9d5f7]';
      borderColor = 'border-[#8ebff3]';
      textColor = 'text-blue-950';
      tagColor = 'bg-blue-500/10 text-blue-900 border-blue-500/30';
      iconSelected = CheckCircle;
    } else if (newCardColor === 'purple') {
      bgColor = 'bg-[#d9bbf9]';
      borderColor = 'border-[#bd91f4]';
      textColor = 'text-purple-950';
      tagColor = 'bg-purple-500/10 text-purple-900 border-purple-500/30';
      iconSelected = Layers;
    } else if (newCardColor === 'peach') {
      bgColor = 'bg-[#f7c2aa]';
      borderColor = 'border-[#f19b74]';
      textColor = 'text-orange-900';
      tagColor = 'bg-orange-500/10 text-orange-900 border-orange-500/30';
      iconSelected = Flame;
    } else if (newCardColor === 'pink') {
      bgColor = 'bg-[#f3b5ef]';
      borderColor = 'border-[#e88ee3]';
      textColor = 'text-fuchsia-950';
      tagColor = 'bg-fuchsia-500/10 text-fuchsia-900 border-fuchsia-500/30';
      iconSelected = Activity;
    } else if (newCardColor === 'coral') {
      bgColor = 'bg-[#fbaaae]';
      borderColor = 'border-[#f68085]';
      textColor = 'text-rose-950';
      tagColor = 'bg-rose-500/10 text-rose-900 border-rose-500/30';
      iconSelected = Compass;
    }

    const newCreated: CueCardItem = {
      id: Date.now(),
      term: newCardTerm,
      desc: newCardDesc,
      status: newCardStatus,
      colorName: newCardColor,
      bgColor,
      borderColor,
      textColor,
      tagColor,
      icon: iconSelected
    };

    setCueCards(prev => [newCreated, ...prev]);
    setIsAddingCard(false);
    setNewCardTerm('');
    setNewCardDesc('');
    setNewCardStatus('Needs Review');
    triggerToast(`Cue Card "${newCardTerm}" successfully injected!`);
  };

  const renderChatMessageContent = (text: string) => {
    const lines = text.split('\n');
    
    const parseInlineMarkdown = (content: string) => {
      const parts = content.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return <span key={i} className="font-semibold text-black dark:text-white">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    return lines.map((line, lIdx) => {
      if (line.trim().startsWith('### ')) {
        return (
          <h4 key={lIdx} className="text-sm font-bold text-[#1c1c1c] dark:text-[#F3F4F6] mt-3 mb-2 border-b border-[#ece6d8] dark:border-white/10 pb-1 font-sans uppercase tracking-wider">
            {parseInlineMarkdown(line.replace('###', '').trim())}
          </h4>
        );
      }
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleanContent = line.replace(/^[\*\-]\s+/, '');
        return (
          <li key={lIdx} className="text-neutral-700 dark:text-gray-300 ml-4 list-disc text-sm leading-relaxed">
            {parseInlineMarkdown(cleanContent)}
          </li>
        );
      }
      return (
        <p key={lIdx} className="text-neutral-800 dark:text-gray-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#ded9d0] dark:bg-[#09090B] py-6 md:py-12 px-4 md:px-8 font-sans antialiased text-[#1c1c1c] dark:text-[#F3F4F6] selection:bg-neutral-250 relative">
      
      {/* Presentation Header bar in clean sans-serif style from image_17 */}
      <div className="hidden md:flex max-w-[1300px] mx-auto items-center justify-between px-2 py-3 text-[10px] font-sans tracking-[0.22em] font-semibold text-[#6a6254] uppercase">
        <span>01 / Core Workspace</span>
        <span>ZID Technical Hud</span>
        <span>Design Concept v1</span>
      </div>

      {/* Floating toast notification bar */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#212121] text-amber-100 text-xs px-6 py-3.5 shadow-2xl z-50 font-mono tracking-wide border border-amber-800/40 rounded-xl flex items-center space-x-3"
          >
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-side Push/Squeeze Working Layout Wrapper */}
      <div 
        id="reader-workspace-wrapper"
        className={`w-full mx-auto flex flex-col lg:flex-row items-stretch lg:items-start justify-center transition-all duration-500 ease-in-out px-2 md:px-4 ${isChatOpen ? 'lg:gap-6' : 'gap-0'}`}
        style={{
          maxWidth: isChatOpen ? '100%' : '1300px',
        }}
      >
        <div 
          id="magazine-page-sheet" 
          className="bg-white dark:bg-[#1C1C1E] flex flex-col relative border-0 min-h-screen rounded-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),_inset_0_0_12px_rgba(0,0,0,0.04)] transition-all duration-500 ease-in-out w-full"
          style={{
            maxWidth: isChatOpen ? 'calc(100% - 364px)' : '100%',
            marginLeft: isChatOpen ? '0' : 'auto',
            marginRight: isChatOpen ? 'auto' : 'auto',
          }}
        >
        {/* Minimalist Top Header Bar conforming to original workspace return controls */}
        <header 
          className="h-20 bg-white dark:bg-[#1C1C1E] flex items-center justify-between px-6 md:px-10 select-none sticky top-0 z-50 shadow-sm"
          style={{}}
        >
          {/* Left Group: ← RETURN TO HUB button */}
          <div className="flex items-center">
            <button
              id="btn-reader-back"
              onClick={onBack}
              className="inline-flex items-center space-x-2 bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-transparent hover:bg-neutral-50 dark:hover:bg-[#1C1C1E] dark:hover:border-white/40 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-[10px] font-sans uppercase tracking-[0.22em] font-extrabold text-neutral-800 dark:text-gray-300 dark:hover:text-white transition-all duration-300 rounded-[4px] px-4 py-2 cursor-pointer shadow-3xs active:bg-neutral-100 dark:active:bg-white/10"
            >
              <span>← RETURN TO HUB</span>
            </button>
          </div>

          {/* Center Group: Place the "ZID | RESEARCH READER" typography in the absolute center of the header */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2.5 sm:space-x-3 pointer-events-none whitespace-nowrap">
            <span className="text-sm font-sans font-extrabold tracking-[0.25em] text-neutral-950 dark:text-gray-200 uppercase">
              ZID
            </span>
            <span className="h-4 w-[1px] bg-neutral-200"></span>
            <span className="text-[10px] font-sans font-bold text-[#8E8E93] tracking-widest uppercase">
              RESEARCH READER
            </span>
          </div>

          {/* Right Group: Icons for share, save, notes, avatar */}
          <div className="flex items-center space-x-3.5">
            {/* Share icon */}
            <button
              id="btn-reader-share"
              onClick={() => triggerToast('Share link copied to clipboard!')}
              className="p-2.5 border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1C1C1E] hover:border-neutral-900 hover:text-black dark:hover:text-[#F3F4F6] dark:text-[#F3F4F6] rounded-[4px] transition text-neutral-600 dark:text-[#9CA3AF] cursor-pointer shadow-3xs hover:bg-[#faf6ec]"
              title="Share research article"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Save icon */}
            {isUploadedDocument ? (
              <button 
                onClick={() => setShowSaveModal(true)}
                disabled={hasSavedUpload}
                className="px-6 py-2 bg-[#111827] text-white dark:text-[#0A0A0B] text-[13px] font-medium rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {hasSavedUpload ? 'Saved' : 'Save Upload'}
              </button>
            ) : (
              <BookmarkButton article={article} size={16} className="border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-[4px] bg-white dark:bg-[#1C1C1E] shadow-3xs hover:border-neutral-900 p-2.5" />
            )}

            {/* User Profile Avatar */}
            <div className="flex items-center pl-3 border-l border-neutral-200 dark:border-[rgba(255,255,255,0.08)] h-8 shrink-0">
              <img className="dark:brightness-90 transition-all duration-300 h-9 w-9 rounded-full object-cover border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] shrink-0 hover:scale-105 transition duration-150 cursor-pointer" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop" 
                alt={user.handle} 
                referrerPolicy="no-referrer"
                 
                title={`${user.handle} Profile Account`}
                onClick={() => {
                  onBack();
                  setActiveTab('profile');
                }}
              />
            </div>
          </div>
        </header>

        {/* Dynamic Interactive Dashboard Layout - 3-Column Asymmetric Grid Layout */}
        <main className="flex-1 px-6 md:px-8 lg:px-12 pt-10 md:pt-14 lg:pt-16 bg-white dark:bg-[#1C1C1E] text-neutral-900 dark:text-[#F3F4F6] relative pb-24">
          
          {/* Giant Centered Main Title block - Scaled elegantly in geometric sans-serif */}
          <div className="text-center pt-2 pb-5 border-b border-[#F3F3F3] dark:border-white/10 select-none" style={{ marginBottom: '28px' }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight text-[#111111] dark:text-gray-100 leading-[1.2] mb-4">
              Neural Sourcing Structures & Cryptographic Hallmark Registries in Sustainable Jewelry Manufacturing
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] font-bold">
              <span className="text-neutral-900 dark:text-[#F3F4F6] font-bold">AUTHOR • DR. EVELYN MOSS</span>
              <span>•</span>
              <span>DATE • MAY 2026</span>
              <span>•</span>
              <span className="text-neutral-700 dark:text-[#E5E7EB] font-extrabold whitespace-nowrap">SCIENCEDIRECT PUBLICATION</span>
            </div>
          </div>

          <div 
            className="grid grid-cols-1 lg:grid gap-[64px] items-start"
            style={{ gridTemplateColumns: 'minmax(320px, 350px) 1fr' }}
          >
                     {/* COLUMN 1: LEFT SIDEBAR (Audio Player & Stacked Cue Cards) */}
            <div id="col-left-sidebar" className="flex flex-col justify-start pt-0" style={{ gap: '24px' }}>
              
              {/* Minimalist Section Header above Audio player with Divider */}
              <div className="space-y-3 mb-4">
                <div className="text-left select-none pb-1">
                  <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888888]">
                    AUDIO SUMMARY
                  </span>
                </div>

                {/* Audio Interface Component (Translucent Light Mode Glass & Standardized Contours) */}
                <div 
                  id="audio-player-interface" 
                  className="p-5 space-y-4 bg-white/40 dark:!bg-white/5 backdrop-blur-md shadow-[0px_12px_32px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.03)] border-t border-white/60 dark:!border-white/10 dark:!border rounded-[16px]"
                  style={{}}
                >
                  
                  {/* Row 1: Visual audio waveform (simple vertical bars) */}
                  <div className="flex items-end justify-between h-8 w-full px-1">
                    {[24, 45, 60, 30, 75, 90, 55, 40, 85, 33, 19, 65, 80, 48, 70, 95, 25, 42, 59, 88, 30, 45, 75, 52, 20, 60, 75, 40, 15, 50, 70, 35].map((val, i) => {
                      const limitIdx = Math.round((audioProgress / 100) * 31);
                      const isActive = i <= limitIdx;
                      return (
                        <div 
                          key={i}
                          className={`w-[2px] rounded-t-sm transition-all duration-300 cursor-pointer ${
                            isActive ? 'bg-[#1c1c1c] dark:bg-white' : 'bg-[#e0dad2] dark:bg-white/20'
                          }`}
                          style={{ height: `${val}%` }}
                          onClick={() => setAudioProgress(Math.round((i / 31) * 100))}
                        />
                      );
                    })}
                  </div>

                  {/* Row 2: Horizontal progress scrubber bar and timestamps */}
                  <div className="space-y-1">
                    <div 
                      className="w-full h-1.5 bg-neutral-100 dark:bg-[rgba(255,255,255,0.1)]/70 rounded-full cursor-pointer relative group"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
                        setAudioProgress(Math.round(percent));
                      }}
                    >
                      <div 
                        className="h-full rounded-full transition-all duration-150 bg-[#1C1C1E] dark:bg-white"
                        style={{ width: `${audioProgress}%` }}
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-md group-hover:scale-110 transition-transform bg-[#1C1C1E] dark:bg-white"
                        style={{ left: `calc(${audioProgress}% - 5px)` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] pt-0.5">
                      <span>{formatTime(elapsedSeconds)}</span>
                      <span>15:30</span>
                    </div>
                  </div>

                  {/* Row 3: Flex row split into two sides */}
                  <div className="flex items-center justify-between select-none pt-1">
                    {/* Left side: Skip back icon, prominent Play button, Skip forward icon */}
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => {
                          setAudioProgress(Math.max(0, audioProgress - 10));
                          triggerToast('Skipped back');
                        }}
                        className="p-1 hover:bg-neutral-100 dark:bg-[rgba(255,255,255,0.1)] rounded text-neutral-700 dark:text-[#E5E7EB] cursor-pointer transition"
                        title="Skip back"
                      >
                        <SkipBack className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => {
                          setIsPlaying(!isPlaying);
                          triggerToast(isPlaying ? "Narration paused" : "Narration initiated");
                        }}
                        className="h-9 w-9 text-white dark:text-white rounded-full flex items-center justify-center transition hover:scale-105 shadow-sm cursor-pointer bg-[#1C1C1E] dark:bg-white/10 dark:border dark:border-white/20"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause className="h-3.5 w-3.5 fill-white text-white dark:text-white dark:fill-white" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-white text-white dark:text-white dark:fill-white ml-0.5" />
                        )}
                      </button>

                      <button 
                        onClick={() => {
                          setAudioProgress(Math.min(100, audioProgress + 10));
                          triggerToast('Skipped forward');
                        }}
                        className="p-1 hover:bg-neutral-100 dark:bg-[rgba(255,255,255,0.1)] rounded text-neutral-700 dark:text-[#E5E7EB] cursor-pointer transition"
                        title="Skip forward"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Right side: Volume controls + tiny monospace text "80%" */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-neutral-700 dark:text-[#E5E7EB] hover:text-black dark:hover:text-[#F3F4F6] dark:text-[#F3F4F6] transition cursor-pointer"
                      >
                        {isMuted ? (
                          <VolumeX className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={isMuted ? 0 : volumeVal} 
                        onChange={(e) => {
                          setVolumeVal(Number(e.target.value));
                          if(isMuted) setIsMuted(false);
                        }}
                        className="w-12 h-1 cursor-pointer bg-neutral-200 dark:bg-white/20 rounded-full accent-[#1C1C1E] dark:accent-white"
                      />
                      <span className="text-[10px] font-mono text-[#888888] w-7 text-right">
                        {isMuted ? "0%" : `${volumeVal}%`}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Stacked Cue Cards Block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between select-none mb-4">
                  <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888888]">
                    CUE CARDS
                  </span>
                </div>

                {/* 3D Stack container */}
                <div className="relative h-[450px] w-full pt-2">
                  {cueCards.map((card, offsetIndex) => {
                    const currentStackPosition = (offsetIndex - activeCardIndex + cueCards.length) % cueCards.length;
                    if (currentStackPosition >= 3) return null;
                    
                    const cardData = cueCards[offsetIndex];
                    const colors = getColorsByStatus(cardData.status);

                    let zIndexClass = "z-10";
                    let transformStyle = "";
                    let opacityClass = "opacity-40 scale-[0.92]";

                    if (currentStackPosition === 0) {
                      zIndexClass = "z-30";
                      transformStyle = "translate(0px, 0px) rotate(0deg)";
                      opacityClass = "opacity-100 scale-100";
                    } else if (currentStackPosition === 1) {
                      zIndexClass = "z-20";
                      transformStyle = "translate(8px, 12px) rotate(4deg)";
                      opacityClass = "opacity-90 scale-[0.98]";
                    } else if (currentStackPosition === 2) {
                      zIndexClass = "z-10";
                      transformStyle = "translate(-12px, 24px) rotate(-5deg)";
                      opacityClass = "opacity-65 scale-[0.95]";
                    }

                    const pastelStyles = [
                      { bg: '#F8FAFC', border: '1px solid #E2E8F0' }, // faded slate
                      { bg: '#F0FDF4', border: '1px solid #DCFCE7' }, // faded mint
                      { bg: '#FFFBEB', border: '1px solid #FEF3C7' }, // faded cream
                      { bg: '#FDF2F8', border: '1px solid #FCE7F3' }, // faded blush
                    ];
                    const cardTheme = pastelStyles[offsetIndex % pastelStyles.length];

                    return (
                       <div 
                        key={cardData.id} 
                        className={`absolute inset-x-0 top-0 p-6 md:p-8 flex flex-col justify-between h-[420px] transition-all duration-300 select-none cursor-grab active:cursor-grabbing dark:!bg-[#1C1C1E] border dark:!border-white/5 ${zIndexClass} ${opacityClass}`}
                        style={{ 
                          transform: transformStyle,
                          background: cardTheme.bg,
                          border: cardTheme.border,
                          boxShadow: currentStackPosition === 0 
                            ? '0px 12px 32px rgba(0, 0, 0, 0.06)'
                            : currentStackPosition === 1
                            ? '0px 6px 16px rgba(0, 0, 0, 0.03)'
                            : '0px 3px 8px rgba(0, 0, 0, 0.015)',
                          borderRadius: '16px'
                        }}
                        onClick={() => {
                          if (currentStackPosition === 0) {
                            setActiveCardIndex(p => (p + 1) % cueCards.length);
                            triggerToast('Swiped forward to next deck card');
                          }
                        }}
                      >
                        <span className="absolute top-5 left-6 md:top-6 md:left-8 font-serif font-bold text-xl text-neutral-400 select-none">
                          {offsetIndex + 1}
                        </span>

                        <div className="text-left flex-grow flex-1 flex flex-col justify-start pt-6">
                          <h4 className="text-lg font-serif font-black tracking-tight text-[#111111] dark:text-gray-100 leading-snug font-bold">
                            {cardData.term}
                          </h4>
                          <p className="text-xs text-[#222222] dark:text-gray-400 font-sans mt-3 leading-relaxed font-normal">
                            {cardData.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Read Full Research Paper Button */}
              <button
                id="btn-read-full-paper"
                onClick={() => triggerToast('Opening full scientific paper registry...')}
                className="block w-full mt-8 p-[18px] rounded-[8px] font-medium text-[13px] uppercase tracking-[0.05em] cursor-pointer text-center transition duration-200 select-none border"
                style={{
                  background: 'transparent',
                  borderColor: '#D1D1D6',
                  color: '#8E8E93'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#111';
                  e.currentTarget.style.color = '#111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D1D6';
                  e.currentTarget.style.color = '#8E8E93';
                }}
              >
                Read Full Research Paper
              </button>

            </div> {/* Close Column 1 (col-left-sidebar) */}

            {/* COLUMN 2: CENTER (Main Reading Column with high contrast and natural width expansion) */}
            <div id="col-center-main-content" className="space-y-6 text-left pt-0 pb-8">

              {/* Long Summary content with clear white, crisp background and high contrast text */}
              <div className="font-serif text-base font-normal leading-relaxed text-neutral-950 dark:text-gray-300 space-y-6">
                
                <h3 className="text-sm font-sans font-semibold uppercase text-neutral-950 dark:text-gray-200 tracking-wider border-l-2 border-[#111] dark:border-gray-200 pl-3 py-0.5 mt-4 select-none">
                  1. Operational Strategies: Gold Purity Assay & Labs
                </h3>
                <p className="dark:text-gray-300 leading-relaxed font-normal">
                  Recent research highlights that securing gold pureness metrics demands a structured, end-to-end trace mechanism. Assay diagnostic laboratories increasingly leverage advanced high-frequency spectrometers on the operational floor, validating metal compositions dynamically prior to custom shaping. By establishing localized testing nodes, companies can successfully bypass expensive middleman certification bottlenecks while logging high-integrity metrics that streamline downstream assembly line assignments.
                </p>
 
                <h3 className="text-sm font-sans font-semibold uppercase text-[#111] dark:text-gray-200 tracking-wider border-l-2 border-[#111] dark:border-gray-200 pl-3 py-0.5 mt-6 select-none">
                  2. Sourcing Ethics & The Kimberley Process Traceability
                </h3>
                <p className="dark:text-gray-300 leading-relaxed font-normal">
                  Ethical logistics protocols must rigidly adhere to standard international governance guidelines. Implementing block-by-block ledger verification secures diamond provenance, totally preventing conflict gemstones from entering retail pipelines. Our operational model integrates a centralized digital certificate track that maps Kimberley invoices with active carat density certifications. Such strategies shield brands from systemic sourcing vulnerabilities while guaranteeing uncompromised product authenticity.
                </p>
 
                {/* Mathematical or operational registry scale blockquote in standard light gray palette */}
                <div className="bg-[#F9F9F9] dark:bg-black/60 dark:shadow-inner border border-neutral-200 dark:border-white/5 p-5 my-6 text-xs font-mono text-neutral-800 dark:text-gray-300 leading-normal select-text shadow-3xs" style={{ borderRadius: '12px' }}>
                  <span className="dark:text-gray-500"># Operational Assay Matrix Metrics Log</span><br />
                  Assay_Verification_Token = d3.scaleLinear().domain([24k_Gold, 14k_Alloy])<br />
                  Conflict_Free_Ratio = Count_Kimberley / Count_Total_Diamonds = 1.000 <span className="dark:text-gray-500">// 100% Certified Ethical Sourced</span>
                </div>
 
                <h3 className="text-sm font-sans font-semibold uppercase text-neutral-950 dark:text-gray-200 tracking-wider border-l-2 border-[#111] dark:border-gray-200 pl-3 py-0.5 mt-6 select-none">
                  3. Customer Engagement: Bridging Sourcing & Presentation
                </h3>
                <p className="dark:text-gray-300 leading-relaxed font-normal">
                  Enhancing customer engagement hinges on absolute corporate transparency. Discerning clientele require vetted proof of hallmark credentials before finalizing transactions. Clearly displaying gold assays, Kimberley certifications, and carat metrics inside custom jewelry concierge dashboards significantly advances buyer trust index ratings. Future developments aim to empower buyers with direct QR scans of the assay certificate log, establishing a direct emotional link between custom craftsmanship, material authenticity, and ethical production values.
                </p>

              </div>

            </div> {/* Close Column 2 */}

          </div>


        </main>
      </div>

      {/* Squeezed side-by-side Chat Panel */}
      <div 
        id="chatbot-drawer-container"
        className={`transition-all duration-500 ease-in-out flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] ${isChatOpen ? 'border-l border-r border-b border-[#F3F3F3] dark:border-0' : 'border-none'}`}
        style={{
          width: isChatOpen ? '340px' : '0px',
          minWidth: isChatOpen ? '340px' : '0px',
          maxWidth: isChatOpen ? '340px' : '0px',
          opacity: isChatOpen ? 1 : 0,
          pointerEvents: isChatOpen ? 'auto' : 'none',
          height: '100vh',
          position: 'sticky',
          top: '0px',
          borderRadius: '0px',
          boxShadow: isChatOpen ? '0 4px 24px rgba(0, 0, 0, 0.02)' : 'none',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div className="p-4 flex items-center justify-between select-none h-20 bg-white dark:bg-transparent">
          <div className="flex items-center space-x-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888888]">RESEARCH ASSISTANT</span>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 hover:bg-black/5 rounded-full text-neutral-600 dark:text-[#9CA3AF] transition cursor-pointer flex items-center justify-center"
            title="Minimize concierge drawer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Chat Message Logs Body & Empty State */}
        <div 
          className="flex-1 overflow-y-auto p-4 flex flex-col bg-white dark:bg-transparent"
          style={messages.length === 0 ? { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' } : undefined}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-6 select-none">
              <Sparkles className="h-10 w-10 text-[#D1D1D6]" strokeWidth={1.5} />
              <p className="font-sans font-medium text-[13px] text-[#8E8E93] mt-3 leading-relaxed max-w-[240px]">
                Ask me anything about this paper, audio or the cue cards, I got your back
              </p>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`leading-[1.5] ${
                      msg.sender === 'user' 
                        ? 'max-w-[85%] text-[13px] text-white dark:text-gray-300 bg-[#2C2C2E] dark:bg-white/10 rounded-[12px] px-4 py-3 border-0' 
                        : 'w-full text-sm bg-neutral-100 dark:bg-white/5 border dark:border-white/10 rounded-2xl p-4 text-neutral-900 dark:text-gray-300'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div className="space-y-2">{renderChatMessageContent(msg.text)}</div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1.5 text-neutral-400 text-xs pl-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Form Input query field sitting perfectly flush */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-transparent flex items-center space-x-2 shrink-0">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask the concierge..."
            className="flex-1 bg-white dark:bg-white/5 rounded-full outline-none text-[12px] leading-none transition placeholder-neutral-400 dark:placeholder-gray-500 font-sans border border-[#EAEAEA] dark:border-white/10"
            style={{ padding: '10px 14px' }}
          />
          <button 
            type="submit" 
            className="h-9 w-9 bg-neutral-900 dark:bg-[#F3F4F6] hover:bg-neutral-950 text-white dark:text-[#0A0A0B] rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shadow-3xs shrink-0"
            title="Send query"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

    </div> {/* Close reader-workspace-wrapper */}

      {/* Renders dynamic slideover modals for adding / detail previewing */}
      
      {/* 1. Modal: Expanded Cue Card Detail Display */}
      {selectedCueCard && (
        <div className="fixed inset-0 bg-neutral-900 dark:bg-[#F3F4F6]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-lg ${selectedCueCard.bgColor} border border-neutral-350 p-8 rounded-3xl shadow-2xl relative text-left`}
          >
            <button 
              onClick={() => setSelectedCueCard(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-neutral-950/10 hover:bg-neutral-950/20 text-neutral-900 dark:text-[#F3F4F6] font-black cursor-pointer flex items-center justify-center"
            >
              &times;
            </button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-neutral-950 rounded-full flex items-center justify-center text-white dark:text-[#0A0A0B] shadow-xs">
                {React.createElement(selectedCueCard.icon as any, { className: "h-5 w-5 text-white dark:text-[#0A0A0B]" })}
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#7a7465] uppercase font-bold">Registry Item Details</span>
                <h3 className="text-xl font-serif font-black text-neutral-950">
                  Concept: {selectedCueCard.term}
                </h3>
              </div>
            </div>

            <div className="space-y-4 font-sans text-xs text-neutral-850 leading-relaxed bg-white dark:bg-[#1C1C1E]/50 p-6 rounded-2xl border border-black dark:border-[rgba(255,255,255,0.2)]/5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-[#F3F4F6] uppercase tracking-widest font-mono">Detailed Definition</h4>
              <p>{selectedCueCard.desc}</p>
              
              <h4 className="text-xs font-bold text-neutral-900 dark:text-[#F3F4F6] uppercase tracking-widest font-mono pt-2">Operational Scope & Standards</h4>
              <p>
                Our lead metallurgists continuously log XRF testing intervals to assure {selectedCueCard.term} complies with global ethical trade specifications. Any discrepancies in {selectedCueCard.term} prompt immediate assay review benchmarks.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-500 dark:text-[#9CA3AF] uppercase tracking-widest font-bold">Status Code Check</span>
              <span className="font-extrabold text-neutral-950 bg-white dark:bg-[#1C1C1E]/70 px-4 py-1.5 rounded-full border border-black dark:border-[rgba(255,255,255,0.2)]/5 font-mono text-xs shadow-3xs">
                {selectedCueCard.status}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. Modal: Add Cue Card */}
      {isAddingCard && (
        <div className="fixed inset-0 bg-neutral-900 dark:bg-[#F3F4F6]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#faf7ee] border border-[#c2bba8] dark:border-[rgba(255,255,255,0.08)] p-8 rounded-3xl shadow-2xl relative text-left"
          >
            <button 
              onClick={() => setIsAddingCard(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-neutral-950/10 hover:bg-neutral-950/20 text-neutral-900 dark:text-[#F3F4F6] font-extrabold cursor-pointer flex items-center justify-center"
            >
              &times;
            </button>

            <h3 className="text-lg font-serif font-black text-neutral-950 mb-1">
              Add Concept Cue Card
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#9CA3AF] mb-6 leading-relaxed">
              Dynamically inject a new sourcing audit, term, or operational parameter to your list.
            </p>

            <form onSubmit={handleCreateCueCard} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-600 dark:text-[#9CA3AF] uppercase font-extrabold mb-1.5">Term Name</label>
                <input 
                  type="text" 
                  value={newCardTerm}
                  onChange={(e) => setNewCardTerm(e.target.value)}
                  placeholder="e.g., Gold Purity Standard" 
                  className="w-full border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-600 dark:text-[#9CA3AF] uppercase font-extrabold mb-1.5">Short Definition / Description</label>
                <textarea 
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  placeholder="e.g., Ethical sourcing standards compliant logs." 
                  className="w-full border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 h-20 outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-600 dark:text-[#9CA3AF] uppercase font-extrabold mb-1.5">Sourcing Status</label>
                  <select 
                    value={newCardStatus}
                    onChange={(e) => setNewCardStatus(e.target.value)}
                    className="w-full border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-neutral-200 bg-white dark:bg-[#1C1C1E]"
                  >
                    <option value="Needs Review">Needs Review</option>
                    <option value="Approved">Approved</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Finalized">Finalized</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-600 dark:text-[#9CA3AF] uppercase font-extrabold mb-1.5">Color Palette Box</label>
                  <select 
                    value={newCardColor}
                    onChange={(e) => setNewCardColor(e.target.value)}
                    className="w-full border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-neutral-200 bg-white dark:bg-[#1C1C1E]"
                  >
                    <option value="orange">Orange (Beige)</option>
                    <option value="blue">Blue (Soft Sky)</option>
                    <option value="purple">Purple (Lilac)</option>
                    <option value="peach">Peach (Terracotta)</option>
                    <option value="pink">Pink (Magenta)</option>
                    <option value="coral">Coral (Warm Red)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-neutral-950 text-white dark:text-[#0A0A0B] font-mono text-xs uppercase tracking-widest font-black py-4 rounded-xl mt-4 hover:bg-black transition cursor-pointer"
              >
                Inject Cue Card
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Floating Chatbot FAB */}
      <button
        id="fab-chatbot-concierge"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-[40px] right-[40px] w-[56px] h-[56px] bg-[#111] dark:bg-white/10 backdrop-blur-md border border-transparent dark:border-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 dark:hover:bg-white/20 dark:hover:border-white/40 active:scale-95 shadow-[0_12px_24px_rgba(0,0,0,0.15)] z-[100]"
        style={{
          opacity: isChatOpen ? 0 : 1,
          pointerEvents: isChatOpen ? 'none' : 'auto',
          display: isChatOpen ? 'none' : 'flex',
        }}
        title="Open Concierge Assistant"
      >
        <Sparkles className="h-5.5 w-5.5 text-white dark:text-white transition-transform duration-300" />
      </button>


      {/* Save Upload Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white dark:bg-[#1C1C1E]/40 backdrop-blur-md"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] bg-white dark:bg-[#1C1C1E] rounded-[16px] p-10 shadow-[0_24px_48px_rgba(0,0,0,0.08)] border border-neutral-200 dark:border-[rgba(255,255,255,0.08)]"
            >
              <h2 className="text-xl font-sans font-bold text-neutral-900 dark:text-[#F3F4F6] mb-6">Save to Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 dark:text-[#9CA3AF] uppercase tracking-widest mb-2">Document Title</label>
                  <input 
                    type="text" 
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full bg-transparent border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-lg p-3 text-sm text-neutral-900 dark:text-[#F3F4F6] focus:outline-none focus:border-neutral-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 dark:text-[#9CA3AF] uppercase tracking-widest mb-2">Short Description</label>
                  <textarea 
                    value={modalDesc}
                    onChange={(e) => setModalDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-neutral-300 dark:border-[rgba(255,255,255,0.08)] rounded-lg p-3 text-sm text-neutral-900 dark:text-[#F3F4F6] focus:outline-none focus:border-neutral-500 resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button 
                  onClick={() => setShowSaveModal(false)}
                  className="text-sm text-neutral-500 dark:text-[#9CA3AF] hover:text-neutral-900 dark:text-[#F3F4F6] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmSave}
                  className="px-6 py-2.5 bg-neutral-900 dark:bg-[#F3F4F6] text-white dark:text-[#0A0A0B] text-sm font-medium rounded-lg hover:bg-black transition-colors"
                >
                  Confirm Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


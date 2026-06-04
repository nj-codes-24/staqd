/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Article } from '../types';
import { useBookmark } from '../contexts/BookmarkContext';
import BookmarkButton from './BookmarkButton';
import { Heart, MessageCircle, Send, Bookmark, X, ThumbsUp, Share2, Reply, ChevronLeft, ChevronRight, UploadCloud, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  articles: Article[];
  onAddCustomArticle: (title: string, excerpt: string, category: string, content: string) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSelectArticle: (article: Article) => void;
}

const postDetailsMap: Record<number, {
  caption: string;
  comments: { user: string; text: string; time: string }[];
}> = {
  1: {
    caption: "Deep dive into real-time style transfers using pre-trained convolutional layers. Reconstructing style representations layer-by-layer with optimal weight constraints.",
    comments: [
      { user: "HELVETICA_FAN", text: "Stunning output structure. The grid alignment on these maps is gorgeous.", time: "2h" },
      { user: "GRID_SYSTEMS", text: "Did you use custom gram matrices or standard VGG?", time: "4h" },
      { user: "ALEX_M", text: "@GRID_SYSTEMS Custom layers with optimized loss weights.", time: "3h" }
    ]
  },
  2: {
    caption: "Synthesizing multi-agent workflows with stateful feedback loops. Orchestrating complex logic systems with extremely fast client-side execution parameters.",
    comments: [
      { user: "WASM_MASTER", text: "Are the models running on-device or via server proxy?", time: "1d" },
      { user: "ALEX_M", text: "@WASM_MASTER Multi-agent is routed server-side, but states remain persistent locally.", time: "1d" }
    ]
  },
  3: {
    caption: "Pushing limits of manual interactive interfaces. Blending Stark Swiss elements with rapid sandbox prototypes that execute within 100ms.",
    comments: [
      { user: "M_DOT", text: "Gotta love the design rhythm. It feels incredibly fast.", time: "5h" },
      { user: "BERN_DESIGN", text: "Pure aesthetic precision. Minimal margins look great.", time: "8h" }
    ]
  },
  4: {
    caption: "Benchmarking micro-architectures under low-compute envelopes. Optimizing training passes and matrix multiplications to scale down model footprint.",
    comments: [
      { user: "CUDA_DEV", text: "What's the memory reduction ratio like?", time: "3d" },
      { user: "ALEX_M", text: "@CUDA_DEV Around ~42% while retaining 98% accuracy on verification suites.", time: "2d" }
    ]
  },
  5: {
    caption: "Developing precise, high-contrast monochrome rendering pipelines. Stripping visual color artifacts to isolate structure and form directly in browser viewports.",
    comments: [
      { user: "CONTRAST", text: "Excellent light-to-shadow ratios, feels sculptural.", time: "12h" },
      { user: "STARK_GRAFIK", text: "Swiss design principles at its finest. No excess noise.", time: "16h" }
    ]
  },
  6: {
    caption: "Evaluating space and time complexity for customized node traversal algorithms. Visualizing dynamic computation paths live.",
    comments: [
      { user: "ALGO_CURATOR", text: "This representation clarifies graph density remarkably well.", time: "2d" }
    ]
  },
  7: {
    caption: "Building independent local indexes. Indexing documents locally using lightweight vectors with immediate response latency.",
    comments: [
      { user: "VECTOR_BASE", text: "Storing embeddings directly in Dexie or localStorage?", time: "4d" },
      { user: "ALEX_M", text: "@VECTOR_BASE Using flat float arrays in high-performance WebASM memory blocks.", time: "4d" }
    ]
  },
  8: {
    caption: "Navigating latent manifolds of diffusion spaces. Linearly interpolating guidance variables to trace state trajectories smoothly.",
    comments: [
      { user: "LATENT_SPACE", text: "This is deeply hypnotic. What model did you seed?", time: "1w" }
    ]
  },
  9: {
    caption: "Archiving structural typography patterns across the last half-century. Cataloging layouts that define contemporary graphic communication.",
    comments: [
      { user: "MUELLER_BROCKMANN", text: "Grid is law. Beautiful curation.", time: "2w" },
      { user: "ZURICH_TYPO", text: "Stark, functional, absolute.", time: "2w" }
    ]
  }
};

const getCommenterAvatar = (username: string) => {
  const norm = username.trim().toUpperCase();
  const avatarMap: Record<string, string> = {
    "HELVETICA_FAN": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    "GRID_SYSTEMS": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
    "ALEX_M": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    "WASM_MASTER": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    "M_DOT": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    "BERN_DESIGN": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150",
    "CUDA_DEV": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    "CONTRAST": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    "STARK_GRAFIK": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    "ALGO_CURATOR": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    "VECTOR_BASE": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    "LATENT_SPACE": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
    "MUELLER_BROCKMANN": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150&h=150",
    "ZURICH_TYPO": "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=150&h=150",
    "VISITOR": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
    "ALEX_MORGAN": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
  };
  return avatarMap[norm] || `https://api.dicebear.com/7.x/initials/svg?seed=${norm}`;
};

export default function ProfileView({ 
  user, 
  activeTab, 
  setActiveTab, 
  articles, 
  onAddCustomArticle,
  onLogout,
  onUpdateUser,
  onSelectArticle
}: ProfileViewProps) {
  const postsData = [
    { id: 1, title: "Neural Style Transfer Pipelines", tag: "Computer Vision", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 2, title: "Custom LLM Agent Workflows", tag: "AI Research", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 3, title: "Dynamic Vibe Coding Experiments", tag: "Software Engineering", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 4, title: "Sparse Transformers V2 Fine-Tuning", tag: "NLP", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 5, title: "Surgical Grayscale Render Passes", tag: "Visual Arts", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 6, title: "Competitive Algorithms Analyzer", tag: "Data Structures", img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 7, title: "Autonomous Knowledge Retrieval", tag: "Systems", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 8, title: "Diffusion Latents interpolation", tag: "Generative AI", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 9, title: "Swiss Graphic Catalog Index Suite", tag: "UI & Typography", img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400&h=400" },
  ];

  const savesData = [
    { id: 1, title: "Attention Is All You Need - Vaswani et al.", tag: "Core ML Reading" },
    { id: 2, title: "Voldemort: Sparse GNN Benchmarks", tag: "Graph-ML" },
    { id: 3, title: "Modern Swiss CSS Grid Layout Techniques", tag: "Aesthetics" },
    { id: 4, title: "Harnessing LoRA Adapters for LLaMA Cells", tag: "Efficient Tuning" },
    { id: 5, title: "Self-Refining Symbolic Code Generators", tag: "Agents" },
    { id: 6, title: "Stark Editorial Design Patterns & Typography", tag: "Style Guidelines" },
  ];

  const hacksData = [
    { id: 1, title: "Media Mosh", tag: "100% Client-side WASM media toolkit" },
    { id: 2, title: "Is My Fit Cooked?", tag: "Vision-model styling analyzer" },
    { id: 3, title: "True Square", tag: "Map-based real estate boundary visualizer" }
  ];

  const { savedArticles, uploadedArticles, removeUpload, saveUpload } = useBookmark();
  const [profileTab, setProfileTab] = useState<'STATS' | 'POSTS' | 'SAVES' | 'UPLOADS'>('STATS');
  const [researchPapersOpen, setResearchPapersOpen] = useState(true);
  const [hacksOpen, setHacksOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<typeof postsData[number] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReplies, setShowReplies] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const [customComments, setCustomComments] = useState<Record<number, { user: string; text: string; time: string }[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; userLiked: boolean }>>({});
  const [shareCopied, setShareCopied] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingUpload, setEditingUpload] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleSaveEdit = () => {
    if (editingUpload) {
      saveUpload({ ...editingUpload, title: editTitle, excerpt: editDesc });
      setEditingUpload(null);
    }
  };

  // Swipe Carousel logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const getCarouselImages = (post: typeof postsData[number]) => {
    const baseImg = post.img.replace('&w=400&h=400', '&w=1200&h=1200');
    return [
      baseImg,
      `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=1200`,
      `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=1200`,
      `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200&h=1200`
    ];
  };

  const handlePrevImage = () => {
    if (!selectedPost) return;
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : prev);
  };
  
  const handleNextImage = () => {
    if (!selectedPost) return;
    const images = getCarouselImages(selectedPost);
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : prev);
  };

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ('targetTouches' in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('targetTouches' in e) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else if (touchStart !== null) {
      setTouchEnd((e as React.MouseEvent).clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleToggleLikeComment = (postId: number, commentIndex: number) => {
    const key = `${postId}-${commentIndex}`;
    const baseLikes = (commentIndex * 3 + postId) % 7 + 1;
    setCommentLikes(prev => {
      const current = prev[key] || { count: baseLikes, userLiked: false };
      const nextLiked = !current.userLiked;
      return {
        ...prev,
        [key]: {
          count: nextLiked ? current.count + 1 : current.count - 1,
          userLiked: nextLiked
        }
      };
    });
  };

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setShowReplies(false);
      setReplyingTo(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  const tabs: ('STATS' | 'POSTS' | 'SAVES' | 'UPLOADS')[] = ['STATS', 'POSTS', 'SAVES', 'UPLOADS'];

  return (
    <div id="personal-profile-wrapper" className="min-h-screen bg-[#ded9cf] pt-12 pb-16 px-4 md:px-8 font-sans antialiased text-[#111]">
      {/* Meta-Header bar */}
      <div className="hidden md:flex max-w-[1240px] mx-auto items-center justify-between px-6 py-2.5 text-[10px] font-mono tracking-widest text-[#605a50] border-[#ccc5b6] mb-4">
        <span>02 / CURATOR DOSSIER</span>
        <span className="uppercase text-center">ZID TECHNICAL HUD</span>
        <span className="uppercase">DESIGN CONCEPT V1</span>
      </div>

      <div 
        id="profile-editorial-sheet" 
        className="w-full max-w-[1240px] mx-auto bg-[#fbfaf8] border border-[#c2bba8] shadow-2xl flex flex-col p-6 md:py-[64px] md:px-[80px]"
        style={{ minHeight: '80vh' }}
      >
        {/* Hub Return Bar */}
        <div 
          className="flex justify-between items-center" 
          style={{ width: '100%', borderBottom: '1px solid #EAEAEA', paddingBottom: '24px', marginBottom: '48px' }}
        >
          <button 
            onClick={() => setActiveTab('hud')}
            className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#888] hover:text-[#111] transition-colors uppercase font-bold cursor-pointer bg-transparent border-none outline-none"
          >
            <span>← RETURN TO HUBS</span>
          </button>
          <div className="text-[10px] font-mono text-[#888] tracking-widest uppercase hidden sm:block">
            Curator Dossier // NO. 04
          </div>
          <button 
            onClick={onLogout}
            className="text-[11px] font-mono tracking-widest text-[#888] hover:text-red-600 transition-colors uppercase font-bold cursor-pointer bg-transparent border-none outline-none"
          >
            LOGOUT
          </button>
        </div>

        {/* Top Section (The Editorial Header) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12 md:gap-20 items-start text-left">
          {/* Left Column (Typography) */}
          <div className="flex flex-col justify-start" style={{ alignSelf: 'center' }}>
            <h1 
              className="font-serif font-black text-[#111] tracking-tighter uppercase"
              style={{ 
                fontSize: 'clamp(4rem, 8vw, 8rem)',
                fontFamily: 'var(--font-serif)',
                lineHeight: '0.9'
              }}
            >
              ALEX<br />MORGAN
            </h1>
            <div className="mt-8">
              <p className="text-sm text-[#444] font-sans leading-relaxed max-w-[480px]">
                Lead researcher and platform curator. Exploring the intersection of digital architecture and minimal interface design.
              </p>
            </div>
          </div>

          {/* Right Column (Photo) */}
          <div className="w-full flex justify-end">
            <div 
              className="w-full bg-[#f0ede6] overflow-hidden border border-neutral-200 rounded-none shadow-none"
              style={{ maxWidth: '360px', width: '100%', aspectRatio: '1/1' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Alex Morgan Portrait"
                referrerPolicy="no-referrer"
                className="grayscale contrast-[1.15]"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Divider & Tab Navigation */}
        <div 
          className="w-full animate-fade-in"
          style={{ borderTop: '1px solid #EAEAEA', marginTop: '48px' }}
        >
          <div 
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '0px'
            }}
          >
            {tabs.map((tab) => {
              const isActive = profileTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    paddingTop: '16px',
                    paddingBottom: '12px',
                    marginTop: '-1px',
                    borderTop: isActive ? '1px solid #111' : '1px solid transparent',
                    color: isActive ? '#111' : '#888',
                    fontWeight: isActive ? 700 : 400,
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-8 min-h-[300px]">
          {profileTab === 'STATS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {/* Block 1 */}
              <div className="border border-[#EAEAEA] rounded-none shadow-none p-8 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase block mb-6 font-semibold">TOTAL SAVES</span>
                  <span className="text-3xl font-bold text-[#111] tracking-tight leading-snug block">
                    142
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block mt-2">
                    Archived nodes
                  </span>
                </div>
              </div>

              {/* Block 2 */}
              <div className="border border-[#EAEAEA] rounded-none shadow-none p-8 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase block mb-6 font-semibold">ACTIVE POSTS</span>
                  <span className="text-3xl font-bold text-[#111] tracking-tight leading-snug block">
                    28
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block mt-2">
                    Published modules
                  </span>
                </div>
              </div>

              {/* Block 3 */}
              <div className="border border-[#EAEAEA] rounded-none shadow-none p-8 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase block mb-6 font-semibold">NETWORK</span>
                  <span className="text-3xl font-bold text-[#111] tracking-tight leading-snug block">
                    1.2K
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block mt-2">
                    Platform peers
                  </span>
                </div>
              </div>

              {/* Block 4 */}
              <div className="border border-[#EAEAEA] rounded-none shadow-none p-8 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase block mb-6 font-semibold">FOCUS</span>
                  <span className="text-lg font-bold text-[#111] tracking-tight leading-snug block">
                    UI/UX & Systems
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block mt-2">
                    Core operational design
                  </span>
                </div>
              </div>
            </div>
          )}

          {profileTab === 'POSTS' && (
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '24px 0' }}
            >
              {postsData.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedPost(item)}
                  className="relative group overflow-hidden bg-[#F0F0F0] cursor-pointer"
                  style={{ aspectRatio: '1/1' }}
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-[1.1] group-hover:grayscale-0 transition-all duration-300"
                    style={{ aspectRatio: '1/1', border: 'none' }}
                  />
                  <div className="absolute inset-0 bg-black/85 flex flex-col justify-between p-4 md:p-6 text-left opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest text-[#bbb] uppercase block font-semibold">
                      // {item.tag}
                    </span>
                    <h4 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-tight leading-snug font-mono">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {profileTab === 'SAVES' && (
            <div className="w-full mx-auto animate-fade-in text-left">
              {savedArticles.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center text-center mt-16 py-20">
                  <Bookmark className="w-8 h-8 text-neutral-300" />
                  <p className="mt-4 text-sm font-mono text-neutral-500 uppercase">NO SAVED ARTICLES YET.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {savedArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="group bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] h-full border border-neutral-100"
                    >
                      <div 
                        className="cursor-pointer flex-1 flex flex-col"
                        onClick={() => onSelectArticle(article)}
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
                            <span>{article.category}</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h3 className="text-[14px] md:text-[15px] font-sans font-bold text-[#1c1c1c] leading-tight line-clamp-3">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <div className="mt-auto pt-3 border-t border-[#ece8df]/60 flex items-center justify-between">
                          <p className="text-[10px] font-sans tracking-widest uppercase text-neutral-400">
                            {article.publishedAt}
                          </p>
                          <div 
                            className="-mr-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookmarkButton article={article} size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {profileTab === 'UPLOADS' && (
            <div className="w-full mx-auto animate-fade-in text-left">
              {uploadedArticles && uploadedArticles.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center text-center mt-16 py-20">
                  <UploadCloud size={24} color="#9CA3AF" strokeWidth={1.5} />
                  <p className="mt-4 text-sm font-mono text-neutral-500 uppercase">NO UPLOADS YET.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {uploadedArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="group bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] h-full border border-neutral-100"
                    >
                      <div 
                        className="cursor-pointer flex-1 flex flex-col"
                        onClick={() => onSelectArticle(article)}
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 relative">
                          <img 
                            src={article.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=400"} 
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-mono text-[#8a8174] uppercase tracking-wider font-semibold">
                            <span>{article.category}</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h3 className="text-[14px] md:text-[15px] font-sans font-bold text-[#1c1c1c] leading-tight line-clamp-3">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <div className="mt-auto pt-3 border-t border-[#ece8df]/60 flex items-center justify-between w-full">
                          <p className="text-[10px] font-sans tracking-widest uppercase text-neutral-400">
                            13TH MAY
                          </p>
                          <div className="flex gap-3 items-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUpload(article);
                                setEditTitle(article.title);
                                setEditDesc(article.excerpt);
                              }}
                              className="text-[#9CA3AF] hover:text-[#111827] hover:scale-110 transition-all duration-200 focus:outline-none"
                            >
                              <Pencil size={15} strokeWidth={1.5} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete(article.id);
                              }}
                              className="text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-500/10 p-1 -m-1 rounded transition-all duration-200 focus:outline-none"
                            >
                              <Trash2 size={15} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>      {/* Dynamic Tech-style post details modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/30 animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="relative w-full max-w-6xl flex flex-col md:flex-row md:space-x-8 md:items-stretch animate-scale-up md:h-[650px] h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side column: Tablet-style media container */}
            <div className="w-full md:w-[58%] flex flex-col justify-start md:h-full flex-shrink-0">
              {/* Tablet panel with dark grey bezel */}
              <div 
                className="w-full flex-1 bg-[#2C2D32] overflow-hidden relative aspect-video md:aspect-auto md:max-h-[580px] select-none rounded-[20px] md:rounded-[32px] p-2 border border-[#40434A]"
                style={{ 
                  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div 
                  className="w-full h-full relative rounded-[14px] md:rounded-[24px] overflow-hidden bg-[#1A1C23] touch-pan-y"
                  onMouseDown={onTouchStart}
                  onMouseMove={onTouchMove}
                  onMouseUp={onTouchEnd}
                  onMouseLeave={onTouchEnd}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{ cursor: 'grab' }}
                >
                  <div 
                    className="flex w-full h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {getCarouselImages(selectedPost).map((imgUrl, i) => (
                      <div key={i} className="flex-shrink-0 w-full h-full">
                        <img 
                          src={imgUrl} 
                          alt={`${selectedPost.title} image ${i + 1}`}
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity pointer-events-none"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Left Chevron */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  {/* Right Chevron */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg ${currentImageIndex === getCarouselImages(selectedPost).length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                  >
                    <ChevronRight size={24} />
                  </button>
                  {/* Pagination Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {getCarouselImages(selectedPost).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${currentImageIndex === i ? 'bg-white' : 'bg-white/30'}`}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Interaction Pill below */}
              <div className="flex justify-center flex-shrink-0 mt-6 md:mt-8">
                <div 
                  className="bg-[#2C2E35]/70 backdrop-blur-xl px-6 py-2.5 rounded-full flex items-center space-x-6 transition-all hover:scale-[1.02] duration-200 select-none cursor-default border border-white/5"
                  style={{ 
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Like Button */}
                  <button 
                    type="button"
                    onClick={() => setLikedPosts(prev => ({ ...prev, [selectedPost.id]: !prev[selectedPost.id] }))}
                    className="flex items-center space-x-2 text-[#9BA0A8] hover:text-white transition-all font-mono font-medium text-[11px] bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Heart size={14} fill={likedPosts[selectedPost.id] ? "#FFF" : "none"} className={likedPosts[selectedPost.id] ? "text-white" : "text-[#9BA0A8]"} />
                    <span className="tracking-wide text-[10px]">{likedPosts[selectedPost.id] ? "1,241" : "1,240"}</span>
                  </button>

                  <span className="h-3 w-[1px] bg-white/10"></span>

                  {/* Save Button */}
                  <button 
                    type="button"
                    onClick={() => setSavedPosts(prev => ({ ...prev, [selectedPost.id]: !prev[selectedPost.id] }))}
                    className="flex items-center space-x-2 text-[#9BA0A8] hover:text-white transition-all font-mono font-medium text-[11px] bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Bookmark size={13} fill={savedPosts[selectedPost.id] ? "#FFF" : "none"} className={savedPosts[selectedPost.id] ? "text-white" : "text-[#9BA0A8]"} />
                    <span className="tracking-wide text-[10px] uppercase">{savedPosts[selectedPost.id] ? "Saved" : "Save"}</span>
                  </button>

                  <span className="h-3 w-[1px] bg-white/10"></span>

                  {/* Share Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      const postUrl = `${window.location.origin}${window.location.pathname}?post=${selectedPost.id}`;
                      navigator.clipboard.writeText(postUrl);
                      setShareCopied(true);
                      setTimeout(() => setShareCopied(false), 2000);
                    }}
                    className="flex items-center space-x-2 text-[#9BA0A8] hover:text-white transition-all font-mono font-medium text-[11px] bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Share2 size={13} className={shareCopied ? "text-white" : "text-[#9BA0A8]"} />
                    <span className="min-w-[40px] text-left uppercase text-[10px] tracking-wide">
                      {shareCopied ? "COPIED" : "SHARE"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side column: Comments Section (Dark Glass) */}
            <div 
              className="w-full md:w-[42%] flex flex-col justify-between bg-[#191B21]/80 backdrop-blur-3xl rounded-[20px] md:h-full h-[90vh] overflow-hidden"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-left custom-scrollbar animate-fade-in" id="modal-messages-feed" style={{ scrollbarColor: '#3A3D45 transparent', scrollbarWidth: 'thin' }}>
                
                {/* Header & Post Wrapper */}
                <div className="space-y-4">
                  {/* Profile Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={getCommenterAvatar("ALEX_MORGAN")} 
                        alt="alex_morgan"
                        className="w-9 h-9 rounded-full object-cover border border-[#3A3D45] flex-shrink-0"
                      />
                      <span className="font-sans font-semibold text-[13px] text-[#E4E6EB] tracking-wide block leading-none truncate uppercase">ALEX_MORGAN</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6A6E78] uppercase tracking-widest">1D AGO</span>
                  </div>

                  {/* Post Caption */}
                  <div className="mt-4">
                    <p className="text-[13.5px] md:text-[14px] font-sans text-[#E4E6EB] leading-relaxed font-normal break-words max-w-[65ch]">
                      {postDetailsMap[selectedPost.id]?.caption || selectedPost.title}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3D45]/40 my-4"></div>

                {/* Comment Section Header */}
                <div className="pb-1 select-none flex items-center justify-between">
                  <h3 className="text-[12px] font-mono uppercase tracking-widest text-[#6A6E78] font-extrabold">
                    // COMMENT SECTION
                  </h3>
                  <span className="text-[9px] font-mono text-[#5A5E68] tracking-widest font-semibold uppercase">
                    {(postDetailsMap[selectedPost.id]?.comments || []).length + (customComments[selectedPost.id] || []).length} ACTIVE LOGS
                  </span>
                </div>

                {/* Vertical Comment Hierarchy */}
                <div className="space-y-1 text-white relative">
                  {((postDetailsMap[selectedPost.id]?.comments || []).concat(customComments[selectedPost.id] || [])).map((comment, idx) => {
                    const commentKey = `${selectedPost.id}-${idx}`;
                    const baseLikes = ((idx * 3 + selectedPost.id) % 5) + 1;
                    const likeState = commentLikes[commentKey] || { count: baseLikes, userLiked: false };

                    if (idx > 0 && !showReplies) return null;

                    return (
                      <div 
                        key={idx} 
                        className={idx === 0 
                          ? "p-4 bg-[#252830]/40 rounded-[16px] relative z-10 transition-all duration-150 group border border-white/5"
                          : "pt-3 pb-1 relative z-10 group ml-10"}
                      >
                         {/* Threading connector for indented replies */}
                         {idx > 0 && (
                            <div className="absolute left-[-20px] top-7 w-[12px] h-px bg-[#4A4E58]"></div>
                         )}
                         {idx > 0 && (
                            <div className="absolute left-[-20px] bottom-0 top-[-20px] w-px bg-[#4A4E58]"></div>
                         )}

                        <div className="flex items-start justify-between space-x-3">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            {/* Tiny circular portrait profile image */}
                            <img 
                              src={getCommenterAvatar(comment.user)} 
                              alt={comment.user}
                              className="w-7 h-7 rounded-full object-cover border border-[#3A3D45] flex-shrink-0 z-10"
                            />
                            <div className="space-y-1 flex-1 text-left min-w-0 pt-0.5">
                              {/* Username */}
                              <div className="flex items-baseline space-x-2">
                                <span className="font-sans font-medium text-[#D0D4DC] text-[12px] tracking-tight uppercase truncate">{comment.user}</span>
                              </div>

                              {/* Comment text body */}
                              <p className="text-[13px] md:text-[13.5px] font-sans text-[#A0A5B1] leading-relaxed font-normal break-words mt-0.5 max-w-[62ch]">
                                {comment.text}
                              </p>
                            </div>
                          </div>

                          {/* Miniaturized Interaction: Vertically stacked line icons (heart, reply) */}
                          <div className="flex flex-col items-center justify-center space-y-1.5 flex-shrink-0 ml-2 select-none pt-1">
                            <button 
                              type="button" 
                              onClick={() => handleToggleLikeComment(selectedPost.id, idx)}
                              className={`text-[#6A6E78] hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer ${likeState.userLiked ? 'text-white' : ''}`}
                            >
                              <Heart size={12} fill={likeState.userLiked ? "#FFF" : "none"} className={likeState.userLiked ? "" : ""} />
                            </button>
                            <span className="text-[9px] font-mono text-[#6A6E78] leading-none mb-1 font-bold">{likeState.count}</span>
                            <button 
                              type="button"
                              onClick={() => setReplyingTo(comment.user)}
                              className="text-[#6A6E78] hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                              title="Reply"
                            >
                              <Reply size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* View all replies pseudo-button */}
                  {((postDetailsMap[selectedPost.id]?.comments || []).concat(customComments[selectedPost.id] || [])).length > 1 && (
                    <div className="pl-14 pt-2 pb-2">
                       <button 
                         type="button"
                         onClick={() => setShowReplies(!showReplies)}
                         className="text-[11px] font-sans text-[#4A85F6] hover:text-[#7AA8FF] cursor-pointer transition-colors block bg-transparent border-none p-0"
                       >
                         {showReplies ? "Hide replies" : `View all replies (${((postDetailsMap[selectedPost.id]?.comments || []).concat(customComments[selectedPost.id] || [])).length - 1})`}
                       </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col bg-[#191B21] border-t border-white/5 flex-shrink-0">
                {replyingTo && (
                  <div className="px-5 pt-3 pb-1 flex justify-between items-center animate-fade-in relative">
                    <span className="text-[10px] font-sans text-[#8B909A]">Replying to <span className="text-[#E4E6EB] font-medium">@{replyingTo}</span></span>
                    <button type="button" onClick={() => setReplyingTo(null)} className="text-[#6A6E78] hover:text-white bg-transparent border-none p-0 cursor-pointer absolute right-5"><X size={12} /></button>
                  </div>
                )}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!commentInput.trim()) return;
                    const newComment = {
                      user: "VISITOR",
                      text: replyingTo ? `@${replyingTo} ${commentInput}` : commentInput,
                      time: "Just now"
                    };
                    setCustomComments(prev => ({
                      ...prev,
                      [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment]
                    }));
                    setCommentInput('');
                    setReplyingTo(null);
                    setTimeout(() => {
                      const feed = document.getElementById('modal-messages-feed');
                      if (feed) feed.scrollTop = feed.scrollHeight;
                    }, 50);
                  }}
                  className="px-5 py-3 flex items-center justify-between gap-3 w-full"
                >
                  <div 
                    className="flex-1 flex items-center bg-[#252830]/80 hover:bg-[#2A2D35] focus-within:bg-[#2A2D35] transition-all duration-200 px-4 py-1.5 rounded-xl border border-white/5"
                  >
                    <input 
                      id="comment-input-box"
                      type="text"
                      placeholder="Record comment in node..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-[12px] text-white placeholder-[#6A6E78] font-mono py-1"
                      autoComplete="off"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!commentInput.trim()}
                    className="text-[11px] font-mono font-bold text-[#3FB495] hover:text-[#52D2B0] disabled:text-[#3A4349] transition-colors py-2 pl-2 pr-1 uppercase cursor-pointer hover:scale-105 active:scale-95 duration-150 tracking-widest flex-shrink-0"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    POST
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Upload Modal */}
      <AnimatePresence>
        {editingUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white/40 backdrop-blur-md"
            onClick={() => setEditingUpload(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] bg-white rounded-[16px] p-10 shadow-[0_24px_48px_rgba(0,0,0,0.08)] border border-neutral-200"
            >
              <h2 className="text-xl font-sans font-bold text-neutral-900 mb-6">Edit Upload Details</h2>
              
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Document Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-transparent border border-neutral-300 rounded-lg p-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea 
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-neutral-300 rounded-lg p-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-500 resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button 
                  onClick={() => setEditingUpload(null)}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white/40 backdrop-blur-md"
            onClick={() => setItemToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] bg-white rounded-[16px] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.08)] border border-neutral-200 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-sans font-bold text-neutral-900">Delete this upload?</h2>
              <p className="text-sm text-neutral-500 mt-2 mb-8">
                This action cannot be undone. The document and all its generated insights will be permanently removed from your profile.
              </p>
              
              <div className="flex gap-3 w-full justify-center">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-full bg-transparent border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-neutral-50 transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    removeUpload(itemToDelete);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-red-500 border border-transparent text-white font-medium text-sm hover:bg-red-600 transition-colors focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


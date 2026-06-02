/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Article } from '../types';
import { Heart, MessageCircle, Send, Bookmark, X } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  articles: Article[];
  onAddCustomArticle: (title: string, excerpt: string, category: string, content: string) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
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

export default function ProfileView({ 
  user, 
  activeTab, 
  setActiveTab, 
  articles, 
  onAddCustomArticle,
  onLogout,
  onUpdateUser
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

  const [profileTab, setProfileTab] = useState<'STATS' | 'POSTS' | 'SAVES'>('STATS');
  const [researchPapersOpen, setResearchPapersOpen] = useState(true);
  const [hacksOpen, setHacksOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<typeof postsData[number] | null>(null);
  const [customComments, setCustomComments] = useState<Record<number, { user: string; text: string; time: string }[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  const tabs: ('STATS' | 'POSTS' | 'SAVES')[] = ['STATS', 'POSTS', 'SAVES'];

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
            <div className="w-full max-w-[800px] mx-auto animate-fade-in text-left">
              {/* RESEARCH PAPERS COLLAPSIBLE SECTION */}
              <div className="border-b border-stone-200">
                <div 
                  onClick={() => setResearchPapersOpen(!researchPapersOpen)}
                  className="flex justify-between items-center py-6 border-b border-[#111] cursor-pointer"
                  style={{ userSelect: 'none' }}
                >
                  <span className="font-bold uppercase text-[14px] tracking-[0.05em] text-[#111]">
                    RESEARCH PAPERS
                  </span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      transform: researchPapersOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                
                {researchPapersOpen && (
                  <div 
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', padding: '24px 0' }}
                  >
                    {/* Paper 1 */}
                    <div 
                      className="bg-white"
                      style={{ border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', padding: '24px 20px', borderRadius: '0', boxShadow: 'none' }}
                    >
                      <span className="text-[9px] font-mono tracking-widest text-[#888] uppercase block mb-3">OCT 2025</span>
                      <h4 className="text-[13px] font-bold text-[#111] uppercase tracking-tight leading-snug mb-2 font-mono">
                        DECENTRALIZED ARCHITECTURES
                      </h4>
                      <p className="text-[11px] text-[#555] font-sans leading-relaxed line-clamp-3">
                        Exploring network layouts for distributed client-side nodes to establish robust, real-time edge state without server-side database requirements.
                      </p>
                    </div>

                    {/* Paper 2 */}
                    <div 
                      className="bg-white"
                      style={{ border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', padding: '24px 20px', borderRadius: '0', boxShadow: 'none' }}
                    >
                      <span className="text-[9px] font-mono tracking-widest text-[#888] uppercase block mb-3">JAN 2026</span>
                      <h4 className="text-[13px] font-bold text-[#111] uppercase tracking-tight leading-snug mb-2 font-mono">
                        TYPOGRAPHIC HEURISTICS
                      </h4>
                      <p className="text-[11px] text-[#555] font-sans leading-relaxed line-clamp-3">
                        An investigation into user cognition and reading efficiency under massive font-size scaling, high contrasts, and ultra-dense structural grid layouts.
                      </p>
                    </div>

                    {/* Paper 3 */}
                    <div 
                      className="bg-white"
                      style={{ border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', padding: '24px 20px', borderRadius: '0', boxShadow: 'none' }}
                    >
                      <span className="text-[9px] font-mono tracking-widest text-[#888] uppercase block mb-3">APR 2026</span>
                      <h4 className="text-[13px] font-bold text-[#111] uppercase tracking-tight leading-snug mb-2 font-mono">
                        SYNTAX TREE PARSERS
                      </h4>
                      <p className="text-[11px] text-[#555] font-sans leading-relaxed line-clamp-3">
                        Leveraging WASM compilers to parse AST representations in real-time, enabling interactive client-only code analysis directly in browser frames.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* HACKS COLLAPSIBLE SECTION */}
              <div className="mt-4">
                <div 
                  onClick={() => setHacksOpen(!hacksOpen)}
                  className="flex justify-between items-center py-6 border-b border-[#111] cursor-pointer"
                  style={{ userSelect: 'none' }}
                >
                  <span className="font-bold uppercase text-[14px] tracking-[0.05em] text-[#111]">
                    HACKS
                  </span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      transform: hacksOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                
                {hacksOpen && (
                  <div 
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '24px 0' }}
                  >
                    {[
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=400",
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=400",
                      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400",
                      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=400",
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400",
                      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=400"
                    ].map((imgSrc, index) => (
                      <img 
                        key={index}
                        src={imgSrc} 
                        alt={`Hack Thumbnail ${index + 1}`}
                        className="grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-300"
                        style={{ aspectRatio: '1/1', backgroundColor: '#F0F0F0', width: '100%', border: 'none', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Instagram-style post details modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#111111] text-white border border-neutral-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tactile Close button with rotation style hover */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-all bg-black/40 hover:bg-black/60 p-2 rounded-full cursor-pointer hover:scale-110 active:scale-95 duration-200"
              style={{ border: 'none' }}
            >
              <X size={18} />
            </button>

            {/* Left side column: High-resolution full-sized layout image */}
            <div className="w-full md:w-[55%] bg-[#080808] flex items-center justify-center relative aspect-square md:aspect-auto md:h-[550px] flex-shrink-0">
              <img 
                src={selectedPost.img.replace('&w=400&h=400', '&w=1000&h=1000')} 
                alt={selectedPost.title}
                className="w-full h-full object-cover grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-700"
              />
              <span className="absolute bottom-4 left-4 bg-black/75 border border-neutral-800/80 px-2.5 py-1 text-[9px] font-mono tracking-widest text-[#bbb] uppercase font-bold select-none">
                // {selectedPost.tag}
              </span>
            </div>

            {/* Right side column: Information Curation Panel */}
            <div className="w-full md:w-[45%] flex flex-col justify-between bg-[#111111] border-t md:border-t-0 md:border-l border-neutral-800 h-[450px] md:h-[550px]">
              {/* Curator Info header */}
              <div className="flex items-center space-x-3 p-4 border-b border-neutral-805/80" style={{ borderColor: '#222' }}>
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-mono tracking-widest text-[#eaeaea] font-bold select-none">
                  AM
                </div>
                <div className="text-left">
                  <span className="font-mono text-xs font-bold text-white uppercase block leading-none">alex_morgan</span>
                  <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase">{selectedPost.tag}</span>
                </div>
              </div>

              {/* Feed & comments container block */}
              <div id="modal-messages-feed" className="flex-1 overflow-y-auto p-4 space-y-4 text-left custom-scrollbar">
                {/* Main post description caption */}
                <div className="flex items-start space-x-3 pb-3" style={{ borderBottom: '1px solid #1c1c1c' }}>
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] font-mono text-white font-bold select-none flex-shrink-0">
                    AM
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs leading-normal">
                      <span className="font-mono font-bold text-white mr-2 uppercase">alex_morgan</span>
                      <span className="text-neutral-300 font-sans">
                        {postDetailsMap[selectedPost.id]?.caption || selectedPost.title}
                      </span>
                    </p>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">1D AGO</span>
                  </div>
                </div>

                {/* Prepopulated & dynamic comments */}
                {((postDetailsMap[selectedPost.id]?.comments || []).concat(customComments[selectedPost.id] || [])).map((comment, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-850 border border-neutral-700 flex items-center justify-center text-[8px] font-mono text-neutral-300 font-bold select-none flex-shrink-0">
                      {comment.user.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs leading-normal">
                        <span className="font-mono font-bold text-neutral-100 mr-2 uppercase">{comment.user}</span>
                        <span className="text-neutral-300 font-sans">{comment.text}</span>
                      </p>
                      <div className="flex items-center space-x-2 text-[9px] font-mono text-neutral-500">
                        <span>{comment.time}</span>
                        <span>•</span>
                        <button className="hover:text-white transition-colors cursor-pointer uppercase text-[9px]" style={{ background: 'transparent', border: 'none', padding: 0 }}>REPLY</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engagement Panel */}
              <div className="p-4 bg-[#141414] border-t border-neutral-800 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setLikedPosts(prev => ({ ...prev, [selectedPost.id]: !prev[selectedPost.id] }))}
                      className="text-white hover:text-red-500 cursor-pointer transition-all hover:scale-110 active:scale-95 duration-200 bg-transparent border-none p-0"
                    >
                      <Heart size={20} fill={likedPosts[selectedPost.id] ? "#ef4444" : "none"} className={likedPosts[selectedPost.id] ? "text-red-500" : ""} />
                    </button>
                    <button 
                      onClick={() => document.getElementById('comment-input-box')?.focus()}
                      className="text-white hover:text-neutral-300 cursor-pointer transition-all hover:scale-110 active:scale-95 duration-200 bg-transparent border-none p-0"
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button className="text-white hover:text-neutral-300 cursor-pointer transition-all hover:scale-110 active:scale-95 duration-200 bg-transparent border-none p-0">
                      <Send size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => setSavedPosts(prev => ({ ...prev, [selectedPost.id]: !prev[selectedPost.id] }))}
                    className="text-white hover:text-yellow-500 cursor-pointer transition-all hover:scale-110 active:scale-95 duration-200 bg-transparent border-none p-0"
                  >
                    <Bookmark size={20} fill={savedPosts[selectedPost.id] ? "#eab308" : "none"} className={savedPosts[selectedPost.id] ? "text-yellow-500" : ""} />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-mono font-bold uppercase text-white leading-none">
                    {likedPosts[selectedPost.id] ? "1,241 LIKES" : "1,240 LIKES"}
                  </p>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mt-1">
                    JUNE 2, 2026 // LOGGED_NODE
                  </span>
                </div>
              </div>

              {/* Dynamic Curation Comment input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!commentInput.trim()) return;
                  const newComment = {
                    user: "VISITOR",
                    text: commentInput,
                    time: "Just now"
                  };
                  setCustomComments(prev => ({
                    ...prev,
                    [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment]
                  }));
                  setCommentInput('');
                  setTimeout(() => {
                    const feed = document.getElementById('modal-messages-feed');
                    if (feed) feed.scrollTop = feed.scrollHeight;
                  }, 50);
                }}
                className="border-t border-neutral-800 p-3 bg-[#0d0d0d] flex items-center justify-between"
              >
                <input 
                  id="comment-input-box"
                  type="text"
                  placeholder="Record comment in node logs..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-neutral-500 px-2 py-1 font-mono"
                  autoComplete="off"
                />
                <button 
                  type="submit" 
                  disabled={!commentInput.trim()}
                  className="text-xs font-mono font-bold text-white/95 hover:text-white disabled:text-neutral-600 transition-all font-semibold tracking-widest px-2 uppercase cursor-pointer hover:scale-105 active:scale-95 duration-150"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  POST
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

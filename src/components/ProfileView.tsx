/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Article } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  activeTab: 'hud' | 'saved' | 'profile';
  setActiveTab: (tab: 'hud' | 'saved' | 'profile') => void;
  articles: Article[];
  onAddCustomArticle: (title: string, excerpt: string, category: string, content: string) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function ProfileView({ 
  user, 
  activeTab, 
  setActiveTab, 
  articles, 
  onAddCustomArticle,
  onLogout,
  onUpdateUser
}: ProfileViewProps) {
  const [profileTab, setProfileTab] = useState<'STATS' | 'POSTS' | 'SAVES'>('STATS');
  const [researchPapersOpen, setResearchPapersOpen] = useState(true);
  const [hacksOpen, setHacksOpen] = useState(false);

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
    </div>
  );
}

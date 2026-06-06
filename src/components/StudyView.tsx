import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface StudyViewProps {
  isGenerating: boolean;
  onBack: () => void;
}

export default function StudyView({ isGenerating, onBack }: StudyViewProps) {
  return (
    <div className="min-h-screen bg-[#ded9d0] dark:bg-[#0a0a0a] py-6 md:py-12 px-4 md:px-8 font-sans antialiased text-[#1c1c1c] dark:text-[#f3f3f3] transition-colors duration-300">
      
      {/* Presentation Header bar */}
      <div className="hidden md:flex max-w-[1300px] mx-auto items-center justify-between px-2 py-3 text-[10px] font-sans tracking-[0.22em] font-semibold text-[#6a6254] dark:text-neutral-400 uppercase">
        <span>01 / Core Workspace</span>
        <span><span className="font-sans font-black tracking-[0.2em] whitespace-nowrap">[ STΛQD ]</span> Technical Hud</span>
        <span>Generating Session...</span>
      </div>

      <div 
        className={`w-full mx-auto flex items-stretch lg:items-start justify-center px-2 md:px-4`}
        style={{ maxWidth: '1300px' }}
      >
        <div 
          className="bg-white dark:bg-[#121214] flex flex-col relative border border-[#F3F3F3] dark:border-white/10 min-h-screen rounded-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),_inset_0_0_12px_rgba(0,0,0,0.04)] w-full"
        >
          {/* Header */}
          <header className="h-20 bg-white dark:bg-[#121214] flex items-center justify-between px-6 md:px-10 select-none relative border-b border-[#F3F3F3] dark:border-white/10 sticky top-0 z-50">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center space-x-2 bg-white dark:bg-transparent hover:bg-neutral-50 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/20 text-[10px] font-sans uppercase tracking-[0.22em] font-extrabold text-neutral-800 dark:text-white transition-colors rounded-[4px] px-4 py-2 cursor-pointer shadow-3xs"
              >
                <span>← RETURN TO HUB</span>
              </button>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2.5 sm:space-x-3 pointer-events-none whitespace-nowrap">
              <span className="text-sm font-sans font-extrabold tracking-[0.25em] text-neutral-950 dark:text-white uppercase whitespace-nowrap">
                [ STΛQD ]
              </span>
              <span className="h-4 w-[1px] bg-neutral-200 dark:bg-white/20"></span>
              <span className="text-[10px] font-sans font-bold text-[#8E8E93] tracking-widest uppercase">
                PROCESSING...
              </span>
            </div>
            <div className="flex flex-row items-center space-x-2 text-indigo-500 animate-pulse">
               <Sparkles className="h-4 w-4" />
               <span className="text-[10px] font-mono tracking-widest font-bold">ANALYZING</span>
            </div>
          </header>

          <main className="flex-1 px-6 md:px-8 lg:px-12 pt-10 md:pt-14 lg:pt-16 bg-white dark:bg-[#121214] relative pb-24 animate-fade-in">
            <style>{`
              @keyframes gemini-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
              .gemini-skeleton {
                background-image: linear-gradient(110deg, #F1ECE1 25%, #E3E7FF 40%, #FFE6F0 50%, #E3E7FF 60%, #F1ECE1 75%);
                background-size: 200% 100%;
                animation: gemini-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
              .dark .gemini-skeleton {
                background-image: linear-gradient(110deg, #1A1A1C 25%, #2A2A35 40%, #3A2A35 50%, #2A2A35 60%, #1A1A1C 75%);
              }
            `}</style>

            {/* Giant Centered Main Title Skeleton */}
            <div className="text-center pt-2 pb-5 border-b border-[#F3F3F3] dark:border-white/10 mb-[28px] flex flex-col items-center">
              <div className="w-3/4 h-12 md:h-14 lg:h-16 rounded-xl gemini-skeleton mb-6" />
              <div className="w-1/2 h-4 rounded-md gemini-skeleton" />
            </div>

            <div 
              className="grid grid-cols-1 lg:grid gap-[64px] items-start"
              style={{ gridTemplateColumns: 'minmax(320px, 350px) 1fr' }}
            >
              {/* COLUMN 1: LEFT SIDEBAR SKELETON */}
              <div className="flex flex-col justify-start pt-0 space-y-6">
                
                {/* Audio Player Skeleton */}
                <div className="border-b border-[#F0F0F0] dark:border-white/10 pb-6">
                  <div className="w-32 h-3 rounded-md gemini-skeleton mb-4" />
                  <div className="w-full h-[140px] rounded-[16px] gemini-skeleton shadow-sm" />
                </div>
                
                {/* Cue Cards Stack Skeleton */}
                <div>
                   <div className="w-24 h-3 rounded-md gemini-skeleton mb-4" />
                   <div className="relative h-[450px] w-full pt-2">
                     <div className="absolute inset-x-0 top-0 h-[420px] rounded-[16px] gemini-skeleton z-30 shadow-lg" />
                     <div className="absolute inset-x-0 top-0 h-[420px] rounded-[16px] gemini-skeleton opacity-90 scale-[0.98] blur-[0.5px] translate-x-2 translate-y-3 rotate-[3deg] z-20" />
                     <div className="absolute inset-x-0 top-0 h-[420px] rounded-[16px] gemini-skeleton opacity-60 scale-[0.95] blur-[1px] -translate-x-3 translate-y-6 -rotate-[4deg] z-10" />
                   </div>
                </div>

                {/* Read Full Paper button skeleton */}
                <div className="w-full h-12 rounded-[8px] gemini-skeleton mt-2" />

              </div>

              {/* COLUMN 2: CENTER MAIN CONTENT SKELETON */}
              <div className="space-y-8 text-left pt-0 pb-8">
                 {/* Block 1 */}
                 <div>
                    <div className="w-64 h-5 rounded-md gemini-skeleton mb-5 ml-4" />
                    <div className="space-y-3">
                      <div className="w-full h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[95%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[98%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[90%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[96%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[85%] h-4 rounded-sm gemini-skeleton" />
                    </div>
                 </div>
                 
                 {/* Block 2 */}
                 <div className="pt-4">
                    <div className="w-80 h-5 rounded-md gemini-skeleton mb-5 ml-4" />
                    <div className="space-y-3">
                      <div className="w-full h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[97%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[92%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[99%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[88%] h-4 rounded-sm gemini-skeleton" />
                    </div>
                 </div>

                 {/* Blockquote Skeleton */}
                 <div className="w-full h-24 rounded-[12px] gemini-skeleton mt-6 mb-6 shadow-sm" />

                 {/* Block 3 */}
                 <div className="pt-2">
                    <div className="w-72 h-5 rounded-md gemini-skeleton mb-5 ml-4" />
                    <div className="space-y-3">
                      <div className="w-[98%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-full h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[94%] h-4 rounded-sm gemini-skeleton" />
                      <div className="w-[91%] h-4 rounded-sm gemini-skeleton" />
                    </div>
                 </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

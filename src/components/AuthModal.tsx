import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chrome, Github } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Main Content Wrapper (includes ID badge and absolute sidecar) */}
          <motion.div
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 90 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Heavy-Duty Branded Lanyard Strap */}
            <div className="w-20 h-[100vh] bg-[#F9F9F9] absolute bottom-[100%] mb-[-36px] left-1/2 -translate-x-1/2 shadow-[inset_4px_0_10px_rgba(0,0,0,0.06),_inset_-4px_0_10px_rgba(0,0,0,0.06)] z-0 border-x border-black/5 flex flex-col justify-end items-center overflow-hidden">
              
              {/* Vertical ZID HUB Branding */}
              <div className="absolute top-[85%] -translate-y-1/2 flex items-center justify-center">
                <span 
                  className="text-[#1C1C1E]/20 font-black uppercase tracking-[0.4em] text-3xl"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  ZID HUB
                </span>
              </div>

              {/* Metallic Rivet Clamp */}
              <div className="w-[88px] -ml-[2px] h-6 bg-gradient-to-b from-[#e0e0e0] via-[#ffffff] to-[#909090] border border-[#9ca3af] rounded-[3px] shadow-md flex items-center justify-center relative z-10 mb-[-2px]">
                 <div className="w-16 h-[1.5px] bg-black/20 rounded-full"></div>
                 <div className="w-16 h-[1px] bg-white absolute top-[13.5px] rounded-full"></div>
              </div>
            </div>

            {/* The Realistic Processed Clasp Image */}
            <div className="absolute -top-[105px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.6)]">
              <ProcessedClaspImage className="w-[120px] object-contain opacity-95 saturate-[0.85] contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* ID Badge Container (The Cream Base) */}
            <div className="relative w-[350px] h-[550px] bg-[#FDF4E3] rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-20 mt-4">
              
              {/* Deep Punched Hole */}
              <div className="w-6 h-6 rounded-full bg-[#151515] absolute top-4 left-1/2 -translate-x-1/2 shadow-[inset_0_6px_8px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.9)] border border-black/50 z-20"></div>

              {/* Abstract Wavy Graphics - Top Right */}
              <svg className="absolute top-0 right-0 w-[240px] h-[340px] z-0" viewBox="0 0 240 340" fill="none">
                <path d="M 60 0 C 60 120, 160 180, 160 260 C 160 300, 200 340, 240 340 L 240 0 Z" fill="#2A2A2A" />
                <path d="M 120 0 C 120 100, 200 120, 200 200 C 200 240, 220 280, 240 280 L 240 0 Z" fill="#3D7C8A" />
                <path d="M 180 0 C 180 60, 220 80, 220 160 C 220 180, 240 200, 240 200 L 240 0 Z" fill="#E56B5B" />
              </svg>

              {/* Abstract Wavy Graphics - Bottom Left */}
              <svg className="absolute bottom-0 left-0 w-[280px] h-[220px] z-0" viewBox="0 0 280 220" fill="none">
                <path d="M 0 20 C 100 20, 100 160, 200 160 C 240 160, 260 220, 280 220 L 0 220 Z" fill="#2A2A2A" />
                <path d="M 0 80 C 60 80, 60 180, 140 180 C 180 180, 200 220, 220 220 L 0 220 Z" fill="#3D7C8A" />
                <path d="M 0 140 C 40 140, 40 200, 80 200 C 110 200, 130 220, 150 220 L 0 220 Z" fill="#E56B5B" />
                <circle cx="80" cy="180" r="8" fill="#E56B5B" />
              </svg>

              {/* Orange ID Pill at Bottom */}
              <div className="absolute bottom-6 right-6 bg-[#E88B67] px-4 py-1.5 rounded-full text-white text-[10px] font-mono tracking-widest font-bold shadow-sm z-10">
                ID: 112-245-259-009
              </div>

              {/* Branding Header Block */}
              <div className="absolute top-[80px] left-0 bg-[#E56B5B] pl-8 pr-10 py-5 rounded-r-[2rem] shadow-md z-20 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FDF4E3] flex flex-col items-center justify-center pt-0.5 shadow-inner">
                  <div className="w-3.5 h-3.5 bg-[#E56B5B] rounded-full mb-[1px]"></div>
                  <div className="w-2 h-1.5 bg-[#E56B5B] rounded-b-sm"></div>
                </div>
                <div className="flex flex-col text-left">
                  <h2 className="text-[#FDF4E3] text-[22px] font-bold font-serif leading-none tracking-tight">ZID Hub</h2>
                  <h3 className="text-[#FDF4E3]/90 text-[10px] font-sans font-medium tracking-widest mt-1.5 uppercase">Platform Access</h3>
                </div>
              </div>

              {/* Centered Login Form */}
              <div className="absolute top-[230px] left-0 w-full px-10 flex flex-col items-center text-center z-20">
                <div className="w-full space-y-3.5 mb-8">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-neutral-300 text-neutral-800 placeholder-neutral-500 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-500 focus:bg-white transition-colors shadow-inner"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-neutral-300 text-neutral-800 placeholder-neutral-500 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-500 focus:bg-white transition-colors shadow-inner"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-neutral-300 text-neutral-800 placeholder-neutral-500 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-500 focus:bg-white transition-colors shadow-inner"
                  />
                </div>
                <button className="w-full py-4 bg-[#2A2A2A] text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-[0_8px_16px_rgba(42,42,42,0.3)] hover:bg-black transition-all active:scale-[0.98]">
                  AUTHORIZE
                </button>
              </div>

            </div>

            {/* Modular OAuth Sidecar */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-[72px] bg-[#1C1C1E]/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-4 shadow-xl z-0">
              <button 
                title="Continue with Google"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer border border-transparent hover:border-white/20 shadow-sm"
              >
                <Chrome className="w-5 h-5" />
              </button>
              <button 
                title="Continue with GitHub"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer border border-transparent hover:border-white/20 shadow-sm"
              >
                <Github className="w-5 h-5" />
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProcessedClaspImage({ className }: { className?: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Target pitch black (or very dark) pixels to make them transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const maxVal = Math.max(r, g, b);
        if (maxVal < 25) {
          data[i + 3] = 0; // Set alpha to 0 (fully transparent)
        } else if (maxVal < 60) {
          // Anti-alias smooth transition for dark edges
          data[i + 3] = Math.floor(((maxVal - 25) / 35) * 255);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = '/clasp_raw.png';
  }, []);

  if (!dataUrl) return null;
  return <img src={dataUrl} className={className} alt="Realistic Metallic Clasp" draggable={false} />;
}

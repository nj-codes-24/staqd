import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chrome, Github } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate terminal security check
    setTimeout(() => {
      setIsLoading(false);
      setError('ACCESS DENIED - RETRY');
      
      // Auto clear error message
      setTimeout(() => setError(null), 3000);
    }, 1500);
  };

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
            <div className="w-20 h-[100vh] bg-[#F9F9F9] absolute bottom-[100%] mb-[-36px] left-1/2 -translate-x-1/2 shadow-[inset_4px_0_10px_rgba(0,0,0,0.06),_inset_-4px_0_10px_rgba(0,0,0,0.06)] z-0 flex flex-col justify-end items-center overflow-hidden">
              
              {/* Vertical ZID HUB Branding */}
              <div className="absolute top-[85%] -translate-y-1/2 flex items-center justify-center">
                <span 
                  className="text-[#1C1C1E]/20 font-black uppercase tracking-[0.4em] text-3xl"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  ZID HUB
                </span>
              </div>
            </div>

            {/* The Realistic Processed Clasp Image */}
            <div className="absolute -top-[105px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.6)]">
              <ProcessedClaspImage className="w-[120px] object-contain opacity-95 saturate-[0.85] contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* The Plastic Sleeve (Outer Container) */}
            <div className="relative w-[360px] h-[570px] bg-[#2A2A2A]/80 rounded-[20px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.1),_0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 p-3 z-20 mt-4 backdrop-blur-md">
              
              {/* Deep Punched Hole (On the Plastic Sleeve) */}
              <div className="w-[48px] h-[12px] rounded-full bg-[#151515] absolute top-3 left-1/2 -translate-x-1/2 shadow-[inset_0_6px_8px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] border border-black/80 z-30"></div>

              {/* Inner Card & Diagonal Split */}
              <div 
                className="w-full h-full rounded-[10px] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] before:opacity-[0.15] before:z-10 before:pointer-events-none"
                style={{ background: 'linear-gradient(160deg, #FBBF24 0%, #FBBF24 35%, #121212 35.1%, #121212 100%)' }}
              >
                
                {/* Typography & Branding */}
                <div className="absolute top-12 right-6 flex flex-col items-end z-20">
                  <h2 className="text-[#121212] text-3xl font-black font-sans tracking-tighter leading-none">
                    ZID HUB
                  </h2>
                  <h3 className="text-[#121212]/80 font-mono text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">
                    Platform Access
                  </h3>
                </div>

                {/* Login/Signup Toggle */}
                <div className="absolute top-[210px] w-full flex justify-end px-8 z-20">
                  <div className="bg-black/40 p-1 rounded-full flex gap-1 border border-white/5 shadow-inner">
                    <button 
                      onClick={() => setMode('login')}
                      className={`px-6 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] transition-all duration-200 ${mode === 'login' ? 'bg-[#FBBF24] text-black shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                    >
                      LOGIN
                    </button>
                    <button 
                      onClick={() => setMode('signup')}
                      className={`px-6 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] transition-all duration-200 ${mode === 'signup' ? 'bg-[#FBBF24] text-black shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                    >
                      SIGNUP
                    </button>
                  </div>
                </div>

                {/* The Modern "Dossier" Input Fields */}
                <div className="absolute top-[280px] left-0 w-full px-8 flex flex-col z-20">
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="flex items-end gap-4 w-full">
                      <label className="text-white/70 font-mono font-black tracking-[0.2em] uppercase text-sm shrink-0 leading-none pb-1">
                        NAME :
                      </label>
                      <input 
                        type="text" 
                        className="flex-1 bg-transparent outline-none ring-0 border-b-2 border-white/40 focus:border-white transition-colors text-white font-bold tracking-wide text-sm pb-1 px-1 leading-none"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex items-end gap-4 w-full">
                      <label className="text-white/70 font-mono font-black tracking-[0.2em] uppercase text-sm shrink-0 leading-none pb-1">
                        MAIL :
                      </label>
                      <input 
                        type="email" 
                        className="flex-1 bg-transparent outline-none ring-0 border-b-2 border-white/40 focus:border-white transition-colors text-white font-bold tracking-wide text-sm pb-1 px-1 leading-none"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="flex items-end gap-4 w-full">
                      <label className="text-white/70 font-mono font-black tracking-[0.2em] uppercase text-sm shrink-0 leading-none pb-1">
                        CODE :
                      </label>
                      <input 
                        type="password" 
                        className="flex-1 bg-transparent outline-none ring-0 border-b-2 border-white/40 focus:border-white transition-colors text-white font-bold tracking-wide text-sm pb-1 px-1 leading-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <div className="absolute bottom-20 left-0 w-full flex justify-center z-20 h-4">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-orange-500/80 text-[10px] tracking-widest font-mono font-bold uppercase"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* The Authenticate Button */}
                <div className="absolute bottom-8 left-0 w-full px-8 z-20">
                  <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-3 h-[42px] flex justify-center items-center border border-[#FBBF24] bg-gradient-to-br from-[#1c1c1c] to-[#121212] text-[#FBBF24] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-xs rounded-md shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#FBBF24] hover:to-[#FBBF24] hover:text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-[0.98]'}`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      mode === 'login' ? 'AUTHENTICATE' : 'SIGN UP'
                    )}
                  </button>
                </div>

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
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setDataUrl('/clasp_raw.png');
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const maxVal = Math.max(data[i], data[i + 1], data[i + 2]);
        if (maxVal < 25) {
          data[i + 3] = 0;
        } else if (maxVal < 60) {
          data[i + 3] = Math.floor(((maxVal - 25) / 35) * 255);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      // Fallback to raw image if canvas manipulation fails
      setDataUrl('/clasp_raw.png');
    };
    img.src = '/clasp_raw.png';
  }, []);

  if (!dataUrl) return null;
  return <img src={dataUrl} className={className} alt="Realistic Metallic Clasp" draggable={false} />;
}

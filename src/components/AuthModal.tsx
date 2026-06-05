import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chrome, Github, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const prefix = email.split('@')[0] || '';
  const finalDerivedName = prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'GUEST';
  const nameParts = finalDerivedName.split(' ');

  const handleFinalEntry = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authName', finalDerivedName);
    onAuthSuccess?.();
    setIsSuccess(false);
    setMode('login');
    setEmail('');
    setPassword('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!email.trim()) {
      setError(mode === 'login' ? "ERROR: USER OR MAIL REQUIRED" : "ERROR: MAIL REQUIRED");
      return;
    }
    
    if (mode === 'signup') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("ERROR: INVALID MAIL FORMAT");
        return;
      }
    }
    
    if (!password.trim()) {
      setError("ERROR: CODE REQUIRED");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const getDynamicFontSize = (str: string) => {
    if (str.length > 12) return '2rem';
    return '3rem';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl ${!isOpen ? 'pointer-events-none' : ''}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 90 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-[100vh] bg-[#F9F9F9] absolute bottom-[100%] mb-[-36px] left-1/2 -translate-x-1/2 shadow-[inset_4px_0_10px_rgba(0,0,0,0.06),_inset_-4px_0_10px_rgba(0,0,0,0.06)] z-0 flex flex-col justify-end items-center overflow-hidden">
              <div className="absolute top-[85%] -translate-y-1/2 flex items-center justify-center">
                <span 
                  className="text-[#1C1C1E]/20 font-black uppercase tracking-[0.4em] text-3xl"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  ZID HUB
                </span>
              </div>
            </div>

            <div className="absolute -top-[105px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.6)]">
              <ProcessedClaspImage className="w-[120px] object-contain opacity-95 saturate-[0.85] contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="relative w-[360px] h-[570px] bg-[#2A2A2A]/80 rounded-[20px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.1),_0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 p-3 z-20 mt-4 backdrop-blur-md">
              <div className="w-[48px] h-[12px] rounded-full bg-[#151515] absolute top-3 left-1/2 -translate-x-1/2 shadow-[inset_0_6px_8px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.2)] border border-black/80 z-30"></div>

              <div className="w-full h-full rounded-[10px] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-[#121212] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] before:opacity-[0.08] before:z-30 before:pointer-events-none">
                {/* The Morphing Success Background */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      key="success-bg"
                      initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 45%)' }}
                      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 60%)' }}
                      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                      className="absolute inset-0 w-full h-full bg-[#FBBF24] z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Typography & Branding (Static, Always Visible) */}
                <div className="absolute top-12 right-6 flex flex-col items-end z-30 pointer-events-none">
                  <h2 className="text-[#121212] text-3xl font-black font-sans tracking-tighter leading-none">
                    ZID HUB
                  </h2>
                  <h3 className="text-[#121212]/80 font-mono text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">
                    Platform Access
                  </h3>
                </div>

                {/* SUCCESS Identity Block */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      key="success-identity"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-end w-full px-8 pb-24 z-0 pointer-events-none text-center"
                    >
                      <h1 className="font-bold text-white uppercase drop-shadow-md tracking-tighter flex flex-col items-center justify-center text-center w-full">
                        {nameParts.length === 1 ? (
                          <span className="block whitespace-nowrap text-center" style={{ fontSize: getDynamicFontSize(nameParts[0]), lineHeight: 1 }}>{nameParts[0]}</span>
                        ) : (
                          <>
                            <span className="block whitespace-nowrap text-center" style={{ fontSize: getDynamicFontSize(nameParts[0]), lineHeight: 1 }}>{nameParts[0]}</span>
                            <span className="block whitespace-nowrap text-center" style={{ fontSize: getDynamicFontSize(nameParts.slice(1).join(' ')), lineHeight: 1 }}>{nameParts.slice(1).join(' ')}</span>
                          </>
                        )}
                      </h1>
                      <div className="text-[10px] text-white/50 tracking-[0.4em] uppercase mt-2 font-bold text-center">
                        WELCOME
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* LOGIN Form & Diagonal Background */}
                <AnimatePresence>
                  {!isSuccess && (
                    <motion.div 
                      key="login-form"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full z-20"
                    >
                      <div className="absolute inset-0 w-full h-full z-0" style={{ background: 'linear-gradient(160deg, #FBBF24 0%, #FBBF24 35%, #121212 35.1%, #121212 100%)' }} />
                      
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

                      <div className="absolute top-[280px] left-0 w-full px-8 flex flex-col z-20">
                        <div className="space-y-10 mt-4">
                          <div className="flex flex-col items-start w-full gap-3">
                            <label className="text-xs tracking-widest text-white/40 uppercase font-mono leading-none whitespace-nowrap">{mode === 'login' ? 'USER / MAIL' : 'MAIL'}</label>
                            <input type="text" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} placeholder={mode === 'login' ? "ENTER ID OR EMAIL..." : "ENTER EMAIL..."} className="w-full bg-transparent outline-none ring-0 border-b border-white/10 focus:border-[#FBBF24] focus:bg-white/[0.02] transition-all duration-300 rounded-t-sm text-white tracking-widest text-sm font-mono pb-2 px-2 leading-none placeholder:text-xs placeholder:tracking-[0.2em] placeholder:text-white/15 placeholder:font-mono placeholder:font-normal" />
                          </div>
                          <div className="flex flex-col items-start w-full gap-3">
                            <label className="text-xs tracking-widest text-white/40 uppercase font-mono leading-none whitespace-nowrap">CODE</label>
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} placeholder="ENTER AUTH CODE..." className="w-full bg-transparent outline-none ring-0 border-b border-white/10 focus:border-[#FBBF24] focus:bg-white/[0.02] transition-all duration-300 rounded-t-sm text-white tracking-widest text-sm font-mono pb-2 px-2 leading-none placeholder:text-xs placeholder:tracking-[0.2em] placeholder:text-white/15 placeholder:font-mono placeholder:font-normal" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-20 left-0 w-full flex justify-center z-20 h-4 pointer-events-none">
                        <AnimatePresence>
                          {error && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-orange-500/80 text-[10px] tracking-widest font-mono font-bold uppercase">{error}</motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-8 left-0 w-full px-8 z-30">
                  <button 
                    onClick={isSuccess ? handleFinalEntry : handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-3 h-[42px] flex justify-center items-center border border-[#FBBF24] bg-gradient-to-br from-[#1c1c1c] to-[#121212] text-[#FBBF24] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-xs rounded-md shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#FBBF24] hover:to-[#FBBF24] hover:text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-[0.98]'}`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    ) : isSuccess ? (
                      <ArrowRight className="w-5 h-5 mx-auto text-current drop-shadow-md" />
                    ) : (
                      mode === 'login' ? 'AUTHENTICATE' : 'SIGN UP'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-[72px] bg-[#1C1C1E]/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-4 shadow-xl z-0">
              <button title="Continue with Google" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer border border-transparent hover:border-white/20 shadow-sm">
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

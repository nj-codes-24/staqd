import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X, ChevronRight } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerforatedEdge = ({ position = 'top' }: { position?: 'top' | 'bottom' }) => (
  <div 
    className={`absolute left-0 right-0 h-[6px] md:h-[8px] w-full z-10 ${position === 'top' ? '-top-[6px] md:-top-[8px]' : '-bottom-[6px] md:-bottom-[8px]'}`}
    style={{
      background: '#fefcf8',
      maskImage: position === 'top' 
        ? 'radial-gradient(circle at 6px 0px, transparent 4px, black 4.5px)' 
        : 'radial-gradient(circle at 6px 100%, transparent 4px, black 4.5px)',
      maskSize: '12px 100%',
      maskRepeat: 'repeat-x',
      WebkitMaskImage: position === 'top' 
        ? 'radial-gradient(circle at 6px 0px, transparent 4px, black 4.5px)' 
        : 'radial-gradient(circle at 6px 100%, transparent 4px, black 4.5px)',
      WebkitMaskSize: '12px 100%',
      WebkitMaskRepeat: 'repeat-x',
    }}
  />
);

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isCheckRevealed, setIsCheckRevealed] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsBookOpen(false); // Reset to closed when re-opened
      setIsCheckRevealed(false); // Reset to unrevealed
    }
  }, [isOpen]);

  // When book is closed, keep check unrevealed as well
  useEffect(() => {
    if (!isBookOpen) {
      setIsCheckRevealed(false);
    }
  }, [isBookOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-md overflow-hidden"
          onClick={onClose}
        >
          {/* Global Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[60] p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-md border border-white/10 cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>

          {/* Scaler Wrapper for Responsiveness */}
          <div 
            className="w-full flex items-center justify-center scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform duration-500 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
              THE 3D PARENT CONTAINER 
              We use animate={{ x: isBookOpen ? '50%' : 0 }} to keep the book 
              perfectly centered on screen when it doubles in width (opens to the left).
            */}
            <motion.div 
              className="relative w-[380px] h-[600px]"
              style={{ perspective: 1800 }}
              animate={{ x: isBookOpen ? '50%' : 0 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
              
              {/* === RIGHT INSIDE PAGE (THE BASE POCKET FOLDER) === */}
              <div className="absolute inset-0 w-full h-full bg-[#E8E0D2] rounded-r-[24px] shadow-[inset_15px_0_40px_rgba(0,0,0,0.06)] border-y border-r border-[#d3ccbc] overflow-hidden flex flex-col z-10">
                
                {/* Elegant Background Texture / Text */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 opacity-[0.07] font-serif text-5xl font-black tracking-[0.4em] uppercase whitespace-nowrap z-0 select-none">
                  CHECK
                </div>

                {/* LAYER 2: CHOREOGRAPHED SKEUOMORPHIC RECEIPT */}
                <motion.div
                  className="absolute left-[8%] right-[8%] z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] origin-top select-none pointer-events-none"
                  style={{ top: '65px' }}
                  initial={{ y: 260 }}
                  animate={{ y: isCheckRevealed ? -42 : 260 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <div className="w-full relative z-10">
                    <PerforatedEdge position="top" />

                    <div className="px-6 py-6 md:px-7 bg-[#fefcf8] text-[#1a1a1a] font-mono text-[13px] shadow-[inset_0_0_40px_rgba(0,0,0,0.02)] border-x border-[#f5f1e8]">
                      
                      {/* Dotted pull indicator & PULL UP microcopy */}
                      <div className="text-center pt-1 mb-3">
                        <div className="text-[10px] font-bold text-neutral-400/80 tracking-[0.25em] select-none">
                          ::: PULL UP :::
                        </div>
                        <div className="border-t border-dashed border-stone-200 mt-2 mx-auto w-10"></div>
                      </div>

                      <div className="text-center mb-4">
                        <h3 className="font-bold text-base tracking-widest uppercase mb-1 text-neutral-900 border-b-[3px] border-black pb-1 inline-block">ZID HUB CHECK</h3>
                        <p className="text-neutral-500 text-[10px] mt-1">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                      </div>

                      <div className="border-t-2 border-dashed border-neutral-300 my-4"></div>

                      <ul className="space-y-2.5 font-medium leading-relaxed mb-4 text-neutral-700 text-xs">
                        <li className="flex justify-between items-end">
                          <span className="leading-tight pr-4">01. Unlimited AI Synthetics</span>
                          <span className="font-bold">$40.00</span>
                        </li>
                        <li className="flex justify-between items-end">
                          <span className="leading-tight pr-4">02. Auto-Cue Card Decks</span>
                          <span className="font-bold">$25.00</span>
                        </li>
                        <li className="flex justify-between items-end">
                          <span className="leading-tight pr-4">03. Voice Synthesis Module</span>
                          <span className="font-bold">$35.00</span>
                        </li>
                        <li className="flex justify-between items-end">
                          <span className="leading-tight pr-4">04. Scholar Network Access</span>
                          <span className="font-bold">$30.00</span>
                        </li>
                      </ul>

                      <div className="border-t-2 border-dashed border-neutral-300 my-4"></div>

                      <div className="space-y-1.5 mt-3 font-bold text-xs">
                        <div className="flex justify-between text-neutral-500 font-normal">
                          <span>Subtotal</span>
                          <span>$130.00</span>
                        </div>
                        <div className="flex justify-between text-neutral-500 font-normal">
                          <span>Tax (8%)</span>
                          <span>$10.40</span>
                        </div>
                        <div className="flex justify-between text-base mt-3 pt-3 border-t-[3px] border-black text-black">
                          <span>TOTAL</span>
                          <span>$140.40</span>
                        </div>
                      </div>

                    </div>

                    <PerforatedEdge position="bottom" />
                  </div>
                </motion.div>

                {/* LAYER 3: THE SLEEVE POCKET (CONVERTED TO INTERACTIVE BUTTON WITH HOVER STATE) */}
                <button 
                  onClick={() => setIsCheckRevealed(prev => !prev)}
                  className="absolute bottom-0 left-0 right-0 h-[45%] z-20 bg-[#2C3742] rounded-br-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.4)] border-t border-white/10 flex flex-col items-center justify-between p-6 pointer-events-auto cursor-pointer group text-left select-none outline-none focus:outline-none"
                  style={{
                    clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0% 100%)',
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
                  }}
                >
                  {/* Subtle Centered "TAP TO REVEAL" Debossed Text */}
                  <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
                    <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[#DECCB3]/40 group-hover:text-[#FFF4DC] group-hover:brightness-110 transition-all duration-300 select-none">
                      {isCheckRevealed ? "TAP TO COLLAPSE" : "TAP TO REVEAL"}
                    </span>
                  </div>

                  {/* Aesthetic label at final corner */}
                  <div className="mt-auto w-full flex justify-end">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 truncate">
                      ZID / F-001
                    </p>
                  </div>
                </button>

                {/* SMOOTH FADE-IN "PAY NOW" BUTTON */}
                <AnimatePresence>
                  {isCheckRevealed && (
                    <motion.button 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="absolute bottom-12 left-[12%] right-[12%] h-14 bg-zinc-950 border border-[rgba(212,175,55,0.45)] text-amber-200/90 font-sans font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.6),_inset_0_1px_2px_rgba(255,255,255,0.12)] hover:shadow-[0_25px_55px_rgba(212,175,55,0.18),_0_20px_45px_rgba(0,0,0,0.6)] rounded-xl z-30 group cursor-pointer pointer-events-auto hover:bg-zinc-900"
                    >
                      <span>PAY NOW</span>
                      <CreditCard className="w-5 h-5 text-amber-200/80 group-hover:scale-115 group-hover:text-amber-200 transition-all duration-300" />
                    </motion.button>
                  )}
                </AnimatePresence>

              </div>

              {/* === FRONT COVER (SWINGS LEFT) === */}
              <motion.div
                className="absolute inset-0 w-full h-full z-30 transform-gpu"
                style={{ originX: 0, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateY: isBookOpen ? -180 : 0 }}
                transition={{ type: 'spring', stiffness: 45, damping: 16 }}
              >
                
                {/* OUTSIDE COVER (Visible when closed) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#1E272E] rounded-r-[24px] shadow-2xl border border-[#34424F] flex flex-col items-center justify-center cursor-pointer group pointer-events-auto"
                  style={{ backfaceVisibility: 'hidden', backgroundImage: 'radial-gradient(circle at 70% 30%, #2A3641 0%, transparent 80%)' }}
                  onClick={() => setIsBookOpen(true)}
                >
                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-[#141A1F] rounded-l-[2px] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.5)] z-0"></div>
                  
                  <div className="w-[82%] h-[88%] border border-[#3E4F5E] rounded-xl flex flex-col items-center p-10 relative overflow-hidden z-10">
                    <div className="absolute top-0 w-full h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_4px]"></div>
                    
                    <div className="mt-12 text-center z-10 w-full">
                      <h2 className="font-serif text-5xl font-black text-[#F4EFE6] tracking-widest uppercase mb-1">ZID HUB</h2>
                      <div className="h-[2px] w-16 bg-amber-600/70 mx-auto my-6"></div>
                      <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#A69B88] font-bold">Premium Workspace</p>
                    </div>

                    <div className="mt-auto mb-8 z-10 space-y-4 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-[#2A3641] border border-[#485B6C] flex items-center justify-center text-[#F4EFE6] group-hover:scale-110 group-hover:bg-[#3E4F5E] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A8A99] group-hover:text-[#DECCB3] transition-colors font-bold">Tap to Open</span>
                    </div>
                  </div>
                </div>

                {/* INSIDE COVER (The Left Page Pitch, visible when open) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#E8E0D2] rounded-l-[24px] border-y border-l border-[#d3ccbc] shadow-[inset_-20px_0_40px_rgba(0,0,0,0.07)] flex flex-col pointer-events-auto"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <div className="p-10 lg:p-14 flex flex-col h-full relative text-left">
                    
                    {/* Visual Polish: Clean, perfect left alignment & vertical balance */}
                    <h2 className="text-4xl font-serif font-black uppercase text-[#1a1a1a] leading-[1.1] tracking-tight mb-8">
                      SCALE YOUR KNOWLEDGE,<br />SEAMLESSLY.
                    </h2>
                    
                    <div className="w-[40px] h-[3px] bg-[#1a1a1a] mb-8"></div>

                    <div className="flex-1 w-full relative mt-auto flex flex-col justify-end">
                      
                      {/* Visual Polish: Embedded-looking Ink Grayscale Illustration */}
                      <div className="w-full h-[220px] bg-[url('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&q=80&w=800')] bg-contain bg-bottom bg-no-repeat mix-blend-multiply opacity-60 grayscale contrast-[1.2] mb-6 filter drop-shadow-sm border border-black/10 rounded-[4px] p-0.5 bg-stone-100">
                      </div>

                      <p className="font-mono text-[11px] text-[#4A4740] uppercase font-bold tracking-[0.15em] leading-relaxed border-l-[3px] border-amber-800/40 pl-4 w-full">
                        Unlock deep architectures, auto-generated cues, & audio synthesis.
                      </p>
                    </div>

                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

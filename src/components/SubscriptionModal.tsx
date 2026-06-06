import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBookOpen: boolean;
  setIsBookOpen: (open: boolean) => void;
  isCheckRevealed: boolean;
  setIsCheckRevealed: (revealed: boolean) => void;
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
      WebkitMaskRepeatX: 'repeat',
    }}
  />
);

export default function SubscriptionModal({
  isOpen,
  onClose,
  isBookOpen,
  setIsBookOpen,
  isCheckRevealed,
  setIsCheckRevealed
}: SubscriptionModalProps) {
  const [checkoutStep, setCheckoutStep] = useState<'pitch' | 'payment'>('pitch');
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI'>('CARD');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('IN');
  const [gstNumber, setGstNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosingInstantly, setIsClosingInstantly] = useState(false);
  const animationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsBookOpen(false); // Reset to closed when re-opened
      setIsCheckRevealed(false); // Reset to unrevealed
      setCheckoutStep('pitch'); // Reset to pitch
      setPlanType('monthly');
      setPaymentMethod('CARD');
      setFullName('');
      setCountry('IN');
      setGstNumber('');
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setIsSubmitting(false);
      setSubmitSuccess(false);
      setIsClosing(false);
      setIsClosingInstantly(false);
    }
  }, [isOpen, setIsBookOpen, setIsCheckRevealed]);

  // When book is closed, keep check unrevealed as well
  useEffect(() => {
    if (!isBookOpen) {
      setIsCheckRevealed(false);
    }
  }, [isBookOpen, setIsCheckRevealed]);

  const handleClose = () => {
    if (isClosing || isClosingInstantly || isSubmitting) return;

    if (isBookOpen) {
      setIsClosing(true);
      setIsBookOpen(false);
      // Total unmount delay: Fold (800ms) + Vanish (250ms)
      animationTimerRef.current = setTimeout(() => {
        onClose();
      }, 1050);
    } else {
      handleImmediateClose();
    }
  };

  const handleImmediateClose = () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setIsClosingInstantly(true);
    onClose();
  };

  if (isClosingInstantly) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-md overflow-hidden"
        >
          {/* Invisible Overlay to block background interactions without closing */}
          <div className="absolute inset-0 z-40" />
          {/* Custom style block for smooth animations and technical texture */}
          <style>{`
            @keyframes shimmer-sweep {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            .shimmer-text-dark {
              background: linear-gradient(90deg, #7A8A99 0%, #E8E0D2 25%, #7A8A99 50%, #E8E0D2 75%, #7A8A99 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
              animation: shimmer-sweep 3s linear infinite;
            }
            .shimmer-text-gold {
              background: linear-gradient(90deg, rgb(222, 204, 179) 0%, rgb(255, 244, 220) 25%, rgb(222, 204, 179) 50%, rgb(255, 244, 220) 75%, rgb(222, 204, 179) 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
              animation: shimmer-sweep 2.5s linear infinite;
            }
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 12px rgba(212, 175, 55, 0.25), 0 20px 45px rgba(0, 0, 0, 0.6);
              }
              50% {
                box-shadow: 0 0 24px rgba(212, 175, 55, 0.55), 0 20px 45px rgba(0, 0, 0, 0.6);
              }
            }
            .button-pulse-glow {
              animation: pulse-glow 2s infinite ease-in-out;
            }
            .workspace-grid {
              background-image: 
                linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px);
              background-size: 24px 24px;
            }
            .strike-through {
              position: relative;
            }
            .strike-through::after {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              width: 0;
              height: 1.5px;
              background: #000;
              transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
            }
            .strike-through.active::after {
              width: 100%;
            }
            .paper-input {
              width: 100%;
              background: transparent !important;
              border: none;
              border-bottom: 1px solid rgba(130, 120, 100, 0.4);
              height: 40px;
              line-height: 24px;
              padding: 16px 4px 1px 4px;
              font-family: inherit;
              font-size: 14.5px;
              outline: none;
              color: #1a1a1a;
              font-weight: 550;
              border-radius: 0;
              transition: all 0.2s ease-in-out;
            }
            .paper-input:focus {
              border-bottom: 2px solid #000000;
              background: transparent !important;
              box-shadow: none;
              outline: none;
            }
            .paper-select {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              cursor: pointer;
            }
            .paper-select-arrow {
              pointer-events: none;
              position: absolute;
              right: 12px;
              top: calc(50% + 8px);
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #1a1a1a;
            }
            .debossed-card {
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
            }
          `}</style>

          {/* Global Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={`absolute top-6 right-6 z-[60] p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-md border border-white/10 cursor-pointer ${(isClosing || isSubmitting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <X size={20} strokeWidth={2} />
          </button>

          {/* Scaler Wrapper for Responsiveness */}
          <div
            className="flex items-center justify-center scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform duration-500 relative z-50 pointer-events-none"
          >
            {/* THE 3D PARENT CONTAINER 
            */}
            <motion.div
              className="relative w-[380px] h-[600px] pointer-events-auto"
              style={{ perspective: 1000 }}
              onClick={(e) => e.stopPropagation()}
              animate={{
                x: isBookOpen ? '50%' : 0,
                scale: isClosing ? 0.95 : 1,
                opacity: isClosing ? 0 : 1
              }}
              transition={{
                x: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 0.25, delay: isClosing ? 0.8 : 0, ease: "easeInOut" },
                opacity: { duration: 0.25, delay: isClosing ? 0.8 : 0, ease: "easeInOut" }
              }}
            >

              {/* === RIGHT INSIDE PAGE (THE BASE POCKET FOLDER) === */}
              <div className="absolute inset-0 w-full h-full bg-[#E8E0D2] rounded-r-[24px] shadow-[inset_15px_0_40px_rgba(0,0,0,0.06)] border-y border-r border-[#d3ccbc] overflow-hidden flex flex-col z-10 workspace-grid">

                {/* LAYER 2: CHOREOGRAPHED SKEUOMORPHIC RECEIPT */}
                <motion.div
                  className="absolute left-[8%] right-[8%] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] origin-top select-none pointer-events-none"
                  style={{ top: '65px' }}
                  initial={{ y: 205, zIndex: 10, opacity: 0.9 }}
                  animate={{
                    y: isCheckRevealed ? -16 : 205,
                    zIndex: isCheckRevealed ? 25 : 10,
                    opacity: isCheckRevealed ? 1 : 0.9
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200, damping: 25
                  }}
                >
                  <motion.div layout transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="w-full relative z-10 flex flex-col items-center">
                    <motion.div layout className={`w-full bg-[#fefcf8] relative rounded-t-sm transition-shadow duration-700 ${submitSuccess ? 'shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'shadow-[0_5px_15px_rgba(0,0,0,0.1)]'}`}>
                      <div className="px-6 py-6 md:px-7 bg-[#fefcf8] text-[#1a1a1a] font-mono text-sm relative overflow-hidden">

                        <div className="text-center mb-4 mt-2">
                          <h3 className="font-sans font-black text-base tracking-[0.2em] uppercase mb-1 text-neutral-900 border-b-[3px] border-black pb-1 inline-block whitespace-nowrap"><span className="text-[#FF5500]">[</span> STΛQD <span className="text-[#FF5500]">]</span> BILL</h3>
                          <p className="text-neutral-500 text-[10px] mt-1 pr-1">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        </div>

                        <AnimatePresence mode="wait">
                          {!submitSuccess ? (
                            <motion.div
                              key="billing"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="border-t-2 border-dashed border-neutral-300 my-4"></div>

                              <ul className="space-y-2.5 font-medium leading-relaxed mb-4 text-neutral-700 text-xs">
                                <li className="flex justify-between items-end">
                                  <span className="leading-tight pr-4">01. Unlimited AI Synthetics</span>
                                  <span className="font-bold">${planType === 'monthly' ? '40.00' : '33.20'}</span>
                                </li>
                                <li className="flex justify-between items-end">
                                  <span className="leading-tight pr-4">02. Auto-Cue Card Decks</span>
                                  <span className="font-bold">${planType === 'monthly' ? '25.00' : '20.75'}</span>
                                </li>
                                <li className="flex justify-between items-end">
                                  <span className="leading-tight pr-4">03. Voice Synthesis Module</span>
                                  <span className="font-bold">${planType === 'monthly' ? '35.00' : '29.05'}</span>
                                </li>
                                <li className="flex justify-between items-end">
                                  <span className="leading-tight pr-4">04. Scholar Network Access</span>
                                  <span className="font-bold">${planType === 'monthly' ? '30.00' : '24.90'}</span>
                                </li>
                              </ul>

                              <div className="border-t-2 border-dashed border-neutral-300 my-4"></div>

                              <div className="space-y-1.5 mt-3 font-bold text-xs relative">
                                <div className="flex justify-between text-neutral-500 font-normal">
                                  <span>Subtotal</span>
                                  <div className="flex flex-col items-end">
                                    <span className={`strike-through ${planType === 'yearly' ? 'active text-neutral-400' : ''}`}>$130.00</span>
                                    {planType === 'yearly' && (
                                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-black font-bold">$107.90</motion.span>
                                    )}
                                  </div>
                                </div>

                                {planType === 'yearly' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex justify-between text-amber-700/80 font-bold italic text-[10px]"
                                  >
                                    <span>Annual Discount Applied</span>
                                    <span>-17%</span>
                                  </motion.div>
                                )}

                                <div className="flex justify-between text-neutral-500 font-normal">
                                  <span>Tax (8%)</span>
                                  <span>${planType === 'monthly' ? '10.40' : '8.63'}</span>
                                </div>

                                <div className="flex justify-between text-base mt-3 pt-3 border-t-[3px] border-black text-black">
                                  <span>TOTAL</span>
                                  <div className="flex flex-col items-end">
                                    <span className={`strike-through ${planType === 'yearly' ? 'active text-neutral-400 text-xs' : ''}`}>$140.40</span>
                                    {planType === 'yearly' && (
                                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black">$116.53</motion.span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="features"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div className="border-t-2 border-dashed border-neutral-300 mt-4 mb-5"></div>
                              <ul className="space-y-4 font-medium leading-relaxed text-neutral-800 text-xs pb-1">
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 mr-3 text-neutral-900 shrink-0 mt-0.5" />
                                  <span><strong className="block text-sm mb-0.5 text-black">Unlimited AI Synthetics</strong> <span className="text-neutral-500">(Enhanced Access)</span></span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 mr-3 text-neutral-900 shrink-0 mt-0.5" />
                                  <span><strong className="block text-sm mb-0.5 text-black">Auto-Cue Card Decks</strong> <span className="text-neutral-500">(Unlimited)</span></span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 mr-3 text-neutral-900 shrink-0 mt-0.5" />
                                  <span><strong className="block text-sm mb-0.5 text-black">Voice Synthesis Module</strong> <span className="text-neutral-500">(Active)</span></span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 mr-3 text-neutral-900 shrink-0 mt-0.5" />
                                  <span><strong className="block text-sm mb-0.5 text-black">Scholar Network Access</strong> <span className="text-neutral-500">(Live)</span></span>
                                </li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </motion.div>

                    <PerforatedEdge position="bottom" />

                    {/* THE BRASS PUSHPIN ANIMATION */}
                    <AnimatePresence>
                      {submitSuccess && (
                        <motion.div
                          initial={{ y: -30, scale: 2, opacity: 0 }}
                          animate={{ y: 0, scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                        >
                          <div className="relative flex items-center justify-center">
                            {/* Pushpin Shadow */}
                            <div className="absolute top-2 -left-1 w-5 h-5 bg-black/40 rounded-full blur-[3px]" />
                            {/* Pushpin Head */}
                            <div className="w-6 h-6 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.4)]"
                              style={{ background: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b 60%, #8b6508)' }} />
                            {/* Pushpin Highlight */}
                            <div className="absolute top-[4px] left-[5px] w-2 h-2 rounded-full bg-white/40 blur-[1px]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* LAYER 3: THE SLEEVE POCKET */}
                <button
                  onClick={() => {
                    if (submitSuccess || isCheckRevealed) return;
                    setIsCheckRevealed(true);
                    setCheckoutStep('payment');
                  }}
                  className={`absolute bottom-0 left-0 right-0 h-[45%] z-20 bg-[#2C3742] rounded-br-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.4)] border-t border-white/10 flex flex-col items-center justify-between p-6 ${submitSuccess || isCheckRevealed ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'} group text-left select-none outline-none focus:outline-none`}
                  style={{
                    clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0% 100%)',
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
                  }}
                >
                  <AnimatePresence>
                    {!submitSuccess && !isCheckRevealed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none"
                      >
                        <span className="font-mono text-xs font-black uppercase tracking-[0.3em] select-none shimmer-text-gold group-hover:brightness-125 group-hover:scale-102 transition-all duration-300">
                          TAP TO REVEAL
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto w-full flex justify-end">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 truncate">
                      <span className="font-sans font-black tracking-[0.1em] whitespace-nowrap">[ STΛQD ]</span> / F-001
                    </p>
                  </div>
                </button>

              </div>

              {/* === FRONT COVER (SWINGS LEFT) === */}
              <motion.div
                className="absolute inset-0 w-full h-full z-30 transform-gpu"
                style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateY: isBookOpen ? -180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >

                {/* OUTSIDE COVER (Visible when closed) */}
                <div
                  className={`absolute inset-0 w-full h-full bg-[#1E272E] rounded-r-[24px] shadow-2xl border border-[#34424F] flex flex-col items-center justify-center group ${isBookOpen ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}`}
                  style={{ backfaceVisibility: 'hidden', backgroundImage: 'radial-gradient(circle at 70% 30%, #2A3641 0%, transparent 80%)' }}
                  onClick={() => !isBookOpen && setIsBookOpen(true)}
                >
                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-[#141A1F] rounded-l-[2px] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.5)] z-0"></div>

                  <div className="w-[82%] h-[88%] border border-[#3E4F5E] rounded-xl flex flex-col items-center p-10 relative overflow-hidden z-10">
                    <div className="absolute top-0 w-full h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_4px]"></div>

                    <div className="mt-8 text-center z-10 w-full">
                      <div
                        className="flex items-center justify-center h-24 mb-6 space-x-2 opacity-50"
                        style={{ filter: 'drop-shadow(0 -1px 2px rgba(0,0,0,0.8)) drop-shadow(0 1px 1px rgba(255,255,255,0.05))' }}
                      >
                        {/* Left Bracket */}
                        <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 12 4 H 4 V 36 H 12" stroke="#B04818" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* The 3 Bars */}
                        <svg className="h-[85%] w-auto text-[#A69B88]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 12 11 L 33 11 L 29 16 L 8 16 Z" fill="currentColor" />
                          <path d="M 5 19 L 2 21 L 5 23 L 3 25 L 36 25 L 32 19 Z" fill="#B04818" />
                          <path d="M 10 28 L 31 28 L 27 33 L 6 33 Z" fill="currentColor" />
                        </svg>

                        {/* Right Bracket */}
                        <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 2 4 H 10 V 36 H 2" stroke="#B04818" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="h-[3px] w-24 bg-amber-700/30 mx-auto mb-8"></div>
                      <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#A69B88]/40 font-bold">Premium Workspace</p>
                    </div>

                    <div className="mt-auto mb-10 z-10 space-y-4 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#31404D] border-2 border-[#6B859E] flex items-center justify-center text-[#F4EFE6] group-hover:scale-110 group-hover:bg-[#3E4F5E] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 button-pulse-glow">
                        <ChevronRight className="w-8 h-8" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold shimmer-text-dark">TAP TO OPEN</span>
                    </div>
                  </div>
                </div>

                {/* INSIDE COVER (The Left Page Pitch, visible when open) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#E8E0D2] rounded-l-[24px] border-y border-l border-[#d3ccbc] shadow-[inset_-20px_0_40px_rgba(0,0,0,0.07)] flex flex-col pointer-events-auto workspace-grid overflow-hidden"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  {/* Vignette Layer for tactile material enhancement */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.12) 130%)' }} />

                  <AnimatePresence mode="wait">
                    {checkoutStep === 'pitch' ? (
                      <motion.div 
                        key="pitch"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 lg:p-12 flex flex-col h-full relative text-left w-full overflow-hidden"
                      >
                        <div className="flex flex-col h-full z-10 w-full">
                          {/* Top Section: Massively Scaled Logo + Headline */}
                          <div className="flex flex-col items-start w-full mix-blend-multiply">
                            
                            {/* Logo - Thicker and larger */}
                            <div className="flex items-center justify-start h-24 space-x-2 mb-6">
                              {/* Left Bracket */}
                              <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 12 4 H 4 V 36 H 12" stroke="#A39384" strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="miter" />
                              </svg>
                              {/* 3 Bars */}
                              <svg className="h-[70%] w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 12 11 L 33 11 L 29 16 L 8 16 Z" fill="#A39384" />
                                <path d="M 5 19 L 2 21 L 5 23 L 3 25 L 36 25 L 32 19 Z" fill="#A39384" />
                                <path d="M 10 28 L 31 28 L 27 33 L 6 33 Z" fill="#A39384" />
                              </svg>
                              {/* Right Bracket */}
                              <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 2 4 H 10 V 36 H 2" stroke="#A39384" strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="miter" />
                              </svg>
                            </div>
                            
                            {/* Headline */}
                            <h1 
                              className="font-sans font-black uppercase flex flex-col items-start w-full whitespace-nowrap text-[#5C554D] mb-6"
                              style={{ 
                                fontSize: 'clamp(38px, 10vw, 44px)',
                                lineHeight: '0.85',
                                letterSpacing: '-0.03em', 
                                transform: 'scaleY(1.1) scaleX(1.02)',
                                transformOrigin: 'top left'
                              }}
                            >
                              <span className="block pb-1">STACK YOUR</span>
                              <span className="block pb-1">KNOWLEDGE.</span>
                              <span className="block">SHIP IT.</span>
                            </h1>
                          </div>

                          {/* Paragraph Section */}
                          <div className="w-full mt-2 pr-4">
                            <p className="font-sans text-[12px] leading-[1.65] text-[#8C8477] font-medium mix-blend-multiply">
                              STAQD is an elite, AI-driven learning architecture built for technical professionals. By synthesizing dense documentation into actionable cognitive models, it accelerates your ability to master deep architectures and deploy them in real time. This isn't just a knowledge base; it's a structural upgrade to your workflow.
                            </p>
                          </div>

                          {/* Footer Text (Pushed to bottom) */}
                          <div className="mt-auto pb-1 mix-blend-multiply">
                            <p className="font-sans font-black uppercase text-[11px] tracking-[0.25em] text-[#5C554D]">
                              SYS.CORE // ACTIVE
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="payment"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="px-6 py-5 flex flex-col h-full relative text-left z-50 pointer-events-auto"
                      >
                        <AnimatePresence mode="wait">
                          {!submitSuccess ? (
                            <motion.div
                              key="form"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col h-full"
                            >
                              <h3 className="text-2xl font-serif font-black uppercase text-[#1a1a1a] mb-4">Checkout</h3>

                              {/* Plan Selection */}
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <button
                                  type="button"
                                  onClick={() => setPlanType('monthly')}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${planType === 'monthly' ? 'border-[#1a1a1a] bg-black/5 debossed-card' : 'border-stone-300 bg-transparent'}`}
                                >
                                  <span className="block font-mono text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-0.5">Monthly</span>
                                  <span className="block font-serif text-lg font-bold text-black">$130/mo</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPlanType('yearly')}
                                  className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${planType === 'yearly' ? 'border-[#1a1a1a] bg-black/5 debossed-card' : 'border-stone-300 bg-transparent'}`}
                                >
                                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#D4AF37] text-white text-[8px] font-bold rounded uppercase tracking-tighter">Save 17%</div>
                                  <span className="block font-mono text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-0.5">Yearly</span>
                                  <span className="block font-serif text-lg font-bold text-black">$107/mo</span>
                                  <span className="block text-[8px] text-neutral-400 font-mono">*billed annually</span>
                                </button>
                              </div>

                              {/* Payment Method Toggle (CARD vs UPI) */}
                              <div className="flex p-1 bg-black/5 rounded-lg border border-black/10 mb-4">
                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('CARD')}
                                  className={`flex-1 py-1.5 text-xs font-bold tracking-widest uppercase transition-all rounded-md cursor-pointer ${paymentMethod === 'CARD' ? 'bg-white shadow-sm border border-black/10 debossed-card text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                                >
                                  CARD
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('UPI')}
                                  className={`flex-1 py-1.5 text-xs font-bold tracking-widest uppercase transition-all rounded-md cursor-pointer ${paymentMethod === 'UPI' ? 'bg-white shadow-sm border border-black/10 debossed-card text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                                >
                                  UPI
                                </button>
                              </div>

                              {/* Payment Fields Container */}
                              <div className="space-y-3 flex-1 flex flex-col">
                                {paymentMethod === 'CARD' ? (
                                  <>
                                    <div>
                                      <label className="block font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#7c725e] mb-0.5">Full Name</label>
                                      <input
                                        type="text"
                                        className="paper-input font-serif italic text-zinc-900 bg-transparent"
                                        placeholder="Enter your name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={isSubmitting || submitSuccess}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#7c725e] mb-0.5">Country or region</label>
                                        <div className="relative">
                                          <select
                                            className="paper-input paper-select bg-transparent rounded-none pr-8 cursor-pointer font-serif italic text-zinc-900"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            disabled={isSubmitting || submitSuccess}
                                          >
                                            <option value="IN">India</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="CA">Canada</option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                          </select>
                                          <div className="paper-select-arrow" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#7c725e] mb-0.5">Indian GST Number</label>
                                        <input
                                          type="text"
                                          className="paper-input font-serif italic text-zinc-900 bg-transparent"
                                          placeholder="Optional"
                                          value={gstNumber}
                                          onChange={(e) => setGstNumber(e.target.value)}
                                          disabled={isSubmitting || submitSuccess}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#7c725e] mb-0.5">
                                        <span>Card Information</span>
                                        <Lock className="w-2.5 h-2.5 text-stone-500 mb-0.5" />
                                      </label>
                                      <div className="relative flex items-center">
                                        <input
                                          type="text"
                                          className="paper-input pr-24 font-serif italic text-zinc-900 bg-transparent"
                                          placeholder="1234 5678 1234 5678"
                                          value={cardNumber}
                                          onChange={(e) => setCardNumber(e.target.value)}
                                          disabled={isSubmitting || submitSuccess}
                                        />
                                        <div className="absolute right-3 flex items-center space-x-1.5 pointer-events-none">
                                          {/* Visa */}
                                          <svg className="w-7 h-4 grayscale opacity-55" viewBox="0 0 36 22" fill="none">
                                            <rect width="36" height="22" rx="2" fill="#faf6ec" stroke="#d1caa2" strokeWidth="0.5" />
                                            <path d="M11 15.5l1.3-8h2.1l-1.3 8h-2.1zm7.5-8c-.5-.2-1.2-.4-2-.4-2.2 0-3.7 1.2-3.7 2.8 0 1.3 1.1 1.9 2 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.8 0-1.5-.2-2.1-.5l-.3-.1-.4 2.2c.6.3 1.7.5 2.8.5 2.3 0 3.8-1.1 3.8-2.8 0-.9-.5-1.6-1.8-2.3-.8-.4-1.4-.7-1.4-1.2 0-.4.5-.8 1.4-.8.7 0 1.4.2 1.8.4l.2.1.2-2.3zm5 5.3l.5-2.7c.1-.4.3-.5.5-.5h1.8c.1 0 .2 0 .2.1 0 0 .1.1 0 .2l-1.1 5.2h-2.2l.3-2.3zm-10.4-.1l1.3-3.4.7 3.4h-2zm-1.8-.6l-2.2-4.6h2.3l1.5 3.6 1-3.6h2.3l-3.5 8h-2.2l.8-1.9c-.2-.5-.7-1.1-.8-1.1z" fill="#2C3742" />
                                          </svg>
                                          {/* Mastercard */}
                                          <svg className="w-7 h-4 grayscale opacity-55" viewBox="0 0 36 22" fill="none">
                                            <rect width="36" height="22" rx="2" fill="#faf6ec" stroke="#d1caa2" strokeWidth="0.5" />
                                            <circle cx="15.5" cy="11" r="5.2" fill="#E24A26" fillOpacity="0.8" />
                                            <circle cx="20.5" cy="11" r="5.2" fill="#F9A01B" fillOpacity="0.8" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 mt-1">
                                        <input
                                          type="text"
                                          className="paper-input font-serif italic text-zinc-900 bg-transparent"
                                          placeholder="MM / YY"
                                          value={expiry}
                                          onChange={(e) => setExpiry(e.target.value)}
                                          disabled={isSubmitting || submitSuccess}
                                        />
                                        <input
                                          type="text"
                                          className="paper-input font-serif italic text-zinc-900 bg-transparent"
                                          placeholder="CVC"
                                          value={cvc}
                                          onChange={(e) => setCvc(e.target.value)}
                                          disabled={isSubmitting || submitSuccess}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1 flex flex-col items-center justify-center py-2">
                                    <div className="w-36 h-36 border-2 border-neutral-800 p-2 bg-transparent relative flex items-center justify-center opacity-80 mix-blend-multiply">
                                      <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M0,0 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
                                        <path d="M70,0 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
                                        <path d="M0,70 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
                                        <rect x="40" y="10" width="10" height="10" />
                                        <rect x="55" y="0" width="10" height="10" />
                                        <rect x="40" y="25" width="20" height="10" />
                                        <rect x="80" y="40" width="20" height="10" />
                                        <rect x="0" y="40" width="30" height="10" />
                                        <rect x="40" y="45" width="30" height="10" />
                                        <rect x="40" y="60" width="10" height="40" />
                                        <rect x="55" y="60" width="20" height="10" />
                                        <rect x="85" y="60" width="15" height="15" />
                                        <rect x="60" y="80" width="20" height="20" />
                                        <rect x="85" y="85" width="10" height="10" />
                                        <rect x="15" y="55" width="10" height="10" />
                                      </svg>
                                    </div>
                                    <p className="mt-3 font-mono text-[9px] uppercase tracking-widest font-bold text-neutral-600">Scan to pay via any UPI app</p>
                                  </div>
                                )}

                                <div className="pt-2 mt-auto flex flex-col items-center">
                                  <motion.button
                                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                                    onClick={() => {
                                      if (isSubmitting) return;
                                      setIsSubmitting(true);
                                      setTimeout(() => {
                                        setIsSubmitting(false);
                                        setSubmitSuccess(true);
                                      }, 1500);
                                    }}
                                    disabled={isSubmitting}
                                    className={`w-full h-12 font-sans font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center transition-all duration-300 rounded-xl shadow-xl relative overflow-hidden ${isSubmitting
                                      ? 'bg-black cursor-not-allowed text-transparent'
                                      : 'bg-zinc-950 hover:bg-zinc-900 cursor-pointer text-[#E5C158]'
                                      }`}
                                  >
                                    <AnimatePresence mode="wait">
                                      {isSubmitting ? (
                                        <motion.div
                                          key="loading"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="absolute inset-0 flex items-center justify-center"
                                        >
                                          <div className="w-5 h-5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                                        </motion.div>
                                      ) : (
                                        <motion.span
                                          key="text"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                        >
                                          Confirm Subscription
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </motion.button>

                                  <AnimatePresence>
                                    {isSubmitting && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="text-center overflow-hidden"
                                      >
                                        <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-neutral-800">
                                          Processing secure payment...
                                        </span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="success"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4 }}
                              className="flex flex-col h-full relative"
                            >
                              {/* Central Watermark & Stamp Lockup */}
                              <div className="absolute top-0 left-0 w-full h-[70%] flex items-center justify-center z-0 pointer-events-none">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] mix-blend-color-burn">
                                  <div className="flex items-center justify-center w-[80%] h-[50%] space-x-6">
                                    {/* Left Bracket */}
                                    <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M 12 4 H 4 V 36 H 12" stroke="#4A453E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    {/* The 3 Bars */}
                                    <svg className="h-[85%] w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M 12 11 L 33 11 L 29 16 L 8 16 Z" fill="#4A453E" />
                                      <path d="M 5 19 L 2 21 L 5 23 L 3 25 L 36 25 L 32 19 Z" fill="#4A453E" />
                                      <path d="M 10 28 L 31 28 L 27 33 L 6 33 Z" fill="#4A453E" />
                                    </svg>

                                    {/* Right Bracket */}
                                    <svg className="h-full w-auto shrink-0" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M 2 4 H 10 V 36 H 2" stroke="#4A453E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                </div>

                                {/* Confirmed Stamp */}
                                <motion.div
                                  className="absolute w-44 h-44 z-10"
                                  initial={{ opacity: 0, scale: 2.5, rotate: -12 }}
                                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                                  transition={{ delay: 0.7, duration: 0.15, ease: [0.8, 0, 1, 1] }}
                                >
                                  <svg viewBox="0 0 200 200" className="w-full h-full text-green-600 mix-blend-multiply drop-shadow-sm opacity-90">
                                    <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="12 3 4 2 8 2" />
                                    <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 1 10 1" />
                                    <path id="top-curve2" d="M 28,100 A 72,72 0 0,1 172,100" fill="none" />
                                    <text fill="currentColor" fontSize="22" fontWeight="900" letterSpacing="5" fontFamily="sans-serif">
                                      <textPath href="#top-curve2" startOffset="50%" textAnchor="middle">CONFIRMED</textPath>
                                    </text>
                                    <path id="bottom-curve2" d="M 172,100 A 72,72 0 0,1 28,100" fill="none" />
                                    <text fill="currentColor" fontSize="22" fontWeight="900" letterSpacing="5" fontFamily="sans-serif">
                                      <textPath href="#bottom-curve2" startOffset="50%" textAnchor="middle">CONFIRMED</textPath>
                                    </text>
                                    <g fill="currentColor" transform="translate(100, 68)">
                                      <polygon points="0,-6 2,-2 7,-2 3,1 4,6 0,3 -4,6 -3,1 -7,-2 -2,-2" transform="translate(-30, 3) scale(1.2)" />
                                      <polygon points="0,-8 3,-2 9,-2 4,2 6,8 0,4 -6,8 -4,2 -9,-2 -3,-2" transform="scale(1.5)" />
                                      <polygon points="0,-6 2,-2 7,-2 3,1 4,6 0,3 -4,6 -3,1 -7,-2 -2,-2" transform="translate(30, 3) scale(1.2)" />
                                    </g>
                                    <g fill="currentColor" transform="translate(100, 132) rotate(180)">
                                      <polygon points="0,-6 2,-2 7,-2 3,1 4,6 0,3 -4,6 -3,1 -7,-2 -2,-2" transform="translate(-30, 3) scale(1.2)" />
                                      <polygon points="0,-8 3,-2 9,-2 4,2 6,8 0,4 -6,8 -4,2 -9,-2 -3,-2" transform="scale(1.5)" />
                                      <polygon points="0,-6 2,-2 7,-2 3,1 4,6 0,3 -4,6 -3,1 -7,-2 -2,-2" transform="translate(30, 3) scale(1.2)" />
                                    </g>
                                    <g transform="rotate(-8, 100, 100)">
                                      <rect x="8" y="76" width="184" height="48" rx="6" fill="#E8E0D2" stroke="currentColor" strokeWidth="4" />
                                      <text x="100" y="110" fill="currentColor" fontSize="30" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="3">
                                        CONFIRMED
                                      </text>
                                    </g>
                                  </svg>
                                </motion.div>
                              </div>

                              <div className="mt-auto ml-[16px] mb-[20px] z-10 flex flex-col justify-end w-full">
                                {/* Editorial Micro-details */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5, duration: 0.6 }}
                                  className="mb-8"
                                >
                                  <p className="font-sans font-bold uppercase text-[10px] tracking-[0.25em] text-[#1E272E]/40 mb-2">
                                    TRANSACTION VERIFIED • SECURE
                                  </p>
                                  <div className="h-[1px] w-[40%] bg-[#1E272E]/20" />
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2, duration: 0.5 }}
                                  className="font-serif font-black uppercase flex flex-wrap"
                                  style={{
                                    color: '#1E272E',
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.03em',
                                    fontSize: 'clamp(36px, 11vw, 48px)',
                                    transform: 'scaleY(1.15)',
                                    transformOrigin: 'bottom left',
                                    gap: '0 0.3em'
                                  }}
                                >
                                  <span>WELCOME TO</span>
                                  <span className="font-sans font-black tracking-widest whitespace-nowrap"><span className="text-[#FF5500]">[</span> STΛQD <span className="text-[#FF5500]">]</span></span>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
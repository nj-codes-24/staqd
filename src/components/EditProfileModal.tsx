import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, X } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // Crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setBio(user?.bio || '');
      setImageSrc(null);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const getCroppedImg = (): string | null => {
    if (!imageRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const cropSize = 300; // Final output size
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const img = imageRef.current;
    
    // We are simulating a fixed 250x250 mask inside a container.
    // The image itself is scaled and translated.
    // Let's assume the container is 100% width and height. To be precise, let's just 
    // extract exactly what is rendered within the central 250x250 bounding box.
    // A simpler way: just draw the image on canvas with the exact transforms applied,
    // centered in the canvas, and the canvas acts as the crop mask!
    
    // Canvas center is cropSize / 2
    ctx.translate(cropSize / 2, cropSize / 2);
    // Apply user translation
    ctx.translate(position.x, position.y);
    // Apply user scale
    ctx.scale(scale, scale);
    
    // Draw image centered at 0,0
    // We need to know the rendered width/height before scale.
    // We'll assume the image object-fit is 'contain' in a 300x300 box, or we just draw it naturally.
    // To match DOM exactly: The image has max-width 100%, max-height 100%.
    const rect = img.getBoundingClientRect();
    // width/height of the actual image element on screen (ignoring scale transforms if we measure before scale, but rect includes scale).
    // Let's use offsetWidth/offsetHeight for unscaled dimension.
    const drawWidth = img.offsetWidth;
    const drawHeight = img.offsetHeight;
    
    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleSave = () => {
    let avatarUrl = user.avatarUrl;
    if (imageSrc) {
      const cropped = getCroppedImg();
      if (cropped) avatarUrl = cropped;
    }
    
    onSave({
      ...user,
      name,
      bio,
      avatarUrl
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-4xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-xl p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <h2 className="text-xl font-serif font-black uppercase tracking-widest text-white">Edit Profile</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Text Inputs */}
              <div className="flex flex-col space-y-8">
                <div>
                  <label className="block text-[10px] tracking-widest text-white/40 uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 rounded-none px-0 py-2 focus:outline-none focus:border-[#FBBF24] focus:bg-white/[0.02] transition-all text-white text-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-white/40 uppercase mb-1">Biography</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 rounded-none px-0 py-2 focus:outline-none focus:border-[#FBBF24] focus:bg-white/[0.02] transition-all text-white resize-none min-h-[120px]"
                    placeholder="Tell us about your background..."
                  />
                </div>
              </div>

              {/* Right Column: Custom Cropper */}
              <div className="flex flex-col items-center justify-center">
                {!imageSrc ? (
                  <div className="w-full aspect-square border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="mb-3 text-white/40">
                      <UploadCloud size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs tracking-widest text-white/40 uppercase">Select Image</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    {/* Cropper Container */}
                    <div 
                      className="relative w-full aspect-square bg-[#111] overflow-hidden rounded-xl cursor-move touch-none"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleMouseDown}
                      onTouchMove={handleMouseMove}
                      onTouchEnd={handleMouseUp}
                    >
                      {/* Darkened overlay outside the mask */}
                      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
                        <div className="absolute w-[250px] h-[250px] border-2 border-white/50 box-content" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.8)' }}></div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                        <img 
                          ref={imageRef}
                          src={imageSrc} 
                          alt="Upload preview" 
                          draggable={false}
                          className="max-w-full max-h-full object-contain select-none"
                          style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Zoom Control */}
                    <div className="w-full mt-6 flex items-center space-x-4">
                      <span className="text-xs text-white/40 tracking-widest uppercase">Zoom</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.01" 
                        value={scale} 
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
              
            </div>

            <div className="mt-12 flex justify-end space-x-4">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-md text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-[#F3F4F6] rounded-md text-[10px] font-bold tracking-widest uppercase transition-all active:scale-[0.98] focus:outline-none"
              >
                Save Changes
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

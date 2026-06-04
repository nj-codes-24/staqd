import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useBookmark } from '../contexts/BookmarkContext';

export default function GlobalToast() {
  const { toastMessage } = useBookmark();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 z-[10000] px-4 py-2 bg-[#111827] text-white text-sm font-medium rounded-full shadow-lg whitespace-nowrap pointer-events-none"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

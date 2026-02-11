
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose }) => {
  const [opened, setOpened] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="glass-pink p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden"
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!opened ? (
              <div className="space-y-6">
                <h3 className="text-3xl font-romantic text-pink-400">You have a gift!</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpened(true)}
                  className="text-9xl cursor-pointer hover:drop-shadow-2xl transition-all"
                >
                  🎁
                </motion.button>
                <p className="text-white/70 italic">Tap to open your heart</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-8xl">🥰</div>
                <h3 className="text-4xl font-romantic text-pink-500">I Love You!</h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
                </p>
                <div className="flex justify-center gap-2">
                  <span className="text-2xl animate-bounce">💖</span>
                  <span className="text-2xl animate-bounce delay-100">✨</span>
                  <span className="text-2xl animate-bounce delay-200">💖</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SurpriseModal;

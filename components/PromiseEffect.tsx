
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromiseEffectProps {
  onComplete: () => void;
}

const PromiseEffect: React.FC<PromiseEffectProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="relative"
      >
        <div className="text-9xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">💍</div>
        
        {/* Magic Sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300
            }}
            transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: -150 }}
        className="absolute font-display text-4xl text-yellow-100 italic"
      >
        A Promise Forever...
      </motion.div>
    </div>
  );
};

export default PromiseEffect;

"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KissAnimationProps {
  onComplete: () => void;
}

const KissAnimation: React.FC<KissAnimationProps> = ({ onComplete }) => {
  // Generate hearts positions once
  const hearts = useMemo(() => Array.from({ length: 16 }), []);

  useEffect(() => {
    // Play kiss sound
    const kissAudio = new Audio("/sounds/kiss.mp3"); // <--- Add your kiss sound file in public/sounds folder
    kissAudio.play().catch(() => {
      console.log("Audio autoplay blocked or not allowed");
    });

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, -6, 6, -3, 3, 0], // subtle screen shake
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
      >
        {/* Gentle Pulsating Lips */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
            opacity: [0, 1, 1],
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="text-[120px] drop-shadow-[0_0_20px_rgba(255,0,128,0.5)]"
        >
          💋
        </motion.div>

        {/* Floating Text */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ y: -100, opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute text-4xl font-semibold text-pink-400 drop-shadow-md"
        >
          Muahhh 😘
        </motion.div>

        {/* Floating Hearts */}
        {hearts.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, scale: 0, opacity: 0 }}
            animate={{
              y: -100 - Math.random() * 100,
              x: -20 + Math.random() * 40,
              scale: 1 + Math.random() * 0.3,
              opacity: 0,
            }}
            transition={{
              duration: 1.8 + Math.random() * 0.5,
              ease: "easeOut",
              delay: i * 0.05,
            }}
            className="absolute text-3xl text-pink-500"
          >
            ❤️
          </motion.div>
        ))}

        {/* Soft Glow Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-pink-600 blur-2xl"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default KissAnimation;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOVE_WEEK_DAYS } from "../constants";

const LoveWeekSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string | null>(null);

  return (
    <section className="py-8">
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-16 space-y-2"
      >
        <h2 className="text-5xl md:text-6xl font-display text-white italic drop-shadow-md">
          The 7 Days of Valentine
        </h2>
        <p className="text-rose-400/50 uppercase tracking-[0.4em] text-[10px] md:text-sm font-bold">
          The Complete Love Journey
        </p>
      </motion.div>

      {/* Days Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {LOVE_WEEK_DAYS.map((day) => (
          <motion.div
            key={day.id}
            whileHover={{
              scale: 1.03,
              y: -5,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveDay(day.id)}
            className="cursor-pointer rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-6 glass transition-all border border-white/5 group"
          >
            <span className="text-6xl md:text-7xl mb-4 group-hover:scale-110 transition-transform duration-500">
              {day.emoji}
            </span>
            <div className="text-center">
              <span className="block font-bold text-white text-sm md:text-base uppercase tracking-widest">
                {day.name}
              </span>
              <span className="text-rose-500/60 text-[10px] md:text-xs font-bold tracking-tighter">
                {day.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal / Popup */}
      <AnimatePresence>
        {activeDay && (
          <div
            className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
            onClick={() => setActiveDay(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass p-12 rounded-[4rem] text-center relative border border-rose-500/20"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDay(null)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Day Content */}
              {(() => {
                const day = LOVE_WEEK_DAYS.find((d) => d.id === activeDay);
                return day ? (
                  <>
                    <div className="text-9xl md:text-[10rem] mb-8 filter drop-shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                      {day.emoji}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-display text-white mb-2 drop-shadow-md">
                      {day.name}
                    </h3>
                    <p className="text-rose-500 font-bold text-xs md:text-sm uppercase tracking-widest mb-6">
                      {day.date}
                    </p>
                    <p className="text-white/80 text-lg md:text-xl font-romantic leading-relaxed drop-shadow-sm">
                      "{day.msg}"
                    </p>

                    {/* Close Insight Button */}
                    <div className="mt-12">
                      <button
                        onClick={() => setActiveDay(null)}
                        className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 px-10 py-3 rounded-full border border-rose-500/20 transition-all font-bold text-xs md:text-sm uppercase tracking-widest"
                      >
                        Close Insight
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LoveWeekSection;

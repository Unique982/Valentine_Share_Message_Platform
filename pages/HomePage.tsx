import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-10 max-w-3xl"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              filter: [
                "drop-shadow(0 0 10px #f43f5e)",
                "drop-shadow(0 0 30px #f43f5e)",
                "drop-shadow(0 0 10px #f43f5e)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-9xl mb-6"
          >
            ❤️
          </motion.div>
          <div className="absolute -top-4 -right-8 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-xl border border-rose-400/50">
            I Love You{" "}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-display text-white tracking-tight leading-none">
            Valentine Share <br />
            <span className="text-rose-500 italic">Message Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-rose-200/60 font-romantic max-w-lg mx-auto leading-relaxed">
            Create a cinematic, private experience to express your eternal love.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-4">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(244, 63, 94, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create")}
            className="w-full md:w-auto bg-gradient-to-r from-rose-500 to-rose-700 text-white text-lg font-bold px-12 py-5 rounded-full shadow-2xl transition-all flex items-center justify-center space-x-3 group"
          >
            <span>Start Creating</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-24 grid grid-cols-3 gap-12 text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">
        <div className="hover:text-rose-500 transition-colors">
          Private Vault
        </div>
        <div className="hover:text-rose-500 transition-colors">
          4K Rendering
        </div>
        <div className="hover:text-rose-500 transition-colors">
          Instant Sharing
        </div>
      </div>
    </div>
  );
};

export default HomePage;

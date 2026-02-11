
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoveData } from '../lib/storage';
import { LoveData } from '../types';
import ImageCarousel from '../components/ImageCarousel';
import LoveWeekSection from '../components/LoveWeekSection';
import VideoGenerator from '../components/VideoGenerator';
import KissAnimation from '../components/KissAnimation';
import PromiseEffect from '../components/PromiseEffect';
import SurpriseModal from '../components/SurpriseModal';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { soundService } from '../lib/audio';

const LovePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<LoveData | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const [showKiss, setShowKiss] = useState(false);
  const [showPromise, setShowPromise] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    if (slug === 'sample') {
      setData({
        id: 'sample',
        slug: 'sample',
        yourName: 'Romeo',
        partnerName: 'Juliet',
        message: 'In your eyes, I see the reflection of a thousand beautiful tomorrows. You are the heartbeat that keeps my soul alive.',
        date: '2024-02-14',
        song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        images: ['https://picsum.photos/seed/lovev1/800/800', 'https://picsum.photos/seed/lovev2/800/800'],
        pin: '1234'
      });
      setIsLocked(true);
      return;
    }

    const saved = getLoveData(slug || '');
    if (saved) {
      setData(saved);
      // Enforce lock if PIN exists
      if (saved.pin) setIsLocked(true);
      else setIsLocked(false);
    } else {
      navigate('/');
    }
  }, [slug, navigate]);

  const handleUnlock = () => {
    if (data?.pin === pinInput) {
      setIsLocked(false);
      soundService.playSparkle();
      setHasStarted(true);
    } else {
      setIsShaking(true);
      setError('PIN Incorrect');
      setPinInput('');
      setTimeout(() => {
        setError('');
        setIsShaking(false);
      }, 1000);
    }
  };

  if (!data) return null;

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
        {/* Deep immersive background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="glass p-12 md:p-16 rounded-[5rem] max-w-sm w-full text-center space-y-10 shadow-3xl border border-rose-500/20 z-10 backdrop-blur-2xl"
        >
          <div className="space-y-4">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 5px rgba(225,29,72,0.4))', 'drop-shadow(0 0 15px rgba(225,29,72,0.8))', 'drop-shadow(0 0 5px rgba(225,29,72,0.4))'] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-7xl"
            >
              🔐
            </motion.div>
            <h2 className="text-3xl font-display text-white tracking-tight leading-tight">Secret Vault</h2>
            <p className="text-rose-500/50 text-[10px] uppercase tracking-[0.5em] font-bold">Encrypted For You</p>
          </div>
          
          <div className="space-y-6">
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="w-full glass-pink p-6 rounded-[2rem] text-center text-4xl tracking-[0.6em] outline-none text-rose-500 font-bold border border-white/5 placeholder-white/10"
            />
            {error && <p className="text-rose-600 text-[10px] font-bold tracking-widest uppercase animate-pulse">{error}</p>}
            <button 
              onClick={handleUnlock}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-900 hover:from-rose-500 hover:to-rose-800 text-white font-bold py-5 rounded-[2rem] transition-all shadow-2xl uppercase tracking-widest text-xs active:scale-95"
            >
              Unlock Memories
            </button>
          </div>
          <p className="text-white/20 text-[8px] uppercase tracking-[0.2em] font-medium">Valentine Share Message Platform</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-32 bg-black">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-[1100] glass px-6 py-3 rounded-full text-white/50 hover:text-white flex items-center gap-2 text-[10px] font-bold transition-all shadow-2xl tracking-widest uppercase group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Home
      </motion.button>

      <div className="max-w-4xl mx-auto pt-32 px-6 space-y-32">
        <header className="text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block glass px-8 py-2 rounded-full text-[9px] font-bold text-rose-400 uppercase tracking-[0.6em] border border-rose-500/10"
          >
            A Message of Eternal Love
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-display text-white tracking-tighter leading-none"
            >
              {data.yourName} <span className="text-rose-600 block md:inline">❤</span> {data.partnerName}
            </motion.h1>
            {data.date && (
              <p className="text-rose-400/40 text-xl font-romantic italic tracking-wide">
                Our journey began on {new Date(data.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </header>

        <section className="relative">
          <ImageCarousel images={data.images} />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-white/[0.02] text-[20vw] select-none pointer-events-none font-display italic whitespace-nowrap uppercase tracking-tighter leading-none">Eternal</div>
        </section>

        <section className="text-center glass p-12 md:p-32 rounded-[6rem] relative shadow-3xl overflow-hidden border border-white/[0.03] backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600/20 to-transparent" />
          <div className="text-8xl mb-12 text-rose-600/10 italic font-serif">"</div>
          <p className="text-4xl md:text-6xl font-romantic text-white leading-tight italic relative z-10 drop-shadow-2xl">
            {data.message}
          </p>
          <div className="text-8xl mt-12 text-rose-600/10 italic text-right font-serif">"</div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 'kiss', icon: '💋', label: 'E-Kiss', action: () => { setShowKiss(true); soundService.playKiss(); } },
            { id: 'promise', icon: '💍', label: 'Our Promise', action: () => { setShowPromise(true); soundService.playSparkle(); } },
            { id: 'surprise', icon: '🎁', label: 'Secret Gift', action: () => { setShowSurprise(true); soundService.playBoxOpen(); } },
          ].map((btn) => (
            <motion.button 
              key={btn.id}
              whileHover={{ scale: 1.05, y: -12, backgroundColor: 'rgba(225,29,72,0.08)' }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.action}
              className="glass p-14 rounded-[4rem] flex flex-col items-center justify-center space-y-4 group border border-white/5 shadow-2xl transition-all"
            >
              <span className="text-7xl group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_0_15px_rgba(225,29,72,0.3)]">{btn.icon}</span>
              <span className="font-bold text-rose-500 uppercase tracking-[0.4em] text-[9px]">{btn.label}</span>
            </motion.button>
          ))}
        </section>

        <LoveWeekSection />

        <section className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-display text-white">Love Cinema</h2>
            <p className="text-rose-400/30 uppercase tracking-[0.3em] text-[10px] font-bold">Memories in Motion</p>
          </div>
          <VideoGenerator images={data.images} partnerName={data.partnerName} />
        </section>

        <section className="text-center space-y-20 py-24 border-t border-white/[0.05]">
          <div className="space-y-4">
            <h2 className="text-6xl font-display text-white">Share The Vault</h2>
            <p className="text-white/20 max-w-sm mx-auto text-sm leading-relaxed">Let them unlock your heart. Share this secret page directly to their phone.</p>
          </div>
          
          <div className="flex flex-col items-center space-y-12">
             <QRCodeGenerator url={window.location.href} />
             
             <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-md">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Private Link Copied! ❤️');
                  }}
                  className="flex-1 glass hover:bg-white/10 text-white px-8 py-5 rounded-[2rem] border border-white/10 font-bold transition-all flex items-center justify-center gap-3 text-xs tracking-widest uppercase shadow-2xl"
                >
                  Copy Secret URL
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/?text=I created a secret Love Vault for you. Use this private link and enter the PIN I gave you: ${window.location.href}`)}
                  className="flex-1 bg-[#25D366] hover:bg-[#1fa851] text-white px-8 py-5 rounded-[2rem] font-bold transition-all shadow-2xl flex items-center justify-center gap-3 text-xs tracking-widest uppercase"
                >
                  WhatsApp
                </button>
             </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showKiss && <KissAnimation onComplete={() => setShowKiss(false)} />}
        {showPromise && <PromiseEffect onComplete={() => setShowPromise(false)} />}
        {showSurprise && <SurpriseModal isOpen={showSurprise} onClose={() => setShowSurprise(false)} />}
      </AnimatePresence>

      <footer className="text-center py-20 opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[1.5em] text-rose-500">Valentine Share Message Platform</p>
      </footer>
    </div>
  );
};

export default LovePage;

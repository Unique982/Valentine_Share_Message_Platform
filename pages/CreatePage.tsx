
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SONGS } from '../constants';
import { saveLoveData } from '../lib/storage';
import { LoveData } from '../types';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LoveData>>({
    yourName: '',
    partnerName: '',
    message: '',
    date: new Date().toISOString().split('T')[0],
    pin: '',
    song: SONGS[0].url,
    images: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'yourName' || name === 'partnerName') {
      if (!value || value.trim().length < 2) error = 'Needs at least 2 characters';
    }
    if (name === 'message') {
      if (!value || value.trim().length < 10) error = 'Write a bit more from your heart';
    }
    if (name === 'pin') {
      if (!value || value.length !== 4) error = 'Secret PIN must be 4 digits';
    }
    if (name === 'images') {
      if (!value || value.length === 0) error = 'Add some memories first';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const updateField = (name: keyof LoveData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const currentCount = formData.images?.length || 0;
    
    if (currentCount + files.length > 12) {
      alert("Let's keep it to 12 special photos for the best reel.");
      return;
    }

    files.forEach(file => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`${file.name} is a bit too large. Try a smaller one!`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string].slice(0, 12)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const nextStep = () => {
    let stepValid = false;
    if (step === 1) stepValid = validateField('yourName', formData.yourName) && validateField('partnerName', formData.partnerName);
    if (step === 2) stepValid = validateField('message', formData.message) && validateField('images', formData.images);
    if (step === 3) stepValid = validateField('pin', formData.pin);

    if (stepValid) {
      setStep(step + 1);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateField('pin', formData.pin)) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Generate a shorter 6-character slug for cleaner links
    const slug = Math.random().toString(36).substring(2, 8);
    const fullData: LoveData = {
      id: Date.now().toString(),
      slug,
      yourName: formData.yourName || 'Someone Special',
      partnerName: formData.partnerName || 'Beloved',
      message: formData.message || '',
      date: formData.date || '',
      pin: formData.pin || '',
      song: formData.song || SONGS[0].url,
      images: formData.images || [],
    };
    saveLoveData(fullData);
    navigate(`/love/${slug}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-black/60">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 glass px-6 py-2 rounded-full text-white/40 hover:text-white transition-all text-[10px] font-bold tracking-widest uppercase z-[1100]"
      >
        Exit Creator
      </motion.button>

      <motion.div 
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="max-w-xl w-full glass p-8 md:p-14 rounded-[4rem] shadow-3xl border border-white/5 relative overflow-hidden backdrop-blur-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)]"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display text-white">The Romantic Lead</h2>
                  <p className="text-rose-400/40 text-[10px] uppercase tracking-[0.3em] font-bold">Step 01 / 03</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">Your Name</label>
                    <input
                      value={formData.yourName}
                      onChange={(e) => updateField('yourName', e.target.value)}
                      placeholder="e.g. Romeo"
                      className="w-full glass-pink p-5 rounded-3xl text-white outline-none focus:ring-1 focus:ring-rose-500/30 transition-all border border-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">Partner's Name</label>
                    <input
                      value={formData.partnerName}
                      onChange={(e) => updateField('partnerName', e.target.value)}
                      placeholder="e.g. Juliet"
                      className="w-full glass-pink p-5 rounded-3xl text-white outline-none focus:ring-1 focus:ring-rose-500/30 transition-all border border-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">Special Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="w-full glass-pink p-5 rounded-3xl text-white outline-none border border-white/5"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display text-white">Memories & Words</h2>
                  <p className="text-rose-400/40 text-[10px] uppercase tracking-[0.3em] font-bold">Step 02 / 03</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">A Letter from your Heart</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Express your love here..."
                      className="w-full glass-pink p-6 rounded-[2rem] text-white outline-none resize-none focus:ring-1 focus:ring-rose-500/30 border border-white/5"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">Your Story Gallery ({formData.images?.length || 0}/12)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images?.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                          <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <button onClick={() => removeImage(i)} className="absolute inset-0 bg-rose-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-[10px] uppercase tracking-tighter">Remove</button>
                        </div>
                      ))}
                      {(formData.images?.length || 0) < 12 && (
                        <label className="aspect-square glass flex flex-col items-center justify-center rounded-2xl cursor-pointer hover:bg-white/5 border border-dashed border-white/10 transition-colors">
                          <span className="text-2xl text-rose-500">+</span>
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display text-white">Security & Aura</h2>
                  <p className="text-rose-400/40 text-[10px] uppercase tracking-[0.3em] font-bold">Final Step</p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4 text-center">
                    <label className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.4em]">Secret Vault PIN (4 Digits)</label>
                    <div className="flex justify-center">
                      <input
                        maxLength={4}
                        placeholder="••••"
                        value={formData.pin}
                        onChange={(e) => updateField('pin', e.target.value.replace(/\D/g, ''))}
                        className="w-48 glass-pink p-6 rounded-[2rem] text-white text-center text-4xl tracking-[0.6em] font-bold focus:ring-1 focus:ring-rose-500/50 outline-none shadow-2xl border border-rose-500/20"
                      />
                    </div>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Mandatory for your partner to unlock this page</p>
                    {errors.pin && <p className="text-[10px] text-rose-500 font-bold">{errors.pin}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest ml-4">Background Serenade</label>
                    <div className="relative">
                      <select 
                        value={formData.song} 
                        onChange={(e) => updateField('song', e.target.value)}
                        className="w-full glass-pink p-5 rounded-3xl text-white outline-none cursor-pointer appearance-none border border-white/5 pr-10"
                      >
                        {SONGS.map(s => <option key={s.id} value={s.url} className="bg-zinc-900">{s.name}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-rose-500">▼</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-6">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)} 
                className="flex-1 p-5 glass rounded-[2rem] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs tracking-widest uppercase"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="flex-[2] p-5 bg-rose-600 hover:bg-rose-700 rounded-[2rem] font-bold text-white shadow-xl transition-all text-xs tracking-widest uppercase"
              >
                Continue
              </button>
            ) : (
              <button 
                type="submit" 
                className="flex-[2] p-5 bg-gradient-to-r from-rose-600 to-rose-900 rounded-[2rem] font-bold text-white shadow-2xl hover:scale-[1.02] transition-all text-xs tracking-widest uppercase"
              >
                Create My Vault
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePage;

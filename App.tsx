
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LovePage from './pages/LovePage';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ambient background particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
           {[...Array(20)].map((_, i) => (
             <div 
               key={i}
               className="absolute animate-pulse text-rose-500"
               style={{
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 fontSize: `${Math.random() * 30 + 10}px`,
                 animationDelay: `${Math.random() * 5}s`,
                 animationDuration: `${Math.random() * 8 + 4}s`
               }}
             >
               ❤
             </div>
           ))}
        </div>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/love/:slug" element={<LovePage />} />
        </Routes>
        
        <AudioPlayer />
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface VideoGeneratorProps {
  images: string[];
  partnerName: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ images, partnerName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateVideo = async () => {
    if (!images.length || !canvasRef.current) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    const stream = canvas.captureStream(30);
    
    const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType,
      videoBitsPerSecond: 3000000 
    });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${partnerName.replace(/\s+/g, '-')}-love-story.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
      setProgress(0);
    };

    // Load all images and verify they are CanvasImageSource compatible
    const loadedImages: HTMLImageElement[] = [];
    try {
      const promises = images.map(src => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Image failed to load"));
          img.src = src;
        });
      });
      const results = await Promise.all(promises);
      loadedImages.push(...results);
    } catch (err) {
      console.error("Video Gen Error: Failed to pre-load images", err);
      alert("Some images couldn't be processed. Try using different files.");
      setIsGenerating(false);
      return;
    }

    if (loadedImages.length === 0) {
      setIsGenerating(false);
      return;
    }

    mediaRecorder.start();

    const durationPerImage = 2000; 
    const totalDuration = loadedImages.length * durationPerImage;
    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const elapsed = now - startTime;
      
      if (elapsed >= totalDuration) {
        mediaRecorder.stop();
        return;
      }

      const imgIndex = Math.floor(elapsed / durationPerImage);
      const currentImg = loadedImages[imgIndex];
      
      // CRITICAL FIX: Ensure the object is actually an HTMLImageElement and ready for drawImage
      if (!(currentImg instanceof HTMLImageElement) || !currentImg.complete) {
        requestAnimationFrame(drawFrame);
        return;
      }

      const progressInImage = (elapsed % durationPerImage) / durationPerImage;

      // Reset & Clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Ken Burns Effect (Zoom In)
      const scale = 1 + progressInImage * 0.1;
      const drawW = canvas.width * scale;
      const drawH = canvas.height * scale;
      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      // Draw image
      ctx.save();
      // Fade in/out
      ctx.globalAlpha = progressInImage < 0.1 ? progressInImage * 10 : progressInImage > 0.9 ? (1 - progressInImage) * 10 : 1;
      ctx.drawImage(currentImg, offsetX, offsetY, drawW, drawH);
      ctx.restore();

      // UI Overlays
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 20;
      
      ctx.font = '32px serif';
      ctx.fillText(`Our Eternal Bond`, canvas.width / 2, canvas.height - 150);
      
      ctx.font = 'bold 64px cursive';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(partnerName, canvas.width / 2, canvas.height - 70);
      ctx.restore();

      setProgress(Math.round((elapsed / totalDuration) * 100));
      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  };

  return (
    <div className="glass p-10 rounded-[3rem] text-center space-y-6 border border-white/5">
      <canvas ref={canvasRef} width={720} height={1280} className="hidden" />
      
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-5xl">
          🎬
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display text-white">Render Cinematic Video</h3>
          <p className="text-xs text-white/30 max-w-xs mx-auto">Convert your images into a high-definition 9:16 vertical video story for social sharing.</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateVideo}
          disabled={isGenerating || !images.length}
          className="relative group overflow-hidden w-full bg-rose-600 text-white font-bold py-6 px-10 rounded-3xl flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-30 disabled:grayscale transition-all"
        >
          {isGenerating && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: `${progress - 100}%` }}
              className="absolute inset-0 bg-white/20"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing {progress}%
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c0-.55.45-1 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                Generate 4K Story
              </>
            )}
          </span>
        </motion.button>
      </div>
      
      <div className="flex justify-center gap-4">
        <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Portrait (9:16)</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">•</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">30 FPS</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">•</span>
        <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">H.264 WebM</span>
      </div>
    </div>
  );
};

export default VideoGenerator;

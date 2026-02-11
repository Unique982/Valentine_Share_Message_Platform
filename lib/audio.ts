
class SoundService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playOscillator(type: OscillatorType, freq: number, duration: number, volume = 0.2) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playKiss() {
    // Mimic kiss sound: Quick high frequency pop
    this.playOscillator('sine', 800, 0.1, 0.3);
    setTimeout(() => this.playOscillator('sine', 1200, 0.15, 0.2), 50);
  }

  playSparkle() {
    // Magic sparkle: High pitch cascading frequencies
    [1000, 1500, 2000, 2500].forEach((f, i) => {
      setTimeout(() => this.playOscillator('triangle', f, 0.4, 0.1), i * 100);
    });
  }

  playBoxOpen() {
    this.playOscillator('square', 200, 0.3, 0.1);
    this.playOscillator('sine', 400, 0.2, 0.2);
  }
}

export const soundService = new SoundService();

// Sound Synthesizer using Web Audio API
export class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSfx(type) {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;

      if (type === 'jump') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } 
      else if (type === 'shoot') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } 
      else if (type === 'hit') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } 
      else if (type === 'unlock') {
        this.playRescueFanfare();
      }
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  playRescueFanfare() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      // Heroic triumph chord: C5 -> E5 -> G5 -> C6
      const arpeggio = [523.25, 659.25, 783.99, 1046.50];

      arpeggio.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.35);
      });
    } catch (e) {
      console.warn("Failed to play rescue fanfare:", e);
    }
  }

  playBirthdayTheme() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const melody = [
        { note: 261.63, dur: 0.3 },
        { note: 261.63, dur: 0.15 },
        { note: 293.66, dur: 0.45 },
        { note: 261.63, dur: 0.45 },
        { note: 349.23, dur: 0.45 },
        { note: 329.63, dur: 0.9 },
        { note: 261.63, dur: 0.3 },
        { note: 261.63, dur: 0.15 },
        { note: 293.66, dur: 0.45 },
        { note: 261.63, dur: 0.45 },
        { note: 392.00, dur: 0.45 },
        { note: 349.23, dur: 0.9 },
      ];

      let elapsed = 0;
      melody.forEach((item) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, now + elapsed);
        gain.gain.setValueAtTime(0, now + elapsed);
        gain.gain.linearRampToValueAtTime(0.1, now + elapsed + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + item.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + item.dur);
        elapsed += item.dur + 0.05;
      });
    } catch (e) {
      console.warn("Failed to play victory birthday melody", e);
    }
  }
}

export const synth = new SoundSynth();

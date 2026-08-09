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
        // Classic Arcade Boing Jump (Rising Sine Sweep)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } 
      else if (type === 'shoot' || type === 'attack') {
        // Katana Sword Energy Slash (High Frequency White Noise Whip + Square Slash)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } 
      else if (type === 'hit') {
        // Deep Impact Enemy Hit Crunch (Heavy Bass Noise Drop)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
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

  startBgm() {
    if (this.bgmPlaying || this.muted) return;
    try {
      this.init();
      if (!this.bgmAudio) {
        // Try Twelve_Candles_Burning.mp3 with flexible base path resolution
        const audioPath = window.location.pathname.endsWith('/') 
          ? window.location.pathname + 'Twelve_Candles_Burning.mp3'
          : './Twelve_Candles_Burning.mp3';
        this.bgmAudio = new Audio(audioPath);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.65;
      }
      this.bgmAudio.play().then(() => {
        this.bgmPlaying = true;
      }).catch((e) => {
        console.warn("Audio play failed, falling back:", e);
        this.startSynthBgmLoop();
      });
    } catch (e) {
      this.startSynthBgmLoop();
    }
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    if (this.synthBgmInterval) {
      clearInterval(this.synthBgmInterval);
      this.synthBgmInterval = null;
    }
    this.bgmPlaying = false;
  }

  startSynthBgmLoop() {
    if (this.synthBgmInterval) return;
    this.bgmPlaying = true;
    
    // Gentle, Soft Anime Lullaby Melody (Sine Wave, Slow 400ms pace)
    const sequence = [
      { note: 329.63, dur: 0.35 }, { note: 392.00, dur: 0.35 }, { note: 440.00, dur: 0.70 },
      { note: 392.00, dur: 0.35 }, { note: 329.63, dur: 0.35 }, { note: 261.63, dur: 0.70 },
      { note: 293.66, dur: 0.35 }, { note: 329.63, dur: 0.35 }, { note: 392.00, dur: 0.35 }, { note: 349.23, dur: 0.35 },
      { note: 329.63, dur: 0.70 }, { note: 261.63, dur: 0.70 }
    ];

    let step = 0;
    const playNextNote = () => {
      if (this.muted || !this.bgmPlaying) return;
      try {
        const item = sequence[step % sequence.length];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + item.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + item.dur);
        step++;
      } catch (e) {}
    };

    this.synthBgmInterval = setInterval(playNextNote, 420);
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


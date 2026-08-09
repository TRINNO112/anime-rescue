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
        // Resolve absolute URL for GitHub Pages /anime-rescue/ or local server
        const loc = window.location;
        const repoPath = loc.pathname.includes('/anime-rescue') ? '/anime-rescue/' : '/';
        const audioUrl = `${loc.origin}${repoPath}Twelve_Candles_Burning.mp3`;
        
        this.bgmAudio = new Audio(audioUrl);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 1.0; // Full volume
      }
      
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.bgmPlaying = true;
        }).catch((err) => {
          console.warn("Retrying MP3 play with direct relative path:", err);
          this.bgmAudio = new Audio('./Twelve_Candles_Burning.mp3');
          this.bgmAudio.loop = true;
          this.bgmAudio.volume = 1.0;
          this.bgmAudio.play().then(() => {
            this.bgmPlaying = true;
          }).catch((e) => console.error("MP3 audio play error:", e));
        });
      }
    } catch (e) {
      console.error("Audio init error:", e);
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
    if (this.birthdayInterval) {
      clearInterval(this.birthdayInterval);
      this.birthdayInterval = null;
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
      if (this.birthdayInterval) clearInterval(this.birthdayInterval);

      const playMelody = () => {
        if (this.muted) return;
        const now = this.ctx.currentTime;
        const melody = [
          { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.20 }, { note: 293.66, dur: 0.50 }, { note: 261.63, dur: 0.50 }, { note: 349.23, dur: 0.50 }, { note: 329.63, dur: 0.90 },
          { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.20 }, { note: 293.66, dur: 0.50 }, { note: 261.63, dur: 0.50 }, { note: 392.00, dur: 0.50 }, { note: 349.23, dur: 0.90 },
          { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.20 }, { note: 523.25, dur: 0.50 }, { note: 440.00, dur: 0.50 }, { note: 349.23, dur: 0.50 }, { note: 329.63, dur: 0.50 }, { note: 293.66, dur: 0.90 },
          { note: 466.16, dur: 0.35 }, { note: 466.16, dur: 0.20 }, { note: 440.00, dur: 0.50 }, { note: 349.23, dur: 0.50 }, { note: 392.00, dur: 0.50 }, { note: 349.23, dur: 1.10 }
        ];

        let elapsed = 0;
        melody.forEach((item) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.note, now + elapsed);
          gain.gain.setValueAtTime(0, now + elapsed);
          gain.gain.linearRampToValueAtTime(0.14, now + elapsed + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.005, now + elapsed + item.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + elapsed);
          osc.stop(now + elapsed + item.dur);
          elapsed += item.dur + 0.06;
        });
      };

      playMelody();
      this.birthdayInterval = setInterval(playMelody, 8800);
    } catch (e) {
      console.warn("Failed to play victory birthday melody", e);
    }
  }
}

export const synth = new SoundSynth();


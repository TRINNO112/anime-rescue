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

  playSynthNote(freq, dur, type = 'sine', vol = 0.05, filterFreq = 1200) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    
    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + dur);
  }

  startBgm() {
    if (this.bgmPlaying || this.muted) return;
    this.init();
    this.startSynthBgmLoop();
  }

  stopBgm() {
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
    this.init();

    // Peaceful Pentatonic Chime Progression
    const melody = [
      329.63, 392.00, 440.00, 523.25,  // E5, G5, A5, C6
      440.00, 392.00, 329.63, 293.66,  // A5, G5, E5, D5
      329.63, 392.00, 440.00, 523.25,  // E5, G5, A5, C6
      587.33, 523.25, 440.00, 392.00   // D6, C6, A5, G5
    ];

    const chords = [
      [130.81, 196.00, 261.63, 329.63], // C major (C3, G3, C4, E4)
      [110.00, 164.81, 220.00, 261.63], // A minor (A2, E3, A3, C4)
      [87.31, 130.81, 174.61, 261.63],  // F major (F2, C3, F3, C4)
      [98.00, 146.83, 196.00, 293.66]   // G major (G2, D3, G3, D4)
    ];

    let step = 0;
    const tick = () => {
      if (this.muted || !this.bgmPlaying) return;
      try {
        const mNote = melody[step % melody.length];
        
        // Play peaceful high chime melody
        this.playSynthNote(mNote, 0.8, 'sine', 0.04, 1500);
        
        // Play warm harmony/pad chord every 4 steps (on the beat)
        if (step % 4 === 0) {
          const chordIdx = Math.floor(step / 4) % chords.length;
          const chordNotes = chords[chordIdx];
          chordNotes.forEach(note => {
            // Very soft triangle wave for warm analog chord feel
            this.playSynthNote(note, 2.2, 'triangle', 0.02, 600);
          });
        }
        
        step++;
      } catch (e) {}
    };

    tick();
    this.synthBgmInterval = setInterval(tick, 600);
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
          gain.gain.linearRampToValueAtTime(0.35, now + elapsed + 0.03); // Double volume gain boost!
          gain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + item.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + elapsed);
          osc.stop(now + elapsed + item.dur);

          // Secondary Harmony Oscillator for double rich volume sound
          const oscHarm = this.ctx.createOscillator();
          const gainHarm = this.ctx.createGain();
          oscHarm.type = 'sine';
          oscHarm.frequency.setValueAtTime(item.note * 0.5, now + elapsed);
          gainHarm.gain.setValueAtTime(0, now + elapsed);
          gainHarm.gain.linearRampToValueAtTime(0.25, now + elapsed + 0.03);
          gainHarm.gain.exponentialRampToValueAtTime(0.01, now + elapsed + item.dur);
          oscHarm.connect(gainHarm);
          gainHarm.connect(this.ctx.destination);
          oscHarm.start(now + elapsed);
          oscHarm.stop(now + elapsed + item.dur);

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


import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Sound Synthesizer using Web Audio API
class SoundSynth {
  constructor() {
    this.ctx = null;
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
        const notes = [293.66, 329.63, 349.23, 440.00];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.08, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.18);
        });
      }
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  playBirthdayTheme() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      // Happy Birthday Melody notes and durations
      const melody = [
        { note: 261.63, dur: 0.3 }, // C4
        { note: 261.63, dur: 0.15 },
        { note: 293.66, dur: 0.45 }, // D4
        { note: 261.63, dur: 0.45 }, // C4
        { note: 349.23, dur: 0.45 }, // F4
        { note: 329.63, dur: 0.9 }, // E4

        { note: 261.63, dur: 0.3 }, // C4
        { note: 261.63, dur: 0.15 },
        { note: 293.66, dur: 0.45 }, // D4
        { note: 261.63, dur: 0.45 }, // C4
        { note: 392.00, dur: 0.45 }, // G4
        { note: 349.23, dur: 0.9 }, // F4
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

const synth = new SoundSynth();

// Preload Akari's sprite sheets
const akariSprites = {
  idle: Array.from({ length: 13 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/idle/${String(i).padStart(3, '0')}.png`;
    return img;
  }),
  running: Array.from({ length: 7 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/running/${String(i + 148).padStart(3, '0')}.png`;
    return img;
  }),
  jump: Array.from({ length: 5 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/jump/${String(i + 37).padStart(3, '0')}.png`;
    return img;
  }),
  attack: Array.from({ length: 8 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/slash_attack_1/${String(i + 29).padStart(3, '0')}.png`;
    return img;
  }),
  hurt: Array.from({ length: 9 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/hurt_recovery/${String(i + 139).padStart(3, '0')}.png`;
    return img;
  }),
  victory: Array.from({ length: 9 }, (_, i) => {
    const img = new Image();
    img.src = `/D Type/heroic_pose/${String(i + 234).padStart(3, '0')}.png`;
    return img;
  })
};

// Preload companion walking cycles
const companionSprites = {
  muichiro: Array.from({ length: 25 }, (_, i) => {
    const img = new Image();
    img.src = `/muichiro/walking/frame_${String(i).padStart(3, '0')}.png`;
    return img;
  }),
  chuuya: Array.from({ length: 36 }, (_, i) => {
    const img = new Image();
    img.src = `/chuuya/walking/frame_${String(i).padStart(3, '0')}.png`;
    return img;
  })
};

function App() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, VICTORY
  const [playerName, setPlayerName] = useState('Akari');
  const [rescuedList, setRescuedList] = useState([]);
  const canvasRef = useRef(null);

  // Active status variables to render onto HUD
  const [currentScore, setCurrentScore] = useState(0);

  // Game control references
  const keysRef = useRef({
    left: false,
    right: false,
    jump: false,
    attack: false
  });

  // Handle game input listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        keysRef.current.jump = true;
      }
      if (e.key === 'x' || e.key === 'X' || e.key === 'Enter') {
        keysRef.current.attack = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.jump = false;
      if (e.key === 'x' || e.key === 'X' || e.key === 'Enter') keysRef.current.attack = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set fixed simulation dimensions
    const VIEW_W = 1000;
    const VIEW_H = 500;
    canvas.width = VIEW_W;
    canvas.height = VIEW_H;

    // Define characters list
    const CHARACTERS = [
      { id: 'muichiro', name: 'Muichiro', color: '#8ecae6', power: 'Double Jump', hairColor: '#202020', hairTip: '#80ed99' },
      { id: 'chuuya', name: 'Chuuya', color: '#fb8500', power: 'Gravity Float', hairColor: '#d66800', hairTip: '#d66800' },
      { id: 'catnoir', name: 'Cat Noir', color: '#10b981', power: 'Cataclysm Shield', hairColor: '#ffe5b4', hairTip: '#ffe5b4' },
      { id: 'yuta', name: 'Yuta', color: '#e0b1cb', power: 'Cursed Slash', hairColor: '#4f5d75', hairTip: '#4f5d75' },
      { id: 'vanitas', name: 'Vanitas', color: '#7209b7', power: 'Homing Sparks', hairColor: '#1a1a2e', hairTip: '#1a1a2e' }
    ];

    // Game state inside loop
    const player = {
      x: 100,
      y: 350,
      vx: 0,
      vy: 0,
      width: 28,
      height: 48,
      isGrounded: false,
      facingLeft: false,
      doubleJumpsUsed: 0,
      jumpCooldown: 0,
      attackCooldown: 0,
      color: '#ff758f',
      shieldActive: false,
      shieldCooldown: 0,
      invulnFrames: 0,
      history: [] // trail positions for companions
    };

    // Parallax background items
    const backgroundStars = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * VIEW_W,
      y: Math.random() * 200,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    // Platforms
    const platforms = [
      // Ground level platforms
      { x: 0, y: 460, w: 900, h: 50 },
      { x: 1000, y: 460, w: 1200, h: 50 },
      { x: 2300, y: 460, w: 1000, h: 50 },
      { x: 3400, y: 460, w: 1500, h: 50 },
      
      // Floating level 1
      { x: 300, y: 350, w: 200, h: 20 },
      { x: 600, y: 260, w: 250, h: 20 },
      { x: 1100, y: 330, w: 220, h: 20 },
      { x: 1400, y: 240, w: 250, h: 20 },
      { x: 1750, y: 320, w: 220, h: 20 },
      
      // Higher level platforms
      { x: 750, y: 150, w: 150, h: 20 },
      { x: 1250, y: 180, w: 180, h: 20 },
      
      // Boss arena ground
      { x: 3500, y: 460, w: 1000, h: 50 }
    ];

    // Rescue Cages
    const cages = [
      { x: 400, y: 300, w: 50, h: 60, charId: 'muichiro', rescued: false },
      { x: 800, y: 210, w: 50, h: 60, charId: 'chuuya', rescued: false },
      { x: 1400, y: 280, w: 50, h: 60, charId: 'catnoir', rescued: false },
      { x: 2200, y: 410, w: 50, h: 60, charId: 'yuta', rescued: false },
      { x: 2900, y: 410, w: 50, h: 60, charId: 'vanitas', rescued: false }
    ];

    // Monsters
    const enemies = [
      { id: 1, x: 450, y: 420, basePatrolX: 450, range: 120, speed: 1.5, height: 30, width: 30, health: 1, vy: 0, onGround: true },
      { id: 2, x: 700, y: 220, basePatrolX: 700, range: 100, speed: 1.2, height: 30, width: 30, health: 1, vy: 0, onGround: true },
      { id: 3, x: 1200, y: 290, basePatrolX: 1200, range: 80, speed: 1.8, height: 30, width: 30, health: 1, vy: 0, onGround: true },
      { id: 4, x: 1550, y: 420, basePatrolX: 1550, range: 150, speed: 2.0, height: 30, width: 30, health: 2, vy: 0, onGround: true },
      { id: 5, x: 2500, y: 420, basePatrolX: 2500, range: 100, speed: 1.6, height: 30, width: 30, health: 2, vy: 0, onGround: true },
      { id: 6, x: 3000, y: 420, basePatrolX: 3000, range: 100, speed: 1.6, height: 30, width: 30, health: 2, vy: 0, onGround: true }
    ];

    // Projectiles
    let magicBolts = [];
    let homingSparks = [];
    let sparkCooldown = 0;

    // Particles
    let particles = [];

    // Boss State
    const boss = {
      x: 3900,
      y: 200,
      vx: -1,
      vy: 0,
      width: 80,
      height: 100,
      maxHealth: 15,
      health: 15,
      attackCooldown: 60,
      active: false
    };

    // Camera offset
    let cameraX = 0;

    function addExplosion(x, y, color, count = 10) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          color,
          size: Math.random() * 4 + 2,
          life: 30 + Math.random() * 20
        });
      }
    }

    // Main animation frame
    let animId;
    let frames = 0;

    const gameTick = () => {
      frames++;
      
      // Retrieve rescued companion list dynamically
      const activeRescues = cages.filter(c => c.rescued).map(c => CHARACTERS.find(ch => ch.id === c.charId));
      if (activeRescues.length !== rescuedList.length) {
        setRescuedList(activeRescues);
      }

      // Check active powers
      const hasDoubleJump = activeRescues.some(c => c.id === 'muichiro');
      const hasGravityFloat = activeRescues.some(c => c.id === 'chuuya');
      const hasCataclysmShield = activeRescues.some(c => c.id === 'catnoir');
      const hasCursedSlash = activeRescues.some(c => c.id === 'yuta');
      const hasHomingSparks = activeRescues.some(c => c.id === 'vanitas');

      // 1. Physics Constants
      const GRAVITY = hasGravityFloat ? 0.35 : 0.6;
      const SPEED_ACCEL = 0.7;
      const MAX_SPEED = 4.8;
      const JUMP_FORCE = hasGravityFloat ? -11.5 : -10.5;

      // 2. Control logic
      // Horizontal movements
      if (keysRef.current.left) {
        player.vx = Math.max(player.vx - SPEED_ACCEL, -MAX_SPEED);
        player.facingLeft = true;
      } else if (keysRef.current.right) {
        player.vx = Math.min(player.vx + SPEED_ACCEL, MAX_SPEED);
        player.facingLeft = false;
      } else {
        player.vx *= 0.8; // friction
      }

      // Jumping & Cooldowns
      if (player.jumpCooldown > 0) player.jumpCooldown--;
      if (keysRef.current.jump && player.jumpCooldown === 0) {
        if (player.isGrounded) {
          player.vy = JUMP_FORCE;
          player.isGrounded = false;
          player.doubleJumpsUsed = 0;
          player.jumpCooldown = 15;
          synth.playSfx('jump');
          addExplosion(player.x + player.width / 2, player.y + player.height, '#ffffff', 4);
        } else if (hasDoubleJump && player.doubleJumpsUsed < 1) {
          player.vy = JUMP_FORCE * 0.95;
          player.doubleJumpsUsed++;
          player.jumpCooldown = 15;
          synth.playSfx('jump');
          addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#80ed99', 8);
        }
      }

      // Apply Gravity
      player.vy += GRAVITY;

      // Update position
      player.x += player.vx;
      player.y += player.vy;

      // Invulnerable frame ticker
      if (player.invulnFrames > 0) player.invulnFrames--;

      // Shield Recharge (Cat Noir's Cataclysm Shield)
      if (hasCataclysmShield) {
        if (player.shieldCooldown > 0) {
          player.shieldCooldown--;
          if (player.shieldCooldown === 0) {
            player.shieldActive = true;
            addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#10b981', 12);
          }
        } else if (!player.shieldActive && player.shieldCooldown === 0) {
          player.shieldActive = true;
        }
      } else {
        player.shieldActive = false;
      }

      // Keep Player in level boundaries
      if (player.x < 10) {
        player.x = 10;
        player.vx = 0;
      }

      // Falling in pit check
      if (player.y > VIEW_H + 100) {
        // Respawn at safe zone before pit
        player.y = 100;
        player.vx = 0;
        player.vy = 0;
        player.x = Math.max(player.x - 250, 100);
        player.invulnFrames = 60;
        synth.playSfx('hit');
      }

      // Platform collisions
      player.isGrounded = false;
      platforms.forEach(plat => {
        if (player.x + player.width > plat.x &&
            player.x < plat.x + plat.w &&
            player.y + player.height > plat.y &&
            player.y + player.height - player.vy <= plat.y + 12) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
        }
      });

      // Save player history for companion following train
      player.history.push({ x: player.x, y: player.y });
      if (player.history.length > 120) {
        player.history.shift();
      }

      // 3. Attack / Shooting magic
      if (player.attackCooldown > 0) player.attackCooldown--;
      if (keysRef.current.attack && player.attackCooldown === 0) {
        const attackRange = hasCursedSlash ? 350 : 200;
        const speed = player.facingLeft ? -8 : 8;
        
        magicBolts.push({
          x: player.facingLeft ? player.x - 10 : player.x + player.width + 10,
          y: player.y + player.height / 2 - 4,
          vx: speed,
          vy: 0,
          range: attackRange,
          distTraveled: 0
        });

        synth.playSfx('shoot');
        player.attackCooldown = 22; // attack delay rate
      }

      // Homing Sparks power
      if (hasHomingSparks) {
        if (sparkCooldown > 0) sparkCooldown--;
        if (sparkCooldown === 0) {
          // Find nearest active enemy
          let nearestEnemy = null;
          let minDist = 300;
          enemies.concat(boss.active ? [boss] : []).forEach(e => {
            if (e.health > 0) {
              const d = Math.abs(e.x - player.x);
              if (d < minDist) {
                minDist = d;
                nearestEnemy = e;
              }
            }
          });

          if (nearestEnemy) {
            homingSparks.push({
              x: player.x + player.width / 2,
              y: player.y + 10,
              target: nearestEnemy,
              vx: 0,
              vy: -2,
              life: 90
            });
            sparkCooldown = 65;
          }
        }
      }

      // Update projectiles
      magicBolts.forEach((bolt, bIdx) => {
        bolt.x += bolt.vx;
        bolt.distTraveled += Math.abs(bolt.vx);
        if (bolt.distTraveled >= bolt.range) {
          magicBolts.splice(bIdx, 1);
        }
      });

      homingSparks.forEach((spark, sIdx) => {
        const dx = spark.target.x + spark.target.width / 2 - spark.x;
        const dy = spark.target.y + spark.target.height / 2 - spark.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
          spark.vx += (dx / dist) * 0.45;
          spark.vy += (dy / dist) * 0.45;
          // cap speed
          const speed = Math.sqrt(spark.vx * spark.vx + spark.vy * spark.vy);
          if (speed > 5) {
            spark.vx = (spark.vx / speed) * 5;
            spark.vy = (spark.vy / speed) * 5;
          }
        }
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life--;
        if (spark.life <= 0 || spark.target.health <= 0) {
          homingSparks.splice(sIdx, 1);
        }
      });

      // Update Monsters
      enemies.forEach((enemy) => {
        if (enemy.health <= 0) return;

        // Patrol move
        enemy.x += enemy.speed;
        if (enemy.x > enemy.basePatrolX + enemy.range) {
          enemy.speed = -Math.abs(enemy.speed);
        } else if (enemy.x < enemy.basePatrolX - enemy.range) {
          enemy.speed = Math.abs(enemy.speed);
        }

        // Apply gravity to enemy
        enemy.vy += 0.5;
        enemy.y += enemy.vy;
        enemy.onGround = false;

        platforms.forEach(plat => {
          if (enemy.x + enemy.width > plat.x &&
              enemy.x < plat.x + plat.w &&
              enemy.y + enemy.height > plat.y &&
              enemy.y + enemy.height - enemy.vy <= plat.y + 10) {
            enemy.y = plat.y - enemy.height;
            enemy.vy = 0;
            enemy.onGround = true;
          }
        });

        // Projectile hit enemy check
        magicBolts.forEach((bolt, bIdx) => {
          if (bolt.x >= enemy.x && bolt.x <= enemy.x + enemy.width &&
              bolt.y >= enemy.y && bolt.y <= enemy.y + enemy.height) {
            enemy.health--;
            magicBolts.splice(bIdx, 1);
            synth.playSfx('hit');
            addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffd13b', 8);
            if (enemy.health <= 0) {
              setCurrentScore(s => s + 100);
            }
          }
        });

        homingSparks.forEach((spark, sIdx) => {
          if (spark.x >= enemy.x && spark.x <= enemy.x + enemy.width &&
              spark.y >= enemy.y && spark.y <= enemy.y + enemy.height) {
            enemy.health--;
            homingSparks.splice(sIdx, 1);
            synth.playSfx('hit');
            addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#c084fc', 8);
            if (enemy.health <= 0) {
              setCurrentScore(s => s + 100);
            }
          }
        });

        // Enemy collides with player check
        if (player.invulnFrames === 0 &&
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.width &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.height) {
          
          if (player.shieldActive) {
            player.shieldActive = false;
            player.shieldCooldown = 300; // 5 seconds recharge
            player.invulnFrames = 45;
            synth.playSfx('hit');
            addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#00bbf9', 20);
          } else {
            player.vx = player.x < enemy.x ? -5 : 5;
            player.vy = -4;
            player.invulnFrames = 60;
            synth.playSfx('hit');
            addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 15);
          }
        }
      });

      // Update Cages
      cages.forEach(cage => {
        if (cage.rescued) return;

        const isNear = Math.abs((player.x + player.width/2) - (cage.x + cage.w/2)) < 80 &&
                       Math.abs((player.y + player.height/2) - (cage.y + cage.h/2)) < 80;
        
        if (isNear && keysRef.current.attack) {
          cage.rescued = true;
          synth.playSfx('unlock');
          addExplosion(cage.x + cage.w/2, cage.y + cage.h/2, '#c084fc', 25);
          setCurrentScore(s => s + 500);
        }

        magicBolts.forEach((bolt, bIdx) => {
          if (bolt.x >= cage.x && bolt.x <= cage.x + cage.w &&
              bolt.y >= cage.y && bolt.y <= cage.y + cage.h) {
            cage.rescued = true;
            magicBolts.splice(bIdx, 1);
            synth.playSfx('unlock');
            addExplosion(cage.x + cage.w/2, cage.y + cage.h/2, '#c084fc', 25);
            setCurrentScore(s => s + 500);
          }
        });
      });

      // Update Particles
      particles.forEach((part, pIdx) => {
        part.x += part.vx;
        part.y += part.vy;
        part.life--;
        if (part.life <= 0) {
          particles.splice(pIdx, 1);
        }
      });

      // Boss Arena Activation
      if (player.x > 3450 && !boss.active) {
        boss.active = true;
      }

      // Update Boss
      if (boss.active && boss.health > 0) {
        boss.y = 150 + Math.sin(frames / 20) * 80;

        boss.x += boss.vx;
        if (boss.x < 3550) {
          boss.vx = 2;
        } else if (boss.x > 3850) {
          boss.vx = -2;
        }

        if (boss.attackCooldown > 0) boss.attackCooldown--;
        if (boss.attackCooldown === 0) {
          const dx = (player.x + player.width/2) - boss.x;
          const dy = (player.y + player.height/2) - boss.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          magicBolts.push({
            x: boss.x,
            y: boss.y + boss.height / 2,
            vx: (dx / dist) * 4.5,
            vy: (dy / dist) * 4.5,
            range: 600,
            distTraveled: 0,
            isBossAttack: true
          });
          boss.attackCooldown = 85;
        }

        magicBolts.forEach((bolt, bIdx) => {
          if (!bolt.isBossAttack &&
              bolt.x >= boss.x && bolt.x <= boss.x + boss.width &&
              bolt.y >= boss.y && bolt.y <= boss.y + boss.height) {
            boss.health--;
            magicBolts.splice(bIdx, 1);
            synth.playSfx('hit');
            addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ef4444', 12);
            
            if (boss.health <= 0) {
              addExplosion(boss.x + boss.width/2, boss.y + boss.height/2, '#ffd13b', 50);
              setCurrentScore(s => s + 5000);
              synth.playBirthdayTheme();
              setTimeout(() => {
                setGameState('VICTORY');
              }, 2000);
            }
          }
        });

        homingSparks.forEach((spark, sIdx) => {
          if (spark.x >= boss.x && spark.x <= boss.x + boss.width &&
              spark.y >= boss.y && spark.y <= boss.y + boss.height) {
            boss.health--;
            homingSparks.splice(sIdx, 1);
            synth.playSfx('hit');
            addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#c084fc', 12);
            
            if (boss.health <= 0) {
              addExplosion(boss.x + boss.width/2, boss.y + boss.height/2, '#ffd13b', 50);
              setCurrentScore(s => s + 5000);
              synth.playBirthdayTheme();
              setTimeout(() => {
                setGameState('VICTORY');
              }, 2000);
            }
          }
        });

        magicBolts.forEach((bolt, bIdx) => {
          if (bolt.isBossAttack &&
              bolt.x >= player.x && bolt.x <= player.x + player.width &&
              bolt.y >= player.y && bolt.y <= player.y + player.height) {
            
            magicBolts.splice(bIdx, 1);
            if (player.invulnFrames === 0) {
              if (player.shieldActive) {
                player.shieldActive = false;
                player.shieldCooldown = 300;
                player.invulnFrames = 45;
                synth.playSfx('hit');
                addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#00bbf9', 20);
              } else {
                player.vx = player.x < boss.x ? -5 : 5;
                player.vy = -3;
                player.invulnFrames = 60;
                synth.playSfx('hit');
                addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 15);
              }
            }
          }
        });
      }

      // Camera Scrolling
      cameraX = player.x - 300;
      if (cameraX < 0) cameraX = 0;
      if (cameraX > 3200) cameraX = 3200;

      // 5. Drawing Section
      ctx.clearRect(0, 0, VIEW_W, VIEW_H);

      // Star Background rendering
      ctx.fillStyle = '#ffffff';
      backgroundStars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.fillRect(star.x - (cameraX * 0.1) % VIEW_W + (star.x - (cameraX * 0.1) < 0 ? VIEW_W : 0), star.y, star.size, star.size);
      });
      ctx.globalAlpha = 1.0;

      // Distant castle skyline
      ctx.fillStyle = '#18122b';
      ctx.beginPath();
      ctx.moveTo(0, 500);
      ctx.lineTo(150 - cameraX*0.15, 300);
      ctx.lineTo(250 - cameraX*0.15, 300);
      ctx.lineTo(400 - cameraX*0.15, 500);
      ctx.fill();

      ctx.fillStyle = '#100c20';
      ctx.beginPath();
      ctx.moveTo(500 - cameraX*0.2, 500);
      ctx.lineTo(650 - cameraX*0.2, 220);
      ctx.lineTo(750 - cameraX*0.2, 220);
      ctx.lineTo(900 - cameraX*0.2, 500);
      ctx.fill();

      // Draw Platforms
      platforms.forEach(plat => {
        if (plat.x + plat.w - cameraX < 0 || plat.x - cameraX > VIEW_W) return;
        
        ctx.fillStyle = '#2d1e3d';
        ctx.fillRect(plat.x - cameraX, plat.y, plat.w, plat.h);
        
        ctx.fillStyle = '#5c3d70';
        ctx.fillRect(plat.x - cameraX, plat.y, plat.w, 4);

        ctx.strokeStyle = '#1b1224';
        ctx.lineWidth = 1;
        for (let bx = plat.x; bx < plat.x + plat.w; bx += 30) {
          ctx.beginPath();
          ctx.moveTo(bx - cameraX, plat.y);
          ctx.lineTo(bx - cameraX, plat.y + plat.h);
          ctx.stroke();
        }
      });

      // Draw Cages
      cages.forEach(cage => {
        if (cage.x + cage.w - cameraX < 0 || cage.x - cameraX > VIEW_W) return;
        
        const cx = cage.x - cameraX;
        const cy = cage.y;

        if (!cage.rescued) {
          ctx.fillStyle = '#495057';
          ctx.fillRect(cx, cy, cage.w, cage.h);
          
          ctx.fillStyle = '#1a1d20';
          for (let bx = cx + 8; bx < cx + cage.w; bx += 10) {
            ctx.fillRect(bx, cy + 5, 3, cage.h - 10);
          }

          const pulse = Math.sin(frames / 8) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(168, 85, 247, ${pulse})`;
          ctx.fillRect(cx + cage.w / 2 - 6, cy + cage.h / 2 + 5, 12, 12);
        }

        const animeChar = CHARACTERS.find(ch => ch.id === cage.charId);
        if (animeChar) {
          if (!cage.rescued) {
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(cx + cage.w/2 - 10, cy + 15, 20, 20);
            
            ctx.fillStyle = animeChar.hairColor;
            ctx.fillRect(cx + cage.w/2 - 12, cy + 10, 24, 8);
            ctx.fillRect(cx + cage.w/2 - 12, cy + 18, 5, 14);
            ctx.fillRect(cx + cage.w/2 + 7, cy + 18, 5, 14);
            
            ctx.fillStyle = animeChar.color;
            ctx.fillRect(cx + cage.w/2 - 6, cy + 20, 3, 3);
            ctx.fillRect(cx + cage.w/2 + 3, cy + 20, 3, 3);
          }
        }
      });

      // Draw Monsters
      enemies.forEach(enemy => {
        if (enemy.health <= 0) return;
        if (enemy.x + enemy.width - cameraX < 0 || enemy.x - cameraX > VIEW_W) return;

        const ex = enemy.x - cameraX;
        const ey = enemy.y;

        ctx.fillStyle = '#1e1a3a';
        ctx.beginPath();
        ctx.arc(ex + enemy.width/2, ey + enemy.height - 12, 14, 0, Math.PI, true);
        ctx.lineTo(ex + enemy.width, ey + enemy.height);
        ctx.lineTo(ex, ey + enemy.height);
        ctx.fill();

        const eyePulse = Math.sin(frames / 6) * 2;
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ex + 6, ey + 10 + eyePulse, 6, 6);
        ctx.fillRect(ex + enemy.width - 12, ey + 10 + eyePulse, 6, 6);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ex + 8, ey + 12 + eyePulse, 2, 2);
        ctx.fillRect(ex + enemy.width - 10, ey + 12 + eyePulse, 2, 2);
        
        ctx.fillStyle = '#3a0ca3';
        ctx.beginPath();
        ctx.moveTo(ex + 4, ey + 4);
        ctx.lineTo(ex + 10, ey + 10);
        ctx.lineTo(ex, ey + 12);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ex + enemy.width - 4, ey + 4);
        ctx.lineTo(ex + enemy.width - 10, ey + 10);
        ctx.lineTo(ex + enemy.width, ey + 12);
        ctx.fill();
      });

      // Draw Projectiles
      magicBolts.forEach(bolt => {
        if (bolt.isBossAttack) {
          ctx.fillStyle = '#9d4edd';
          ctx.beginPath();
          ctx.arc(bolt.x - cameraX, bolt.y, 6, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bolt.x - cameraX, bolt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crescent sword slash effect
          ctx.strokeStyle = '#ffd13b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          const startAngle = bolt.vx > 0 ? -Math.PI / 3 : Math.PI - Math.PI / 3;
          const endAngle = bolt.vx > 0 ? Math.PI / 3 : Math.PI + Math.PI / 3;
          ctx.arc(bolt.x - cameraX, bolt.y, 24, startAngle, endAngle);
          ctx.stroke();

          // Outer glowing slash edge
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(bolt.x - cameraX, bolt.y, 24, startAngle, endAngle);
          ctx.stroke();
        }
      });

      // Draw Homing Sparks
      homingSparks.forEach(spark => {
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(spark.x - cameraX - 4, spark.y - 4, 8, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(spark.x - cameraX - 2, spark.y - 2, 4, 4);
      });

      // Draw Particles
      particles.forEach(part => {
        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.life / 50;
        ctx.fillRect(part.x - cameraX, part.y, part.size, part.size);
      });
      ctx.globalAlpha = 1.0;

      // Draw Companions
      activeRescues.forEach((char, idx) => {
        const offsetHistory = player.history[player.history.length - 1 - (idx + 1) * 16];
        if (offsetHistory) {
          const cx = offsetHistory.x - cameraX;
          
          let drawnSprite = false;
          
          if (char.id === 'muichiro' || char.id === 'chuuya') {
            const list = companionSprites[char.id];
            const frameIndex = Math.floor(frames / 6) % list.length;
            const img = list[frameIndex];
            
            if (img && img.complete && img.naturalWidth !== 0) {
              ctx.save();
              if (player.facingLeft) {
                ctx.translate(cx + 9, offsetHistory.y + 9);
                ctx.scale(-1, 1);
                ctx.translate(-(cx + 9), -(offsetHistory.y + 9));
              }
              
              const compHeight = 90;
              const ratio = img.naturalWidth / img.naturalHeight;
              const compWidth = compHeight * ratio;
              
              ctx.imageSmoothingEnabled = true;
              ctx.drawImage(
                img, 
                cx - compWidth / 2 + 9, 
                offsetHistory.y + player.height - compHeight + 12, 
                compWidth, 
                compHeight
              );
              ctx.restore();
              drawnSprite = true;
            }
          }
          
          if (!drawnSprite) {
            // Draw procedural chibi fallback for companions who don't have walk sprites yet (Cat Noir, Yuta, Vanitas)
            // Float them slightly for a magical/chibi feel
            const cy = offsetHistory.y + Math.sin((frames + idx * 25) / 10) * 8 - 10;
            
            ctx.fillStyle = '#ffd166'; // Skin
            ctx.fillRect(cx, cy, 18, 18);
            
            ctx.fillStyle = char.hairColor;
            ctx.fillRect(cx - 2, cy - 2, 22, 6);
            ctx.fillRect(cx - 2, cy + 4, 4, 10);
            ctx.fillRect(cx + 16, cy + 4, 4, 10);
            
            if (char.id === 'catnoir') {
              // Draw tiny black cat ears for Chat Noir!
              ctx.fillStyle = '#121212';
              ctx.beginPath();
              ctx.moveTo(cx - 2, cy - 2);
              ctx.lineTo(cx + 2, cy - 6);
              ctx.lineTo(cx + 4, cy - 2);
              ctx.moveTo(cx + 14, cy - 2);
              ctx.lineTo(cx + 16, cy - 6);
              ctx.lineTo(cx + 20, cy - 2);
              ctx.fill();
            }

            ctx.fillStyle = char.color;
            ctx.fillRect(cx + 3, cy + 6, 3, 3);
            ctx.fillRect(cx + 11, cy + 6, 3, 3);

            if (frames % 12 === 0) {
              particles.push({
                x: offsetHistory.x + 9,
                y: offsetHistory.y + 9,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 1.5,
                color: char.color,
                size: Math.random() * 3 + 1,
                life: 25
              });
            }
          }
        }
      });

      // Draw Player (Akari using D Type sprites)
      const px = player.x - cameraX;
      const py = player.y;
      
      if (player.invulnFrames === 0 || Math.floor(frames / 4) % 2 === 0) {
        // Determine player animation state
        let animState = 'idle';
        let frameList = akariSprites.idle;
        
        if (player.invulnFrames > 0) {
          animState = 'hurt';
          frameList = akariSprites.hurt;
        } else if (keysRef.current.attack || player.attackCooldown > 0) {
          animState = 'attack';
          frameList = akariSprites.attack;
        } else if (!player.isGrounded) {
          animState = 'jump';
          frameList = akariSprites.jump;
        } else if (keysRef.current.left || keysRef.current.right) {
          animState = 'running';
          frameList = akariSprites.running;
        }
        
        // Reduced animation frame rate (frames / 8 instead of frames / 5) for smoother, slower playback
        const frameIndex = Math.floor(frames / 8) % frameList.length;
        const img = frameList[frameIndex];
        
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.save();
          if (player.facingLeft) {
            ctx.translate(px + player.width / 2, py + player.height / 2);
            ctx.scale(-1, 1);
            ctx.translate(-(px + player.width / 2), -(py + player.height / 2));
          }
          // Calculate dimensions maintaining the original aspect ratio (388x275) to prevent distortion
          const targetHeight = 190;
          const nativeW = img.naturalWidth || img.width;
          const nativeH = img.naturalHeight || img.height;
          const spriteW = targetHeight * (nativeW / nativeH);
          const spriteH = targetHeight;
          const bottomOffset = 31; // Adjusted offset for 190 height to keep feet on ground
          
          ctx.imageSmoothingEnabled = true; // Kept true for smooth scaled scaling
          ctx.drawImage(
            img, 
            px + player.width / 2 - spriteW / 2, 
            py + player.height - spriteH + bottomOffset, 
            spriteW, 
            spriteH
          );
          ctx.restore();
        } else {
          // Fallback if images are loading: draw a glowing violet orb
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(px + player.width/2, py + player.height/2, 16, 0, Math.PI*2);
          ctx.fill();
        }

        if (player.shieldActive) {
          ctx.strokeStyle = 'rgba(0, 180, 216, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(px + player.width/2, py + player.height/2, 32, 0, Math.PI*2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(0, 180, 216, 0.08)';
          ctx.beginPath();
          ctx.arc(px + player.width/2, py + player.height/2, 32, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // Draw Boss
      if (boss.active && boss.health > 0) {
        const bx = boss.x - cameraX;
        const by = boss.y;

        ctx.fillStyle = '#3a0ca3';
        ctx.fillRect(bx, by, boss.width, boss.height);

        ctx.fillStyle = '#7209b7';
        ctx.fillRect(bx + 10, by + 10, boss.width - 20, boss.height - 20);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bx + 15, by + 25, 16, 12);
        ctx.fillRect(bx + boss.width - 31, by + 25, 16, 12);

        ctx.fillStyle = '#0f0c24';
        ctx.fillRect(bx - 4, by - 12, boss.width + 8, 12);

        ctx.fillStyle = '#1e1a3a';
        ctx.fillRect(bx - 10, by - 30, boss.width + 20, 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bx - 10, by - 30, (boss.width + 20) * (boss.health / boss.maxHealth), 10);
      }

      animId = requestAnimationFrame(gameTick);
    };

    animId = requestAnimationFrame(gameTick);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, rescuedList]);

  const handleStartGame = () => {
    synth.init();
    setGameState('PLAYING');
  };

  return (
    <div className="app-container">
      <div className="ambient-bg magic"></div>
      <div className="grid-overlay"></div>

      {gameState === 'START' && (
        <div className="start-screen-wrapper">
          <div className="title-banner">
            <span className="retro-tag font-retro">BIRTHDAY QUEST</span>
            <h1 className="main-logo font-retro">ANIME RESCUE</h1>
          </div>

          <div className="story-card">
            <h2>The Citadel of Gloom</h2>
            <p>
              An evil dark glitch has swept across the anime multiverse! 
              The legendary heroes are trapped inside mystical cages guarded by Gloom Monsters. 
              Only you, <strong>Akari</strong>, can save them. Use your magical wand to break the cages, recruit the boys to your party, harness their special abilities, and clear the citadel to unlock your birthday celebration!
            </p>
          </div>

          <div className="setup-form">
            <button className="start-btn active font-retro" onClick={handleStartGame}>
              START GAME
            </button>
          </div>

          <div className="instructions">
            <h3>🎮 Controls Checklist</h3>
            <ul>
              <li><strong>Move Left / Right</strong>: Arrow Keys / A / D</li>
              <li><strong>Jump</strong>: Spacebar</li>
              <li><strong>Attack / Blast Wand</strong>: X / Enter key</li>
            </ul>
          </div>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="game-screen-wrapper">
          <div className="game-hud">
            <div className="hud-metric">
              <span className="label">HEROINE:</span>
              <span className="value text-gold">{playerName}</span>
            </div>
            <div className="hud-metric">
              <span className="label">RESCUED:</span>
              <span className="value text-gold">{rescuedList.length} / 6</span>
            </div>
            <div className="hud-metric">
              <span className="label">SCORE:</span>
              <span className="value text-purple">{currentScore}</span>
            </div>
          </div>

          <div className="canvas-wrapper">
            <canvas ref={canvasRef} className="game-canvas" />
          </div>

          <div className="companions-status">
            <h3>Active Party Powers</h3>
            <div className="companions-grid">
              {rescuedList.length === 0 ? (
                <div className="no-power-msg">No active party members. Rescue cages to gain powers!</div>
              ) : (
                rescuedList.map(char => (
                  <div key={char.id} className="power-card" style={{ borderColor: char.color }}>
                    <span className="char-name" style={{ color: char.color }}>{char.name}</span>
                    <span className="power-desc">{char.power} Enabled</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'VICTORY' && (
        <div className="victory-screen-wrapper">
          <div className="congrats-card">
            <h1 className="flashing-logo font-retro">HAPPY BIRTHDAY</h1>
            <h2 className="recipient font-retro text-gold">{playerName.toUpperCase()}!</h2>
            
            <div className="interactive-cake">
              <div className="cake-candle">🔥</div>
              <div className="cake-top">🎂</div>
            </div>

            <p className="victory-msg">
              Congratulations! You successfully rescued Muichiro, Chuuya, Giyu, Luka, Yuta, and Vanitas from the Gloom Citadel. 
              The characters have organized a grand celebration in your honor!
            </p>

            <div className="characters-wishes">
              <h3>💌 The Boys' Birthday Wishes:</h3>
              <div className="wish-bubbles">
                <div className="wish-bubble">
                  <span className="wish-author text-mint">☁️ Muichiro:</span>
                  "Happy birthday... I'll remember this day forever. Let's look at the clouds together."
                </div>
                <div className="wish-bubble">
                  <span className="wish-author text-gold">🎩 Chuuya:</span>
                  "Happy birthday, kid! Need a lift? I can make gravity vanish just for your birthday!"
                </div>
                <div className="wish-bubble">
                  <span className="wish-author text-blue">🌊 Giyu:</span>
                  "Happy birthday. I am glad you are safe... and I'm glad to celebrate with you."
                </div>
                <div className="wish-bubble">
                  <span className="wish-author text-cyan">🎸 Luka:</span>
                  "Happy birthday. I wrote a song just for your heartbeat today."
                </div>
              </div>
            </div>

            <button className="start-btn active font-retro" onClick={() => setGameState('START')}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

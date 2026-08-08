import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { synth } from './game/soundSynth';
import { akariSprites, enemySprites, drawCroppedSprite, companionSprites, preloadAllImages } from './game/spriteLoader';
import { CHARACTERS, platforms, initialCages, initialEnemies } from './game/gameConfig';
import { drawCompanions } from './game/companionRenderer';
import { EnvironmentRenderer } from './game/environmentRenderer';
import { ParticleEngine } from './game/particleEngine';
import { drawRescueCutscene } from './game/cutsceneRenderer';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';

function App() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER, VICTORY
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [playerName, setPlayerName] = useState('Akari');
  const [rescuedList, setRescuedList] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    preloadAllImages((pct) => {
      setLoadingProgress(pct);
    }).then(() => {
      setTimeout(() => setIsLoaded(true), 250);
    });
  }, []);

  // Active status variables
  const [currentScore, setCurrentScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const MAX_HP = 5;

  // Game control references
  const keysRef = useRef({
    left: false,
    right: false,
    jump: false,
    attack: false
  });

  // Reset player and game state
  const resetGame = () => {
    setCurrentScore(0);
    setPlayerHp(5);
    setRescuedList([]);
    setGameState('PLAYING');
  };

  const cutsceneRef = useRef({ active: false, char: null });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Handle game input listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING') return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'x', 'X', 'Enter', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D', 'f', 'F'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
        return;
      }

      // If Dialogue Box is open, pressing ANY key dismisses it!
      if (cutsceneRef.current.active) {
        if (['x', 'X', 'Enter', ' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
          cutsceneRef.current.active = false;
          synth.playSfx('unlock');
          return;
        }
      }

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
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'x', 'X', 'Enter', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.jump = false;
      if (e.key === 'x' || e.key === 'X' || e.key === 'Enter') keysRef.current.attack = false;
    };

    const handlePointerDown = () => {
      if (cutsceneRef.current.active) {
        cutsceneRef.current.active = false;
        synth.playSfx('unlock');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
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

    // Environment & Particle Engines
    const envRenderer = new EnvironmentRenderer(VIEW_W, VIEW_H);
    const particleEngine = new ParticleEngine();

    // Reset cages state for gameplay
    const cages = initialCages.map(c => ({ ...c, rescued: false }));
    const enemies = initialEnemies.map(e => ({ ...e }));

    // Cutscene State Controller
    const cutsceneState = {
      active: false,
      char: null,
      timer: 0
    };

    // Player Object
    const player = {
      x: 100,
      y: 350,
      vx: 0,
      vy: 0,
      width: 28,
      height: 48,
      hp: 5,
      isGrounded: false,
      facingLeft: false,
      doubleJumpsUsed: 0,
      jumpCooldown: 0,
      attackCooldown: 0,
      color: '#ff758f',
      invulnFrames: 0,
      history: Array.from({ length: 120 }, () => ({ x: 100, y: 350 }))
    };

    // Projectiles
    let magicBolts = [];
    let homingSparks = [];
    let sparkCooldown = 0;

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

    let cameraX = 0;
    let animId;
    let frames = 0;

    const takePlayerDamage = () => {
      if (player.invulnFrames > 0) return;

      player.invulnFrames = 60;
      synth.playSfx('hit');
      particleEngine.triggerShake(16, 8);
      particleEngine.addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 16);

      setPlayerHp(prevHp => {
        const nextHp = prevHp - 1;
        if (nextHp <= 0) {
          setTimeout(() => setGameState('GAME_OVER'), 500);
        }
        return Math.max(0, nextHp);
      });
    };

    const gameTick = () => {
      frames++;
      
      // Retrieve rescued companion list dynamically
      const activeRescues = cages.filter(c => c.rescued).map(c => CHARACTERS.find(ch => ch.id === c.charId)).filter(Boolean);
      if (activeRescues.length !== rescuedList.length) {
        setRescuedList(activeRescues);
      }

      // Check active powers
      const hasDoubleJump = activeRescues.some(c => c.id === 'muichiro');
      const hasGravityFloat = activeRescues.some(c => c.id === 'chuuya');
      const hasWaterShield = activeRescues.some(c => c.id === 'giyu');
      const hasCursedSlash = activeRescues.some(c => c.id === 'yuta');
      const hasSpeedBoost = activeRescues.some(c => c.id === 'luka');

      if (player.invulnFrames > 0) player.invulnFrames--;

      // 1. Cutscene Pause Logic
      if (cutsceneState.active) {
        cutsceneState.timer--;
        if (cutsceneState.timer <= 0) {
          cutsceneState.active = false;
        }
      } else {
        // Regular Gameplay Physics Tick
        const GRAVITY = hasGravityFloat ? 0.35 : 0.55;
        const SPEED_ACCEL = 0.8;
        const MAX_SPEED = hasSpeedBoost ? 7.0 : 5.2;
        const JUMP_FORCE = hasGravityFloat ? -14.5 : -13.5;

        // Horizontal movements
        if (keysRef.current.left) {
          player.vx = Math.max(player.vx - SPEED_ACCEL, -MAX_SPEED);
          player.facingLeft = true;
        } else if (keysRef.current.right) {
          player.vx = Math.min(player.vx + SPEED_ACCEL, MAX_SPEED);
          player.facingLeft = false;
        } else {
          player.vx *= 0.8;
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
            particleEngine.addDust(player.x + player.width / 2, player.y + player.height);
          } else if (hasDoubleJump && player.doubleJumpsUsed < 1) {
            player.vy = JUMP_FORCE * 0.9;
            player.doubleJumpsUsed = 1;
            player.jumpCooldown = 15;
            synth.playSfx('jump');
            particleEngine.addExplosion(player.x + player.width / 2, player.y + player.height, '#8ecae6', 8);
          }
        }

        // Apply Gravity
        player.vy += GRAVITY;
        player.x += player.vx;
        player.y += player.vy;

        // Boundaries
        if (player.x < 0) player.x = 0;

        // Pit Check
        if (player.y > VIEW_H + 100) {
          player.y = 100;
          player.vx = 0;
          player.vy = 0;
          player.x = Math.max(player.x - 250, 100);
          takePlayerDamage();
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

        // Player History Trail
        player.history.push({ x: player.x, y: player.y });
        if (player.history.length > 120) {
          player.history.shift();
        }

        // Melee Katana Sword Strike System (No yellow circles or purple balls!)
        if (player.attackCooldown > 0) player.attackCooldown--;
        if (keysRef.current.attack && player.attackCooldown === 0) {
          player.attackCooldown = 18;
          synth.playSfx('sword');

          // Melee Katana Slash Hit Area (75px in facing direction)
          const slashReach = 75;
          const slashMinX = player.facingLeft ? player.x - slashReach : player.x;
          const slashMaxX = player.facingLeft ? player.x + player.width : player.x + player.width + slashReach;

          // Melee strike enemies
          enemies.forEach(enemy => {
            if (enemy.health > 0 && enemy.x + enemy.width > slashMinX && enemy.x < slashMaxX &&
                Math.abs(enemy.y - player.y) < 60) {
              enemy.health--;
              synth.playSfx('hit');
              particleEngine.addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ff4d6d', 10);
              if (enemy.health <= 0) {
                setCurrentScore(s => s + 100);
              }
            }
          });

          // Melee strike boss
          if (boss.active && boss.health > 0 && boss.x + boss.width > slashMinX && boss.x < slashMaxX &&
              Math.abs(boss.y - player.y) < 100) {
            boss.health -= 2;
            synth.playSfx('hit');
            particleEngine.addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ff4d6d', 14);
            if (boss.health <= 0) {
              particleEngine.addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ffd13b', 50);
              setCurrentScore(s => s + 5000);
              synth.playBirthdayTheme();
              setTimeout(() => setGameState('VICTORY'), 2000);
            }
          }
        }

        // Projectiles Update
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
          
          enemy.x += enemy.speed;
          if (enemy.x > enemy.basePatrolX + enemy.range) {
            enemy.speed = -Math.abs(enemy.speed);
          } else if (enemy.x < enemy.basePatrolX - enemy.range) {
            enemy.speed = Math.abs(enemy.speed);
          }

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

          // Projectile hit enemy
          magicBolts.forEach((bolt, bIdx) => {
            if (bolt.x >= enemy.x && bolt.x <= enemy.x + enemy.width &&
                bolt.y >= enemy.y && bolt.y <= enemy.y + enemy.height) {
              enemy.health--;
              magicBolts.splice(bIdx, 1);
              synth.playSfx('hit');
              particleEngine.addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffd13b', 10);
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
              particleEngine.addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#c084fc', 10);
              if (enemy.health <= 0) {
                setCurrentScore(s => s + 100);
              }
            }
          });

          // Enemy hit player
          if (player.invulnFrames === 0 &&
              player.x + player.width > enemy.x &&
              player.x < enemy.x + enemy.width &&
              player.y + player.height > enemy.y &&
              player.y < enemy.y + enemy.height) {
            
            player.vx = player.x < enemy.x ? -5 : 5;
            player.vy = -4;

            // Water Shield damage absorption
            if (hasWaterShield) {
              particleEngine.addExplosion(player.x + player.width / 2, player.y + player.height / 2, '#219ebc', 12);
              player.invulnFrames = 45;
              synth.playSfx('hit');
            } else {
              takePlayerDamage();
            }
          }
        });

        // Prison Cages Break & Cutscene Trigger!
        cages.forEach(cage => {
          if (cage.rescued) return;

          const isNear = Math.abs((player.x + player.width / 2) - (cage.x + cage.w / 2)) < 80 &&
                         Math.abs((player.y + player.height / 2) - (cage.y + cage.h / 2)) < 80;
          
          let broken = false;
          if (isNear && keysRef.current.attack) {
            broken = true;
          }

          magicBolts.forEach((bolt, bIdx) => {
            if (bolt.x >= cage.x && bolt.x <= cage.x + cage.w &&
                bolt.y >= cage.y && bolt.y <= cage.y + cage.h) {
              broken = true;
              magicBolts.splice(bIdx, 1);
            }
          });

          if (broken) {
            cage.rescued = true;
            const animeChar = CHARACTERS.find(ch => ch.id === cage.charId);
            
            synth.playSfx('unlock');
            particleEngine.triggerShake(20, 8);
            particleEngine.addRescueEnergyBurst(
              cage.x + cage.w / 2, 
              cage.y + cage.h / 2, 
              animeChar ? animeChar.color : '#a855f7'
            );
            setCurrentScore(s => s + 500);

            // Companion Combat Strike! Obliterate nearest patrol enemy with special attack burst!
            let nearestEnemy = null;
            let minDistance = 500;
            enemies.forEach(e => {
              if (e.health > 0) {
                const dist = Math.abs(e.x - cage.x);
                if (dist < minDistance) {
                  minDistance = dist;
                  nearestEnemy = e;
                }
              }
            });

            if (nearestEnemy) {
              nearestEnemy.health = 0;
              particleEngine.addExplosion(
                nearestEnemy.x + nearestEnemy.width / 2, 
                nearestEnemy.y + nearestEnemy.height / 2, 
                animeChar ? animeChar.color : '#ffd13b', 
                24
              );
              synth.playSfx('bossHit');
              setCurrentScore(s => s + 300);
            }

            // Trigger RPG Dialogue & Rescue Cutscene Overlay (Indefinite Hold Until Dismissed!)
            cutsceneState.active = true;
            cutsceneState.char = animeChar;
            cutsceneRef.current.active = true;
            cutsceneRef.current.char = animeChar;
          }
        });

        // Boss Arena
        if (player.x > 3450 && !boss.active) {
          boss.active = true;
        }

        if (boss.active && boss.health > 0) {
          boss.y = 150 + Math.sin(frames / 20) * 80;
          boss.x += boss.vx;
          if (boss.x < 3550) boss.vx = 2;
          else if (boss.x > 3850) boss.vx = -2;

          if (boss.attackCooldown > 0) boss.attackCooldown--;
          if (boss.attackCooldown === 0) {
            const dx = (player.x + player.width / 2) - boss.x;
            const dy = (player.y + player.height / 2) - boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
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
            if (bolt.isBossAttack &&
                bolt.x >= player.x && bolt.x <= player.x + player.width &&
                bolt.y >= player.y && bolt.y <= player.y + player.height) {
              magicBolts.splice(bIdx, 1);
              takePlayerDamage();
            }
          });

          magicBolts.forEach((bolt, bIdx) => {
            if (!bolt.isBossAttack &&
                bolt.x >= boss.x && bolt.x <= boss.x + boss.width &&
                bolt.y >= boss.y && bolt.y <= boss.y + boss.height) {
              boss.health--;
              magicBolts.splice(bIdx, 1);
              synth.playSfx('hit');
              particleEngine.addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ef4444', 12);
              
              if (boss.health <= 0) {
                particleEngine.addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, '#ffd13b', 50);
                setCurrentScore(s => s + 5000);
                synth.playBirthdayTheme();
                setTimeout(() => setGameState('VICTORY'), 2000);
              }
            }
          });
        }
      }

      // Camera Scrolling & Screen Shake
      cameraX = Math.max(0, Math.min(player.x - 300, 3200));
      particleEngine.update();

      const shake = particleEngine.getShakeOffset();

      ctx.save();
      ctx.translate(shake.x, shake.y);

      // Rendering Layers
      ctx.clearRect(0, 0, VIEW_W, VIEW_H);

      // 1. Dynamic Parallax Background
      envRenderer.drawBackground(ctx, cameraX, frames);

      // 2. Platform Tilemap
      envRenderer.drawPlatforms(ctx, platforms, cameraX);

      // 3. Prison Cages
      envRenderer.drawCages(ctx, cages, cameraX, frames, player);

      // 4. Monsters (Authentic Gothicvania Animated Villains!)
      enemies.forEach(enemy => {
        if (enemy.health <= 0) return;
        const ex = enemy.x - cameraX;
        if (ex < -60 || ex > VIEW_W + 60) return;

        const enemyCenterX = ex + enemy.width / 2;
        // Snap enemy feet solidly onto stone platform caps (+2px offset)
        const enemyGroundY = enemy.y + enemy.height + 2;
        
        const enemyConfig = enemySprites[enemy.type] || enemySprites.hellhound;
        const animList = Array.isArray(enemyConfig) ? enemyConfig : (enemyConfig.frames || []);
        const flipDefault = enemyConfig.flipDefault || false;
        
        // facingLeft = true when moving left (speed < 0)
        const facingLeft = (enemy.vx ? enemy.vx < 0 : enemy.speed < 0);
        const currentFrameIdx = Math.floor(frames / 5) % (animList.length || 1);
        const enemyImg = animList[currentFrameIdx];

        const renderHeight = enemy.type === 'werewolf' ? 68 : enemy.type === 'fireskull' ? 44 : 54;

        if (!drawCroppedSprite(ctx, enemyImg, enemyCenterX, enemyGroundY, renderHeight, facingLeft, flipDefault)) {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(ex, enemy.y, enemy.width, enemy.height);
        }
      });

      // 5. Projectiles
      magicBolts.forEach(bolt => {
        const bx = bolt.x - cameraX;
        if (bx < -30 || bx > VIEW_W + 30) return;

        if (bolt.isBossAttack) {
          ctx.fillStyle = '#9d4edd';
          ctx.beginPath();
          ctx.arc(bx, bolt.y, 7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffd13b';
          ctx.beginPath();
          ctx.arc(bx, bolt.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. Particles
      particleEngine.draw(ctx, cameraX);

      // 7. Companions Trail (Fighting Animations ONLY Trigger when Near an Active Enemy or Boss!)
      const nearEnemies = enemies.some(e => e.health > 0 && Math.abs(e.x - player.x) < 140) || 
                          (boss.active && boss.health > 0 && Math.abs(boss.x - player.x) < 220);
      drawCompanions(ctx, activeRescues, player, cameraX, frames, nearEnemies);

      // 8. Player (Akari) - Authentic 8-Frame Katana Slash Animation (No procedural semi-circles!)
      if (player.invulnFrames % 4 < 2) {
        let state = 'idle';
        if (!player.isGrounded) state = 'jump';
        else if (Math.abs(player.vx) > 0.5) state = 'running';
        if (keysRef.current.attack) state = 'attack';

        const animList = akariSprites[state] || akariSprites.idle;
        const currentAkariFrame = Math.floor(frames / 5) % animList.length;
        const akariImg = animList[currentAkariFrame];

        const akariCenterX = player.x - cameraX + player.width / 2;
        // Snap Akari feet solidly onto stone platform cap (+2px offset)
        const akariGroundY = player.y + player.height + 2;
        const AKARI_RENDER_HEIGHT = 68;

        if (!drawCroppedSprite(ctx, akariImg, akariCenterX, akariGroundY, AKARI_RENDER_HEIGHT, player.facingLeft)) {
          ctx.fillStyle = player.color;
          ctx.fillRect(player.x - cameraX, player.y, player.width, player.height);
        }
      }

      // 9. Boss (Mighty Gothic Demon Overlord!)
      if (boss.active && boss.health > 0) {
        const bossCenterX = boss.x - cameraX + boss.width / 2;
        const bossGroundY = boss.y + boss.height + 2;
        const BOSS_RENDER_HEIGHT = 140;

        const bossConfig = enemySprites.demonboss;
        const bossAnim = Array.isArray(bossConfig) ? bossConfig : (bossConfig.frames || []);
        const currentBossFrame = Math.floor(frames / 6) % (bossAnim.length || 1);
        const bossImg = bossAnim[currentBossFrame];

        // Demon Boss source sprite faces RIGHT by default -> flip=false faces LEFT towards Akari!
        if (!drawCroppedSprite(ctx, bossImg, bossCenterX, bossGroundY, BOSS_RENDER_HEIGHT, false)) {
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(boss.x - cameraX, boss.y, boss.width, boss.height);
        }

        // Boss Healthbar Overlay
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(VIEW_W / 2 - 150, 20, 300, 18);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(VIEW_W / 2 - 148, 22, (boss.health / boss.maxHealth) * 296, 14);
        ctx.strokeStyle = '#ffd13b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(VIEW_W / 2 - 150, 20, 300, 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔥 SHADOW DEMON OVERLORD 🔥', VIEW_W / 2, 16);
      }

      // 10. Companion Rescue Cutscene Overlay (Stays Open Until Dismissed!)
      drawRescueCutscene(ctx, cutsceneRef.current, VIEW_W, VIEW_H, frames);

      ctx.restore();

      animId = requestAnimationFrame(gameTick);
    };

    animId = requestAnimationFrame(gameTick);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="app-container">
      {!isLoaded && (
        <div className="screen loading-screen">
          <div className="loading-card">
            <div className="loading-icon">🗡️✨</div>
            <h1 className="loading-title">AKARI'S BIRTHDAY RESCUE</h1>
            <p className="loading-subtitle">「 PRELOADING ANIME COMPANION SPRITES & REALM BIOMES 」</p>

            <div className="loading-bar-container">
              <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }} />
            </div>
            <span className="loading-percent">{loadingProgress}% COMPLETE</span>
          </div>
        </div>
      )}

      <div className="portrait-orientation-warning">
        <span>🔄 PLEASE ROTATE YOUR PHONE TO LANDSCAPE MODE 🎮</span>
        <p>This RPG is designed for horizontal landscape gameplay!</p>
      </div>

      {gameState === 'START' && (
        <div className="screen start-screen">
          <div className="ts-aura" aria-hidden="true" />

          <header className="ts-header">
            <span className="ts-eyebrow">2D Anime Action RPG</span>
            <h1 className="ts-title">
              <span className="ts-title-top">AKARI&rsquo;S</span>
              <span className="ts-title-main">BIRTHDAY RESCUE</span>
            </h1>
            <div className="ts-rule" aria-hidden="true"><i /><span>◆</span><i /></div>
            <span className="ts-kanji">アカリの誕生日レスキュー</span>
            <p className="ts-tagline">
              Cut through the gothic shadow realm, shatter four prison cells,
              and bring every companion home before the night ends.
            </p>
          </header>

          <div className="ts-body">
            <section className="ts-hero">
              <div className="ts-hero-crest"><span>刀</span></div>
              <div className="ts-hero-meta">
                <span className="ts-label">Playable Heroine</span>
                <h2 className="ts-hero-name">AKARI</h2>
                <div className="ts-hero-stats">
                  <div className="ts-stat">
                    <span className="ts-stat-key">Weapon</span>
                    <span className="ts-stat-val">Birthday Katana</span>
                  </div>
                  <div className="ts-stat">
                    <span className="ts-stat-key">Vitality</span>
                    <span className="ts-stat-val ts-pips">
                      <i /><i /><i /><i /><i />
                    </span>
                  </div>
                  <div className="ts-stat">
                    <span className="ts-stat-key">Art</span>
                    <span className="ts-stat-val">Crescent Slash</span>
                  </div>
                </div>
              </div>
              <button
                className="ts-sound-btn"
                onClick={() => setIsMuted(synth.toggleMute())}
                aria-pressed={!isMuted}
              >
                {isMuted ? '🔇' : '🔊'}
                <span>{isMuted ? 'Muted' : 'Sound'}</span>
              </button>
            </section>

            <section className="ts-roster">
              <div className="ts-roster-head">
                <span className="ts-label">Allies to Free</span>
                <span className="ts-roster-count">04</span>
              </div>

              <ul className="ts-roster-list">
                <li className="ts-ally" style={{ '--ally': '#8ecae6' }}>
                  <span className="ts-ally-no">01</span>
                  <span className="ts-ally-body">
                    <span className="ts-ally-name">Muichiro Tokito</span>
                    <span className="ts-ally-power">Air Double Jump</span>
                  </span>
                </li>
                <li className="ts-ally" style={{ '--ally': '#fb8500' }}>
                  <span className="ts-ally-no">02</span>
                  <span className="ts-ally-body">
                    <span className="ts-ally-name">Chuuya Nakahara</span>
                    <span className="ts-ally-power">Gravity Float</span>
                  </span>
                </li>
                <li className="ts-ally" style={{ '--ally': '#e0b1cb' }}>
                  <span className="ts-ally-no">03</span>
                  <span className="ts-ally-body">
                    <span className="ts-ally-name">Yuta Okkotsu</span>
                    <span className="ts-ally-power">Cursed Slash</span>
                  </span>
                </li>
                <li className="ts-ally" style={{ '--ally': '#219ebc' }}>
                  <span className="ts-ally-no">04</span>
                  <span className="ts-ally-body">
                    <span className="ts-ally-name">Giyu Tomioka</span>
                    <span className="ts-ally-power">Water Shield</span>
                  </span>
                </li>
              </ul>
            </section>
          </div>

          <section className="ts-controls">
            <span className="ts-label">Controls</span>
            <ul className="ts-control-list">
              <li>
                <span className="ts-keys"><kbd>A</kbd><kbd>D</kbd></span>
                <span className="ts-control-text">Walk</span>
              </li>
              <li>
                <span className="ts-keys"><kbd>Space</kbd><kbd>W</kbd></span>
                <span className="ts-control-text">Jump</span>
              </li>
              <li>
                <span className="ts-keys"><kbd>X</kbd><kbd>Enter</kbd></span>
                <span className="ts-control-text">Attack &amp; Shatter Prison Cells</span>
              </li>
            </ul>
          </section>

          <button className="ts-play" onClick={resetGame}>
            <span className="ts-play-label">Play Mission</span>
            <span className="ts-play-icon">▶</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="screen game-screen">
          <HUD 
            currentScore={currentScore} 
            playerHp={playerHp} 
            maxHp={MAX_HP} 
            rescuedList={rescuedList} 
            isMuted={isMuted}
            onToggleAudio={() => setIsMuted(synth.toggleMute())}
            onToggleFullscreen={toggleFullscreen}
          />

          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
            <MobileControls 
              onTouchStartKey={(key) => {
                if (key === 'left') keysRef.current.left = true;
                if (key === 'right') keysRef.current.right = true;
                if (key === 'jump') keysRef.current.jump = true;
                if (key === 'attack') keysRef.current.attack = true;
              }}
              onTouchEndKey={(key) => {
                if (key === 'left') keysRef.current.left = false;
                if (key === 'right') keysRef.current.right = false;
                if (key === 'jump') keysRef.current.jump = false;
                if (key === 'attack') keysRef.current.attack = false;
              }}
            />
          </div>

          <div className="controls-hint">
            <span>[A] [D] / Arrows / Touch D-Pad : Walk</span>
            <span>[SPACE] / [W] / [🦘] : Jump (Double Jump with Muichiro!)</span>
            <span>[X] / [ENTER] / [⚔️] : Attack & Break Prison Cages</span>
            <span>[F] / [🖥️] : Toggle Fullscreen Mode</span>
          </div>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="screen game-over-screen">
          <h1 className="game-over-title">GAME OVER</h1>
          <p className="victory-subtitle">Akari was overwhelmed by the void shadows!</p>
          <button className="start-btn" onClick={resetGame}>
            TRY AGAIN 🔄
          </button>
        </div>
      )}

      {gameState === 'VICTORY' && (
        <div className="screen victory-screen">
          <h1 className="victory-title">HAPPY BIRTHDAY {playerName.toUpperCase()}!</h1>
          <p className="victory-subtitle">You rescued all your favorite anime companions and saved the kingdom!</p>
          
          <div className="victory-party">
            {rescuedList.map(char => (
              <div key={char.id} className="victory-char-card" style={{ borderColor: char.color }}>
                <h3>{char.name}</h3>
                <p>Abilities unlocked: {char.power}</p>
              </div>
            ))}
          </div>

          <button className="start-btn" onClick={resetGame}>
            PLAY AGAIN 🔄
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

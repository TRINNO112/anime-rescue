import { companionSprites, drawCroppedSprite, registerExtraImage } from './spriteLoader';
import { CHARACTERS } from './gameConfig';

function loadImg(src) {
  return registerExtraImage(src);
}

export class EnvironmentRenderer {
  constructor(viewWidth, viewHeight) {
    this.w = viewWidth;
    this.h = viewHeight;

    // Load Stage 1: Night Town & Gothic Castle
    this.bgSky = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/night-town-background-files/layers/night-town-background-sky.png');
    this.bgMountains = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/night-town-background-files/layers/night-town-background-mountains.png');
    this.bgBuildings = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/night-town-background-files/layers/night-town-background-far-buildings.png');
    this.bgTown = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/night-town-background-files/layers/night-town-background-town.png');
    this.castleTileset = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/Gothic-Castle-Files/PNG/layers/gothic-castle-tileset.png');

    // Load Stage 2: Haunted Forest & Mist Woodland
    this.bgForestBack = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/back.png');
    this.bgForestMiddle = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/middle.png');
    this.forestTileset = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/tileset.png');

    // Load Stage 3: Lava Depths & Demon Overlord Arena
    this.bgLavaBack = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/lava-background/PNG/background.png');
    this.bgLavaRocks = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/lava-background/PNG/middle-rocks.png');
    this.cavernsTileset = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/caverns-files-web/layers/tiles.png');

    // Props: Gothic Pillars, Ancient Haunted Trees, Throwing Daggers
    this.propPillars = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/Props/pillars.png');
    this.propTree1 = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/Props/tree.png');
    this.propTree2 = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Environments/HauntedForest/Layers/Props/tree-2.png');
    this.propDagger = loadImg('/assets/legacy/Legacy Collection/Assets/Gothicvania/Misc/Dagger/dagger.png');

    // Pre-generate background stars
    this.stars = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * viewWidth,
      y: Math.random() * (viewHeight * 0.55),
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.05 + 0.01
    }));

    // Background floating embers/motes
    this.embers = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * 4500,
      y: Math.random() * viewHeight,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2
    }));
  }

  drawBackground(ctx, cameraX, frames) {
    ctx.imageSmoothingEnabled = false;

    // 1. Sky Base Layer
    if (this.bgSky.complete && this.bgSky.naturalWidth !== 0) {
      for (let x = 0; x < this.w + 500; x += this.bgSky.naturalWidth) {
        ctx.drawImage(this.bgSky, x - (cameraX * 0.02) % this.bgSky.naturalWidth, 0, this.bgSky.naturalWidth, this.h);
      }
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.h);
      skyGrad.addColorStop(0, '#060412');
      skyGrad.addColorStop(0.5, '#100b2b');
      skyGrad.addColorStop(1, '#1e1447');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    // 2. Twinkling Stars
    this.stars.forEach(star => {
      const alpha = Math.sin(frames * star.twinkleSpeed) * 0.25 + star.opacity;
      ctx.fillStyle = `rgba(245, 208, 254, ${Math.max(0.1, Math.min(1, alpha))})`;
      const starX = (star.x - cameraX * 0.04) % this.w;
      const realX = starX < 0 ? starX + this.w : starX;
      ctx.fillRect(realX, star.y, star.size, star.size);
    });

    // 3. Stage 1: Gothic Distant Mountains
    if (this.bgMountains.complete && this.bgMountains.naturalWidth !== 0) {
      const w = this.bgMountains.naturalWidth * 2;
      const h = this.bgMountains.naturalHeight * 2;
      const y = this.h - h;
      for (let x = -200; x < this.w + 600; x += w) {
        const drawX = x - (cameraX * 0.1) % w;
        ctx.drawImage(this.bgMountains, drawX, y, w, h);
      }
    }

    // 4. Stage 1: Distant Buildings
    if (this.bgBuildings.complete && this.bgBuildings.naturalWidth !== 0) {
      const w = this.bgBuildings.naturalWidth * 2;
      const h = this.bgBuildings.naturalHeight * 2;
      const y = this.h - h + 10;
      for (let x = -200; x < this.w + 600; x += w) {
        const drawX = x - (cameraX * 0.25) % w;
        ctx.drawImage(this.bgBuildings, drawX, y, w, h);
      }
    }

    // 5. Stage 1: Town Architecture - Anchored Flat to Canvas Bottom (+70px) to prevent house floating!
    if (this.bgTown.complete && this.bgTown.naturalWidth !== 0) {
      const w = this.bgTown.naturalWidth * 2;
      const h = this.bgTown.naturalHeight * 2;
      const y = this.h - h + 70; // Solidly anchored to bottom horizon
      for (let x = -200; x < this.w + 600; x += w) {
        const drawX = x - (cameraX * 0.4) % w;
        ctx.drawImage(this.bgTown, drawX, y, w, h);
      }
    }

    // Stage 2: Haunted Forest Parallax & Ancient Trees Overlay (Fades in around X = 1200)
    if (cameraX > 900 && this.bgForestBack.complete && this.bgForestBack.naturalWidth !== 0) {
      const forestAlpha = Math.min(1, (cameraX - 900) / 400);
      ctx.save();
      ctx.globalAlpha = forestAlpha;
      const fw = this.bgForestBack.naturalWidth * 2.2;
      const fh = this.bgForestBack.naturalHeight * 2.2;
      for (let x = -200; x < this.w + 600; x += fw) {
        ctx.drawImage(this.bgForestBack, x - (cameraX * 0.3) % fw, this.h - fh, fw, fh);
      }

      // Draw Ancient Haunted Trees in Foreground Silhouette
      if (this.propTree1.complete && this.propTree1.naturalWidth !== 0) {
        for (let tx = 1300; tx < 2600; tx += 450) {
          const drawTx = tx - cameraX;
          if (drawTx > -150 && drawTx < this.w + 150) {
            ctx.drawImage(this.propTree1, drawTx, this.h - 260, 140, 220);
          }
        }
      }
      if (this.propTree2.complete && this.propTree2.naturalWidth !== 0) {
        for (let tx = 1550; tx < 2600; tx += 450) {
          const drawTx = tx - cameraX;
          if (drawTx > -150 && drawTx < this.w + 150) {
            ctx.drawImage(this.propTree2, drawTx, this.h - 250, 130, 210);
          }
        }
      }
      ctx.restore();
    }

    // Stage 3: Lava Depths Red Glow Overlay (Fades in around X = 2500)
    if (cameraX > 2200 && this.bgLavaBack.complete && this.bgLavaBack.naturalWidth !== 0) {
      const lavaAlpha = Math.min(1, (cameraX - 2200) / 400);
      ctx.save();
      ctx.globalAlpha = lavaAlpha * 0.85;
      const lw = this.bgLavaBack.naturalWidth * 2.5;
      const lh = this.bgLavaBack.naturalHeight * 2.5;
      for (let x = -200; x < this.w + 600; x += lw) {
        ctx.drawImage(this.bgLavaBack, x - (cameraX * 0.2) % lw, 0, lw, this.h);
      }
      ctx.restore();
    }

    // 6. Floating Embers / Magic Sparks
    this.embers.forEach(emb => {
      emb.y -= emb.speedY;
      emb.x += emb.speedX;
      if (emb.y < -10) emb.y = this.h + 10;
      const ex = emb.x - cameraX * 0.5;
      if (ex > -10 && ex < this.w + 10) {
        ctx.fillStyle = cameraX > 2200 ? `rgba(239, 68, 68, ${emb.alpha})` : `rgba(192, 132, 252, ${emb.alpha})`;
        ctx.fillRect(ex, emb.y, emb.size, emb.size);
      }
    });
  }

  drawPlatforms(ctx, platforms, cameraX) {
    ctx.imageSmoothingEnabled = false;

    platforms.forEach(plat => {
      const px = plat.x - cameraX;
      if (px + plat.w < -50 || px > this.w + 50) return;

      ctx.save();

      // Multi-piece 9-slice Gothicvania Castle Tilemap Renderer (16x16 tile grid)
      if (this.castleTileset.complete && this.castleTileset.naturalWidth !== 0) {
        const tileSize = 16;

        for (let x = px; x < px + plat.w; x += tileSize) {
          const isLeftEdge = (x === px);
          const isRightEdge = (x + tileSize >= px + plat.w);
          const chunkW = Math.min(tileSize, px + plat.w - x);

          // 1. Top Cap Slice (Left corner X=32, Middle top X=48, Right corner X=80)
          let srcX = 48; // Middle top cap tile (16x32)
          if (isLeftEdge) srcX = 32;
          else if (isRightEdge) srcX = 80;

          const topH = Math.min(32, plat.h);
          ctx.drawImage(this.castleTileset, srcX, 32, 16, topH, x, plat.y, chunkW, topH);

          // 2. Underneath Body Wall Fill (Left X=32 Y=48, Middle X=48 Y=48, Right X=80 Y=48)
          if (plat.h > topH) {
            for (let y = plat.y + topH; y < plat.y + plat.h; y += tileSize) {
              const chunkH = Math.min(tileSize, plat.y + plat.h - y);
              let bodySrcX = 48;
              if (isLeftEdge) bodySrcX = 32;
              else if (isRightEdge) bodySrcX = 80;

              ctx.drawImage(this.castleTileset, bodySrcX, 48, 16, 16, x, y, chunkW, chunkH);
            }
          }
        }
      } else {
        // High-end procedural fallback
        const bodyGrad = ctx.createLinearGradient(px, plat.y, px, plat.y + plat.h);
        bodyGrad.addColorStop(0, '#2d1e4e');
        bodyGrad.addColorStop(1, '#1a1033');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(px, plat.y, plat.w, plat.h);

        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(px, plat.y, plat.w, 6);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(px, plat.y, plat.w, 2);
      }

      // Bottom Rim Shadow Trim
      ctx.fillStyle = '#0a0518';
      ctx.fillRect(px, plat.y + plat.h - 4, plat.w, 4);

      ctx.restore();
    });
  }

  drawCages(ctx, cages, cameraX, frames, player) {
    cages.forEach(cage => {
      const cx = cage.x - cameraX;
      if (cx + cage.w < -50 || cx > this.w + 50) return;

      const cy = cage.y;
      const animeChar = CHARACTERS.find(ch => ch.id === cage.charId);

      if (!cage.rescued) {
        // --- Gothic Iron Cell ------------------------------------------
        // Built taller than the cage hitbox so a full companion sprite fits
        // inside; the hitbox stays the authoritative collision volume.
        const accent = (animeChar && animeChar.color) || '#c084fc';
        const midX = cx + cage.w / 2;
        const bottom = cy + cage.h;      // floor line, sits on the platform
        const HALF = cage.w / 2 + 8;     // cell is wider than the hitbox
        const left = midX - HALF;
        const right = midX + HALF;
        const span = right - left;
        const top = bottom - 62;         // springline of the arch
        const apex = top - 20;           // tip of the pointed gothic arch
        const pulse = 0.5 + Math.sin(frames / 30) * 0.5;

        // Pointed (two-centre) gothic arch: each half is a quadratic whose
        // control point pulls outward, meeting in a sharp point at the apex.
        const archY = (x) => {
          const half = span / 2;
          const t = x <= midX ? (x - left) / half : (right - x) / half;
          const ctrlY = top - 3;
          const inv = 1 - t;
          return inv * inv * top + 2 * inv * t * ctrlY + t * t * apex;
        };

        const traceArch = () => {
          ctx.moveTo(left, bottom);
          ctx.lineTo(left, top);
          ctx.quadraticCurveTo(left + span * 0.14, top - 3, midX, apex);
          ctx.quadraticCurveTo(right - span * 0.14, top - 3, right, top);
          ctx.lineTo(right, bottom);
        };

        ctx.save();

        // 1. Contact shadow — grounds the cell on the stone
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(midX, bottom + 2, HALF + 5, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Stone alcove framing the cell mouth
        ctx.beginPath();
        ctx.moveTo(left - 7, bottom);
        ctx.lineTo(left - 7, top - 2);
        ctx.quadraticCurveTo(left + span * 0.12, apex - 9, midX, apex - 9);
        ctx.quadraticCurveTo(right - span * 0.12, apex - 9, right + 7, top - 2);
        ctx.lineTo(right + 7, bottom);
        ctx.closePath();
        const stone = ctx.createLinearGradient(left - 7, apex, right + 7, bottom);
        stone.addColorStop(0, '#3b3550');
        stone.addColorStop(0.5, '#241f36');
        stone.addColorStop(1, '#151222');
        ctx.fillStyle = stone;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3. Cell cavity — near-black so bars and sprite read against it
        ctx.beginPath();
        traceArch();
        ctx.closePath();
        const cavity = ctx.createLinearGradient(0, apex, 0, bottom);
        cavity.addColorStop(0, '#05040c');
        cavity.addColorStop(0.55, '#0a0716');
        cavity.addColorStop(1, '#03020a');
        ctx.fillStyle = cavity;
        ctx.fill();

        // 4. Everything inside the cavity is clipped to it
        ctx.save();
        ctx.clip();

        // Captive's aura pooling on the cell floor
        const aura = ctx.createRadialGradient(midX, bottom - 10, 1, midX, bottom - 10, HALF * 1.9);
        aura.addColorStop(0, accent);
        aura.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.2 + pulse * 0.2;
        ctx.fillStyle = aura;
        ctx.fillRect(left, apex, span, bottom - apex);
        ctx.globalAlpha = 1;

        // Companion sprite standing on the cell floor
        if (animeChar) {
          const compObj = companionSprites[animeChar.id];
          const list = (compObj && compObj.walking) ? compObj.walking : null;
          const img = (list && list.length > 0) ? list[0] : null;

          if (img) {
            drawCroppedSprite(ctx, img, midX, bottom - 3, 44, false, compObj ? compObj.flipDefault : false);
          } else {
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(midX - 10, bottom - 30, 20, 22);
            ctx.fillStyle = animeChar.hairColor || '#333';
            ctx.fillRect(midX - 12, bottom - 34, 24, 8);
          }
        }

        // Vignette so the sprite's feet melt into the dark
        const vig = ctx.createLinearGradient(0, bottom - 16, 0, bottom);
        vig.addColorStop(0, 'transparent');
        vig.addColorStop(1, 'rgba(3, 2, 10, 0.9)');
        ctx.fillStyle = vig;
        ctx.fillRect(left, bottom - 16, span, 16);

        ctx.restore();

        // 5. Vertical iron bars IN FRONT of the sprite — this is what sells
        //    the depth: the captive is visibly behind the bars.
        const BAR_W = 3;
        const GAP = 11;
        const firstBar = midX - Math.floor((HALF - 5) / GAP) * GAP;
        for (let bx = firstBar; bx <= right - 5; bx += GAP) {
          const bTop = archY(bx) + 2;
          const h = bottom - bTop;
          if (h <= 0) continue;
          // cylindrical shading: dark edges, hot specular just left of centre
          const g = ctx.createLinearGradient(bx - BAR_W / 2, 0, bx + BAR_W / 2, 0);
          g.addColorStop(0, '#0f1420');
          g.addColorStop(0.35, '#7b8aa3');
          g.addColorStop(0.55, '#aab6c9');
          g.addColorStop(1, '#131926');
          ctx.fillStyle = g;
          ctx.fillRect(bx - BAR_W / 2, bTop, BAR_W, h);
        }

        // 6. Riveted horizontal cross-braces (also in front of the bars)
        [bottom - 42, bottom - 14].forEach(ry => {
          if (ry <= archY(midX)) return;
          const g = ctx.createLinearGradient(0, ry, 0, ry + 4);
          g.addColorStop(0, '#8d9ab0');
          g.addColorStop(0.5, '#3f4a5e');
          g.addColorStop(1, '#161d2c');
          ctx.fillStyle = g;
          ctx.fillRect(left + 2, ry, span - 4, 4);
          // rivet heads along the brace
          ctx.fillStyle = '#c3cddb';
          for (let rx = left + 7; rx < right - 5; rx += 13) {
            ctx.beginPath();
            ctx.arc(rx, ry + 2, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // 7. Iron frame tracing the arch and posts
        ctx.beginPath();
        traceArch();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#141a28';
        ctx.stroke();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(170, 182, 201, 0.65)';
        ctx.stroke();

        // 8. Base plinth the whole cell rests on
        ctx.fillStyle = '#1b2233';
        ctx.fillRect(left - 6, bottom - 4, span + 12, 6);
        ctx.fillStyle = 'rgba(170, 182, 201, 0.3)';
        ctx.fillRect(left - 6, bottom - 4, span + 12, 1);
        ctx.fillStyle = '#07050f';
        ctx.fillRect(left - 6, bottom + 2, span + 12, 2);

        // 9. Keystone gem at the apex, pulsing in the captive's colour
        ctx.save();
        ctx.shadowColor = accent;
        ctx.shadowBlur = 6 + pulse * 8;
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.5 + pulse * 0.5;
        ctx.beginPath();
        ctx.moveTo(midX, apex - 5);
        ctx.lineTo(midX + 4, apex + 1);
        ctx.lineTo(midX, apex + 7);
        ctx.lineTo(midX - 4, apex + 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 10. Golden padlock hanging at the centre of the cell door
        const lockY = bottom - 26;
        ctx.strokeStyle = '#6b7280';       // short chain link to the brace
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(midX, bottom - 42);
        ctx.lineTo(midX, lockY - 7);
        ctx.stroke();

        ctx.save();
        ctx.shadowColor = 'rgba(255, 209, 59, 0.85)';
        ctx.shadowBlur = 8;
        ctx.font = '15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', midX, lockY);
        ctx.restore();

        ctx.restore();

        // Keypress Proximity Prompt Overlay when Akari is near!
        const dist = Math.abs((player.x + player.width / 2) - (cage.x + cage.w / 2));
        if (dist < 90 && Math.abs(player.y - cage.y) < 100) {
          const bounceY = Math.sin(frames / 6) * 4;
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.5;
          const promptW = 120;
          const promptX = cx + cage.w / 2 - promptW / 2;
          const promptY = apex - 32 + bounceY; // clear the arch apex

          ctx.beginPath();
          ctx.roundRect(promptX, promptY, promptW, 24, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('[X] BREAK CAGE', cx + cage.w / 2, promptY + 16);
          ctx.restore();
        }
      }
    });
  }
}

import { companionSprites, drawCroppedSprite } from './spriteLoader';

export function drawCompanions(ctx, activeRescues, player, cameraX, frames, nearEnemies = false) {
  activeRescues.forEach((char, idx) => {
    // 16 frames history offset per companion in line, guarded against negative indices
    const targetIdx = Math.max(0, player.history.length - 1 - (idx + 1) * 16);
    const offsetHistory = player.history[targetIdx] || { x: player.x, y: player.y };

    const cx = offsetHistory.x - cameraX + player.width / 2;
    const groundY = offsetHistory.y + player.height + 2;
    let drawnSprite = false;

    const compObj = companionSprites[char.id];
    if (compObj) {
      const isMoving = Math.abs(player.vx) > 0.1;
      // Companions ONLY attack when an active enemy or boss is nearby!
      const shouldUseAttack = Boolean(nearEnemies);
      
      const animList = (shouldUseAttack && compObj.attack && compObj.attack.length > 0)
        ? compObj.attack
        : (compObj.walking && compObj.walking.length > 0 ? compObj.walking : null);

      if (animList && animList.length > 0) {
        const animSpeed = shouldUseAttack ? 4 : 5;
        const frameIndex = (isMoving || shouldUseAttack) ? (Math.floor(frames / animSpeed) % animList.length) : 0;
        const img = animList[frameIndex];

        if (img) {
          const COMPANION_HEIGHT = shouldUseAttack ? 68 : 60;
          drawnSprite = drawCroppedSprite(ctx, img, cx, groundY, COMPANION_HEIGHT, player.facingLeft, compObj.flipDefault);

          // Render Soft, Light Pastel Lore Ability Aura Effects (Subtle & Non-Distracting!)
          if (shouldUseAttack) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            
            if (char.id === 'muichiro') {
              // Mist Breathing 7th Form: Soft Ethereal White/Sky Mist Glow
              ctx.fillStyle = 'rgba(224, 242, 254, 0.22)';
              for (let i = 0; i < 3; i++) {
                const mistX = cx + Math.sin((frames + i * 15) / 6) * 18;
                const mistY = groundY - 18 - i * 10;
                ctx.beginPath();
                ctx.arc(mistX, mistY, 10 + i * 3, 0, Math.PI * 2);
                ctx.fill();
              }
            } else if (char.id === 'chuuya') {
              // Gravity Distortion Ring (Light Soft Amber Pulse)
              ctx.strokeStyle = 'rgba(254, 215, 170, 0.28)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              const r = 18 + (frames % 18);
              ctx.arc(cx, groundY - 22, r, 0, Math.PI * 2);
              ctx.stroke();
            } else if (char.id === 'yuta') {
              // Cursed Energy Surge (Soft Pastel Violet Motes)
              ctx.fillStyle = 'rgba(245, 208, 254, 0.35)';
              for (let i = 0; i < 3; i++) {
                const px = cx + (Math.sin(frames / 5 + i) * 20);
                const py = groundY - 24 + (Math.cos(frames / 5 + i) * 16);
                ctx.fillRect(px, py, 3, 3);
              }
            } else if (char.id === 'giyu') {
              // Water Breathing 11th Form: Lull (Light Pastel Water Ripples)
              ctx.strokeStyle = 'rgba(219, 234, 254, 0.35)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              const r1 = 16 + Math.sin(frames / 6) * 4;
              ctx.arc(cx, groundY - 24, r1, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }
    }

    if (!drawnSprite) {
      // High-detail procedural fallback aura
      const floatY = offsetHistory.y + Math.sin((frames + idx * 20) / 8) * 4 - 8;
      const compX = offsetHistory.x - cameraX;

      ctx.save();
      
      // Character Body / Jacket
      ctx.fillStyle = char.color || '#3b82f6';
      ctx.fillRect(compX + 2, floatY + 12, 16, 16);

      // Head / Skin
      ctx.fillStyle = '#ffdfc4';
      ctx.fillRect(compX, floatY, 20, 14);

      // Hair
      ctx.fillStyle = char.hairColor || '#1e293b';
      ctx.fillRect(compX - 2, floatY - 4, 24, 7);
      ctx.fillStyle = char.hairTip || char.hairColor;
      ctx.fillRect(compX - 2, floatY + 3, 4, 10);
      ctx.fillRect(compX + 18, floatY + 3, 4, 10);

      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(compX + 4, floatY + 5, 3, 4);
      ctx.fillRect(compX + 13, floatY + 5, 3, 4);

      // Special Character Auras
      if (char.id === 'giyu') {
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const r = 16 + Math.sin(frames / 6) * 3;
        ctx.arc(compX + 10, floatY + 12, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  });
}

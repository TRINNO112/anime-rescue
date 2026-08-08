import { companionSprites, drawCroppedSprite } from './spriteLoader';

const RESCUE_DIALOGUES = {
  muichiro: {
    avatar: "🗡️",
    title: "MIST HASHIRA • MUICHIRO TOKITO",
    speech: "Happy Birthday, Akari-san! What shape was that cloud again...? Oh right, protecting you! Mist Breathing 7th Form — Obscuring Clouds! I will clear a path through the mist for you!"
  },
  chuuya: {
    avatar: "🍷",
    title: "GRAVITY USER • CHUUYA NAKAHARA",
    speech: "Happy Birthday, Akari! Nobody locks my allies in a void cage and gets away with it! Upon the Tainted Sorrow — Gravity Control ready! Stand behind me, I'll crush these void demons into dust!"
  },
  yuta: {
    avatar: "💍",
    title: "SPECIAL GRADE • YUTA OKKOTSU",
    speech: "Akari-san! Happy Birthday! I won't let anyone hurt you today. Pure Cursed Energy and Rika are with us — I'll shield you with everything I've got!"
  },
  giyu: {
    avatar: "🌊",
    title: "WATER HASHIRA • GIYU TOMIOKA",
    speech: "Happy Birthday, Akari. Water Breathing 11th Form — Dead Calm. Stand behind my Water Shield, no shadow beast will touch you while I'm breathing."
  }
};

export function drawRescueCutscene(ctx, cutsceneData, viewW, viewH, frames) {
  if (!cutsceneData || !cutsceneData.active || !cutsceneData.char) return;

  const char = cutsceneData.char;
  const dialogData = RESCUE_DIALOGUES[char.id] || {
    avatar: "👑",
    title: `${char.name.toUpperCase()} RESCUED!`,
    speech: `Happy Birthday, Akari! We will stand by your side and defeat the Shadow Overlord!`
  };

  ctx.save();

  // 1. Cinematic Dim Backdrop
  ctx.fillStyle = 'rgba(7, 10, 20, 0.72)';
  ctx.fillRect(0, 0, viewW, viewH);

  // 2. Companion Special Attack Rescue Showcase Animation (Cinematic Slowed Frame Rate: 9 ticks per frame!)
  const compObj = companionSprites[char.id];
  const attackList = (compObj && compObj.attack) ? compObj.attack : (compObj ? compObj.walking : null);

  if (attackList && attackList.length > 0) {
    const animFrame = Math.floor(frames / 9) % attackList.length;
    const attackImg = attackList[animFrame];
    if (attackImg) {
      drawCroppedSprite(ctx, attackImg, viewW / 2, isSmallScreen ? viewH * 0.28 : viewH / 2 + 10, isSmallScreen ? 90 : 120, false, compObj ? compObj.flipDefault : false);
    }
  }

  // 3. Dynamic RPG Dialogue Box (Moves up and sizes to fit content on small screens)
  const isSmallScreen = viewW < 600 || viewH < 400;
  const cardW = Math.min(840, viewW - 24);
  
  const fontSize = isSmallScreen ? 11 : 13;
  const lineSpacing = isSmallScreen ? 15 : 18;
  const avatarSize = isSmallScreen ? 24 : 30;
  const portRadius = isSmallScreen ? 22 : 30;
  const portPadding = isSmallScreen ? 10 : 16;
  
  ctx.save();
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
  
  const maxWidth = cardW - (isSmallScreen ? 90 : 120);
  const words = dialogData.speech.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Calculate dynamic card height to fit text lines
  const textTopOffset = isSmallScreen ? 34 : 48;
  const cardH = Math.max(isSmallScreen ? 85 : 110, textTopOffset + lines.length * lineSpacing + (isSmallScreen ? 18 : 22));
  const cardX = viewW / 2 - cardW / 2;
  const cardY = isSmallScreen ? viewH - cardH - 56 : viewH - cardH - 14;

  // Glass Box Container
  ctx.fillStyle = 'rgba(10, 15, 30, 0.96)';
  ctx.strokeStyle = char.color || '#a855f7';
  ctx.lineWidth = isSmallScreen ? 2 : 3;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  // Character Face Portrait Avatar Box
  const portX = cardX + portPadding;
  const portY = cardY + portPadding;
  ctx.fillStyle = char.color ? `${char.color}33` : 'rgba(168, 85, 247, 0.2)';
  ctx.strokeStyle = char.color || '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(portX + portRadius, portY + portRadius, portRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = `${isSmallScreen ? 20 : 30}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(dialogData.avatar, portX + portRadius, portY + portRadius + (isSmallScreen ? 7 : 10));

  // Dialogue Title & Speech Text
  const textX = cardX + (isSmallScreen ? 72 : 96);
  ctx.textAlign = 'left';

  // Title / Power Nameplate
  ctx.fillStyle = char.color || '#c084fc';
  ctx.font = `800 ${isSmallScreen ? 10 : 12}px system-ui, sans-serif`;
  ctx.fillText(dialogData.title, textX, cardY + (isSmallScreen ? 20 : 26));

  // Dialogue Speech Text
  ctx.fillStyle = '#f8fafc';
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
  
  let lineY = cardY + textTopOffset;
  for (let j = 0; j < lines.length; j++) {
    ctx.fillText(lines[j], textX, lineY);
    lineY += lineSpacing;
  }

  // Press Prompt Badge (Bottom Right)
  const bounceX = Math.sin(frames / 6) * 3;
  ctx.fillStyle = char.color || '#ffd13b';
  ctx.font = `700 ${isSmallScreen ? 9 : 11}px system-ui, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(`PRESS [X] OR TAP TO CONTINUE ▶`, cardX + cardW - 14 + bounceX, cardY + cardH - (isSmallScreen ? 8 : 12));

  ctx.restore();
}

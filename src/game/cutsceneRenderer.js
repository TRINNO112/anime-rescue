import { companionSprites, drawCroppedSprite } from './spriteLoader';

const RESCUE_DIALOGUES = {
  muichiro: {
    avatar: "🗡️",
    title: "MIST HASHIRA • MUICHIRO TOKITO",
    speech: "Thanks Akari! Mist Breathing 7th Form ready! I'll meet you at the Boss Arena to slice the Shadow Overlord!"
  },
  chuuya: {
    avatar: "🍷",
    title: "GRAVITY USER • CHUUYA NAKAHARA",
    speech: "Thanks Akari! Upon the Tainted Sorrow! Let's crush that mighty void demon together at the end!"
  },
  yuta: {
    avatar: "💍",
    title: "SPECIAL GRADE • YUTA OKKOTSU",
    speech: "Thanks Akari! Pure Love & Cursed Energy ready! I'll bring Rika's power to help you slay the final boss!"
  },
  giyu: {
    avatar: "🌊",
    title: "WATER HASHIRA • GIYU TOMIOKA",
    speech: "Thanks Akari! Water Breathing 11th Form Lull activated! Water Shield ready for the final battle!"
  }
};

export function drawRescueCutscene(ctx, cutsceneData, viewW, viewH, frames) {
  if (!cutsceneData || !cutsceneData.active || !cutsceneData.char) return;

  const char = cutsceneData.char;
  const dialogData = RESCUE_DIALOGUES[char.id] || {
    avatar: "👑",
    title: `${char.name.toUpperCase()} RESCUED!`,
    speech: `Thanks Akari! We will meet you at the boss arena to defeat the Shadow Overlord!`
  };

  ctx.save();

  // 1. Dark Cinematic Background Overlay
  ctx.fillStyle = 'rgba(7, 10, 20, 0.82)';
  ctx.fillRect(0, 0, viewW, viewH);

  // 2. Top and Bottom Letterbox Bars
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, viewW, 50);
  ctx.fillRect(0, viewH - 50, viewW, 50);

  ctx.fillStyle = char.color || '#a855f7';
  ctx.fillRect(0, 48, viewW, 2);
  ctx.fillRect(0, viewH - 50, viewW, 2);

  // 3. Central Glowing Spotlight & Magic Slash Particles
  const beamGrad = ctx.createLinearGradient(viewW / 2 - 180, 0, viewW / 2 + 180, 0);
  beamGrad.addColorStop(0, 'rgba(0,0,0,0)');
  beamGrad.addColorStop(0.5, char.color ? `${char.color}44` : 'rgba(168, 85, 247, 0.25)');
  beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(viewW / 2 - 200, 50, 400, viewH - 100);

  // Magic Slash Wave Visual Behind Companion
  ctx.strokeStyle = char.color || '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const slashRadius = 60 + Math.sin(frames / 4) * 10;
  ctx.arc(viewW / 2, viewH / 2 + 20, slashRadius, -Math.PI / 4, Math.PI / 4);
  ctx.stroke();

  // 4. Companion Special Attack / Rescue Showcase Animation
  const compObj = companionSprites[char.id];
  const attackList = (compObj && compObj.attack) ? compObj.attack : (compObj ? compObj.walking : null);

  if (attackList && attackList.length > 0) {
    const animFrame = Math.floor(frames / 4) % attackList.length;
    const attackImg = attackList[animFrame];
    if (attackImg) {
      drawCroppedSprite(ctx, attackImg, viewW / 2, viewH / 2 + 35, 115, false, compObj ? compObj.flipDefault : false);
    }
  }

  // 5. 2D RPG Dialogue Box Overlay with Character Face Portrait
  const cardW = Math.min(680, viewW - 40);
  const cardH = 90;
  const cardX = viewW / 2 - cardW / 2;
  const cardY = viewH - 150;

  // Glass Box Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = char.color || '#a855f7';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  // Character Face Portrait Avatar Badge
  const portX = cardX + 16;
  const portY = cardY + 15;
  ctx.fillStyle = char.color ? `${char.color}33` : 'rgba(168, 85, 247, 0.2)';
  ctx.strokeStyle = char.color || '#c084fc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(portX + 30, portY + 30, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = '28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(dialogData.avatar, portX + 30, portY + 39);

  // Dialogue Title & Subtitle Speech Text
  const textX = cardX + 90;
  ctx.textAlign = 'left';

  // Title / Power Nameplate
  ctx.fillStyle = char.color || '#c084fc';
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.fillText(dialogData.title, textX, cardY + 26);

  // Dialogue Speech Text
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 13px system-ui, sans-serif';
  
  // Word wrap speech text if long
  const maxWidth = cardW - 110;
  const words = dialogData.speech.split(' ');
  let line = '';
  let lineY = cardY + 48;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, textX, lineY);
      line = words[i] + ' ';
      lineY += 18;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, textX, lineY);

  ctx.restore();
}

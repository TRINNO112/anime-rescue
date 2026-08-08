import { companionSprites, drawCroppedSprite } from './spriteLoader';

const RESCUE_DIALOGUES = {
  muichiro: {
    avatar: "🗡️",
    title: "MIST HASHIRA • MUICHIRO TOKITO",
    speech: "Happy Birthday, Akari! What shape was that cloud again...? Oh right, protecting you! Mist Breathing 7th Form — Obscuring Clouds! Let's slice that Shadow Overlord together!"
  },
  chuuya: {
    avatar: "🍷",
    title: "GRAVITY USER • CHUUYA NAKAHARA",
    speech: "Happy Birthday, Akari! Nobody locks my allies in a void cage and gets away with it! Upon the Tainted Sorrow — Gravity Control ready! Let me crush the next shadow beast for you!"
  },
  yuta: {
    avatar: "💍",
    title: "SPECIAL GRADE • YUTA OKKOTSU",
    speech: "Akari! Happy Birthday! I won't let anyone hurt you today. Pure Cursed Energy and Rika's blessing are with us — let me handle the next shadow monster!"
  },
  giyu: {
    avatar: "🌊",
    title: "WATER HASHIRA • GIYU TOMIOKA",
    speech: "Happy Birthday, Akari. Water Breathing 11th Form — Dead Calm activated. Stand behind my Water Shield, I will ensure your safety all the way to the final boss!"
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

  // 2. Companion Special Attack Rescue Strike Action Animation (Center Stage)
  const compObj = companionSprites[char.id];
  const attackList = (compObj && compObj.attack) ? compObj.attack : (compObj ? compObj.walking : null);

  if (attackList && attackList.length > 0) {
    const animFrame = Math.floor(frames / 4) % attackList.length;
    const attackImg = attackList[animFrame];
    if (attackImg) {
      drawCroppedSprite(ctx, attackImg, viewW / 2, viewH / 2 + 10, 120, false, compObj ? compObj.flipDefault : false);
    }
  }

  // 3. Classic 2D RPG Bottom Dialogue Box (Anchored at very bottom of screen)
  const cardW = Math.min(840, viewW - 32);
  const cardH = 100;
  const cardX = viewW / 2 - cardW / 2;
  const cardY = viewH - 112;

  // Glass Box Container
  ctx.fillStyle = 'rgba(10, 15, 30, 0.96)';
  ctx.strokeStyle = char.color || '#a855f7';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  // Character Face Portrait Avatar Box
  const portX = cardX + 16;
  const portY = cardY + 16;
  ctx.fillStyle = char.color ? `${char.color}33` : 'rgba(168, 85, 247, 0.2)';
  ctx.strokeStyle = char.color || '#c084fc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(portX + 32, portY + 32, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = '30px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(dialogData.avatar, portX + 32, portY + 42);

  // Dialogue Title & Speech Text
  const textX = cardX + 96;
  ctx.textAlign = 'left';

  // Title / Power Nameplate
  ctx.fillStyle = char.color || '#c084fc';
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.fillText(dialogData.title, textX, cardY + 26);

  // Dialogue Speech Text
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 13px system-ui, sans-serif';
  
  const maxWidth = cardW - 120;
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

  // Press Prompt Badge (Bottom Right)
  const bounceX = Math.sin(frames / 6) * 3;
  ctx.fillStyle = char.color || '#ffd13b';
  ctx.font = '700 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`PRESS [X] OR TAP TO CONTINUE ▶`, cardX + cardW - 18 + bounceX, cardY + cardH - 14);

  ctx.restore();
}

// Helper to process white/green background keying and calculate tight alpha content bounds
export function processImageCanvas(img) {
  if (img._processedCanvas) return img._processedCanvas;
  if (!img || !img.complete || img.naturalWidth === 0) return null;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Check corner pixel to detect solid white or green background
    const r0 = data[0], g0 = data[1], b0 = data[2], a0 = data[3];
    const isWhiteBg = (a0 > 200 && r0 > 225 && g0 > 225 && b0 > 225);
    const isGreenBg = (a0 > 200 && g0 > 60 && r0 < 70 && b0 < 70);
    
    if (isWhiteBg || isGreenBg) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Key out solid white or green background pixels
        if ((isWhiteBg && r > 215 && g > 215 && b > 215) || (g > 60 && r < 70 && b < 70)) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    
    // Calculate exact content bounding box (eliminating any bottom transparent padding!)
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const bounds = (maxX < minX || maxY < minY)
      ? { x: 0, y: 0, w: canvas.width, h: canvas.height }
      : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
      
    img._processedCanvas = { canvas, bounds };
    return img._processedCanvas;
  } catch (e) {
    return null;
  }
}

// Utility to draw a normalized, alpha-keyed, tightly cropped sprite
export function drawCroppedSprite(ctx, img, centerX, bottomY, targetHeight, facingLeft = false, flipDefault = false) {
  if (!img || !img.complete || img.naturalWidth === 0) return false;
  
  const processed = processImageCanvas(img);
  const sourceCanvas = processed ? processed.canvas : img;
  const bounds = processed ? processed.bounds : { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  
  const aspect = bounds.w / (bounds.h || 1);
  const targetWidth = targetHeight * aspect;
  const drawX = centerX - targetWidth / 2;
  const drawY = bottomY - targetHeight;

  // Determine effective flip state
  const shouldFlip = flipDefault ? !facingLeft : facingLeft;

  ctx.save();
  if (shouldFlip) {
    ctx.translate(centerX, bottomY - targetHeight / 2);
    ctx.scale(-1, 1);
    ctx.translate(-centerX, -(bottomY - targetHeight / 2));
  }

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    sourceCanvas,
    bounds.x, bounds.y, bounds.w, bounds.h,
    drawX, drawY, targetWidth, targetHeight
  );
  ctx.restore();
  return true;
}

function createImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    processImageCanvas(img);
  };
  return img;
}

// Preload Akari's sprite sheets
export const akariSprites = {
  idle: Array.from({ length: 13 }, (_, i) => createImage(`/D Type/idle/${String(i).padStart(3, '0')}.png`)),
  running: Array.from({ length: 7 }, (_, i) => createImage(`/D Type/running/${String(i + 148).padStart(3, '0')}.png`)),
  jump: Array.from({ length: 5 }, (_, i) => createImage(`/D Type/jump/${String(i + 37).padStart(3, '0')}.png`)),
  attack: Array.from({ length: 8 }, (_, i) => createImage(`/D Type/slash_attack_1/${String(i + 29).padStart(3, '0')}.png`)),
  hurt: Array.from({ length: 9 }, (_, i) => createImage(`/D Type/hurt_recovery/${String(i + 139).padStart(3, '0')}.png`)),
  victory: Array.from({ length: 9 }, (_, i) => createImage(`/D Type/heroic_pose/${String(i + 234).padStart(3, '0')}.png`))
};

// Preload companion walking and attack cycles
export const companionSprites = {
  muichiro: {
    flipDefault: true, // Muichiro source frames face left -> set flipDefault: true so he faces RIGHT!
    walking: Array.from({ length: 25 }, (_, i) => createImage(`/muichiro/walking/frame_${String(i).padStart(3, '0')}.png`)),
    attack: Array.from({ length: 16 }, (_, i) => createImage(`/muichiro/attack/frame_${String(i).padStart(3, '0')}.png`))
  },
  chuuya: {
    flipDefault: true, // Chuuya source frames face left -> set flipDefault: true so he faces RIGHT!
    walking: Array.from({ length: 36 }, (_, i) => createImage(`/chuuya/walking/frame_${String(i).padStart(3, '0')}.png`)),
    attack: Array.from({ length: 16 }, (_, i) => createImage(`/chuuya/attack/frame_${String(i).padStart(3, '0')}.png`))
  },
  yuta: {
    flipDefault: false,
    walking: Array.from({ length: 25 }, (_, i) => createImage(`/yuta/walking/frame_${String(i).padStart(3, '0')}.png`)),
    attack: Array.from({ length: 25 }, (_, i) => createImage(`/yuta/attack/frame_${String(i).padStart(3, '0')}.png`))
  },
  giyu: {
    flipDefault: false,
    idle: Array.from({ length: 8 }, (_, i) => createImage(`/giyu/idle/frame_${String(i).padStart(3, '0')}.png`)),
    walking: Array.from({ length: 8 }, (_, i) => createImage(`/giyu/walking/frame_${String(i).padStart(3, '0')}.png`)),
    jump: Array.from({ length: 8 }, (_, i) => createImage(`/giyu/jump/frame_${String(i).padStart(3, '0')}.png`)),
    attack: Array.from({ length: 14 }, (_, i) => createImage(`/giyu/attack/frame_${String(i).padStart(3, '0')}.png`))
  }
};

// Preload Gothicvania enemy & boss animated sprites (High Frame-Count Cycles)
export const enemySprites = {
  hellhound: Array.from({ length: 12 }, (_, i) => createImage(`/assets/legacy/Legacy Collection/Assets/Gothicvania/Characters/Hell-Hound-Files/Sprites/Walk/frame${i + 1}.png`)),
  werewolf: Array.from({ length: 6 }, (_, i) => createImage(`/assets/legacy/Legacy Collection/Assets/Gothicvania/Characters/WereWolf/Sprites/run/werewolf-run${i + 1}.png`)),
  fireskull: Array.from({ length: 8 }, (_, i) => createImage(`/assets/legacy/Legacy Collection/Assets/Gothicvania/Characters/Fire-Skull-Files/Sprites/Fire/frame${i + 1}.png`)),
  demonboss: Array.from({ length: 18 }, (_, i) => createImage(`/assets/legacy/Legacy Collection/Assets/Gothicvania/Characters/demon-Files/Sprites/DemonAttackBreath/frame${i + 1}.png`))
};



// Modular 2D Particle Engine with Screen Shake and VFX support

export class ParticleEngine {
  constructor() {
    this.particles = [];
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;
  }

  triggerShake(durationFrames = 12, intensity = 6) {
    this.screenShakeTime = durationFrames;
    this.screenShakeIntensity = intensity;
  }

  getShakeOffset() {
    if (this.screenShakeTime <= 0) return { x: 0, y: 0 };
    this.screenShakeTime--;
    return {
      x: (Math.random() - 0.5) * this.screenShakeIntensity,
      y: (Math.random() - 0.5) * this.screenShakeIntensity
    };
  }

  addExplosion(x, y, color, count = 12, speedScale = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 4 + 2) * speedScale;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color,
        size: Math.random() * 4 + 2,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }
  }

  addDust(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 1.5 - 0.5,
        color: 'rgba(255, 255, 255, 0.4)',
        size: Math.random() * 3 + 2,
        life: 15 + Math.random() * 10,
        maxLife: 25,
        shape: 'circle'
      });
    }
  }

  addRescueEnergyBurst(x, y, charColor) {
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 2 === 0 ? charColor : '#ffffff',
        size: Math.random() * 6 + 3,
        life: 40 + Math.random() * 20,
        maxLife: 60,
        shape: 'spark'
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx, cameraX) {
    this.particles.forEach(p => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      const px = p.x - cameraX;
      const py = p.y;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'spark') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
      } else {
        ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    });
  }
}

---
name: 2d-game-canvas-engine
description: Comprehensive rules, game loops, physics, sprite animation, collision detection, particle systems, and Web Audio patterns for 2D HTML5 Canvas web games. Use when building or refining HTML5 canvas games, animation engines, or interactive web applications like anime-rescue.
---

# 2D Game Development & HTML5 Canvas Skill

This skill provides best practices, architectural patterns, and performance guidelines for building rich 2D web games using HTML5 `<canvas>` and JavaScript.

## 1. Game Loop & Frame Synchronization
Always use a decoupled delta-time accumulator loop driven by `requestAnimationFrame`:

```javascript
class GameLoop {
  constructor(updateFn, renderFn, targetFPS = 60) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.step = 1 / targetFPS;
    this.lastTime = 0;
    this.accumulator = 0;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (dt > 0.25) dt = 0.25;

    this.accumulator += dt;

    while (this.accumulator >= this.step) {
      this.updateFn(this.step);
      this.accumulator -= this.step;
    }

    this.renderFn(this.accumulator / this.step);
    requestAnimationFrame(this.loop.bind(this));
  }
}
```

## 2. Canvas Context & High-DPI Resolution
Ensure high-DPI (Retina) crisp rendering by scaling the canvas coordinate space:

```javascript
function setupCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

## 3. Physics & Collision Handling
- **AABB Collisions**:
  ```javascript
  function checkAABB(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
  ```
- **Circle Collisions**:
  ```javascript
  function checkCircleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    return Math.hypot(dx, dy) < c1.radius + c2.radius;
  }
  ```

## 4. Web Audio API Sound System
```javascript
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async loadSound(key, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.buffers.set(key, audioBuffer);
  }

  playSound(key, volume = 1.0, pitch = 1.0) {
    if (!this.ctx || !this.buffers.has(key)) return;

    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();

    source.buffer = this.buffers.get(key);
    source.playbackRate.value = pitch;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start(0);
  }
}
```

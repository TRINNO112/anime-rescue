---
name: web-performance-optimizer
description: Guidelines and patterns for maintaining 60 FPS performance in web apps and canvas games, avoiding garbage collection spikes, optimizing Web Audio memory, DOM reflow minimization, and asset preloading. Use when optimizing performance, fixing lag/stutter, or debugging memory leaks in web applications.
---

# Web Performance & Code Optimization Skill

This skill provides strategies, object pooling patterns, memory optimization techniques, and profiling rules to maintain smooth 60 FPS rendering and avoid lag spikes in web applications and HTML5 games.

## 1. Object Pooling
```javascript
class ObjectPool {
  constructor(factoryFn, initialSize = 100) {
    this.factoryFn = factoryFn;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factoryFn());
    }
  }

  get() {
    if (this.pool.length > 0) {
      const obj = this.pool.pop();
      obj.active = true;
      return obj;
    }
    const newObj = this.factoryFn();
    newObj.active = true;
    return newObj;
  }

  release(obj) {
    obj.active = false;
    if (obj.reset) obj.reset();
    this.pool.push(obj);
  }
}
```

## 2. Layout Reflow Prevention
Always batch DOM reads before writing styles to prevent layout thrashing:

```javascript
// Batch reads first
const heights = elements.map(el => el.offsetHeight);
// Batch writes second
elements.forEach((el, i) => {
  el.style.height = `${heights[i] + 10}px`;
});
```

---
name: modern-web-ui-styling
description: Premium design aesthetics, CSS variables, glassmorphism, responsive layouts, micro-animations, vibrant color tokens, and modern typography guidelines. Use when designing or styling web interfaces, landing pages, or game UI overlays.
---

# Modern Web UI & Responsive Styling Skill

This skill defines modern design guidelines, styling patterns, design tokens, and CSS techniques to build premium, sleek, and high-converting web user interfaces and game HUD overlays.

## 1. Design System & CSS Custom Properties
```css
:root {
  /* Brand & Accents */
  --primary-hue: 250;
  --primary: hsl(var(--primary-hue), 85%, 62%);
  --primary-hover: hsl(var(--primary-hue), 90%, 68%);
  --primary-glow: hsla(var(--primary-hue), 85%, 62%, 0.35);

  --accent-cyan: hsl(185, 95%, 55%);
  --accent-pink: hsl(330, 90%, 65%);

  /* Dark Theme Surfaces */
  --bg-main: hsl(225, 25%, 8%);
  --bg-surface: hsl(225, 20%, 12%);
  --bg-glass: rgba(22, 27, 38, 0.7);

  /* Borders & Shadows */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.2);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.45);
  --shadow-glow: 0 0 25px var(--primary-glow);
}
```

## 2. Glassmorphism & Micro-Animations
```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.glass-panel:hover {
  transform: translateY(-2px);
  border-color: var(--border-active);
}
```

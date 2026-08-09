# Trinno's Anime Rescue RPG - Project Memory & Guidelines

This document serves as the project memory and guidelines for the development of "Akari's Birthday Rescue Mission" anime RPG. It preserves design decisions, typography pairings, sound synthesis settings, and mobile responsiveness configurations.

---

## 🎨 Typography & Aesthetics
We use a premium, high-fantasy and retro anime style. Maintain these specific font pairings:
1. **Main Header Title (`AKARI'S`)**: 
   - Font: `'Cinzel Decorative'`, serif, bold (`900`)
   - Style: Gold/crimson background clipping gradient (`linear-gradient(180deg, #ffffff 10%, #ffd13b 50%, #ff3b6b 100%)`) with drop-shadow neon glows.
2. **Subtitle (`BIRTHDAY RESCUE MISSION`)**:
   - Font: `'Press Start 2P'`, monospace
   - Style: Glowing golden text shadow (`0 0 12px rgba(255, 209, 59, 0.65)`).
3. **Japanese Gutter Text (`誕生日おめでとう` / `アカリの誕生日レスキュー`)**:
   - Font: `'Yuji Syuku'`, serif (traditional calligraphy brush font)
   - Style: Alternating glow/blink animation, styled vertically down the screen edge.
4. **Trinno's Birthday Card Message**:
   - Font: `'Caveat'`, cursive (handwritten signature aesthetic).
5. **Companion Badges & Names (Muichiro, Chuuya, Yuta, Giyu)**:
   - Name font: `'Bebas Neue'`, sans-serif with ally color glow shadows.
   - Kanji Glyph badges: `'Yuji Syuku'`, serif.
   - Attack Powers: `'Cinzel Decorative'`.

---

## 📱 Mobile Responsiveness & Viewport Lock
To ensure perfect scaling across all smartphone screens (such as Vivo T3 Lite, Moto G84, and iPhones):
- **Preloading Scroll Lock**:
  - Always set `document.body.style.overflow = 'hidden'` while `isLoaded` is false. Remove it when loading finishes.
  - Wait for both assets and web fonts (`document.fonts.ready`) to complete before transition.
- **2:1 Game Scaling**:
  - Desktop: Canvas wrapper has a stylized neon bounding box with `aspect-ratio: 2 / 1` and `max-width: 1000px`.
  - Mobile Landscape: Canvas uses `.canvas-wrapper` with responsive bounds: `width: 100vw`, `height: 50vw` (`aspect-ratio: 2 / 1`), matching `max-width` based on portrait bounds.
  - Canvas uses `object-fit: contain` so the full layout remains visible and scales correctly on any device.
- **Controls Positioning**:
  - Mobile touch gamepad handles must hover directly in the canvas overlay corners using absolute positioning.

---

## 🔊 Audio Engine
Managed via `src/game/soundSynth.js`:
- **Victory Music**: Loops the `"Twelve_Candles_Burning.mp3"` track continuously.
- **Mute States**: Controlled via `synth.toggleMute()` returning a boolean status that reflects on UI controls.

---

## 🤝 Pair Programming Communication
- Keep responses short, direct, and actionable.
- Prioritize rapid deployment to GitHub Pages for instant verification on smartphone viewports.
- Skip over-elaborated steps unless requested.
- Maintain developer cheat codes (like pressing 'V' to trigger the Victory Screen instantly during debug testing).

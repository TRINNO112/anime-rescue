# 🎮 Master Architectural Spec & Goal Execution Guide: Anime Rescue 2D RPG

> **Notice to AI Agent executing in `/goal` or autonomous mode**:
> This document is an uncompressed, comprehensive blueprint of the entire codebase, asset pipeline, physics engine, renderer, level structures, known bugs, design flaws to rebuild, and exact execution directives. Read this file completely before taking action.

---

## 📌 1. Project Background & Core Objective

**Anime Rescue** is a custom 2D side-scrolling platformer RPG built in **React 19**, **Vite**, and **HTML5 Canvas**. 
The player controls the main hero (**Akari**) as she traverses platformer levels, rescues trapped anime companions (**Muichiro Tokito**, **Chuuya Nakahara**, **Yuta Okkotsu**, **Cat Noir**, **Giyu Tomioka**, **Luka Couffaine**), and forms a party train behind her.

---

## 🏗️ 2. Comprehensive Codebase Blueprint

### Directory Hierarchy
```
d:\Trinno\Last Message\
├── package.json                         # Root runner package (routes `npm run dev` to anime-rescue)
├── README.md                            # High-level summary
└── anime-rescue/                        # Primary React Application Directory
    ├── index.html                       # HTML canvas mounting host
    ├── package.json                     # Vite & React 19 dependency configuration
    ├── public/                          # Public static game assets
    │   ├── D Type/                      # Akari (Hero) Sprite Sheets
    │   │   ├── idle/                    # 13 PNG frames (000.png ... 012.png)
    │   │   ├── running/                 # 7 PNG frames (148.png ... 154.png)
    │   │   ├── jump/                    # 5 PNG frames (037.png ... 041.png)
    │   │   ├── slash_attack_1/          # 8 PNG frames (029.png ... 036.png)
    │   │   ├── hurt_recovery/           # 9 PNG frames (139.png ... 147.png)
    │   │   └── heroic_pose/             # 9 PNG frames (234.png ... 242.png)
    │   ├── muichiro/                    # Muichiro Tokito Assets
    │   │   ├── walking/                 # 25 PNG frames (frame_000.png ... frame_024.png)
    │   │   ├── attack/                  # 16 PNG frames (frame_000.png ... frame_015.png)
    │   │   └── muichiro_attack_spritesheet.png # Full overview sheet reference
    │   ├── chuuya/                      # Chuuya Nakahara Assets
    │   │   ├── walking/                 # 36 PNG frames (frame_000.png ... frame_035.png)
    │   │   └── attack/                  # 16 PNG frames (frame_000.png ... frame_015.png)
    │   ├── catnoir/                     # Cat Noir (Adrien) Assets
    │   │   └── walking/                 # 16 PNG frames (frame_000.png ... frame_015.png)
    │   ├── yuta/                        # Yuta Okkotsu Assets
    │   │   ├── walking/                 # 25 PNG frames (frame_000.png ... frame_024.png)
    │   │   └── attack/                  # 25 PNG frames (frame_000.png ... frame_024.png)
    │   ├── giyu/                        # Giyu Tomioka (2-frame step fallback)
    │   ├── luka/                        # Luka Couffaine (2-frame step fallback)
    │   └── sprite_preview.html          # Browser-based sprite inspector & animation frame step previewer
    └── src/
        ├── App.jsx                      # Main React game loop, canvas context, input listeners, & physics tick
        ├── App.css                      # Modern glassmorphism UI, retro fonts, start & victory screens
        ├── main.jsx                     # Vite DOM mount point
        ├── components/
        │   └── HUD.jsx                  # React HUD component (score, party badges, ability stats)
        └── game/
            ├── soundSynth.js            # Web Audio API synthesizer for SFX (jump, hit, unlock) & Happy Birthday theme
            ├── spriteLoader.js          # Image object instantiation & preloading cache
            ├── gameConfig.js            # Platform coordinates, cages array, monster patrol paths, character stats
            └── companionRenderer.js     # Canvas renderer for companion party trail, direction flipping, & idle locks
```

---

## 🎨 3. Current Asset Inventory & Technical Specs

### Character Asset Specifications

| Character | Role / Anime | Walk Frame Count | Attack Frame Count | Asset Folder Path | Active Ability |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Akari** | Hero Main Player | 7 | 8 | `/D Type/` | Crescent Sword Slash |
| **Muichiro Tokito** | Companion / Demon Slayer | 25 | 16 | `/muichiro/` | Air Double Jump |
| **Chuuya Nakahara** | Companion / BSD | 36 | 16 | `/chuuya/` | Gravity Jump Float |
| **Cat Noir** | Companion / Miraculous | 16 | 0 (In-Progress) | `/catnoir/` | Cataclysm Shield |
| **Yuta Okkotsu** | Companion / JJK | 25 | 25 | `/yuta/` | Cursed Wave Slash |
| **Giyu Tomioka** | Companion / Demon Slayer | 2 (Fallback) | 0 | `/giyu/` | Water Shield |
| **Luka Couffaine** | Companion / Miraculous | 2 (Fallback) | 0 | `/luka/` | Speed Accord Boost |

---

## 🛑 4. Explicit Flaws & Root Problems of Current System

When rebuilding from scratch or optimizing in `/goal` mode, **address these specific flaws**:

1. **Sprite Margin / Transparent Padding Discrepancy**:
   - *Problem*: PNG files generated from different AI runs have varying empty transparent borders. Direct canvas `drawImage` causes some characters (like Muichiro) to render too large while Akari renders small.
   - *Solution Required*: Build an automated **Image Alpha Bounding-Box Processor** that scans non-transparent pixel boundaries `(minX, minY, maxX, maxY)` upon preloading, automatically cropping out empty padding to guarantee 100% normalized physical heights across all characters.

2. **Primitive Flat Canvas World Art**:
   - *Problem*: Platforms currently use basic dark purple canvas rectangles (`#2d1e3d`).
   - *Solution Required*: Replace raw solid fills with **Tilemaps / Textured Platform Sprites** (brick tiles, grass edges, stone pillars, background parallax layers).

3. **Prison Cell Sprite Rendering**:
   - *Problem*: Locked cells must show the actual mini sprite of the trapped character inside the cage rather than colored fallback shapes.

4. **Cutscene Integration**:
   - *Problem*: Special attack animations (Muichiro, Chuuya, Yuta) are loaded but not showcased in cutscenes.
   - *Solution Required*: Trigger a 1-second **Companion Intro Cutscene** displaying their attack animation when Akari shatters a prison cell lock.

---

## 🚀 5. Blueprint Prompts for Sprite Generators

```text
Muichiro Tokito:
pixel art chibi Muichiro Tokito sword slash mist breathing mist cloud effect 2D sprite sheet transparent background

Chuuya Nakahara:
pixel art chibi Chuuya Nakahara gravity manipulation red glowing aura martial arts kick 2D sprite sheet transparent background

Cat Noir:
pixel art chibi Cat Noir miraculous cataclysm strike dark purple black claw slash wave 2D sprite sheet transparent background

Giyu Tomioka:
pixel art chibi Giyu Tomioka water breathing 11th form dead calm water wave sword attack 2D sprite sheet

Luka Couffaine:
pixel art chibi Luka Couffaine viperion playing guitar music wave aura 2D sprite sheet
```

---

## 🎯 6. Instructions for New AI Agent (`/goal` Mode Directive)

When the user starts a new chat and enters `/goal`:

1. **Read this file (`README.md`) thoroughly first.**
2. **Execute a complete, non-stop build loop**:
   - Do NOT ask simple questions after every edit.
   - Implement the dynamic **Alpha Bounding-Box Cropper** to normalize character sizes automatically.
   - Upgrade the canvas world rendering with rich platform tiles, parallax background layers, and particle effects.
   - Wire up the companion rescue intro cutscenes.
   - Run `npm run build` continuously to verify zero build or linting errors.

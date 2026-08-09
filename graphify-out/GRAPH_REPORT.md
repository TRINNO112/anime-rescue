# Graph Report - .  (2026-08-09)

## Corpus Check
- Corpus is ~11,853 words - fits in a single context window. You may not need a graph.

## Summary
- 53 nodes · 67 edges · 7 communities (5 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Particle & Screen Shake FX|Particle & Screen Shake FX]]
- [[_COMMUNITY_Web Audio Sound Engine|Web Audio Sound Engine]]
- [[_COMMUNITY_UI, Cutscene & App Shell|UI, Cutscene & App Shell]]
- [[_COMMUNITY_Sprite Loading & Environment|Sprite Loading & Environment]]

## God Nodes (most connected - your core abstractions)
1. `ParticleEngine` - 13 edges
2. `SoundSynth` - 12 edges
3. `drawCroppedSprite()` - 7 edges
4. `EnvironmentRenderer` - 6 edges
5. `registerExtraImage()` - 4 edges
6. `drawRescueCutscene()` - 3 edges
7. `loadImg()` - 3 edges
8. `HUD()` - 2 edges
9. `MobileControls()` - 2 edges
10. `drawCompanions()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `drawRescueCutscene()` --calls--> `drawCroppedSprite()`  [INFERRED]
  src/game/cutsceneRenderer.js → src/game/spriteLoader.js
- `loadImg()` --calls--> `registerExtraImage()`  [INFERRED]
  src/game/environmentRenderer.js → src/game/spriteLoader.js

## Communities (7 total, 2 thin omitted)

### Community 2 - "UI, Cutscene & App Shell"
Cohesion: 0.23
Nodes (6): HUD(), MobileControls(), drawCompanions(), drawRescueCutscene(), isInsideOkBtn(), drawCroppedSprite()

### Community 3 - "Sprite Loading & Environment"
Cohesion: 0.21
Nodes (6): EnvironmentRenderer, loadImg(), createImage(), preloadAllImages(), processImageCanvas(), registerExtraImage()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticleEngine` connect `Particle & Screen Shake FX` to `UI, Cutscene & App Shell`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `EnvironmentRenderer` connect `Sprite Loading & Environment` to `UI, Cutscene & App Shell`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `drawCroppedSprite()` connect `UI, Cutscene & App Shell` to `Sprite Loading & Environment`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
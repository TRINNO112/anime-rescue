# Graph Report - Last Message  (2026-08-09)

## Corpus Check
- 13 files · ~1,701,115 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 412 nodes · 1514 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3c327d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `i()` - 62 edges
2. `pc()` - 50 edges
3. `wc()` - 34 edges
4. `bc()` - 31 edges
5. `wd()` - 27 edges
6. `z()` - 26 edges
7. `hc()` - 24 edges
8. `hu()` - 23 edges
9. `pd()` - 23 edges
10. `vl()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `drawRescueCutscene()` --calls--> `drawCroppedSprite()`  [INFERRED]
  src/game/cutsceneRenderer.js → src/game/spriteLoader.js
- `loadImg()` --calls--> `registerExtraImage()`  [INFERRED]
  src/game/environmentRenderer.js → src/game/spriteLoader.js

## Communities (18 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (57): $(), a(), Ac(), bc(), bd(), Bt(), cc(), cd() (+49 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (55): ae(), as(), b(), Bo(), bs(), cs(), D(), ds() (+47 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (49): aa(), ao(), bl(), C(), cl(), dl(), Do(), el() (+41 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (14): ce(), constructor(), $f(), hl(), jl(), jr(), ml(), Mr() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (37): at(), Au(), bu(), cp(), Cu(), di(), Du(), Eu() (+29 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (13): HUD(), MobileControls(), drawCompanions(), drawRescueCutscene(), isInsideOkBtn(), EnvironmentRenderer, loadImg(), ParticleEngine (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (33): af(), cf(), df(), ef(), et(), ff(), fn(), gf() (+25 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (22): ap(), bi(), ci(), ct(), dp(), dt(), ep(), fi() (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (22): ar(), Cn(), cr(), dr(), Ed(), Er(), fr(), gr() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (18): dc(), dd(), ec(), ee(), Fu(), ic(), Iu(), ja() (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (9): ad(), Gd(), hr(), Ki(), od(), qi(), ud(), uf() (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.38
Nodes (7): createNoiseBuffer(), init(), playBirthdayTheme(), playRescueFanfare(), playSfx(), startBgm(), startSynthBgmLoop()

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (5): Jt(), kt(), ni(), Pr(), ut()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): ca(), Io(), la(), sa()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `i()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 11`, `Community 14`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `pc()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 9`, `Community 11`, `Community 14`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
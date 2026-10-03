# Asset provenance — active presentation

The active character, three NPCs, green slime and sixteen village props are the
original project artwork from `../web-pixel-rpg-v0.1/assets/painted/`. These were
created with image_gen for this project. They are not commercial-game sprites,
Universal LPC assets or Kenney assets. See the preserved prompts and source
sheets in `../web-pixel-rpg-v0.1/ART-DIRECTION.md`. No new third-party license is
claimed for these project-owned images.

`tools/build-parity-assets.mjs` copies only runtime PNGs, extracts the three NPC
columns, and executes the unchanged reference `src/world.js` in an isolated
build-time canvas context to reproduce its deterministic terrain. The 540px
reference ground is padded by four grass pixels for the Tiled 16px grid.
`@napi-rs/canvas` is a build-only dependency; its package license is MIT.

`src/game/audio.ts` adapts the original project-authored Web Audio village/meadow
scores and slash/hurt/level effects. Its preference key is separate from v0.1.

## Retained experiment assets (not active)

The active chibi hero v2 is original artwork generated with built-in imagegen on2026-10-02. Its source and complete prompt are preserved in `assets/masters/CHIBI-HERO-V2.md`. No files from DDT4.0 were copied into the game. `public/willowbrook/hd/` also includes higher-density exports from the preserved project-owned v0.1 masters and deterministic terrain. The source master is authoring material; the runtime receives only packed exports.

The earlier Universal LPC composite and five original layer sources remain in
`public/spritesheets/adventurer-lpc.png` and `assets/lpc-source/` for reproducible
history. Every layer selected OGA-BY 3.0 from its offered alternatives. Keep
`LPC-CREDITS.csv` and `LPC-CREDITS.json` with redistribution of those assets.
OGA-BY text: https://opengameart.org/content/oga-by-30-faq
Generator: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
Source revision: 4963a69795255fb15a934c47f478a8bdcf3668f5.

The earlier code-art slime and five-tile terrain were original CC0 placeholders;
they are no longer registered in the active maps. Official starter sample maps,
tiles and sprites remain for reference; attribution: Pipoya —
https://pipoya.itch.io/. They are not active gameplay art.

Painted hurt/dead currently hold the idle frame with opaque red ground feedback;
there is no authored dedicated hurt/death animation in the original hero sheet.
The unused thrust/shoot/spellcast semantics fall back to its sword rows; no such
abilities are enabled. Do not advertise those as completed visual animations.

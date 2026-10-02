# Asset credits and license list

The earlier Canvas artwork below was authored for this repository by Codex for Game-Concept-Bible. It remains as a fallback and includes the boar. The newer illustrated bitmap set is listed in its own section below. No asset was copied from Ragnarok or another commercial game.

| Asset | Creator | Source URL | License |
|---|---|---|---|
| Willowbrook grass, dirt, stone, water tiles | Game-Concept-Bible / Codex | https://github.com/herogamee/Game-Concept-Bible/tree/codex/visual-baseline-v0.1.1/prototype/web-pixel-rpg-v0.1/assets | MIT (ASSET-LICENSE.txt) |
| Adventurer directional idle/walk/attack frames | Game-Concept-Bible / Codex | same repository path above, pixel-art.js | MIT |
| Elder, merchant, veteran adventurer sprites | Game-Concept-Bible / Codex | same repository path above, pixel-art.js | MIT |
| Slime animation frames | Game-Concept-Bible / Codex | same repository path above, pixel-art.js | MIT |
| House, tree, rock, bush, flower, fence, sign, well, lamp | Game-Concept-Bible / Codex | same repository path above, pixel-art.js | MIT |
| Fantasy panel styles, HUD and combat effects | Game-Concept-Bible / Codex | same repository, src/style.css and src/render.js | MIT |

Text uses local system fonts and Unicode symbols; platform-rendered glyph appearance varies. No font files are distributed.

License research: Kenney Tiny Town was checked at https://kenney.nl/assets/tiny-town (CC0, 16×16). It is **not bundled or used**: this release uses original 32px tiles and 64px actors for one coherent palette. No attribution obligations from third-party art are introduced.

Azure slime color variant and original boar animation: Game-Concept-Bible / Codex, src/monsters.js, same repository URL and MIT asset license above.

## Illustrated asset set — 2026-10-02

These original assets were generated with OpenAI's built-in image_gen under Codex's art direction for this project. They were not downloaded from an existing game's asset pack. The project distributes this asset set under ASSET-LICENSE.txt (MIT). This license describes the project's distribution terms, not third-party assets or the model itself.

| Asset name | Creator / method | Source URL | Distributed license |
|---|---|---|---|
| Willowbrook cottage, teal cottage, oak, rock, flowering bush, flowers, fence, sign, well, lantern, market, planter, reeds, barrels, bridge, rune | Game-Concept-Bible / Codex + OpenAI image_gen | https://github.com/herogamee/Game-Concept-Bible/tree/codex/visual-baseline-v0.1.1/prototype/web-pixel-rpg-v0.1/assets/painted | MIT |
| Teal-caped adventurer, 64 directional walk/attack frames | same | same repository directory, adventurer-source.png and adventurer.png | MIT |
| Leaf-sprout slime, 16 idle/move/hit/death frames; azure color variant | same; variant rendered in original code | same repository directory, slime-source.png and slime.png | MIT |
| Elder, merchant and veteran adventurer, 9 idle frames | same | same repository directory, npcs-source.png and npcs.png | MIT |

Exact prompts and tool choice: ART-DIRECTION.md. Original source sheets are preserved for further art cleanup. `slice-art.py`, `slice-character.py`, `slice-slime.py` and `slice-npcs.py` extract/package the generated atlases; the game loads only compact runtime PNGs.

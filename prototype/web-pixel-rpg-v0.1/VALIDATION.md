# Validation — 2026-10-02

- `npm test`: PASS. Real game functions exercised in a Node VM with mocked Canvas/DOM/storage. Covers movement, water collision, elder quest accept, three slime kills and drops, reward, merchant, potion, inventory, save/load, field/village portals, renderer and syntax. This is deterministic logic coverage, not a browser end-to-end claim.
- `npm run build`: PASS; static output under dist.
- In-app Chromium browser: village and slime meadow rendered; E dialogue and inventory buttons worked; console error/warning capture returned an empty list.
- Resize: 640×480 viewport smoke-tested; HUD, dialogue, inventory and controls remain in the game container; temporary viewport override restored.
- Local static script/style paths checked with HTTP 200. All bitmap assets are authored in bundled JavaScript; no image URLs or third-party fetches.
- Three real browser screenshots saved under screenshots/. Preview scene URLs never overwrite the existing save.
- Chrome/Edge/Safari APIs used are standard Canvas 2D, classic scripts, localStorage and requestAnimationFrame. Safari, physical iMac 2017 and old notebooks were not available. No measured cross-device 60 FPS certification is claimed.
- The optional second monster was omitted to keep this pass focused on the visual baseline.

Click-to-move follow-up: deterministic arrival/detour/blocked-target/keyboard/portal checks passed; browser left-click smoke test passed with no console errors.

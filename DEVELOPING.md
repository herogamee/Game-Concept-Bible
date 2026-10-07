# Move the project to another computer

Latest playable development is on **`codex/rpgjs-v0.2`**, separate from the original v0.1 reference. Clone the full repository: the parity asset generator reads the preserved v0.1 artwork/source. Do not copy only the candidate folder if you need to regenerate maps.

## Source checkout

Install Git and Node.js 22+ (verified here with 22.23.2), then on Windows:

```powershell
git clone --branch codex/rpgjs-v0.2 https://github.com/herogamee/Game-Concept-Bible.git
cd Game-Concept-Bible/prototype/rpgjs-v5-adventurer-v0.2
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://localhost:5173/. macOS/Linux use `npm` instead of `npm.cmd`. Source, lockfile, active PNGs, generated maps, asset source/credits and tests are committed. `node_modules`, caches and generated builds are reproducible and are not committed.

```powershell
npm.cmd run maps
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:production
npm.cmd run preview -- --port 4175
```

Map regeneration is optional for an unchanged checkout; the generated TMX/TSX/PNG and registry are already tracked. `npm ci` needs registry access. Large-bundle/native-config warnings are known. Multiplayer development uses `npm.cmd run dev:online` on 5174 and is server-authoritative, with guest identities and in-memory storage; it is not production hosting.

## Locked character-study verification

Read [DDTank character standard v1](design/DDTANK-CHARACTER-STANDARD-v1.md) before changing the current authoring pipeline. From the repository root, run:

```powershell
python characters/ddtank-lab-v1/tools/verify_standard.py --self-test
python characters/ddtank-lab-v1/tools/verify_standard.py --live-root D:/Codex/DDtank
```

The second command requires the owner's external live lab. The browser-only snapshot can be served from `characters/ddtank-lab-v1` with `python -m http.server 5215 --bind 127.0.0.1`, then opened at `http://127.0.0.1:5215/web/index.html`. Godot adapters additionally require the external lab's non-published commercial resources. Preserve v1 when creating an authorized new version; never regenerate its lock just to suppress drift errors.

## Portable playable build

The source branch includes [`releases/willowbrook-v02-portable.zip`](releases/willowbrook-v02-portable.zip). Extract it, install Node.js 22+ and double-click `start-game.cmd` on Windows (or run `node tools/serve-portable.mjs` elsewhere). Open http://localhost:4175/. No `npm install` is needed to play this built bundle. Serve over localhost; directly opening HTML with `file://` does not work. This is browser-local standalone simulation, not an online server.

To recreate that folder from source after `npm run build`:

```powershell
npm.cmd run package:portable
```

Output: `prototype/rpgjs-v5-adventurer-v0.2/artifacts/willowbrook-v02-portable/`, including game files, launcher/server, asset credits and available installed package notices. Keep notices with redistribution. ZIP that folder's contents to refresh the checkpoint in `releases/`, update its checksum/build source record, then commit/push. The repo checkout is the editable development deliverable; the game bundle alone is not a substitute for source. This ZIP is a tracked checkpoint artifact, not an automatically rebuilt GitHub Release.

Saves live in browser storage at their original localhost origin. Moving source/the game ZIP to another machine does **not** transfer saved progress. Save export/import is not implemented. Existing v0.1 and v0.2 keys are separate. No credentials or `.env` secrets are required for this standalone slice.

Read [PROJECT-STATUS.md](PROJECT-STATUS.md), the candidate [readme](prototype/rpgjs-v5-adventurer-v0.2/readme.md), [appearance contract](prototype/rpgjs-v5-adventurer-v0.2/CHARACTER-APPEARANCE.md) and [parity evidence](prototype/rpgjs-v5-adventurer-v0.2/PARITY-REVIEW.md) before changing systems.

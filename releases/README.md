# Playable checkpoint

Download `willowbrook-v02-portable.zip` using GitHub's **Download raw file** button, extract it and run `start-game.cmd` (Node.js 22+ required). Open http://localhost:4175/. macOS/Linux: `node tools/serve-portable.mjs`. No npm dependency install is required for this built standalone game. Keep asset/package notices with the game.

`manifest.json` records SHA-256, size and the source commit used for the checkpoint. To develop, clone the **full repo** and follow [DEVELOPING.md](../DEVELOPING.md); editing minified game chunks is not the development workflow. Saves are browser/origin-local and are not copied between computers.

This tracked ZIP is intentionally kept as a small reviewable playable checkpoint. Rebuild and replace it when publishing a new playable checkpoint; ordinary source commits need not include a new binary. It is not a production online server or an installer with a bundled Node runtime.

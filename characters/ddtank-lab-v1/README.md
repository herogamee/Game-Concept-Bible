# Locked modular chibi character baseline — 2026-10-07

Owner-requested preservation checkpoint for the latest DDTank-style study. Read the [Thai design summary](../../design/DDTANK-CHARACTER-STANDARD-v1.md) and [machine-readable contract](contract.json). Historical failed walk/mesh trials remain in their old folders; this snapshot is the current study baseline.

- `web/`: working Canvas wardrobe, 24 registered PNGs, two clean headless stand/walk masters, head-part sources, prompts, deterministic exporter and runtime lock.
- `godot/scripts/`: working external-lab adapter snapshots, including standing Bag/Aura portraits, blink, inventory icons and character/aura alignment. Requires the rest of `D:/Codex/DDtank`; this folder alone is not a complete Godot project.
- `evidence/`: measured DDTank dimensions/origins and verification results. Commercial PNGs, atlases, SWFs and decompiled excerpts are excluded.
- `baseline-lock.json`: 70 preserved file/reference hashes; `tools/verify_standard.py` detects drift without third-party Python packages.

Verify from the repository root:

```powershell
python characters/ddtank-lab-v1/tools/verify_standard.py --self-test
python characters/ddtank-lab-v1/tools/verify_standard.py --live-root D:/Codex/DDtank
```

Run the self-contained browser wardrobe using Python's standard server from this folder:

```powershell
python -m http.server 5215 --bind 127.0.0.1
```

Open `http://127.0.0.1:5215/web/index.html`. The active external lab remains `http://127.0.0.1:5214/template-walk-test/index.html`. The lock uses SHA-256 through Web Crypto; serve on localhost rather than opening the HTML as a file. The whole-character experiment linked at the bottom is preserved as the historical step before separating equipment, not the current modular renderer.

Re-exporting the unchanged sources needs Pillow and preserves the locked bytes. A different encoder/source producing different bytes is rejected; do not unlock v1 to silence that rejection.

The nine inventory items form 48 looks and 384 look×walk-frame combinations. Current support is one male/downleft family, stand plus eight walk frames. Glasses/new wings/full costumes/other directions/combat poses remain incomplete; it is not a production engine migration or 100% Flash interchange.

Source provenance: our generated originals from the existing three-quarter character study, exact new outfit prompts in `web/generation-prompts.json`, paired blue-hair originals linked by the lock to the existing repository and prompt copies under `provenance/paired-hair`. The pose reference selected by the owner is [Ginzii Walk Template](https://toy.ginzii.com/walk-template); the supplied [README](provenance/ginzii-walk-template-README.txt) says free use with no conditions and credits Three.js under MIT. The downleft gray pose-guide PNG is included for comparison; the Three.js runtime is not redistributed. No claim is made that AI-generated poses inherit or guarantee correct template geometry.

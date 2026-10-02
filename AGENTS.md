# Repository agent instructions

Current owner-authorized direction: read `design/implementation-reset-2026-10-02.md` and `prototype/CODEX-HANDOFF-QUALITY-PARITY.md` first. They supersede engine/asset exclusivity and gameplay-only acceptance in the earlier research/RPGJS handoff. Historical research remains useful evidence, not a production engine lock.

- Main playable/product reference: `prototype/web-pixel-rpg-v0.1/`. Preserve its working code, original illustrated artwork, audio and save compatibility. Do not replace its renderer or migrate its save in an engine experiment.
- `prototype/rpgjs-v5-adventurer-v0.2/` is a technical experiment. Functional/two-client acceptance has evidence; visual/input/product parity has NOT passed. Do not describe it as a better replacement or expand its scope yet.
- Next implementation is one comparable village/meadow slice using v0.1 assets and behavior in the RPGJS candidate. Use adapters; Universal LPC is optional, not mandatory replacement art. Preserve attribution for every third-party asset. No commercial-game sprites.
- Phaser 4 is an allowed bounded comparison candidate under the owner's latest authorization. Do not pretend an RPGJS engine blocker exists because an implementation looked bad. Document measured limitations, integration effort and attempted fixes. Do not install multiple engines into the same playable project.
- Read the installed RPGJS skill/current docs before RPGJS API changes. Use official documentation for Phaser API/version choices. Existing package dependencies prove what was used; do not claim planned tools were implemented.
- Compare the same map/assets/actions and record screenshots, input feel and performance evidence. Passing logic tests or two-client connection alone does not pass product acceptance. Owner visual/feel acceptance is required before calling a migration the new default.
- Final shared-world gameplay must be server-authoritative. Do not treat standalone save/client simulation as secure multiplayer, or in-memory online storage as durable account persistence.
- No large dungeon, class trees, crafting/guild simulation or MMO scaling until product parity and functional/online gates pass.
- Keep authored content IDs/data separate from renderer-specific frame/layout details. Avoid a broad refactor before the one-scene experiment gives evidence.
- Meaningful changes update README/CHANGELOG and an honest acceptance record. Preserve old prototypes and concept versions; use incremental commits.

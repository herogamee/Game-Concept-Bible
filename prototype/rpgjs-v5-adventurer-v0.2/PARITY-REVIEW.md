# Willowbrook one-scene review — 2026-10-02

Status: **reviewable RPGJS experiment; owner visual/feel acceptance pending. v0.1 remains the default playable.** Implementation commits: `bc31e4b` and transfer/resize correction `32e6dea`, followed by this evidence record.

## What changed and what the comparison means

The original illustrated hero, three distinct NPCs, slime, props and deterministic village/meadow terrain now run through RPGJS adapters. The original source runtime/assets/save were not modified. This repairs the earlier implementation's discarded artwork; it is evidence that that art regression did not require changing engines. The compact fantasy HUD is a new arrangement, not a pixel-identical copy of v0.1.

Matched viewport captures, 1280×720, are in `evidence/parity/v1-village.png`, `v1-meadow.png`, `v2-village.png`, `v2-meadow.png`. v1 uses its existing `?preview=village` / `?preview=field` no-save fixtures. v2 uses actual saved Lv.2 progress and ordinary portals. The browser viewport override was reset afterward. v1 has a header/footer and different usable scene area, so identical browser dimensions do not imply identical on-screen actor size.

## Controls and gameplay

| Behavior | Reference and current result |
|---|---|
| Ground click | Original screen/world conversion, destination ring, bounded eight-way route. Candidate uses a conservative 16px collision mask and a 6px waypoint arrival tolerance; v1 ends within 0.5px. |
| Camera / overlap | Logical 800×450 framing; camera leaves 300 world pixels above the hero and clamps at map bounds. Prop foot anchors retain Y sorting. |
| Movement | Click motion requests 160px/s in both implementations. Native RPGJS keyboard motion uses its engine speed setting; WASD currently picks one held axis rather than v1's normalized diagonal input. Exact keyboard-speed/feel parity is not claimed. |
| Keyboard takeover | WASD/arrows cancel route and selected target. Z/Space slash; E/Enter talk; I bag; 1 potion. |
| Sword | 350ms cycle in both; candidate has 90ms windup, 120ms active, 140ms recovery and validates 48px/100° facing arc. v1 damages immediately within 55px. This intentional authority gate changes timing/aim feel. |
| Hit feedback | Opaque hero, red hurt ring, floating damage, sword frames/arc and original slash/hurt audio. Living slimes receive about 10px bounded recoil. Hurt blocks attacking for 700ms but preserves retreat movement. |
| Audio | Original v1 village/meadow synthesis, slash, hurt and level chime; separate volume/mute key and gesture activation. No listening-quality assessment was performed. |
| Content scope | Four Lv.1 slimes, starter sword/count-based inventory and one quest. v1's higher-level blue slime/boar roster is not ported in this bounded slice. |

## Actual browser checks

Final online actor `PNfw` accepted the elder quest by clicking into range, killed three valid slime generations and returned through the north portal. Turn-in displayed **Lv.2, HP 35/35, EXP 14/43, 76 Gold, Potion 2, Gel 3, quest complete**. See `evidence/parity/quest-turn-in.png`. Killing then retreating completed without damage on the last two trips. Leaving a character standing beside a respawning slime also exercised damage/death and recovery at village spawn while retaining earned progress.

The final two-client race used `PNfw` and `hKgs` in the same meadow. Both displayed `slime-003 · HP 0/3 · dead` and both players' positions. PNfw changed EXP **14→22**, Gold **76→78**, Gel **3→4**; hKgs remained EXP **0**, Gold **20**, Gel **0**. Only one reward was granted. See `online-a-final.png` and `online-b-final.png`; earlier `online-a.png` / `online-b.png` preserve the previous same-level race.

Standalone loaded the existing isolated v0.2 save, saved via K and reloaded the browser: **Lv.2, HP 35/35, EXP 22/43, 78 Gold, Gel 4, completed quest** survived. Both portals and explicit L load were exercised on this final renderer; `evidence/parity/save-reload.png` records that progress and idle phase. Old save positions inside the new footprint mask are repaired to a safe spawn without resetting progress.

Online slots remain server-owned **in-memory guest storage**. Reloading an online browser can create a fresh guest identity; this is not persistent-account reconnect. During development HMR/reloads, old guest actors could remain listed in the room until server restart. Authentication, disconnect cleanup/reconnect semantics and durable storage are not accepted by this slice.

## Verification and measured cost

- TypeScript check passed; **21/21** focused rules/runtime tests passed, including diagonal clearance, monster home leash and retreat while hurt.
- Production build passed. Root and `/quest/` production HTTP smoke passed for map/TSX collision data, theme and PNG signatures. HTTP smoke does not certify online deployment or full browser gameplay under a subpath.
- Windows, Node 22.23.2, Codex in-app browser; matched image viewport 1280×720. Online final check also used the ordinary 1254×884 pane. No controlled CPU/GPU baseline or low-end hardware was available.
- Engine `onStep` sampling retains the last 600 intervals. Final two-client snapshots showed roughly **74–75 Hz, p95 15.4–16.3ms**, about eight seconds of samples per client. Earlier busy build/resize runs were slower. This is client callback cadence, **not GPU FPS**, a cold-load timing or a controlled v1/v2 frame benchmark.
- Filesystem `fs.readFileSync` + `zlib.gzipSync` inventory: eight scripts actually referenced by v1's index total **36,347 raw bytes / 16,222 gzip bytes**. The candidate's four built JS chunks total **2,740,691 raw / 793,159 gzip bytes** (font, CSS, images and maps excluded). This measures code payload, not network requests/cache or wall-clock loading. Active candidate PNG copies total **764,286 bytes**, plus ground atlases. Production retains inactive starter/LPC assets; deploy-size cleanup remains open.

The candidate is substantially heavier in JavaScript payload. A controlled same-scenario v1/v2 cold-load and frame-time benchmark remains open; no claim of better performance or a guaranteed 60 FPS is made.

## Recommendation and remaining acceptance

Keep v0.1 as the product reference. This RPGJS slice is now suitable for an owner review of art, click arrival, sword timing and camera feel, rather than adding more systems. The custom asset generator, collision registry, navigation, camera/pointer adapter and authoritative combat are real integration costs; RPGJS provided shared rooms/lifecycle/synchronization but did not remove that work.

No hard engine blocker has been established and Phaser has not been installed. If the owner still rejects control feel, or the measured payload/integration costs are unacceptable, the next justified comparison is the same small scene in an isolated Phaser 4 candidate. First address the known keyboard diagonal difference and record a controlled load/frame benchmark; do not start a full rewrite or MMO expansion from this evidence.

Hurt/death still use an idle frame plus feedback; no dedicated death animation, full equipment UI, higher-level roster or account backend is claimed. Product acceptance and broader performance gates remain pending.

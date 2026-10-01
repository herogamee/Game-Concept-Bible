# Market comparison — evidence before positioning

**Research date:** 2026-10-01, Asia/Bangkok. This is a focused desk study, not an exhaustive census or a sales forecast.

## Evidence rules

**Fact** = directly observed store description, developer statement, service announcement or captured count. **Community** = an individual review or discussion, not an official description. **Inference** = our comparison of documented features. **Proposal** = something our game should test.

Fourteen Steam applications were queried directly using the public review endpoint with `language=all`, `purchase_type=all`, `filter=all`. [Captured metrics](evidence/steam-review-counts-2026-10-01.csv) preserve positive, negative, total, exact retrieval timestamps and endpoint. Counts include all returned purchase types and languages; they are not interchangeable with a store's English-only or Steam-purchaser-only headline. Values can change, and retrievals are not simultaneous.

Percentage = positive / (positive + negative), rounded to one decimal. Steam's supplied rating label is retained in CSV; it need not match a naive percentage-derived label. App 794260's review history spans the Outward app and its edition transition; it is not an isolated Definitive Edition cohort. No wishlist counts were publicly verified. Review count is not copies sold, revenue, profitability or concurrent population. Do not apply a sales multiplier.

## Current observed footprint

| Game / linked primary store | Positive / negative | Total | Positive % | Documented neighboring experience | Comparison boundary / our inference |
|---|---:|---:|---:|---|---|
| [Monster Hunter: World](https://store.steampowered.com/app/582010/) | 460,175 / 58,026 | 518,201 | 88.8 | Monster hunting, preparation and equipment progression | Strong professional-contract reference; not evidence of a fully autonomous civilian Guild society |
| [Kenshi](https://store.steampowered.com/app/233860/) | 111,886 / 5,153 | 117,039 | 95.6 | Open-ended squad RPG and vulnerable beginnings | Powerful neighboring fantasy of earning survival; setting and squad focus differ |
| [Wandering Sword](https://store.steampowered.com/app/1876890/) | 43,488 / 2,363 | 45,851 | 94.8 | Martial-arts travel, NPC recruitment and relationships | Relationship/travel comparator, not a documented F–S adventurer-license game |
| [Outward](https://store.steampowered.com/app/794260/) | 22,850 / 8,586 | 31,436 | 72.7 | Ordinary-adventurer vulnerability, survival and co-op exploration | Close emotional competitor; professional Guild ladder is not its documented organizing promise |
| [Battle Brothers](https://store.steampowered.com/app/365360/) | 25,476 / 3,457 | 28,933 | 88.1 | Mercenary-company contracts, wages and risk | Excellent financial/preparation comparison; player leads a company rather than one Guild applicant |
| [Trails in the Sky](https://store.steampowered.com/app/251150/) | 9,789 / 619 | 10,408 | 94.1 | Authored RPG centered on young licensed professionals | Direct counterexample to “games never have an adventurer-style Guild”; own-player biography and career simulation differ |
| [TROUBLESHOOTER: Abandoned Children](https://store.steampowered.com/app/470310/) | 9,222 / 652 | 9,874 | 93.4 | Tactical team building and a professional organization | Adjacent modern setting/agency premise; no verified match for our entire fantasy-life combination |
| [Elin](https://store.steampowered.com/app/2135150/) | 8,633 / 614 | 9,247 | 93.4 | Adventure, survival, crafting and home building | Close life-sandbox competitor; do not infer absent Guild features merely from a short store description |
| [The Matchless Kungfu](https://store.steampowered.com/app/1696440/) | 6,282 / 1,658 | 7,940 | 79.1 | Martial-arts sandbox, world interaction and survival | Strong systemic-life adjacency; exact autonomous behaviors need hands-on verification |
| [M.A.S.S. Builder](https://store.steampowered.com/app/956680/) | 3,502 / 624 | 4,126 | 84.9 | Action RPG with deep mecha customization | Thai production/reference case, not a direct fantasy Guild competitor |
| [Gedonia](https://store.steampowered.com/app/1114220/) | 3,448 / 524 | 3,972 | 86.8 | Open-world RPG, character building and free exploration | Budget-scope comparison; detailed professional career simulation is not established by the source |
| [Our Adventurer Guild](https://store.steampowered.com/app/2026000/) | 3,444 / 176 | 3,620 | 95.1 | Guild Master management and tactical adventurer parties | Closest organizational fantasy, but its advertised player role conflicts with our locked identity |
| [Mirthwood](https://store.steampowered.com/app/2272900/) | 1,676 / 705 | 2,381 | 70.4 | Fantasy life sim with exploration and social interaction | Adjacent everyday-life promise; sampled criticism warns about unfinished systems and progression |
| [Dungeon Dreams 2](https://store.steampowered.com/app/1843470/) | 212 / 22 | 234 | 90.6 | Character creation, relationships, town building and dungeon challenge | Important small competitor; lower review volume does not mean weak design or failure |

These are **reception/visibility observations**, not a league table of business success. Kenshi, Wandering Sword and Our Adventurer Guild show strong positive reception in differently sized audiences. Mirthwood and Outward have more polarized aggregate responses; neither should be labeled a commercial failure from that alone.

## Geographic coverage, without inventing national preferences

| Requested region | Concrete evidence in this study | Limit |
|---|---|---|
| Thailand | M.A.S.S. Builder; a [founder interview](https://redharegames.wordpress.com/2025/06/02/spotlight-interview-sai-from-vermillion-digital/) identifies the Bangkok team; Thai Outward reviews sampled | Mecha RPG is adjacent, and three Thai reviews cannot represent the Thai market |
| Japan | Elin, Trails, Monster Hunter; [Falcom's official terminology](https://www.falcom.co.jp/sora/story/keyword.html) describes civic protection and international branches | Japanese-language opinion sample is Elin-only; no national demand percentage |
| China | Wandering Sword and The Matchless Kungfu, Simplified-Chinese review sample | Language does not identify citizenship or purchase region |
| Korea | TROUBLESHOOTER; [Dandylion contact page](https://www.dandylion.co.kr/contact-us) gives Seoul address | No Korean-language review cohort analyzed in this pass |
| Europe | Kenshi's [Bristol studio](https://lofigames.com/about/about-us/), Battle Brothers' [Hamburg developer](https://overhypestudios.com/disclaimer.html); Guild management comparison | Developer origin is not audience distribution |
| America | Mirthwood; [developer interview](https://premortem.games/2024/12/04/mirthwood-by-bad-ridge-games-is-mixing-genres-with-something-darker-and-more-adventurous/) identifies the Seattle team | No US-only conversion/wishlist data; English reviews are multinational |

The Thai founder also describes an earlier MMORPG effort as unsuccessful and explains the later team's resource constraints. That is an attributed developer account, not a documented failure of M.A.S.S. Builder. It reinforces our no-MMO-first guardrail without proving that all Thai teams should make the same game.

## Success and failure cases worth distinguishing

**Positive reception:** Kenshi and Our Adventurer Guild demonstrate that deep systemic play can attract favorable reviews in very different audience sizes. That supports testing progression and attachment; it does not prove our budget, visuals or proposed genre will convert those audiences.

**Execution disappointment:** current sampled Mirthwood and Gedonia reviews describe broken or unfinished-feeling interactions despite liking the underlying idea. These are community reports tied to review dates, not confirmed bugs in the current build. Do not claim that “life RPGs fail”; use the reports to define save/progression/presentation checks.

**Service discontinuation:** the original Japanese **Blue Protocol** announced closure for 2025-01-18; see [Famitsu's dated announcement report](https://www.famitsu.com/article/202408/15819) and [Bandai Namco Studios' product description](https://www.bandainamcostudios.com/en/products/blue-protocol.html) for its online action RPG identity. The original service ending is an operational failure to sustain that product, not a measured financial loss in this study. The original notice is no longer readable through this research access. Do not conflate it with separately operated successor/reuse projects. No unverified budget or causal claim is included.

## Closest-feature matrix

Legend: **D** directly documented; **P** partial/adjacent comparison; **U** not established by consulted sources, which does not mean absent. This is not a hands-on feature audit.

| Comparator | Ordinary/vulnerable beginning | Guild as core profession | Professional progression | Life outside battles | Independent colleague careers | Our literal F–S + proposed combination |
|---|---|---|---|---|---|---|
| Outward | D | U | P | D | U | U |
| Elin | P | U | P | D | U | U |
| Our Adventurer Guild | P | D, management role | D | P | P | U, different player role |
| Trails | P | D | D | P | U | U, authored protagonists |
| Monster Hunter | P | D | D | P | U | U, specialized hunting loop |
| Dungeon Dreams 2 | P | P | P | D | U | U |
| Kenshi | D | U | P | D | P | U |

Monster Hunter's [official Generations manual](https://game.capcom.com/manual/MH_Gen/en-UK/page-147.html) explicitly ties completed low-rank Guild work to higher Hunter Rank and high-rank permission. This is a series-level organizational reference, **not evidence that every exact rule applies identically to World**. Trails' civilian Guild role is supported by Falcom; community wiki rank details are secondary cross-checks, not names or rules for our IP.

## Answer to the market question

**Inference:** games already fulfill substantial parts of “an ordinary adventurer joins a Guild and advances.” It would be inaccurate to market this as the first game with Guild careers. In this consulted sample, no product was verified to combine **a self-created ordinary F-rank adventurer, rank independent from power, a physical civic/social Guild, independently progressing colleagues, a meaningful early living budget, contract uncertainty and a long multi-stratum dungeon** exactly as proposed.

The opportunity is the coherence and visibility of that combination, not the literal use of the letter F. Evidence confidence is moderate for overlap, low-to-moderate for uniqueness and low for commercial demand. Missing small games, mods, RPG Maker projects and newer releases could narrow the gap. “Not verified in this sample” must never become “does not exist.”

**Proposal:** pitch the slice around “earn your first license upgrade among people who have lives of their own.” Test whether players remember peers, preparation and recognition. Avoid promising 100 playable floors before the first three justify expansion. No pricing, sales target or monetization recommendation is established here.

## Tools and evidence limits

[SteamDB](https://steamdb.info/app/2026000/) was consulted as a cross-check; no wishlist estimate or inferred revenue is used. Public store crawls showed different totals and language filters, so the direct captured API count is the consistent metric source. Reddit and Steam community samples appear in [community demand](community-demand.md). YouTube metadata identified a [dated Outward review](https://www.youtube.com/watch?v=mUnSJjnrcQs); the video was not watched/transcribed here and supplies no gameplay claims or engagement-based demand estimate. Wikis were consulted for vocabulary cross-checking, not as authority over our original design.

Next validation: hands-on audit of the closest seven comparators, structured interviews in the requested languages, and a playable slice. These are empirical follow-ups, not missing sections of this design proposal.

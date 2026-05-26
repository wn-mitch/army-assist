# 11th Edition Migration — `army-assist`

This is the scoped tracker for the army-assist repo's 11e migration work. Cross-repo strategic context, captured 11e intel, and the disposition matrix all live in the consortium's parent migration doc — read that first.

- **Parent (cross-repo)**: [`tabletop-developer-consortium.github.io/11e-migration.md`](https://github.com/Tabletop-Developer-Consortium/tabletop-developer-consortium.github.io/blob/main/11e-migration.md)
- **Sister trackers**: [`40kdc-data`](https://github.com/Tabletop-Developer-Consortium/40kdc-data/blob/main/11e-migration.md), [`shadowboxing`](https://github.com/wn-mitch/shadowboxing/blob/main/11e-migration.md)

## Status

- **10e freeze**: tag [`10e-final`](https://github.com/wn-mitch/army-assist/releases/tag/10e-final) at `origin/main` (commit `f8876fb`, the most recent 10e data-pipeline refresh) — first tag in this repo. Marks the last pure-10e state.
- **`main`**: 11th edition development begins from here. The data pipeline already swung to `game-datacards` extraction during the 10e end-game; the 11e migration takes it further and replaces the Wahapedia HTML regex path entirely.
- **Branch option**: cut `10e-archive` branch from `10e-final` if/when the team wants to land critical 10e-only fixes after migration begins. Not done by default.

---

## Tasks

- [ ] Audit `src/store/`, `src/types/` for in-app data shape; map to `40kdc-data` core schema. Where fields diverge, prefer the schema's shape and translate at the boundary.
- [ ] Replace Wahapedia regex import (`README.md` regex blob, `src/utils/`) with `40kdc-data` artifact consumption + generated TypeScript types. The `game-datacards` extraction pipeline that landed during the 10e tail (see `scripts/extract_from_game_datacards.py`) can stay as a bridge until the 40kdc-data npm package is stable; long-term it goes away.
- [ ] Wait for `40kdc-data` 11e `game-version` artifact (npm package + Rust crate). Once published, version-pin and migrate.
- [ ] `ROADMAP.md` 11e-relevant items already enumerated:
  - Pre-game phase modal (force-disposition fits here).
  - Keyword highlighting on the movement screen.
  - Stratagem flyout (DSL-driven once `40kdc-data` Ability DSL primitives are wired).
- [ ] Print system: re-test against 11e card layouts. Structural changes from 10e look minor; spot-check rather than rewrite.
- [ ] Force-disposition surface in the pre-game phase modal: read disposition from the parsed list (driven by GW's encoding once published), surface inline. Avoid deriving — `40kdc-data` is authoritative.
- [ ] Cover audit: 11e cover is `−1 BS` to the attacker, not `+1 save` to the defender. Anywhere the UI explains cover, update the framing. Where the unit stat surface shows an effective save against shooting, recompute against the new model.
- [ ] Engagement range copy: 2" in 11e (was 1"). Surface anywhere the movement screen highlights engagement.

## Critical files

- `src/store/`, `src/types/`, `src/utils/` — in-app data shape and import pipeline.
- `src/components/` — pre-game phase modal surface.
- `src/print/` — print layout (verify against 11e card structure).
- `ROADMAP.md` — keeps the 11e-relevant near-term items.
- `scripts/extract_from_game_datacards.py` — bridge until `40kdc-data` npm package supersedes it.

## Verification

- [ ] Existing Cypress suite passes against 11e fixtures.
- [ ] A roster (e.g. `lists/world-eaters.txt`) loads identically in `army-assist` and `shadowboxing` with the same keyword and disposition derivation — cross-repo consistency check.
- [ ] Pre-game phase modal surfaces the parsed disposition correctly across the five archetypes.

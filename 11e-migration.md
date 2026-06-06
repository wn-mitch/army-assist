# 11th Edition Migration — `army-assist`

This is the scoped tracker for the army-assist repo's 11e migration work. Cross-repo strategic context, captured 11e intel, and the disposition matrix all live in the consortium's parent migration doc — read that first.

- **Parent (cross-repo)**: [`tabletop-developer-consortium.github.io/11e-migration.md`](https://github.com/Tabletop-Developer-Consortium/tabletop-developer-consortium.github.io/blob/main/11e-migration.md)
- **Sister trackers**: [`40kdc-data`](https://github.com/Tabletop-Developer-Consortium/40kdc-data/blob/main/11e-migration.md), [`shadowboxing`](https://github.com/wn-mitch/shadowboxing/blob/main/11e-migration.md)

## Status

- **10e freeze**: tag [`10e-final`](https://github.com/wn-mitch/army-assist/releases/tag/10e-final) (GitHub Release) at the final 10e data-pipeline fix (`fa64102`). Marks the last pure-10e state.
- **Migration**: executed on `wnmitch/11e-migration` (PR #17). The app is a pure consumer of `@alpaca-software/40kdc-data` (≥0.5.3): the package's `Roster` is the native data model, all display text derives from the DSL describers, and the entire legacy data layer (regex parsers, ~20MB embedded JSON, ListUnit/StoredList types, game-datacards extraction script) is deleted. Saved lists migrate by re-importing their original raw text (state version 28).

## Tasks

- [x] Audit `src/store/`, `src/types/` for in-app data shape; map to `40kdc-data` core schema. **Outcome: the package `Roster` became the native model outright** — `StoredRoster` = raw text + verbatim Roster + app overlay (notes/toggles/casualties); no boundary translation, legacy types deleted.
- [x] Replace Wahapedia regex import with `40kdc-data` consumption. `tryImportRoster` auto-detects ListForge text + share links, NewRecruit JSON/WTC/simple, GW app, Rosterizer (the listforge-text adapter and several NR-simple robustness fixes were upstreamed in 0.5.1). The bridge script is deleted.
- [x] Version-pin and migrate. Package consumed from npm (`^0.5.3`); upstream releases cut this migration: 0.5.1 (importer + browser-safe barrel), 0.5.2 (core stratagems), 0.5.3 (force dispositions).
- [ ] `ROADMAP.md` 11e-relevant items:
  - [x] Pre-game force-disposition surface (see below).
  - [ ] Keyword highlighting on the movement screen (post-migration).
  - [x] Stratagem flyout is DSL-driven (linked-ability `describe()` text).
- [x] Print system: fully ported to roster data (not just spot-checked — the section components consume `RosterUnitRow` + dataset views; enhancements now print per unit).
- [x] Force-disposition surface on the pre-game screen: renders `dataset.forceDispositions` (all five as reference until detachment grants/GW list encoding publish upstream — `detachment.force_dispositions` is wired and takes over automatically).
- [x] Cover audit: the app never explained cover mechanics — the only touchpoint is the "Ignores Cover" keyword tag (name + icon, still valid in 11e). Effect semantics live in the package DSL. No copy changes needed.
- [x] Engagement range copy: no 1"/engagement prose existed in the app. No changes needed.

## Upstream follow-ups (40kdc-data — flagged during this migration)

- Detachment rules: 184/190 detachments lack `detachment_rule_id`; the app's fallback (`ability.detachment_id`) picks them up as they land.
- Faction-rule abilities missing: `martial-katah` (Custodes), `strands-of-fate` (Aeldari), `the-red-thirst` (BA), `nurgles-gift` (DG).
- Faction rules carry no phase mappings (1/46) — the app shows empty-phase rules in every game phase until mappings land.
- Core stratagems have `ability_id: null` (no DSL effects yet) — panel shows name/CP/timing without rules text.
- NR-simple `Detachments:` (plural) config key unparsed.
- Per-model stat profiles (`model_constraint.model_name` unconsumed) — sergeants share the primary stat row.
- Degrading-profile ("Damaged") display data not modeled in the DSL.
- `launch` dataslate (2026-06-20): bump the dep to clear `points_provisional`.

## Verification

- [x] Cypress suite passes against 11e fixtures — 75/75 (includes new `save_migration.cy.ts` covering the v27→v28 localStorage migration, and force-disposition coverage).
- [x] Cross-repo consistency: all 44 `src/assets/lists/*.txt` fixtures import through the same `tryImportRoster` the package pins via its conformance corpus (TS/Rust/Python parity-checked upstream).
- [x] Pre-game surface renders the five archetypes; per-list dispositions activate when the list encoding publishes.

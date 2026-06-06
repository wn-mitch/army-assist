# army-assist — Product

## Register
product

## Users
- **40k players mid-game at the table**: phone in one hand, dice in the other,
  attention split between the opponent and the clock. They need "what does this
  unit do in this phase" answered in one glance.
- **Pre-game reviewers**: same players the night before — importing a list,
  checking force dispositions, printing a reference packet. Desktop or tablet,
  more attention available.

## Product purpose
Mid-game 40k rules reference. Import a list (ListForge, NewRecruit, GW app,
Rosterizer) and get per-phase unit cards, stratagems, army rules, and pre-game
force dispositions. One unit, one phase, one answer at a time. All rules text
derives from the 40kdc community dataset (`@alpaca-software/40kdc-data`).

## Strategic principles
- **Phase-first, not list-first**: the screen answers the current phase's
  question. Everything else collapses out of the way.
- **Phone-first ergonomics**: thumb reach, generous tap targets, no horizontal
  scroll. Desktop layouts are an expansion, never the baseline.
- **Reference, not authoring**: importing and editing a list is setup; reading
  it mid-game is the job. Optimize for the read path.
- **Tools share a dialect**: army-assist uses the shadowboxing visual language
  (industrial near-black, teal accent, inset rim-lit elevation, faction
  palette overrides) so the 40kdc family reads as one product line.
- **Mechanics from 40kdc, never scraped prose**: rules text is generated from
  structured ability data; numeric facts are fair game, GW prose is not.

## Anti-references
- **Battlescribe-era list tools**: dense gridded tables, every keyword in a
  pill, modal-on-modal navigation. army-assist shows one phase at a time.
- **Brand-heavy SaaS chrome**: hero gradients, illustrated empty states,
  marketing copy. Users already know 40k; the app is a utility.
- **Generic AI-dashboard card grids**: equal-sized icon-plus-heading cards
  with no hierarchy. The unit card for the current phase is the hero.

## Voice
Terse, technical, present-tense. Status verbs over adjectives. Errors are
diagnostic ("ListForge URL decoded but no units matched"), not apologetic.

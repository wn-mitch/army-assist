# Design Brief — army-assist

Mid-game Warhammer 40K rules reference. React SPA, phone-first. Dark-first,
industrial aesthetic shared with shadowboxing and the rest of the 40kdc family.
This document is the reference for any tool generating UI in this repo.

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript, Zustand (persisted store)
- **Styling:** Tailwind CSS v4 with `@theme` design tokens in `src/index.css`
- **Fonts:** Barlow Condensed (headings, uppercase, tracked), Barlow (body), JetBrains Mono (mono/kbd)
- **Icons:** HeroIcons (`@heroicons/react`) — family sibling shadowboxing uses Lucide; army-assist standardizes on HeroIcons, same angular mono-weight language
- **Modals/menus:** HeadlessUI (`Dialog`, `Menu`, `Transition`)

## Design Tokens

Defined in the `@theme` block in `src/index.css` (Neutral dark is the baseline)
and overridden at runtime by the faction theme system. **All components use
token classes** (`bg-bg`, `bg-surface`, `text-text`, `text-text-muted`,
`border-border`, `bg-accent`, `text-accent-foreground`, …) — never hardcoded
hex values or raw Tailwind palette classes.

```
--color-bg / --color-bg-dark          page background tiers
--color-surface                       card/section fill
--color-border                        dividers, outlines
--color-text / -muted / -dim          text hierarchy (AAA/AA on --color-bg)
--color-accent / -foreground / -hover faction accent (teal #14b8a6 in Neutral)
--color-panel / -surface / -border / -hover   darker tier for dense game UI
--color-success / -warning / -danger  semantic, faction-independent
```

### Typography

- Headings: `font-heading` (Barlow Condensed) `font-bold uppercase tracking-wider`
- Body: `font-body` (Barlow); game UI runs compact at `text-sm` / `text-xs`
- Mono: `font-mono` (JetBrains Mono) for kbd hints and stat values where alignment matters
- 13px floor; hierarchy through scale + weight contrast, never flat scales

### Border Radius

Angular/industrial: `--radius-sm: 2px`, `--radius-md: 4px`, `--radius-lg: 8px`.
`rounded` (4px) is the default. **`rounded-lg` only on modals/floating overlays.**

### Elevation

Layered inset rim-lit shadows for near-black backgrounds (`--shadow-sm/md/xl`).
A 1px white-alpha inset top edge reads as rim light; never plain drop shadows.

## Faction Theme System

14 faction themes in `src/theme/palettes.ts` (Neutral, Space Wolves, Blood
Angels, Dark Angels, Ultramarines, Necrons, T'au Empire, Imperial Fists, White
Scars, Sisters of Battle, Aeldari, Drukhari, World Eaters, Death Guard), each
with full **dark + light** palettes. Each theme shifts the accent AND tints the
neutral grays toward the faction hue — never pure `#000`/`#fff`.

- Applied at runtime by setting `--color-*` properties on
  `document.documentElement` (effect in `App.tsx`).
- `settings.factionThemeId === ""` means **auto**: the theme resolves from the
  active roster's `faction_id` (walking `parent_faction_id` for chapters),
  falling back to Neutral. An explicit id overrides auto.
- Dark/light mode remains the `dark` class on `<html>` driven by
  `settings.isDarkMode`; the theme effect picks the matching palette variant.

## Component Patterns

### Buttons

All buttons go through `src/components/ui/Button.tsx`. Do not hand-write
button token classes; use the component, or `buttonClasses(variant, size,
extra)` from `src/components/ui/buttonStyles.ts` for elements that can't be
a `<Button>` (HeadlessUI `Menu.Item` render props, links styled as buttons).

```jsx
import Button from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";

<Button variant="standard">Close</Button>          // neutral action, dismissal
<Button variant="accent" size="md">Save</Button>   // THE primary action (≤1 per view)
<Button variant="danger">Delete</Button>           // destructive; quiet tint
<Button variant="ghost-icon" aria-label="Settings">
  <CogIcon className="h-8 w-8" />                  // toolbar/inline icon button
</Button>
```

- **Variants:** `standard` (`text-text bg-panel hover:bg-panel-hover`),
  `accent` (`bg-accent text-accent-foreground hover:bg-accent-hover`),
  `danger` (`text-danger bg-danger/5 hover:bg-danger/15`), `ghost-icon`
  (`p-2 text-text-muted hover:bg-panel-hover hover:text-text`; the icon
  child carries its size).
- **Sizes:** `sm` (`px-2 py-1`, default) and `md` (`px-4 py-2`, full-width
  modal CTAs). Weight is always `font-medium`; never `font-bold` on buttons.
- **States:** focus is `focus-visible:outline-2 outline-accent` (never
  `ring-offset`, which draws a box on dark backgrounds); disabled is
  `disabled:opacity-50 disabled:pointer-events-none`. Both are built in.
- **Danger means destructive.** Delete, reset, detach. Never dismissal:
  a red Close button trains users to ignore red.
- **Toolbar destructive buttons** (e.g. Reset) stay `ghost-icon` rhythm with
  a danger tint: `buttonClasses("ghost-icon", "sm", "text-danger
  hover:bg-danger/15 hover:text-danger")`.
- Icon-only buttons always carry `aria-label` or `title`.

### Modal close convention

Phone-first: every modal keeps a full-width bottom
`<Button variant="standard" size="md" className="w-full">Close</Button>`
(thumb reach beats minimal chrome). A `ghost-icon` X in the header is an
optional addition for long modals. Close handlers use `onClick` — never
`onPointerDown`/`onTouchEnd`, which fire on touch-scroll start and dismiss
the modal mid-scroll.

### Modals (HeadlessUI Dialog)

```jsx
<Dialog open={isOpen} onClose={close} className="relative z-50">
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="bg-panel-surface border border-panel-border
      rounded-lg shadow-xl max-w-lg w-full">
      <DialogTitle className="font-heading font-bold text-xl uppercase
        tracking-wider text-text">Title</DialogTitle>
      {/* content */}
    </DialogPanel>
  </div>
</Dialog>
```

Close on backdrop click and Escape (HeadlessUI provides both).

### Inputs

```jsx
<input className="w-full bg-panel border border-panel-border rounded px-2 py-1
  text-sm text-text placeholder:text-text-dim focus:outline-none
  focus:border-accent" />
```

### Tables (phase stat tables)

Token surfaces and borders only: header rows `bg-surface text-text-muted
font-heading uppercase tracking-wider text-xs`, body cells `text-text
border-border`. No zebra striping; rely on row borders.

### Unit cards

`bg-surface border border-border rounded` with `shadow-sm`. The card heading is
`font-heading uppercase tracking-wider`. Collapsed state dims to
`text-text-muted`. Nested cards are always wrong — phase sections inside a card
separate with `border-t border-border`, not inner cards.

## Hard Rules

- Token classes only; no `bg-gray-*`/`dark:` palette pairs, no hardcoded hex.
- Dark is primary; light comes from the faction palette's light variant.
- No side-stripe borders (`border-l-4` accents), no gradient text, no
  glassmorphism, no hero-metric blocks, no identical card grids.
- No em dashes in UX copy.
- Compact: game UI at `text-xs`/`text-sm`; body line length ≤ 75ch.
- Motion: ease-out only, never animate layout properties.

## Documented Exceptions

- **`src/utils/KeywordTagHelper.tsx`** keeps its fixed per-keyword Tailwind
  palette (≈40 semantic keyword colors with light/dark variants). These are
  meaning-bearing, must stay legible under every faction theme, and print.
- **The print tree (`src/print/`)** uses fixed light, ink-friendly colors and
  is never tokenized; `@media print` re-declares Neutral-light token values on
  `:root` as a safety net.

## Component Inventory (mapping)

| Area | Components | Pattern |
|---|---|---|
| Chrome | Header, Body, PhaseFilter, ScrollToTopButton | panel tier, tool buttons |
| List index | StoredListsDisplay, TileLayout, TableLayout, ListCard, ListRow | surface cards/rows |
| Army view | ListDisplay, SingleListDisplay, ListUnitCard, PhaseDisplays/*, KeywordTags | unit cards, stat tables |
| Rules | ArmyRuleDisplay, StratagemPanel, ForceDispositions | panel tier, collapsibles |
| Modals | Settings, NoteModal, EditListModal, ShareListModal, LeaderAttachmentModal, Changelog, Instructions | HeadlessUI modal pattern |
| Import | Pastebox, AddListButton/Row | inputs, accent CTA |
| Print | Print, src/print/* | fixed light (exception) |

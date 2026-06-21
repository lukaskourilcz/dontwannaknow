---
# THE ALMANAC — design tokens (machine-readable)
# Warm editorial archive for "Don't wanna know". Tokens are normative; the
# prose below explains how to apply them. Source of truth: src/styles.css.

name: The Almanac
mood: [warm, editorial, nostalgic, archival, tactile, unhurried]

color:
  light:
    bg: "#f6efe1"          # almanac paper
    bg-tint: "#efe5d2"      # canvas vignette edge
    surface: "#fffdf8"      # card paper (warm white)
    surface-warm: "#f3ead8" # secondary panel
    surface-sunk: "#efe5d2" # sunken field fill
    ink: "#221d18"          # headlines + primary text (warm near-black)
    ink-soft: "#45392e"     # body prose
    muted: "#6e6256"        # captions, labels
    muted-soft: "#9a8b78"   # faint helper text
    rule: "#e4d9c5"         # hairline
    rule-strong: "#d3c5ac"  # stronger rule / field underline
    accent: "#c14a2b"       # persimmon — CTAs, marks, drop cap, active
    accent-dark: "#a23c20"  # persimmon for text on light
    accent-soft: "#f3dccd"  # light persimmon wash
    accent-tint: "#fbeee4"  # faintest persimmon wash
    cool: "#2f5e6b"         # deep petrol — links + editorial detail
    cool-dark: "#234a55"
    cool-soft: "#dde8e7"
    gold: "#a9772a"         # warm gold — almanac flourishes
    on-accent: "#fdf6ec"    # type on accent / ink fills
  dark:
    bg: "#161210"
    surface: "#221c17"
    ink: "#f1e8d9"
    ink-soft: "#d8ccb9"
    muted: "#a3937f"
    rule: "#34291f"
    accent: "#e26a40"
    cool: "#74b4c0"
    gold: "#d2a458"
    on-accent: "#161210"

type:
  display: '"Fraunces Variable", "Iowan Old Style", "Hoefler Text", Georgia, serif'
  serif:   '"Newsreader Variable", "Iowan Old Style", Georgia, serif'
  sans:    '"Instrument Sans Variable", -apple-system, "Segoe UI", Roboto, sans-serif'
  mono:    '"SF Mono", ui-monospace, "JetBrains Mono", monospace'
  scale:   # clamp(min, fluid, max)
    hero:      "clamp(2.3rem, 7vw, 4.2rem)"
    h2-name:   "clamp(2rem, 5vw, 2.9rem)"
    question:  "clamp(1.95rem, 5.2vw, 3rem)"
    input:     "clamp(1.7rem, 4.6vw, 2.6rem)"
    reading:   "1.22rem"        # essay body
    fact:      "1.12rem"
    kicker:    "0.7rem"         # uppercase, 0.18–0.20em tracking
  weights: { display: 460-560, serif: 400-560, sans: 500-600 }

space: { 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 24px, 6: 32px, 7: 48px, 8: 64px }
radius: { sm: 8px, md: 14px, lg: 18px, pill: 999px }
shadow:
  sm: "0 1px 2px rgba(40,30,20,.06), 0 1px 1px rgba(40,30,20,.04)"
  md: "0 2px 6px rgba(40,30,20,.06), 0 12px 28px rgba(40,30,20,.09)"
  lg: "0 28px 64px rgba(40,30,20,.15)"
ease: { out: "cubic-bezier(.22,1,.36,1)", spring: "cubic-bezier(.34,1.4,.5,1)" }
---

# The Almanac

A design language for **Don't wanna know** — a site that takes a birth year and
birthplace and tells you the world your parents and grandparents lived through.
The product is nostalgic, emotional and full of curated history (it even prints a
vintage front page), so the interface is built to feel like a **warm editorial
archive**: ink on almanac paper, set in serif, with one confident accent.

This replaces the earlier flat, monochrome "Lightship" treatment, which read as
cold and generic for a product whose whole subject is memory and time.

## Inspiration

Drawn from the editorial / almanac branch of the public `DESIGN.md` collections
(VoltAgent's *awesome-design-md*, Google's `design.md` spec):

- **WIRED** — paper-white broadsheet density, a custom serif display face, mono
  uppercase kickers, a single editorial link accent.
- **Notion** — warm minimalism, serif headings, soft surfaces.
- **Mastercard** — warm cream canvas, editorial warmth.

The takeaway: warmth + serif display + a restrained, *used* accent beat cool,
flat monochrome for anything humane.

## Overview & personality

Paper, not screen. Unhurried, literate, a little vintage — the texture of an old
almanac or a well-set magazine — without tipping into pastiche. Every screen
should feel like a page worth keeping.

## Colour

A warm, near-monochrome paper-and-ink base with a deliberate three-mark accent
system. The canvas carries a faint persimmon glow at the top and a gold breath at
the foot, plus a 4%-opacity paper grain so it reads as stock.

- **Persimmon `accent`** is the lead. It fills the primary button, draws the
  essay drop cap, tops every person card, and marks the active choice. Use it
  where you want the eye to go.
- **Petrol `cool`** is the editorial counter-mark: text links, and a few cool
  category bullets. Never a fill.
- **Gold** is reserved for almanac flourishes — the card's top rule gradient, the
  newspaper rules, a couple of "value" bullets. Sparing.

Everything else is warm neutrals. Dark mode is a warm espresso, not black.

## Typography — three voices

| Voice | Family | Used for |
|-------|--------|----------|
| Display | **Fraunces** (opsz) | hero, headings, names, the big inputs, stat figures, drop cap |
| Reading | **Newsreader** | essays, facts, captions, ledes, the disclaimer (italic) |
| Chrome | **Instrument Sans** | kickers/eyebrows, buttons, toggles, labels, progress |

Headlines set tight (`-0.02` to `-0.025em`) at display optical sizes. Kickers are
uppercase Instrument Sans at `0.18–0.20em` tracking. Reading copy is Newsreader at
`1.22rem / 1.7`, measure capped at `64ch`. Numbers in stats use `tabular-nums`.

## Layout

Single reading column, `max-width: 820px`, centred. A two-person comparison breaks
out wider (`min(1140px, 94vw)`) into two cards. Sections are separated by a
centred rule-and-✦ divider with generous air above (`--s-8`).

## Elevation & depth

Soft, warm, low-contrast shadows (see `shadow.*`) — the system has depth again.
Cards lift on hover (`translateY(-3px)` + `shadow-md`). The paper grain and canvas
vignette supply ambient texture; avoid hard or cool-grey shadows.

## Shapes

Gentle, print-considered corners: `md: 14px` for cards and choice tiles, `lg:
18px` for the big person cards, full `pill` only for buttons and segmented
toggles. The wizard's text input and select are **borderless underlined fields**
(2.5px rule that turns persimmon on focus) so the form reads as one voice.

## Components

- **Primary button** — solid persimmon, cream text, soft shadow, lifts on hover.
  This is the confident CTA the old system lacked.
- **Secondary button** — warm surface, hairline border → ink on hover.
- **Link button** — petrol text, underline on hover.
- **Inputs** — large Fraunces fields on a single underline; placeholder is muted
  italic; caret is persimmon. Text input and `<select>` share the underline so
  they never look mismatched.
- **Choice cards** (country/gender) — warm card, hover lift, persimmon border +
  tint + corner dot when active.
- **Person card** — warm surface, persimmon→gold top rule, rises in on mount.
- **Stat cards** — warm panels; the "accent" variant fills persimmon-soft.
- **Essay** — Newsreader, drop cap on the first paragraph, hairline between
  paragraphs, uppercase persimmon kickers.
- **Front page** — an always-warm parchment artifact (Fraunces masthead, double
  rules); intentionally light in both themes, like a clipping under glass.

## Do

- Reach for the accent to guide attention, then stop.
- Keep the three type voices in their lanes.
- Let sections breathe; trust the hairline + ✦ dividers.
- Keep depth soft and warm.

## Don't

- Don't go flat/monochrome — that's what made the prior design feel boring.
- Don't fill with petrol or gold; they are marks, not surfaces.
- Don't set body copy in the sans or headlines in Newsreader.
- Don't add cool-grey shadows or hard borders to the warm surfaces.

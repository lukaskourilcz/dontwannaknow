---
# NEWFORM — design tokens (machine-readable)
# A broadsheet financial broadside for "Don't wanna know". Tokens are
# normative; the prose below explains how to apply them.
# Source of truth: src/styles.css.

name: NewForm
mood: [editorial, broadsheet, financial, spacious, monochrome, surgical]
theme: light            # light top to bottom — the page never breaks into a dark hero

color:
  linen:        "#fafffa"   # page canvas + card surfaces (faintly green near-white)
  obsidian-ink: "#121613"   # primary text, dominant borders, image frames
  pure-black:   "#000000"   # hard borders, icon strokes, deepest text
  bark:         "#232924"   # secondary dark surface, layered depth
  sage:         "#516254"   # muted heading text, secondary borders
  mist:         "#c8d2c8"   # hairline dividers, quiet borders
  voltage:      "#2bee4b"   # the action / accent green — CTA, marks, ticks only
  moss-glow:    "#93b799"   # green supporting accent (decoration only)
  pollen:       "#c4e4c9"   # gray-green supporting accent (decoration only)

type:
  display:     '"Playfair Display", Georgia, serif'        # Editorial New substitute
  display-alt: '"DM Serif Display", "Playfair Display", serif' # PP Mondwest substitute
  sans:        '"Inter Variable", ui-sans-serif, system-ui, sans-serif' # TWK Lausanne substitute
  serif:       '"Times New Roman", Times, serif'           # tiny captions / broadsheet body
  scale:   # clamp(min, fluid, max)
    hero:      "clamp(3rem, 11vw, 8.5rem)"   # Editorial New, line-height 0.90
    name:      "clamp(2.6rem, 8vw, 5.5rem)"
    question:  "clamp(2.2rem, 6vw, 4rem)"
    input:     "clamp(1.9rem, 5vw, 3rem)"
    body:      "16-18px"                      # Inter 350/400
    caption:   "11px"                         # uppercase, 0.11em tracking
  weights: { sans: 350-550, display: 400-500 }
  leading: { display: 0.90, body: 1.40 }      # 0.90 on display is the signature

space: { 1: 4px, 2: 8px, 3: 12px, 4: 20px, 5: 32px, 6: 50px, 7: 80px, 8: 120px, 9: 190px }
radius: { sm: 5px, cards: 14px, images: 14px, buttons: 10px }
shadow:
  # The ONLY shadow on the site — the green glow under the Voltage CTA.
  cta: "rgba(16,94,29,.45) 1px 8px 20px 0, rgba(18,146,39,.25) 1px 8px 20px 0"
ease: { out: "cubic-bezier(.22,1,.36,1)", spring: "cubic-bezier(.34,1.4,.5,1)" }
---

# NewForm

A design language for **Don't wanna know** — a site that takes a birth year and
birthplace and tells you the world your parents and grandparents lived through.
It reads as an **editorial financial publication**: a near-white, faintly
green-tinted canvas holds massive serif display type that does the heavy
lifting, while a single neon green acts as surgical punctuation. UI chrome is
stripped to almost nothing — a split wordmark, a quiet label, a green mark —
letting the typography and imagery own every page.

This replaces the warm "Almanac" treatment with a colder, more confident
broadsheet register.

## Colour

A near-monochrome ink-on-Linen base with **one** chromatic mark.

- **Voltage `#2bee4b`** is the entire colour system. It appears only on the
  filled CTA, the `know` half of the wordmark, the `‖` nav mark, short tick
  accents, the progress bar, active states, and a couple of data marks (the
  life-grid, a few fact bullets). Never on body text, headings, or large fills.
- Everything else is **Obsidian ink** on **Linen**, with **Sage** for muted
  copy and **Mist** for hairlines.
- Do not add a second saturated colour. Do not break the Linen canvas with a
  dark hero. Imagery is black-and-white / desaturated only.

## Typography

| Voice | Family | Used for |
|-------|--------|----------|
| Display | **Playfair Display** (Editorial New) | hero, names, section/question headlines, big inputs, stat figures |
| Display-alt | **DM Serif Display** (PP Mondwest) | the broadsheet masthead — the rare architectural moment |
| UI / body | **Inter** (TWK Lausanne) | everything: chrome, labels, body, essays, lists |
| Caption | **Times** | tiny serif captions, the front-page broadsheet body, the disclaimer |

Display headlines set at **line-height 0.90** with tight tracking (-0.02 to
-0.03em) so lines visually lock together — this is the signature. Body is Inter
350–400 at 16–18px. Captions are uppercase Inter at 11px / 0.11em tracking.

## Layout

A wide editorial frame (`max-width: 1180px`) with the reading column centred
inside it (`880px`). Sections are separated by **80–120px of whitespace** plus a
short green tick + uppercase label — *the absence of a line is the divider*. No
card grids, no alternating background bands; the page reads top-to-bottom as a
scrollable broadsheet.

## Components

- **Voltage CTA** — the only filled button. `#2bee4b` fill, Obsidian text,
  uppercase 14px Inter 550, 10px radius, a `→` glyph, and a dual-layer green
  glow (never a neutral-grey shadow).
- **Ghost links** — secondary actions and `Menu`/footer links: no fill, Inter
  350, underline on hover.
- **Cards** (person, choice, stat) — Linen surface, 14px radius, defined by a
  hairline + padding + type change, **not** by elevation. The only "shadow" is
  the CTA glow.
- **Nav header** — wordmark left (`dontwanna` in ink + `know` in Voltage), a
  quiet label + green `‖` mark right. Non-sticky.
- **Accent tick** — short ~44–52px × 2px Voltage lines near headlines and
  section transitions; visual rests against the monochrome field.
- **Front page** — a broadsheet artifact: ink on Linen, double-rule masthead in
  DM Serif Display, Times body.

## Do

- Reserve Voltage for the CTA, the `‖` mark, tick accents, and active states.
- Set display at line-height 0.90 so the lines lock together.
- Let the Linen canvas carry the page; cards are type + radius, not borders.
- Keep imagery monochrome and framed at 14px.

## Don't

- Don't introduce a second saturated colour or a neutral-grey shadow.
- Don't use box-shadows outside the CTA.
- Don't set display at 1.0+ line-height.
- Don't break the Linen canvas with a dark hero section.
- Don't use Inter weights above 550.

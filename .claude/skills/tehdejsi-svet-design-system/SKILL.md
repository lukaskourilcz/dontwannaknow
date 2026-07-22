---
name: tehdejsi-svet-design-system
description: Apply the Tehdejší svět editorial design system when changing React components, CSS, report layouts, forms, share previews, or the development editor. Use for visual, responsive, motion, accessibility, and component-system work.
---

# Tehdejší svět design system

## Inspect before designing

Read `CLAUDE.md`, `dontwannaknow/DESIGN.md`, `dontwannaknow/src/styles.css`, and the component being changed. Search for a reusable pattern before adding a component, class, token, icon, or motion primitive.

## Express the visual thesis

Build a contemporary personal publication assembled from evidence: warm like an album, clear like an edited magazine, credible like a cultural archive, and calm like a private keepsake.

- Use the paper, ink, forest, coral, rule, wash, and semantic state tokens in `src/styles.css`.
- Use Fraunces for display, Newsreader for editorial prose, and Instrument Sans for interface text and metadata.
- Respect the narrow reading, report, visual, comparison, and form widths.
- Prefer typographic hierarchy, fine rules, spacing, and surface contrast to shadows and nested cards.
- Use restrained editorial radii; keep controls at least 44 by 44 CSS pixels.
- Use the shared motion durations and `cubic-bezier(.22, 1, .36, 1)`; make reduced motion immediate and static.

Avoid brown vintage theming, yellowed paper everywhere, fake stamps, flag-led design, glassmorphism, purple-blue gradients, glows, sparkles, giant gradient headings, generic blobs, card saturation, pill saturation, floating fake UI, or animation behind long text.

## Match density to the surface

- Landing: calm, low density, one obvious action, form before marketing detail.
- Report: medium editorial density with chapter rhythm and distinct factual treatments.
- Comparison: compact structure that keeps shared and individual context scannable.
- `/dev`: denser, operational, data-first, and less decorative while using the same semantic states.

Drive fact presentation from existing `ReportItem` metadata. Do not create fragile text-prefix styling or a second report component system.

## Accessibility and responsive requirements

Keep semantic landmarks, ordered headings, labels, error associations, live status, disclosure semantics, visible focus, keyboard order, non-color state indicators, readable line lengths, and accessible summaries for maps, canvas, and sky.

Validate 320, 375, 390, 768, 1024, and 1280 pixels. Check long Czech strings, historical place names, 200% zoom/reflow, landscape, reduced motion, touch targets, and horizontal overflow. Use authentic rendered UI for visual validation; never replace it with generated UI.

Run focused tests and lint during implementation, then use `$tehdejsi-svet-release-validation`.

---
name: tehdejsi-svet-product
description: Preserve Tehdejší svět product correctness when changing public journeys, person input, reports, comparison, sharing, privacy, country scope, or positioning. Use for any feature or copy change that could affect who the product is for, what it claims, or how personal data is handled.
---

# Tehdejší svět product

## Start with the product contract

Read `CLAUDE.md`, `docs/experience-overhaul.md`, and the relevant source before editing. Search before creating components or utilities.

- Keep the main question exactly `Čí svět chcete poznat?`
- Keep the public interface Czech-only and the public country scope limited to `CZ` and `UA`.
- Treat the person as the subject and historical material as the formative environment around them.
- Never imply knowledge of memories, preferences, routines, family circumstances, or private biography that the user did not supply.
- Preserve a client-side, deterministic, static-hosting-friendly application without runtime AI, accounts, profiles, or report storage.
- Preserve the truthful promise that form values do not leave the browser.
- Never send report inputs, fragments, facts, chapters, or variants to analytics.

## Protect the journeys

Keep the single-person journey primary and comparison secondary but discoverable. Preserve flexible full-date or year-only input, optional first name, supported-city selection, deterministic variants, URL-fragment restoration, explicit name-sharing consent, client-rendered share images, and client-rendered PDF.

Comparison is non-competitive. Show shared context and meaningful environmental differences rather than two complete reports side by side.

The report is a personal editorial volume, not a dashboard, newspaper, certificate, biography, nostalgia quiz, museum kiosk, or school textbook.

## Preserve the pipeline

Trace changes through the existing flow instead of replacing it:

1. `src/lib/person.ts` normalizes a stable person profile.
2. `src/lib/historicalLocation.ts` resolves historical place and political context.
3. `src/lib/facts.ts` gathers deterministic candidates with editorial metadata.
4. `src/lib/report.ts` composes the person-centric chapters and controls sensitive material.
5. `src/lib/share.ts`, `src/lib/shareImage.ts`, and `src/lib/pdf.ts` encode, share, or export without a backend.

Preserve name-independent seeds, share-safe selection, duplicate-copy protection, historical boundaries, and the archive/public-data separation.

## Definition of product correctness

A product change is correct only when it remains personal without false certainty; useful for parents, grandparents, partners, friends, self-reflection, and Czech-Ukrainian families; honest about methodology and missing data; private; deterministic; Czech-only; CZ/UA-only; and fully usable on mobile and with a keyboard.

Run the most relevant tests while iterating, then use `$tehdejsi-svet-release-validation` before completion.

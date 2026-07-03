---
name: cooksbrad-design-system
description: Use when editing this Astro site (CooksBrad cookie site) — brand palette, typography, shared CSS conventions, and the workflow for turning the user's annotated screenshots into safe, scoped edits. Trigger on any styling/copy/layout request on this repo, especially when the user pastes a screenshot with red circles/arrows/letters.
---

# CooksBrad design system & polish workflow

This is a static Astro site (`astro build`, output `dist/`). Global styles live in
`src/styles/global.css`, imported once by `src/layouts/Layout.astro` — every page
(`src/pages/*.astro`) shares it. Read that file before styling anything; do not
guess class names.

## Brand palette

| Token | Hex | Usage |
|---|---|---|
| Forest (dark brand green) | `#0c392d` | `.bg-forest` sections (dark bg, light text), primary button text, `::selection` |
| Bottle green (script accent) | `#1a5c3a` | Script/display titles on light backgrounds — `.bk-story-title` ("CooksBrad"), `.histoire-h2-vert`, one-off `<h2>`/`<h3>` accents. Do not confuse with forest — this is a lighter, more "visible" green meant to read on cream. |
| Cream (base bg) | `#f7f5ef` | `body`, `.bg-cream`, default section background — the site's neutral canvas |
| Warm beige (secondary panel) | `#f0ece4` | `.bk-story-left` panel and any section that sits directly beside/under it and needs to read as "the same beige" rather than blend into the plain cream |
| CTA-band beige (legacy, avoid introducing more) | `#ede9df` | Only pre-existing use was the old CTA section bg — now normalized to `#f7f5ef`, don't reintroduce a third beige without a reason |
| Gold accent | `#ceb85c` | Eyebrow spans, dividers, `.btn-primary` bg (with `#0c392d` text), decorative ✦ marks, borders on dark cards (`rgba(206,184,92,0.35)`) |
| Body text | `#1b1c1c` / `rgba(27,28,28,0.65)` | Default text / muted body copy on light bg |

Rule of thumb: **script/display headings get bottle green (`#1a5c3a`) on light backgrounds**; whole-section dark treatments use **forest (`#0c392d`) via the `.bg-forest` utility**, never a bare inline dark-green background — `.bg-forest` also flips `.eyebrow`, `.body-text`, `.hairline-long`, `.btn-ghost` to light-on-dark automatically.

## Typography

- Display/script font: `'Alex Brush', cursive` — used for every big cursive heading (`.section-head h2`, `.bk-story-title`, `.bk-services-title`, `.histoire-text h2`, etc.). New script headings should reuse an existing class rather than hand-rolling a new font-family declaration.
- Body font: `'Montserrat', system-ui, sans-serif`.
- Occasional serif italic accent (e.g. contact page "Nos Coordonnées"): `'Noto Serif', serif; font-style: italic`.
- Fonts are loaded via `src/styles/fonts.css`, imported in `Layout.astro`.

## Global content rules

- **Paragraphs are justified site-wide**: `global.css` has a base `p { text-align: justify; text-align-last: left; }` rule (low specificity — any `text-align: center` on a class/inline style still wins). Any new prose copy should just be a plain `<p>`; don't fight this with per-page overrides unless the user asks to unjustify something specific.
- `.bg-forest` = dark section utility (bg `#0c392d`, fg `#f7f5ef`) with matching child overrides for `.eyebrow`, `.body-text`, `.hairline-long`, `.btn-ghost`. Prefer adding this class over inline dark backgrounds so text contrast is handled for free.
- `.btn-primary` = gold bg (`#ceb85c`) + dark green text (`#0c392d`) — already reads fine on both cream and forest backgrounds, no per-instance override needed.
- Cards/frames that need to "pop" off a cream section typically get a `1.5px solid` border in a translucent brand color (`rgba(12,57,45,0.22)` on cream, `rgba(206,184,92,0.35)` on a dark card) rather than a hard black border.

## Workflow: turning annotated screenshots into edits

The user's usual request shape: a screenshot of the live/dev site with a **red circle, arrow, or handwritten letter (A/B)** pointing at one element, plus a short imperative ("met en vert", "justifie le texte", "supprime ça"). Handle it like this:

1. **Read the screenshot** and identify the exact visible text or component near the annotation — don't guess the page from context alone, confirm with `grep` for that literal text across `src/pages/*.astro` (and `src/components/*` for interactive bits like forms).
2. **Find the smallest correct scope.** Most classes in `global.css` (`.section-head h2`, `.bg-cream`, `.btn-primary`, etc.) are shared across every page. If the user only flagged *one* instance, do not edit the shared rule — add an inline `style="color:#..."` or a one-off wrapper the same way the codebase already does elsewhere (this file is full of ad-hoc `style="color:#ceb85c"` on individual spans/h2s — that's the established pattern for single-instance overrides, not a smell to "clean up").
3. **When two nearby elements clash** (e.g. a section reads "too light" next to a panel that's visibly darker), grep both elements' resolved background colors before touching anything — the fix is usually reusing an existing nearby token (like `#f0ece4`), not inventing a new shade.
4. **Before deleting an asset or section**, grep the whole `src/` tree for other usages of that image/class — the same JPEG is frequently reused across the homepage services grid, the Créations gallery, and OG/meta `image:` fields. Removing one usage (e.g. "delete this photo" on one page) should not silently break another.
5. **After every batch of edits, run `npm run build`** (astro build) and confirm all pages generate with no errors before calling the work done. This project's `git push` also runs the build as a pre-push hook, but don't rely on that — catch it earlier.
6. Keep edits minimal and additive: no drive-by refactors of unrelated CSS while fixing a single flagged element.

## Reference color already in use for "the green" requests

When a user just says "en vert" / "vert bouteille" without a hex, default to `#1a5c3a` (established in `histoire.astro` / `.histoire-h2-vert`) for text on light backgrounds, and `.bg-forest` (`#0c392d`) for whole-section dark treatments. Don't invent a third green.

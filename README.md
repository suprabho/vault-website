# The Vault — marketing site

Next.js 16 (App Router) + Tailwind CSS v4 port of the Concept 05 wireframe
("Cinematic Institution × Ledger motion"). Each section of the page is its own
component.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

```
app/
  layout.tsx            fonts (Familjen Grotesk via next/font, New York local woff2), global CSS
  page.tsx              composes the sections in order
  globals.css           design tokens (@theme), base styles, shared primitives (.btn, .h1…, c5 ledger utilities)
components/
  brand/VaultLogo.tsx   wordmark + "powered by Merkle Science" lockup
  brand/monogram.ts     the four monogram path pieces (A/B/C/D) in a 662×827 space
  layout/               Header (+ MobileSheet), ProgressArcs, Footer, RevealObserver
  motif/MotifLayer.tsx  the mark as one fixed layer travelling through sections 01–05 (see below)
  motif/MotifGlyph.tsx  the mark as a static picture, for narrow viewports and reduced motion
  sections/             one component (+ CSS module) per section:
    Hero            01  pinned: the copy over the aura, then the mark alone
    Problem         02  pinned, inside the mark: headline, copy, the five signals (light ground)
    Continuation    03→04  pinned: the closing line, the room on a cream ellipse, the photographs
    Between         05  the mark upright at the right; the working rhythm joined by one drawn path
    Intelligence    06  this week in Vault
    Value           07  what members open
    Pulse           08  vault pulse
    People          09  the amphitheatre
    Membership      10  the standard
    Process         11  pinned scrub: the route draws as you scroll
    Request         12  pinned close
hooks/useStillMedia.ts  "settle instead of animate" media query (narrow / reduced motion)
hooks/useTrackScrub.ts  rAF scroll loop for a pinned track, with the settle path for still mode
lib/scrub.ts            progress + easing helpers for the pinned sequences
lib/choreography.ts     beat windows for sections 01–05, shared by the sections and the motif
lib/motif.ts            the motif camera: poses, keyframes, resolve/sample/viewBox maths
lib/icons.tsx           24×24 line icons
lib/site.ts             nav links and section order
public/images           photographs extracted from the wireframe
public/fonts            New York (Apple) subset, 400/500/600
```

## Conventions

- **Tokens** live in `@theme` in `globals.css`. The six palette scales from
  `vault-color-palette.json` are registered (`red`, `blue`, `amber`, `slate`,
  `stone`, `emerald`) alongside the brand tokens (`night`, `brass`, `cream`,
  `brass-ink` …), so `bg-night`, `text-brass`, `border-arc` etc. work as
  Tailwind utilities.
- **Reveals**: add `data-reveal` to an element and `RevealObserver` gives it
  the `in` class once it scrolls into view. The `.c5-ln`, `.c5-fade`,
  `.c5-rule`, `.ap` and `.reveal` primitives respond to that class.
- **Pinned sequences** (Hero, Problem, Continuation, Process, Request) are
  client components that scrub inline styles from scroll progress. Below 900px
  or with `prefers-reduced-motion`, they unpin and settle into the final frame.
- **The motif** (sections 01–05) is a single `position: fixed` layer
  (`components/motif/MotifLayer.tsx`) painted between the section backgrounds
  and their copy: sections keep their background, pinned stages sit at
  `z-index: 2`. The monogram is framed by a `viewBox` camera so the zoom stays
  crisp; its keyframes (`lib/motif.ts`) are placed relative to the
  `[data-motif-track]` sections and resolved to scroll positions on measure.
  Section copy and the mark share the beat windows in `lib/choreography.ts`,
  so tuning a beat in one place moves both. In still mode the layer is not
  mounted and each section shows a static `MotifGlyph` instead.
- Section-specific choreography stays in the section's CSS module; Tailwind is
  used for layout and one-off spacing.

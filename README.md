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
  request/              "Request an invitation" form page (posts to api/request)
  api/request/route.ts  forwards requests to VAULT_REQUEST_WEBHOOK_URL; answers 503 until it is set
  member-access/, code-of-conduct/, privacy/, terms/   the footer destinations
components/
  brand/VaultLogo.tsx   wordmark + "powered by Merkle Science" lockup
  brand/monogram.ts     the four monogram path pieces (A/B/C/D) in a 662×827 space
  layout/               Header (+ MobileSheet), ProgressArcs, Footer, RevealObserver, Subpage (frame for the other pages)
  forms/RequestForm.tsx the invitation request form
  type/Lines.tsx        masked headline lines for the .c5-ln reveal, with the spaces kept between them
  motif/MotifLayer.tsx  the mark as one fixed layer travelling through sections 01–05 (see below)
                        (lib/motif.ts also holds INNER_LOOP + betweenPose(), which the cadence dial is drawn from)
  motif/MotifGlyph.tsx  the mark as a static picture, for narrow viewports and reduced motion
  sections/             one component (+ CSS module) per section:
    Hero            01  pinned: the copy over the aura, then the mark alone
    Problem         02  pinned, inside the mark: headline, the promise, the three themes (light ground)
    Continuation    03→04  pinned: the introduction/relationship line, the room on a cream ellipse, the three convenings
    Between         05  pinned: the mark at the left, its counter a 365-day dial; each stop lights its days
                        (52 Mondays, signals, 12 months, 4 quarters, every day) with a preview in the middle
    CadenceAssets       placeholder previews for the five stops (swap for real renders)
    Intelligence    06  the weekly briefing: one item open, four out of focus
    Pulse           07  vault pulse: the next table and its setting, with this week's briefing and the newest resource beside it
    People          08  the amphitheatre, and its seating plan: two seats per constituency, names withheld
    Membership      09  the standard: built for / not built for, two lists either side of one rule
    Process         10  pinned scrub: interest → review → conversation → invitation
    Request         11  pinned close: one line, one button
hooks/useStillMedia.ts  "settle instead of animate" media query (narrow / reduced motion)
hooks/useTrackScrub.ts  rAF scroll loop for a pinned track, with the settle path for still mode
lib/scrub.ts            progress + easing helpers for the pinned sequences
lib/choreography.ts     beat windows for sections 01–05, shared by the sections and the motif
lib/motif.ts            the motif camera: poses, keyframes, resolve/sample/viewBox maths
lib/icons.tsx           24×24 line icons
lib/site.ts             the call to action, contact/member-portal settings, nav + legal links, section order
lib/briefing.ts         the sample Monday briefing shown in 06 and 07 (replace with a live edition)
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
- **Pinned sequences** (Hero, Problem, Continuation, Between, Process, Request) are
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

## Content that needs a real value before launch

- `lib/site.ts` — `CONTACT_EMAIL` and `MEMBER_PORTAL_URL` are `null`; the footer contact line and the
  portal link appear once they are set.
- `VAULT_REQUEST_WEBHOOK_URL` — where invitation requests are sent (any endpoint accepting a JSON POST).
- `lib/briefing.ts`, `Pulse.tsx` — sample briefing, next table and resource are illustrative placeholders.
- `CadenceAssets.tsx` — the five cadence previews are placeholder mock-ups.
- `People.tsx` — the seating plan's titles and institution types are illustrative; confirm them against the
  real membership. `APPROVED_LOGOS` stays empty until organisations approve the use of their marks.
- `app/privacy`, `app/terms` — plain-language summaries; have them reviewed before launch.

/**
 * Beat boundaries for the opening choreography (Hero → Problem → Continuation → Between).
 *
 * Every window is a fraction of its section's pinned track progress (see `trackProgress` in
 * lib/scrub.ts). Sections drive their own copy from these numbers and the motif layer
 * (components/motif/MotifLayer.tsx) keys its camera against the same tracks, so the text
 * and the mark always land on the same scroll position.
 */

export type Window = readonly [number, number];

/** Pinned track heights, in vh. Between is not pinned. */
export const TRACK_VH = { hero: 200, problem: 400, continuation: 1000 } as const;

export const HERO = {
  /** headline, lead and buttons fade and lift away */
  copyOut: [0.1, 0.35] as Window,
};

export const PROBLEM = {
  /** headline moves from the centre of the stage to its resting place above the copy */
  headUp: [0.28, 0.5] as Window,
  /** body copy fades in under the headline */
  copyIn: [0.34, 0.52] as Window,
  /** headline + copy fade while the cards stack */
  textOut: [0.55, 0.68] as Window,
  /** first card lands; each following card starts `cardStep` later */
  cardsIn: [0.55, 0.69] as Window,
  cardStep: 0.06,
};

export const CONTINUATION = {
  /** 03 headline + copy clear the stage */
  textOut: [0.08, 0.14] as Window,
  /** "Conferences create introductions. Vault creates relationships." */
  closeIn: [0.18, 0.22] as Window,
  closeOut: [0.28, 0.32] as Window,
  /** "Small by design. Relevant by construction." inside the cream ellipse */
  roomIn: [0.38, 0.42] as Window,
  roomOut: [0.5, 0.54] as Window,
  /** the ellipse has covered the viewport: the stage itself turns cream from here on */
  ground: 0.58,
  /** captions for the three photographs */
  cap: [
    { in: [0.68, 0.72] as Window, out: [0.76, 0.79] as Window },
    { in: [0.81, 0.84] as Window, out: [0.88, 0.91] as Window },
    { in: [0.93, 0.96] as Window, out: [1.2, 1.3] as Window },
  ],
};

export const BETWEEN = {
  /** the mark fades before the intelligence section arrives */
  fadeOut: [0.2, 0.45] as Window,
};

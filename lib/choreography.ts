/**
 * Beat boundaries for the opening choreography (Hero → Signals → Between).
 *
 * Every window is a fraction of its section's pinned track progress (see `trackProgress` in
 * lib/scrub.ts). Sections drive their own copy from these numbers and the motif layer
 * (components/motif/MotifLayer.tsx) keys its camera against the same tracks, so the text
 * and the mark always land on the same scroll position.
 */

export type Window = readonly [number, number];

/** Pinned track heights, in vh. */
export const TRACK_VH = { hero: 200, signals: 1200, between: 500 } as const;

export const HERO = {
  /** the scroll cue gives way as soon as the page moves */
  cueOut: [0, 0.07] as Window,
  /** headline, lead and button fade and lift away */
  copyOut: [0.1, 0.35] as Window,
};

/** 02 → 04 · the intro, the three themes inside the mark, the room, and the experiences. */
export const SIGNALS = {
  /** the intro copy clears */
  introOut: [0.04, 0.08] as Window,
  /** the mark grows from beside the intro to hold the photographs */
  grow: [0.05, 0.12] as Window,
  /** each theme: its photograph arrives over the last one, its copy comes in, then goes */
  topics: [
    { photo: [0.06, 0.12] as Window, in: [0.09, 0.13] as Window, out: [0.21, 0.245] as Window },
    { photo: [0.225, 0.285] as Window, in: [0.26, 0.295] as Window, out: [0.375, 0.41] as Window },
    { photo: [0.39, 0.45] as Window, in: [0.425, 0.46] as Window, out: [0.54, 0.575] as Window },
  ],
  /** the dinner replaces the last theme inside the mark; the room's copy follows */
  roomPhoto: [0.555, 0.615] as Window,
  roomIn: [0.59, 0.625] as Window,
  /** the mark's foot lights softly while the room holds */
  glow: [0.6, 0.64] as Window,
  /** where the "The Room" link lands: the room fully composed */
  roomAt: 0.63,
  /** the room's copy leaves; the mark grows to the centre, its counter empties, the foot brightens */
  roomOut: [0.69, 0.72] as Window,
  focus: [0.69, 0.77] as Window,
  counterOut: [0.69, 0.74] as Window,
  flare: [0.72, 0.77] as Window,
  /** the foot opens into a window that grows to the full frame; the mark gives way to it */
  expand: [0.775, 0.86] as Window,
  markOut: [0.82, 0.86] as Window,
  /** the frame divides into three panels */
  split: [0.88, 0.925] as Window,
  /** each panel becomes its experience: its own photograph, then its caption */
  cards: [0.925, 0.97] as Window,
  cardStep: 0.008,
};

export const BETWEEN = {
  /** the rim draws round the counter and the 365 days appear */
  dialIn: [0.02, 0.14] as Window,
  /** the headline gives way to the first stop */
  headOut: [0.14, 0.2] as Window,
  /** the five stops share this window equally, one at a time */
  stops: [0.2, 0.94] as Window,
};

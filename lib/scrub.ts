/** Normalised progress of `p` between `a` and `b`, clamped to 0..1. */
export const t = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
/** easeInOutCubic */
export const easeCubic = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
/** easeInOutQuad */
export const easeQuad = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
/** Progress (0..1) of a pinned track through the viewport. */
export const trackProgress = (track: HTMLElement) => {
  const span = track.offsetHeight - window.innerHeight;
  return span <= 0 ? 1 : Math.max(0, Math.min(1, -track.getBoundingClientRect().top / span));
};

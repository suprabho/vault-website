"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a "still" media query — the conditions under which a scroll-scrubbed
 * sequence should settle into its final frame instead of animating
 * (narrow viewports and/or reduced motion).
 */
export function useStillMedia(query = "(max-width:899px),(prefers-reduced-motion:reduce)") {
  const [still, setStill] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return still;
}

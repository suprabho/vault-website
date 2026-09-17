"use client";

import { useEffect, useRef, type RefObject } from "react";
import { trackProgress } from "@/lib/scrub";

/**
 * Runs `at(progress)` for a pinned track on every scroll frame (rAF-throttled), and again on
 * resize and once fonts are ready. When `still` is true (narrow viewport / reduced motion)
 * the track is not pinned: `settle()` runs once instead so the stage can drop its inline styles.
 * `still === null` means the media query has not been read yet; nothing happens.
 */
export function useTrackScrub(
  track: RefObject<HTMLElement | null>,
  still: boolean | null,
  at: (progress: number) => void,
  settle?: () => void,
) {
  const atRef = useRef(at);
  const settleRef = useRef(settle);
  useEffect(() => {
    atRef.current = at;
    settleRef.current = settle;
  });

  useEffect(() => {
    if (still === null) return;
    const tr = track.current;
    if (!tr) return;
    if (still) {
      settleRef.current?.();
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        atRef.current(trackProgress(tr));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.fonts?.ready.then(onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [track, still]);
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationEvent } from "react";
import { MONOGRAM_FULL, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";
import styles from "./Invitation.module.css";

/**
 * sealed → opening (the seal lifts, the flap swings up, the card rises to rest) → in (hover or
 * focus lifts it for a glance) → out (a click pops it up and out to fill the frame) → back (a
 * second click tucks it in again) → in.
 */
type State = "sealed" | "opening" | "in" | "out" | "back";

/** how long the opening runs, in ms, before hover takes over */
const OPENING = 1700;

/** twelve seats around an oval table, drawn over the photograph (rounded so server and client agree) */
const SEATS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return [(60 + 50 * Math.cos(a)).toFixed(2), (34 + 24 * Math.sin(a)).toFixed(2)] as const;
});

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 07 · the next table, delivered: the envelope opens as it comes into view, and the invitation inside pops out on a click. */
export default function Invitation() {
  const stage = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<State>("sealed");

  useEffect(() => {
    const el = stage.current;
    // without an observer the envelope stays sealed; a click still pops the invitation out
    if (!el || !("IntersectionObserver" in window)) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // reduced motion: open at once, with nothing to watch
        const still = reduced();
        setState((s) => (s === "sealed" ? (still ? "in" : "opening") : s));
        if (!still) timer = window.setTimeout(() => setState((s) => (s === "opening" ? "in" : s)), OPENING);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const toggle = useCallback(() => {
    setState((s) => (s === "out" ? (reduced() ? "in" : "back") : "out"));
  }, []);
  const settle = useCallback((e: AnimationEvent) => {
    if (e.animationName.includes("tuckIn")) setState((s) => (s === "back" ? "in" : s));
  }, []);

  return (
    <button
      type="button"
      ref={stage}
      className={styles.stage}
      data-state={state}
      aria-pressed={state === "out"}
      aria-label="Open the invitation"
      onClick={toggle}
      onAnimationEnd={settle}
    >
      <span className={styles.back} />

      {/* the invitation: the table itself, with its seats and the foil keyline of a printed card */}
      <span className={styles.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/private-dinner.webp" alt="" loading="lazy" />
        <svg className={styles.seats} viewBox="0 0 120 68" aria-hidden="true">
          <ellipse cx="60" cy="34" rx="36" ry="14" />
          {SEATS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" />
          ))}
        </svg>
        <span className={styles.keyline} />
        <span className={styles.label}>
          <span className={styles.labelMark}>
            <svg viewBox={MONOGRAM_VIEWBOX} aria-hidden="true">
              <path d={MONOGRAM_FULL} />
            </svg>
          </span>
          Invitation only
        </span>
      </span>

      {/* the front of the envelope: the side and bottom folds, open in a V at the top */}
      <span className={styles.pocket}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.lip} d="M0 0 50 50 100 0" />
          <path d="M0 100 50 57 100 100" />
        </svg>
      </span>

      {/* the flap, and the seal that holds it */}
      <span className={styles.flapWrap}>
        <span className={styles.flap} />
        <span className={styles.seal}>
          <svg viewBox={MONOGRAM_VIEWBOX} aria-hidden="true">
            <path d={MONOGRAM_FULL} />
          </svg>
        </span>
      </span>
    </button>
  );
}

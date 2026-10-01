"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { AnimationEvent } from "react";
import { MONOGRAM_FULL, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";
import { Icon, type IconName } from "@/lib/icons";
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
export default function Invitation({ title, details }: { title: string; details: { icon: IconName; label: string }[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const ids = useId();
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
    <div ref={stage} className={styles.stage} data-state={state} onAnimationEnd={settle}>
      <span className={styles.back} aria-hidden="true" />

      {/* the invitation: the table on top, its details printed beneath, inside the foil keyline of a card */}
      <div className={styles.card}>
        <div className={styles.photo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/private-dinner.webp" alt="" loading="lazy" />
          <svg className={styles.seats} viewBox="0 0 120 68" aria-hidden="true">
            <ellipse cx="60" cy="34" rx="36" ry="14" />
            {SEATS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" />
            ))}
          </svg>
          <p className={styles.label}>
            <span className={styles.labelMark} aria-hidden="true">
              <svg viewBox={MONOGRAM_VIEWBOX}>
                <path d={MONOGRAM_FULL} />
              </svg>
            </span>
            Invitation only
          </p>
        </div>
        <div className={styles.panel}>
          <h3 className={styles.title}>{title}</h3>
          <ul className={styles.details}>
            {details.map((d) => (
              <li key={d.label}>
                <Icon name={d.icon} strokeWidth={1.4} />
                <span>{d.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <span className={styles.keyline} aria-hidden="true" />
      </div>

      {/*
        the front of the envelope: the side and bottom folds, open in a V at the top. Drawn as a
        shape rather than a clipped box: Chrome can drop a clip-path once the card behind it settles.
      */}
      <svg className={styles.pocket} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${ids}-front`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f1b36" />
            <stop offset="0.55" stopColor="#161329" />
            <stop offset="1" stopColor="#100e21" />
          </linearGradient>
        </defs>
        <path d="M0 0 50 50 100 0V100H0Z" fill={`url(#${ids}-front)`} />
        <path className={styles.seam} d="M0 100 50 57 100 100" />
        <path className={`${styles.seam} ${styles.lip}`} d="M0 0 50 50 100 0" />
      </svg>

      {/* the flap, and the seal that holds it */}
      <span className={styles.flapWrap} aria-hidden="true">
        <svg className={styles.flap} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${ids}-flap`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a2545" />
              <stop offset="0.85" stopColor="#1b1832" />
            </linearGradient>
          </defs>
          {/* the flap's shadow on the folds: the same triangle, reaching a little lower */}
          <path className={styles.flapShade} d="M0 0H100L50 106Z" />
          <path d="M0 0H100L50 100Z" fill={`url(#${ids}-flap)`} />
          <path className={styles.seam} d="M0 0 50 100 100 0" />
        </svg>
        <span className={styles.seal}>
          <svg viewBox={MONOGRAM_VIEWBOX}>
            <path d={MONOGRAM_FULL} />
          </svg>
        </span>
      </span>

      {/* the whole frame is the control; the card's words stay readable outside it */}
      <button type="button" className={styles.hit} aria-pressed={state === "out"} aria-label="Open the invitation" onClick={toggle} />
    </div>
  );
}

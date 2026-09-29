"use client";

import { useCallback, useRef } from "react";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { PROBLEM } from "@/lib/choreography";
import { easeCubic, easeQuad, t } from "@/lib/scrub";
import Lines from "@/components/type/Lines";
import styles from "./Problem.module.css";

const SIGNALS = [
  { name: "Regulation", desc: "Stay ahead of policy and rulemaking across key jurisdictions." },
  { name: "Enforcement", desc: "Know what global enforcement bodies are prioritising before it becomes yesterday\u2019s news." },
  { name: "Financial crime", desc: "Track emerging typologies, risk patterns and threats before they reach your controls." },
];

/**
 * 02 · three beats on one pinned track, inside the mark: the headline alone, the headline
 * with its promise, then the three themes stacking over the text. The closing claim follows
 * the track as ordinary flow.
 */
export default function Problem() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const at = useCallback((p: number) => {
    const T = text.current, H = head.current, C = copy.current;
    if (!T || !H || !C) return;
    // the headline starts alone at the centre, then rises to make room for the copy
    const up = easeCubic(t(p, PROBLEM.headUp[0], PROBLEM.headUp[1]));
    const lift = (C.offsetHeight + 28) / 2;
    H.style.transform = `translateY(${(lift * (1 - up)).toFixed(1)}px)`;
    const ci = easeQuad(t(p, PROBLEM.copyIn[0], PROBLEM.copyIn[1]));
    C.style.opacity = ci.toFixed(3);
    C.style.transform = `translateY(${(14 * (1 - ci)).toFixed(1)}px)`;
    // the text yields to the signals
    T.style.opacity = (1 - easeQuad(t(p, PROBLEM.textOut[0], PROBLEM.textOut[1]))).toFixed(3);
    const len = PROBLEM.cardsIn[1] - PROBLEM.cardsIn[0];
    rows.current.forEach((r, i) => {
      if (!r) return;
      const s = PROBLEM.cardsIn[0] + i * PROBLEM.cardStep;
      const v = easeCubic(t(p, s, s + len));
      r.style.opacity = v.toFixed(3);
      r.style.transform = `translateY(${(26 * (1 - v)).toFixed(1)}px)`;
    });
  }, []);
  const settle = useCallback(() => {
    [text.current, head.current, copy.current, ...rows.current].forEach((el) => {
      if (!el) return;
      el.style.opacity = "";
      el.style.transform = "";
    });
  }, []);
  useTrackScrub(track, still, at, settle);

  return (
    <section id="problem" data-motif-track="problem" className={`c5 light-c5 ${styles.problem}`}>
      <div className={styles.track} ref={track}>
        <div className={styles.stage}>
          <div className={styles.text} ref={text}>
            <div className={styles.head} ref={head}>
              <h2 className={`c5-h2 ${styles.h2}`} data-reveal>
                <Lines lines={["Crypto compliance", "does not wait for", "the next conference."]} />
              </h2>
            </div>
            <p className={styles.copy} ref={copy}>
              Know first. Understand faster. Act before the rest of the market catches up.
            </p>
          </div>
          <ol className={styles.ledger} aria-label="What Vault tracks">
            {SIGNALS.map((s, i) => (
              <li key={s.name} className={styles.row} ref={(el) => { rows.current[i] = el; }}>
                <span className={styles.nm}>{s.name}</span>
                <span className={styles.ds}>{s.desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={`c5-sheet ${styles.after}`}>
        <p className={`c5-fade ${styles.claim}`} data-reveal>
          Vault filters noise into context.
        </p>
      </div>
    </section>
  );
}

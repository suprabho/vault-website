"use client";

import { useCallback, useRef } from "react";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { PROBLEM } from "@/lib/choreography";
import { easeCubic, easeQuad, t } from "@/lib/scrub";
import styles from "./Problem.module.css";

const SIGNALS = [
  { n: "01", name: "Regulation", desc: "Policy updates and rulemaking across key jurisdictions." },
  { n: "02", name: "Enforcement", desc: "Actions and priorities from global enforcement bodies." },
  { n: "03", name: "Financial crime", desc: "Emerging typologies and risk patterns to monitor.", active: true },
  { n: "04", name: "Market infrastructure", desc: "Infrastructure shifts shaping the digital asset ecosystem." },
  { n: "05", name: "Action", desc: "What it means for your team and what to do next." },
];

/**
 * 02 · three beats on one pinned track, inside the mark: the headline alone, the headline
 * with its copy, then the five signals stacking over the text. The closing claim follows
 * the track as ordinary flow.
 */
export default function Problem() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);

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
              <span className="c5-lab">02 — The problem</span>
              <h2 className={`c5-h2 mt-[22px] ${styles.h2}`} data-reveal>
                <span className="c5-ln"><span>Crypto compliance</span></span>
                <span className="c5-ln"><span>does not wait for</span></span>
                <span className="c5-ln"><span>the next conference.</span></span>
              </h2>
            </div>
            <p className={`c5-copy ${styles.copy}`} ref={copy}>
              Rules shift across jurisdictions. Enforcement changes the meaning of yesterday&apos;s guidance. New typologies
              appear before most teams have time to process the last one. The information exists. The difficulty is knowing
              what matters, what it changes and what to do next.
            </p>
          </div>
          <div className={styles.ledger} role="list" aria-label="The five signals Vault tracks">
            {SIGNALS.map((s, i) => (
              <div
                key={s.n}
                role="listitem"
                className={`${styles.row} ${s.active ? styles.active : ""}`}
                ref={(el) => { rows.current[i] = el; }}
              >
                <span className={styles.n}>{s.n}</span>
                <span className={styles.nm}>{s.name}</span>
                <span className={styles.ds}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`c5-sheet ${styles.after}`}>
        <p className={`c5-fade ${styles.claim}`} data-reveal>
          Vault turns movement into context.
        </p>
      </div>
    </section>
  );
}

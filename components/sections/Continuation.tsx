"use client";

import { useCallback, useRef } from "react";
import MotifGlyph from "@/components/motif/MotifGlyph";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { CONTINUATION } from "@/lib/choreography";
import { easeQuad, t } from "@/lib/scrub";
import Lines from "@/components/type/Lines";
import styles from "./Continuation.module.css";
import ConveningVisual from "./ConveningVisual";

/** the three convenings. Described, never named: no venues, no guests. */
const CONVENINGS = [
  {
    name: "Private dinners",
    text: "Twelve seats. A private table. One topic everyone in the room has a reason to care about.",
  },
  {
    name: "Executive breakfasts",
    text: "Small morning sessions with senior operators before the day starts.",
  },
  {
    name: "Closed-door roundtables",
    text: "A confidential room built around one regulatory, enforcement or financial crime issue.",
  },
];

/**
 * 03 → 04 · one pinned track. The mark itself is drawn by the motif layer; this stage carries
 * the words that answer each of its poses: the continuation, the closing line, the room, then
 * the three convenings as the camera moves through the photographs. Past `CONTINUATION.ground`
 * the stage turns cream to match the ellipse that has just covered it.
 */
export default function Continuation() {
  const still = useStillMedia();
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);

  const at = useCallback((p: number) => {
    const win = (a: readonly [number, number], b: readonly [number, number]) =>
      easeQuad(t(p, a[0], a[1])) * (1 - easeQuad(t(p, b[0], b[1])));
    const show = (el: HTMLElement | null, v: number, lift = 10) => {
      if (!el) return;
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate(-50%,-50%) translateY(${(lift - lift * v).toFixed(1)}px)`;
    };
    if (sheet.current) {
      const v = 1 - easeQuad(t(p, CONTINUATION.textOut[0], CONTINUATION.textOut[1]));
      sheet.current.style.opacity = v.toFixed(3);
      sheet.current.style.transform = `translateY(${(-18 * (1 - v)).toFixed(1)}px)`;
    }
    show(close.current, win(CONTINUATION.closeIn, CONTINUATION.closeOut));
    show(msg.current, win(CONTINUATION.roomIn, CONTINUATION.roomOut), 8);
    CONTINUATION.cap.forEach((c, i) => {
      const el = caps.current[i];
      if (!el) return;
      const v = win(c.in, c.out);
      el.style.opacity = v.toFixed(3);
      el.style.setProperty("--visual-play", v > 0.01 ? "running" : "paused");
      el.style.transform = `translateY(${(12 - 12 * v).toFixed(1)}px)`;
    });
    const ground = p >= CONTINUATION.ground ? "cream" : "";
    if (sec.current && sec.current.dataset.ground !== ground) sec.current.dataset.ground = ground;
  }, []);
  const settle = useCallback(() => {
    [sheet.current, close.current, msg.current, ...caps.current].forEach((el) => {
      if (!el) return;
      el.style.removeProperty("--visual-play");
      el.style.opacity = "";
      el.style.transform = "";
    });
    if (sec.current) sec.current.dataset.ground = "";
  }, []);
  useTrackScrub(track, still, at, settle);

  return (
    <section id="continuation" data-motif-track="continuation" ref={sec} className={`c5 ${styles.continuation}`}>
      <div className={styles.track} ref={track}>
        <div className={styles.stage}>
          <span id="room" className={styles.roomAnchor} aria-hidden="true" />

          {/* 03 · the continuation */}
          <div className={`c5-sheet c5-grid ${styles.sheet}`} ref={sheet} data-reveal>
            <div className={`c5c ${styles.st}`}>
              <h2 className="c5-h2" data-reveal>
                <Lines lines={["The event ends.", "The conversation should not."]} />
              </h2>
            </div>
          </div>

          {/* the one idea: conferences introduce, Vault continues — inside the turned mark */}
          <div className={styles.close} ref={close}>
            <p>
              <span className={styles.closeA}>Conferences make the introduction.</span>{" "}
              <span className={styles.closeB}>Vault is where the real relationship begins.</span>
            </p>
          </div>

          {/* 04 · inside the room, on the cream ellipse */}
          <div className={styles.roomMsg} ref={msg}>
            <h2 className={styles.roomH2}>
              A community of pioneers, brought together in exceptional rooms for a reason.
            </h2>
            <p className={styles.roomCopy}>Every table is built around people who should genuinely know one another.</p>
          </div>

          {/* still mode only: the photographs in the mark, as one picture */}
          <figure className={styles.still}>
            <MotifGlyph
              photos
              className={styles.stillGlyph}
              title="The Vault monogram holding photographs of a private dinner, an executive breakfast and a closed-door roundtable."
            />
          </figure>

          {/* the three convenings, as the camera reaches each photograph */}
          {CONVENINGS.map((c, i) => (
            <div key={c.name} className={`${styles.cap} ${styles[`cap${i}`]}`} ref={(el) => { caps.current[i] = el; }}>
              <div className={styles.conveningVisual}><ConveningVisual variant={i} /></div>
              <h3 className={styles.capName}>{c.name}</h3>
              <p className={styles.capText}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

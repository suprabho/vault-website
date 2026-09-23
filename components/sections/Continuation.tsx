"use client";

import { useCallback, useRef } from "react";
import MotifGlyph from "@/components/motif/MotifGlyph";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { CONTINUATION } from "@/lib/choreography";
import { easeQuad, t } from "@/lib/scrub";
import styles from "./Continuation.module.css";

const CAPTIONS = ["Private dinners", "Executive breakfasts", "Closed-door roundtables"];

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
  const caps = useRef<(HTMLParagraphElement | null)[]>([]);

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
      el.style.transform = `translateY(${(12 - 12 * v).toFixed(1)}px)`;
    });
    const ground = p >= CONTINUATION.ground ? "cream" : "";
    if (sec.current && sec.current.dataset.ground !== ground) sec.current.dataset.ground = ground;
  }, []);
  const settle = useCallback(() => {
    [sheet.current, close.current, msg.current, ...caps.current].forEach((el) => {
      if (!el) return;
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
              <span className="c5-lab">03 — The continuation</span>
              <h2 className="c5-h2 mt-[22px]" data-reveal>
                <span className="c5-ln"><span>The event ends.</span></span>
                <span className="c5-ln"><span>The conversation should not.</span></span>
              </h2>
              <p className={`c5-copy c5-fade d1 ${styles.co}`}>
                The industry already has places to meet. Vault is built for what happens next: the follow-up question,
                the trusted introduction, the context shared in confidence and the relationship that remains useful
                long after the badge comes off.
              </p>
            </div>
          </div>

          {/* the closing line, inside the turned mark */}
          <div className={styles.close} ref={close}>
            <p>
              Conferences create introductions.
              <br />
              Vault creates relationships.
            </p>
          </div>

          {/* 04 · inside the room, on the cream ellipse */}
          <div className={styles.roomMsg} ref={msg}>
            <span className="c5-lab">04 — Inside the room</span>
            <h2 className={styles.roomH2}>
              Small by design.
              <br />
              Relevant by construction.
            </h2>
            <p className={styles.roomCopy}>
              Vault convenings are curated around who would genuinely benefit from knowing one another. The objective
              is not attendance. It is the quality of the conversation.
            </p>
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
          {CAPTIONS.map((c, i) => (
            <p key={c} className={`${styles.cap} ${styles[`cap${i}`]}`} ref={(el) => { caps.current[i] = el; }}>
              {c}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useRef } from "react";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { HERO } from "@/lib/choreography";
import { CTA } from "@/lib/site";
import { easeQuad, t } from "@/lib/scrub";
import styles from "./Hero.module.css";

/** 01 · two beats on one pinned track: the copy over the aura, then the copy clears for the mark. */
export default function Hero() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  const at = useCallback((p: number) => {
    const el = copy.current;
    if (!el) return;
    const v = 1 - easeQuad(t(p, HERO.copyOut[0], HERO.copyOut[1]));
    el.style.opacity = v.toFixed(3);
    el.style.transform = `translateY(${(-28 * (1 - v)).toFixed(1)}px)`;
    el.style.pointerEvents = v < 0.05 ? "none" : "";
  }, []);
  const settle = useCallback(() => {
    const el = copy.current;
    if (!el) return;
    el.style.opacity = "";
    el.style.transform = "";
    el.style.pointerEvents = "";
  }, []);
  useTrackScrub(track, still, at, settle);

  return (
    <section id="top" data-motif-track="hero" className="relative">
      <div className={styles.track} ref={track}>
        <div className={styles.bg} aria-hidden="true">
          <div className={styles.aura}>
            <iframe
              title="Dark Gold Background – Elegant Header for Modern Websites"
              src="https://aura.promad.design/embed/dark-gold-background-elegant-header-for-modern-websites?hideText=true&hideIcons=true&theme=dark"
              allowFullScreen
            />
          </div>
        </div>
        <div className={styles.stage}>
          <div className={`canvas w-full text-center ${styles.copy}`} ref={copy}>
            <span className={styles.vignette} aria-hidden="true" />
            <h1 className={`h1 enter mx-auto ${styles.h1}`} style={{ animationDelay: "150ms" }}>
              Where crypto compliance continues.
            </h1>
            <p className={`lead enter mx-auto ${styles.lead}`} style={{ animationDelay: "320ms" }}>
              A private network for the people shaping and navigating financial crime, regulation and risk across
              digital assets.
            </p>
            <div className={`enter flex flex-wrap justify-center gap-3 ${styles.ctas}`} style={{ animationDelay: "480ms" }}>
              <a className="btn btn-brass" href={CTA.href}>
                {CTA.label}
              </a>
              <a className="btn btn-ghost-brass" href="#room">
                See what happens inside
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/lib/icons";
import styles from "./Intelligence.module.css";

const ITEMS = [
  { n: "02 · Enforcement", title: "The case that changes how policy may be applied." },
  { n: "03 · Financial crime", title: "The typology teams should brief on now." },
  { n: "04 · Market infrastructure", title: "The development that creates a new control question." },
  { n: "05 · Action", title: "The practical step worth taking this week." },
];

const CONTEXT = [
  { icon: "target", label: "Why it matters", text: "Understand what changed, and why it puts the current operating position in question." },
  { icon: "people", label: "Who is affected", text: "See the teams and functions that this lands on first." },
  { icon: "next", label: "What to do next", text: "Identify the step worth taking before the next reporting cycle." },
] as const;

/** 06 · this week in Vault — the active item follows the scroll, no pin. */
export default function Intelligence() {
  const brief = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = brief.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("article"));
    let cur: HTMLElement | null = null;
    const onScroll = () => {
      const mid = window.innerHeight * 0.42;
      let best: HTMLElement | null = null, bestD = 1e9;
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = it; }
      }
      if (!best || best === cur) return;
      cur = best;
      items.forEach((it) => it.classList.toggle(styles.active, it === best));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="intelligence" className={`section-pad ${styles.intelligence}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#010016">
          <circle cx="1290" cy="200" r="300" strokeOpacity=".05" />
          <circle cx="1290" cy="200" r="470" strokeOpacity=".04" />
          <circle cx="1290" cy="200" r="650" strokeOpacity=".03" />
          <circle cx="1290" cy="200" r="840" strokeOpacity=".022" />
        </g>
        <circle cx="1340" cy="212" r="4" fill="#C3AE87" />
      </svg>
      <div className="canvas relative">
        <div>
          <p className={`eyebrow mb-5 ${styles.eyebrow}`}>This week in Vault</p>
          <h2 className="h2 max-w-[16ch] text-night">Five things every crypto compliance team should care about this week.</h2>
          <div className={styles.meta} role="list" aria-label="Briefing details">
            <span role="listitem">Briefing 047</span>
            <span role="listitem">6 min read</span>
            <span role="listitem">Updated 25 August 2026</span>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.briefCard} ref={brief}>
            <article className={`${styles.bi} ${styles.biLead} ${styles.active}`} data-reveal>
              <span className={styles.biDot} aria-hidden="true" />
              <span className={styles.biRule} aria-hidden="true" />
              <div>
                <p className={styles.biNum}>01 · Regulatory movement</p>
                <h3 className={`${styles.biTitle} ${styles.biTitleLead}`}>The change most likely to affect operating assumptions.</h3>
                <p className={styles.biSum}>
                  Full summary and one recommended action are published openly, so the quality of the work can be judged
                  before anyone asks to join the room.
                </p>
                <div className={styles.biAction}>
                  <span className={styles.biCheck}>
                    <Icon name="check" className="block h-[30px] w-[30px] text-brass-ink" />
                  </span>
                  <div>
                    <p className={styles.biActionLabel}>Recommended action</p>
                    <p className={styles.biActionText}>
                      One practical step, written for the person who has to file it rather than the person who has to present it.
                    </p>
                  </div>
                </div>
              </div>
            </article>
            {ITEMS.map((it) => (
              <article key={it.n} className={styles.bi} data-reveal>
                <span className={styles.biDot} aria-hidden="true" />
                <div>
                  <p className={styles.biNum}>{it.n}</p>
                  <h4 className={styles.biTitle}>{it.title}</h4>
                </div>
                <p className={styles.biLock}>
                  <Icon name="lock" strokeWidth={1.6} className={styles.lk} />
                  <span>
                    Analysis reserved
                    <br />
                    for members
                  </span>
                </p>
              </article>
            ))}
          </div>
          <aside className={styles.ctxCard}>
            <p className={styles.ctxHead}>Decision context</p>
            {CONTEXT.map((c) => (
              <div key={c.label} className={styles.ctxMod}>
                <span className={styles.ctxBadge}>
                  <Icon name={c.icon} className="block h-[21px] w-[21px] text-brass-ink" />
                </span>
                <div>
                  <p className={styles.ctxLabel}>{c.label}</p>
                  <p className={styles.ctxText}>{c.text}</p>
                </div>
              </div>
            ))}
            <a className={styles.cta} href="#">
              Preview the weekly briefing <Icon name="arrow" strokeWidth={1.6} className="h-[19px] w-[19px]" />
            </a>
          </aside>
        </div>
        <p className={styles.foot}>
          <Icon name="lock" strokeWidth={1.6} className={styles.lk} />
          <span>Full analysis reserved for members.</span>
          <a href="#request">
            Request consideration <Icon name="arrow" strokeWidth={1.6} className="h-[19px] w-[19px]" />
          </a>
        </p>
      </div>
    </section>
  );
}

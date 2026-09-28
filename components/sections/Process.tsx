"use client";

import { useEffect, useRef } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import { Icon, type IconName } from "@/lib/icons";
import { easeQuad, t, trackProgress } from "@/lib/scrub";
import styles from "./Process.module.css";

const STEPS: { icon: IconName; num: string; desc: string }[] = [
  { icon: "docEdit", num: "Interest", desc: "Tell us who you are and why the room matters to you now." },
  { icon: "group", num: "Review", desc: "We look at relevance, contribution and who is already at the table." },
  { icon: "chat", num: "Conversation", desc: "A short, personal conversation — sometimes a word from a member." },
  { icon: "door", num: "Invitation", desc: "Selected members receive a personal invitation." },
];
const IN: [number, number][] = [[0.03, 0.11], [0.24, 0.32], [0.45, 0.53], [0.66, 0.74]];
const LINE: [number, number][] = [[0.12, 0.23], [0.33, 0.44], [0.54, 0.65]];

/** 10 · the way in: scrubbed reveal, the connector physically extends as you scroll. */
export default function Process() {
  const still = useStillMedia();
  const seq = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (still === null) return;
    const el = seq.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const parts = steps.map((s) => ({
      badge: s.querySelector<HTMLElement>("[data-badge]")!,
      num: s.querySelector<HTMLElement>("[data-num]")!,
      desc: s.querySelector<HTMLElement>("[data-desc]")!,
      line: s.querySelector<HTMLElement>("[data-line] i"),
    }));

    if (still) {
      parts.forEach((p) => {
        p.badge.style.opacity = "1"; p.badge.style.transform = "none";
        p.num.style.opacity = "1";
        p.desc.style.opacity = "1"; p.desc.style.transform = "none";
        if (p.line) p.line.style.transform = "scaleX(1)";
      });
      return;
    }

    const at = (pr: number) => {
      parts.forEach((p, i) => {
        const v = easeQuad(t(pr, IN[i][0], IN[i][1]));
        p.badge.style.opacity = v.toFixed(3);
        p.badge.style.transform = `scale(${(0.94 + 0.06 * v).toFixed(4)})`;
        p.num.style.opacity = easeQuad(t(pr, IN[i][0] + 0.02, IN[i][1] + 0.03)).toFixed(3);
        p.desc.style.opacity = easeQuad(t(pr, IN[i][0] + 0.04, IN[i][1] + 0.05)).toFixed(3);
        p.desc.style.transform = `translateY(${(8 - 8 * v).toFixed(2)}px)`;
        if (p.line && LINE[i]) p.line.style.transform = `scaleX(${easeQuad(t(pr, LINE[i][0], LINE[i][1])).toFixed(4)})`;
      });
    };
    const onScroll = () => at(trackProgress(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [still]);

  return (
    <section id="process" className={styles.process}>
      <div className={styles.seq} ref={seq}>
        <div className={styles.stage}>
          <svg className={styles.mark} viewBox="0 0 662 827" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g fill="none" stroke="#8A7754" strokeOpacity=".055" strokeWidth="1.4">
              <path d={MONOGRAM.A} />
              <path d={MONOGRAM.B} />
              <path d={MONOGRAM.C} />
              <path d={MONOGRAM.D} />
            </g>
          </svg>
          <div className="canvas relative w-full">
            <p className="eyebrow mb-[22px] text-brass-ink">Membership</p>
            <h2 className="h2 max-w-[12ch] text-night">A considered way in.</h2>
            <div className={styles.steps}>
              {STEPS.map((s, i) => (
                <div key={s.num} className={styles.step} data-step>
                  <div className={styles.head}>
                    <span className={styles.badge} data-badge>
                      <Icon name={s.icon} strokeWidth={1.35} className="h-[30px] w-[30px] text-brass-ink" />
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className={styles.line} aria-hidden="true" data-line>
                        <i />
                      </span>
                    )}
                  </div>
                  <p className={styles.num} data-num>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {s.num}
                  </p>
                  <p className={styles.desc} data-desc>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

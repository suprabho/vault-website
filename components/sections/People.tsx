"use client";

import { useState } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { Icon, type IconName } from "@/lib/icons";
import styles from "./People.module.css";

const SPOKES = [
  [1015.3, 428.7], [972.4, 325.0], [904.1, 235.9], [815.0, 167.6], [711.3, 124.7], [600.0, 110.0],
  [488.7, 124.7], [385.0, 167.6], [295.9, 235.9], [227.6, 325.0], [184.7, 428.7],
];
const ARCS = ["M470 540A130 130 0 0 1 730 540", "M370 540A230 230 0 0 1 830 540", "M270 540A330 330 0 0 1 930 540", "M180 540A420 420 0 0 1 1020 540"];

const NODES: { icon: IconName; from: [number, number]; to: [number, number] }[] = [
  { icon: "exchange", from: [335.1, 399.2], to: [229.2, 342.8] },
  { icon: "bank", from: [507.3, 254.7], to: [470.2, 140.6] },
  { icon: "scales", from: [692.7, 254.7], to: [729.8, 140.6] },
  { icon: "person", from: [864.9, 399.2], to: [970.8, 342.8] },
];

const WHO: { icon: IconName; label: string; text: string }[] = [
  { icon: "exchange", label: "Exchanges & custodians", text: "Trading platforms, custodians and infrastructure providers operating at scale." },
  { icon: "bank", label: "Financial institutions", text: "Banks, brokers and diversified financial institutions navigating digital asset risk." },
  { icon: "scales", label: "Regulators & investigators", text: "Regulators, law enforcement and investigative teams shaping and enforcing standards." },
  { icon: "person", label: "Legal & advisory", text: "Law firms and specialist advisors guiding compliance, governance and strategy." },
];

/** 09 · people: the room as an amphitheatre around the mark. Hovering a constituency lights its seat. */
export default function People() {
  const [lit, setLit] = useState<number | null>(null);

  return (
    <section id="people" className={`c5 ${styles.people}`}>
      <div className="c5-sheet c5-grid" data-reveal>
        <div className={`c5c ${styles.head}`}>
          <span className="c5-lab">09 — Who is in the room</span>
          <h2 className="c5-h2 mt-[22px]" data-reveal>
            <span className="c5-ln"><span>The right room is</span></span>
            <span className="c5-ln"><span>defined by who is in it.</span></span>
          </h2>
        </div>
        <p className={`c5c c5-copy c5-fade d1 ${styles.co}`} data-reveal>
          Vault brings together the people responsible for protecting the digital asset economy — across exchanges,
          financial institutions, investigations, regulation, protocols and specialist advisory work.
        </p>

        <div className={`c5c ${styles.amph}`} data-reveal>
          <svg
            className={styles.amphSvg}
            viewBox="0 0 1200 560"
            preserveAspectRatio="xMidYMax meet"
            role="img"
            aria-label="Four constituencies arranged around the Vault mark: exchanges and custodians, financial institutions, regulators and investigators, legal and advisory."
          >
            <g className={styles.spokes}>
              {SPOKES.map(([x, y]) => (
                <line key={`${x}-${y}`} x1="600" y1="540" x2={x} y2={y} />
              ))}
            </g>
            <g className={styles.arcs}>
              {ARCS.map((d) => (
                <path key={d} className={styles.arc} pathLength={1} d={d} />
              ))}
            </g>
            <g className={styles.markG}>
              <svg x="565" y="464" width="70" height="88" viewBox="0 0 662 827">
                <g fill="none" stroke="#C3AE87" strokeWidth="10" strokeLinejoin="round">
                  <path d={MONOGRAM.A} />
                  <path d={MONOGRAM.B} />
                  <path d={MONOGRAM.C} />
                  <path d={MONOGRAM.D} />
                </g>
              </svg>
            </g>
            {NODES.map((n, i) => (
              <g key={n.icon} className={`${styles.node} ${lit === i ? styles.on : ""}`} style={{ "--i": i } as React.CSSProperties}>
                <line className={styles.nl} pathLength={1} x1={n.from[0]} y1={n.from[1]} x2={n.to[0]} y2={n.to[1]} />
                <circle className={styles.nd} cx={n.from[0]} cy={n.from[1]} r="4" />
                <circle className={styles.nc} cx={n.to[0]} cy={n.to[1]} r="22" />
                <foreignObject x={n.to[0] - 11} y={n.to[1] - 11} width="22" height="22">
                  <div className={styles.nfo}>
                    <Icon name={n.icon} strokeWidth={1.4} className="h-[18px] w-[18px] text-brass" />
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>

        <div className={`c5c ${styles.who}`} data-reveal>
          {WHO.map((w, i) => (
            <div key={w.label} className={styles.wc} onMouseEnter={() => setLit(i)} onMouseLeave={() => setLit(null)}>
              <span className={styles.wi}>
                <Icon name={w.icon} strokeWidth={1.4} className="h-[18px] w-[18px] text-brass" />
              </span>
              <div>
                <span className="c5-lab">{w.label}</span>
                <p>{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useId, useState } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { Icon, type IconName } from "@/lib/icons";
import Lines from "@/components/type/Lines";
import styles from "./People.module.css";

const SPOKES = [
  [1015.3, 428.7], [972.4, 325.0], [904.1, 235.9], [815.0, 167.6], [711.3, 124.7], [600.0, 110.0],
  [488.7, 124.7], [385.0, 167.6], [295.9, 235.9], [227.6, 325.0], [184.7, 428.7],
];
const ARCS = ["M470 540A130 130 0 0 1 730 540", "M370 540A230 230 0 0 1 830 540", "M270 540A330 330 0 0 1 930 540", "M180 540A420 420 0 0 1 1020 540"];

// Connector origins sit on the innermost arc (radius 130, centre 600, 540).
const NODES: { icon: IconName; from: [number, number]; to: [number, number] }[] = [
  { icon: "exchange", from: [485.222, 478.959], to: [229.2, 342.8] },
  { icon: "bank", from: [559.820, 416.365], to: [470.2, 140.6] },
  { icon: "scales", from: [640.180, 416.365], to: [729.8, 140.6] },
  { icon: "person", from: [714.778, 478.959], to: [970.8, 342.8] },
];

const WHO: { icon: IconName; label: string; text: string }[] = [
  { icon: "exchange", label: "Exchanges & custodians", text: "The teams running compliance for platforms and custody at scale." },
  { icon: "bank", label: "Financial institutions", text: "Banks and brokers bringing digital asset risk inside the perimeter." },
  { icon: "scales", label: "Regulators & investigators", text: "The people who set the standard, and the ones who test it." },
  { icon: "person", label: "Legal & advisory", text: "Counsel and specialist advisers on the hardest calls." },
];

/*
 * Social proof. Only add organisations here once their names and marks are approved for
 * use; until then the room is described by the seats it is built for, never by who is in it.
 */
const APPROVED_LOGOS: { name: string; src: string }[] = [];
const SEATS = [
  "Chief Compliance Officers",
  "MLROs",
  "Heads of Financial Crime",
  "Heads of Investigations",
  "Chief Risk Officers",
  "General Counsel",
];

/** 09 · people: the room as an amphitheatre around the mark. Hovering a constituency lights its seat. */
export default function People() {
  const arcMaskId = useId();
  const [lit, setLit] = useState<number | null>(null);

  return (
    <section id="people" className={`c5 ${styles.people}`}>
      <div className="c5-sheet c5-grid" data-reveal>
        <div className={`c5c ${styles.head}`}>
          <h2 className="c5-h2" data-reveal>
            <Lines lines={["The right room is", "defined by who is in it."]} />
          </h2>
        </div>
        <p className={`c5c c5-copy c5-fade d1 ${styles.co}`} data-reveal>
          Senior operators from exchanges, financial institutions, regulators, investigations, legal and advisory
          already sit around the table.
        </p>

        <div className={`c5c ${styles.amph}`} data-reveal>
          <svg
            className={styles.amphSvg}
            viewBox="0 0 1200 560"
            preserveAspectRatio="xMidYMax meet"
            role="img"
            aria-label="Four constituencies arranged around the Vault mark: exchanges and custodians, financial institutions, regulators and investigators, legal and advisory."
          >
            <defs>
              {ARCS.map((d, i) => (
                <mask key={d} id={`${arcMaskId}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="560">
                  <path className={styles.arcReveal} pathLength={1} d={d} style={{ "--arc-delay": `${[100, 260, 420, 580][i]}ms` } as React.CSSProperties} />
                </mask>
              ))}
            </defs>
            <g className={styles.spokes}>
              {SPOKES.map(([x, y]) => (
                <line key={`${x}-${y}`} x1="600" y1="540" x2={x} y2={y} />
              ))}
            </g>
            <g className={styles.arcs}>
              {ARCS.map((d, i) => (
                <path key={d} className={styles.arc} pathLength={1} d={d} mask={`url(#${arcMaskId}-${i})`} />
              ))}
            </g>
            <g className={styles.markG}>
              <svg data-motif-dock="people" x="565" y="464" width="70" height="88" viewBox="0 0 662 827">
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
                <g className={styles.badge} style={{ transformOrigin: `${n.to[0]}px ${n.to[1]}px` }}>
                  <circle className={styles.nc} cx={n.to[0]} cy={n.to[1]} r="22" />
                  <foreignObject x={n.to[0] - 11} y={n.to[1] - 11} width="22" height="22">
                    <div className={styles.nfo}>
                      <Icon name={n.icon} strokeWidth={1.4} className="h-[18px] w-[18px] text-brass" />
                    </div>
                  </foreignObject>
                </g>
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
              <p>{w.text}</p>
            </div>
          ))}
        </div>

        <div className={`c5c c5-fade ${styles.seats}`} data-reveal>
          {APPROVED_LOGOS.length > 0 ? (
            <ul className={styles.logos} aria-label="Organisations represented">
              {APPROVED_LOGOS.map((l) => (
                <li key={l.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={l.name} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.roles}>
              {SEATS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

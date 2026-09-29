"use client";

import type { PointerEvent } from "react";
import { Icon, type IconName } from "@/lib/icons";
import styles from "./CadenceAssets.module.css";

/*
 * Placeholder previews of what each stop in the cadence delivers. They are illustrative only:
 * bars stand in for copy, and nothing names a real case, firm or date. Swap each one for a real
 * screenshot or rendering when the product has one.
 */

/** how far the card leans towards the pointer, in degrees */
const TILT = { x: 10, y: 14 };

/** lean the card towards the pointer and move the glare with it (CSS vars read by the stylesheet) */
function tilt(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--rx", `${((0.5 - y) * TILT.x).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x - 0.5) * TILT.y).toFixed(2)}deg`);
  el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  el.dataset.tilt = "on";
}
function untilt(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  ["--rx", "--ry", "--gx", "--gy"].forEach((v) => el.style.removeProperty(v));
  delete el.dataset.tilt;
}

/**
 * The slot the preview scales to (every size inside is in container units of it): a glass card
 * that floats, and tilts towards the pointer with a glare that follows it.
 */
function Paper({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={styles.frame} onPointerMove={tilt} onPointerLeave={untilt}>
      <div className={styles.float}>
        <div className={`${styles.paper} ${className}`}>{children}</div>
      </div>
    </div>
  );
}

function Kicker({ left, right }: { left: string; right?: string }) {
  return (
    <p className={styles.kicker}>
      <span>{left}</span>
      {right && <span>{right}</span>}
    </p>
  );
}

/** 01 · Monday: the briefing, first item legible, the rest locked */
function Monday() {
  return (
    <Paper>
      <Kicker left="Monday briefing" />
      <p className={styles.title}>Five things worth knowing</p>
      <ol className={styles.rows}>
        <li>
          <span className={styles.item}>Travel Rule exceptions</span>
        </li>
        {[78, 64, 84, 56].map((w) => (
          <li key={w} className={styles.locked}>
            <span className={styles.bar} style={{ width: `${w}%` }} />
            <Icon name="lock" strokeWidth={1.6} className={styles.lock} />
          </li>
        ))}
      </ol>
      <p className={styles.foot}>Members only</p>
    </Paper>
  );
}

/** 02 · As needed: an out-of-cycle signal */
function Signal() {
  return (
    <Paper className={styles.signal}>
      <p className={styles.kicker}>
        <span className={styles.live}>
          <i />
          Signal
        </span>
        <span>Out of cycle</span>
      </p>
      <span className={`${styles.bar} ${styles.head}`} style={{ width: "92%" }} />
      <span className={`${styles.bar} ${styles.head}`} style={{ width: "70%" }} />
      <p className={styles.tags}>
        <span>Enforcement</span>
        <span>Priority</span>
      </p>
      <span className={styles.rule} />
      {[96, 88, 60].map((w) => (
        <span key={w} className={styles.bar} style={{ width: `${w}%` }} />
      ))}
      <p className={styles.foot}>Members only</p>
    </Paper>
  );
}

/** 03 · Monthly: the digest, cases in a table with a quiet tally */
function Digest() {
  return (
    <Paper>
      <Kicker left="Monthly digest" right="Cases" />
      <p className={styles.title}>Worth understanding properly</p>
      <ul className={styles.table}>
        {[72, 58, 80, 48].map((w, i) => (
          <li key={w}>
            <span className={styles.bar} style={{ width: `${w}%` }} />
            <span className={styles.pill}>{["Action", "Fine", "Order", "Guidance"][i]}</span>
          </li>
        ))}
      </ul>
      <svg className={styles.chart} viewBox="0 0 120 32" preserveAspectRatio="none">
        {[10, 18, 13, 24, 16, 28].map((h, i) => (
          <rect key={i} x={i * 20 + 2} y={32 - h} width="14" height={h} rx="1.5" />
        ))}
      </svg>
    </Paper>
  );
}

/** 04 · Quarterly: the outlook, a trend with its projection */
function Outlook() {
  return (
    <Paper>
      <Kicker left="Quarterly outlook" right="Next quarter" />
      <p className={styles.title}>Where it appears to be heading</p>
      <svg className={styles.trend} viewBox="0 0 120 56" preserveAspectRatio="none">
        <path className={styles.grid} d="M0 14H120M0 28H120M0 42H120" />
        <path className={styles.past} d="M0 44C14 42 22 36 34 38S54 26 66 27 80 18 84 18" />
        <path className={styles.ahead} d="M84 18C94 16 104 10 120 6" />
        <circle className={styles.now} cx="84" cy="18" r="2.4" />
      </svg>
      <ul className={styles.legend}>
        {["Regulation", "Enforcement", "Market"].map((l, i) => (
          <li key={l}>
            <span>{l}</span>
            <span className={styles.bar} style={{ width: `${[46, 62, 38][i]}%` }} />
          </li>
        ))}
      </ul>
    </Paper>
  );
}

/** 05 · Always available: the member library */
function Library() {
  const shelves: { icon: IconName; label: string; w: number }[] = [
    { icon: "playbook", label: "Playbooks", w: 70 },
    { icon: "play", label: "Recordings", w: 54 },
    { icon: "radar", label: "Tools", w: 44 },
    { icon: "link", label: "Introductions", w: 62 },
  ];
  return (
    <Paper>
      <Kicker left="Member library" right="Always open" />
      <ul className={styles.shelves}>
        {shelves.map((s) => (
          <li key={s.label}>
            <span className={styles.badge}>
              <Icon name={s.icon} strokeWidth={1.5} />
            </span>
            <span className={styles.shelf}>
              <span className={styles.item}>{s.label}</span>
              <span className={styles.bar} style={{ width: `${s.w}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.foot}>Members only</p>
    </Paper>
  );
}

/** In cadence order: Monday, as needed, monthly, quarterly, always available. */
export const CADENCE_ASSETS = [Monday, Signal, Digest, Outlook, Library];

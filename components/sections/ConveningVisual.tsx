import type { CSSProperties } from "react";
import styles from "./ConveningVisual.module.css";

/** Decorative line drawings share the site's brass dial and arc language. */
export default function ConveningVisual({ variant }: { variant: number }) {
  return (
    <svg className={styles.visual} viewBox="0 0 240 112" fill="none" aria-hidden="true" focusable="false">
      {variant === 0 && <>
        <ellipse className={styles.faint} cx="120" cy="56" rx="100" ry="48" />
        <ellipse className={styles.ink} cx="120" cy="56" rx="70" ry="30" />
        <ellipse className={styles.faint} cx="120" cy="56" rx="59" ry="22" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = i * Math.PI / 6;
          return <circle key={i} className={styles.seat} cx={120 + 88 * Math.cos(a)} cy={56 + 42 * Math.sin(a)} r="3" style={{ "--delay": `${i * -0.5}s` } as CSSProperties} />;
        })}
        <path className={styles.trace} pathLength="1" d="M50 56a70 30 0 1 1 140 0a70 30 0 1 1-140 0" />
        <path d="M112 56h16m-8-8v16" />
        <circle className={styles.faint} cx="120" cy="56" r="13" />
      </>}
      {variant === 1 && <>
        <path className={styles.faint} d="M30 87a90 74 0 0 1 180 0M49 87a71 57 0 0 1 142 0" />
        <g className={styles.sun}>
          <path className={styles.ink} d="M84 78a36 36 0 0 1 72 0" />
          <path d="M120 20v10m-41 6 7 7m68 0 7-7M66 67l10 2m88 0 10-2" />
          <path className={styles.trace} pathLength="1" d="M84 78a36 36 0 0 1 72 0" />
        </g>
        <path d="M24 87h192" />
        <path className={styles.faint} d="M55 95h130M88 103h64" />
        <circle className={styles.dot} cx="120" cy="87" r="3" />
      </>}
      {variant === 2 && <>
        <path className={styles.faint} d="M18 56h51m102 0h51M120 5v12m0 78v12" />
        <circle className={styles.faint} cx="120" cy="56" r="47" />
        <circle className={styles.ink} cx="120" cy="56" r="34" />
        <g className={styles.orbit}>
          <path d="M73 56a47 47 0 0 1 47-47m47 47a47 47 0 0 1-47 47" />
          <circle className={styles.dot} cx="120" cy="9" r="3" />
          <circle className={styles.dot} cx="120" cy="103" r="3" />
        </g>
        <path d="M110 53v-8a10 10 0 0 1 20 0v8" />
        <rect className={styles.ink} x="105" y="53" width="30" height="23" rx="3" />
        <circle className={styles.dot} cx="120" cy="63" r="2" />
        <path d="M120 65v5" />
      </>}
    </svg>
  );
}

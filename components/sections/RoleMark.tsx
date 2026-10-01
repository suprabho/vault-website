import type { ReactNode } from "react";
import styles from "./RoleMark.module.css";

/*
 * One mark per seat in the seating plan. Every role is a seat, so every mark is the same outer
 * circle; what sits inside it is drawn only from triangles, circles and dots, the shapes of the
 * standard's seal. An upward triangle is oversight, a downward one a reporting line, a dot the
 * point someone answers for. All on a 32 × 32 grid around (16, 16).
 */

/** an equilateral triangle inscribed in a circle of radius r about (cx, cy); up or down */
function tri(r: number, up = true, cx = 16, cy = 16) {
  const s = up ? 1 : -1;
  const dx = r * Math.cos(Math.PI / 6), dy = r / 2;
  return `M${cx} ${cy - s * r}L${(cx + dx).toFixed(2)} ${cy + s * dy}L${(cx - dx).toFixed(2)} ${cy + s * dy}Z`;
}

const MARKS = {
  /** oversight, with the dot at its apex: the person the programme answers to */
  cco: (
    <>
      <path d={tri(9)} />
      <circle className={styles.dot} cx="16" cy="7" r="1.7" />
    </>
  ),
  /** the reporting line runs down to one point */
  mlro: (
    <>
      <path d={tri(9, false)} />
      <circle className={styles.dot} cx="16" cy="25" r="1.7" />
    </>
  ),
  /** the target held inside the frame of controls */
  finCrime: (
    <>
      <path d={tri(9)} />
      <circle cx="16" cy="16" r="2.8" />
      <circle className={styles.dot} cx="16" cy="16" r="0.9" />
    </>
  ),
  /** three weighed corners, as on the seal */
  risk: (
    <>
      <path d={tri(9)} />
      <circle className={styles.dot} cx="16" cy="7" r="1.5" />
      <circle className={styles.dot} cx="23.79" cy="20.5" r="1.5" />
      <circle className={styles.dot} cx="8.21" cy="20.5" r="1.5" />
    </>
  ),
  /** the authority at the centre of a watching ring */
  supervisor: (
    <>
      <circle cx="16" cy="16" r="7.5" />
      <path className={styles.fill} d={tri(3.6)} />
    </>
  ),
  /** a lens, and the point it is turned towards */
  investigations: (
    <>
      <circle cx="14.2" cy="14.2" r="5.4" />
      <path className={styles.fill} d="M19.4 21.6 21.6 19.4 24 24Z" />
    </>
  ),
  /** two pans over a fulcrum */
  counsel: (
    <>
      <path d="M16 14.6 19.6 21.4H12.4Z" />
      <circle cx="9.6" cy="13" r="2.8" />
      <circle cx="22.4" cy="13" r="2.8" />
    </>
  ),
  /** two circles that share their middle */
  partner: (
    <>
      <circle cx="13" cy="16" r="5.4" />
      <circle cx="19" cy="16" r="5.4" />
      <path className={styles.fill} d={tri(1.6, true, 16, 16.4)} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type RoleName = keyof typeof MARKS;

export default function RoleMark({ role, className = "" }: { role: RoleName; className?: string }) {
  return (
    <svg className={`${styles.mark} ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle className={styles.seat} cx="16" cy="16" r="14.2" />
      {MARKS[role]}
    </svg>
  );
}

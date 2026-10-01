import { MONOGRAM, MONOGRAM_FULL } from "@/components/brand/monogram";
import type { AssetMotif } from "@/lib/briefing";
import styles from "./AssetBackdrop.module.css";

/*
 * The deep-blue ground behind a briefing card's visual, composed from the site's own motifs:
 * a cropped monogram piece, the concentric rings the sections use, the seal's triangle and
 * dots, and the cream ellipse. Drawn on a 400 × 240 frame and cropped to the thumbnail
 * (`slice`), so the same composition reads in a wide lead and a narrow card. The glass
 * objects of the visual sit over it and blur what is behind them.
 */

type Composition = {
  /** a monogram piece (or the whole mark) and where it sits, as an SVG transform */
  piece?: { d: string; t: string };
  /** concentric rings about a point */
  rings?: { cx: number; cy: number; from: number; step: number };
  /** the seal: a circle with an upward triangle inscribed and a dot at each corner */
  seal?: { cx: number; cy: number; r: number };
  /** the cream ellipse */
  ellipse?: { cx: number; cy: number; rx: number; ry: number };
  /** a soft brass light the glass catches */
  glow: { cx: number; cy: number; r: number };
};

const COMPOSITIONS: Record<AssetMotif, Composition> = {
  arc: {
    piece: { d: MONOGRAM.A, t: "translate(176 -26) scale(0.74)" },
    rings: { cx: 392, cy: 250, from: 60, step: 52 },
    glow: { cx: 330, cy: 70, r: 70 },
  },
  gate: {
    piece: { d: MONOGRAM.B, t: "translate(-150 -36) scale(0.92)" },
    glow: { cx: 120, cy: 200, r: 80 },
    rings: { cx: 40, cy: 240, from: 50, step: 46 },
  },
  hook: {
    piece: { d: MONOGRAM.C, t: "translate(-10 -300) scale(0.74)" },
    seal: { cx: 318, cy: 92, r: 54 },
    glow: { cx: 80, cy: 60, r: 70 },
  },
  bowl: {
    piece: { d: MONOGRAM.D, t: "translate(56 -232) scale(0.6)" },
    rings: { cx: 30, cy: 20, from: 44, step: 40 },
    glow: { cx: 300, cy: 180, r: 80 },
  },
  rings: {
    rings: { cx: 360, cy: 36, from: 40, step: 48 },
    glow: { cx: 360, cy: 36, r: 60 },
  },
  seal: {
    seal: { cx: 290, cy: 128, r: 108 },
    rings: { cx: 290, cy: 128, from: 136, step: 40 },
    glow: { cx: 120, cy: 190, r: 70 },
  },
  ellipse: {
    ellipse: { cx: 250, cy: 126, rx: 170, ry: 118 },
    piece: { d: MONOGRAM_FULL, t: "translate(196 30) scale(0.23)" },
    glow: { cx: 60, cy: 40, r: 60 },
  },
};

/** an equilateral triangle inscribed in a circle, apex up, and its three corners */
function triangle(cx: number, cy: number, r: number) {
  const dx = r * Math.cos(Math.PI / 6), dy = r / 2;
  const pts = [[cx, cy - r], [cx + dx, cy + dy], [cx - dx, cy + dy]].map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  return { d: `M${pts.map((p) => p.join(" ")).join("L")}Z`, pts };
}

export default function AssetBackdrop({ motif, uid }: { motif: AssetMotif; uid: string }) {
  const c = COMPOSITIONS[motif];
  const id = `bd-${uid.replace(/[^\w-]/g, "")}`;
  const tri = c.seal && triangle(c.seal.cx, c.seal.cy, c.seal.r);
  return (
    <svg className={styles.backdrop} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-ground`} cx="0.82" cy="0.08" r="1.05">
          <stop offset="0" stopColor="#1f1d58" />
          <stop offset="0.55" stopColor="#0c0b33" />
          <stop offset="1" stopColor="#050420" />
        </radialGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C3AE87" stopOpacity="0.62" />
          <stop offset="0.6" stopColor="#C3AE87" stopOpacity="0.16" />
          <stop offset="1" stopColor="#C3AE87" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={`${id}-oval`}>
          <stop offset="0" stopColor="#f2f1f3" stopOpacity="0.2" />
          <stop offset="1" stopColor="#f2f1f3" stopOpacity="0.03" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>

      <rect width="400" height="240" fill={`url(#${id}-ground)`} />
      <circle cx={c.glow.cx} cy={c.glow.cy} r={c.glow.r} fill="#C3AE87" opacity="0.4" filter={`url(#${id}-soft)`} />

      <g className={styles.drift}>
        {c.ellipse && (
          <ellipse cx={c.ellipse.cx} cy={c.ellipse.cy} rx={c.ellipse.rx} ry={c.ellipse.ry} fill={`url(#${id}-oval)`} stroke="#f2f1f3" strokeOpacity="0.14" />
        )}
        {c.rings && (
          <g fill="none" stroke="#C3AE87">
            {[0.34, 0.24, 0.16, 0.1, 0.06].map((o, i) => (
              <circle key={i} cx={c.rings!.cx} cy={c.rings!.cy} r={c.rings!.from + i * c.rings!.step} strokeOpacity={o} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        )}
        {c.piece && (
          <g transform={c.piece.t}>
            <path d={c.piece.d} fill={`url(#${id}-fill)`} />
            <path d={c.piece.d} fill="none" stroke="#C3AE87" strokeOpacity="0.7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>
        )}
        {c.seal && tri && (
          <g fill="none" stroke="#C3AE87" strokeOpacity="0.55" vectorEffect="non-scaling-stroke">
            <circle cx={c.seal.cx} cy={c.seal.cy} r={c.seal.r} vectorEffect="non-scaling-stroke" />
            <path d={tri.d} fill={`url(#${id}-fill)`} vectorEffect="non-scaling-stroke" />
            {tri.pts.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" fill="#C3AE87" stroke="none" />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

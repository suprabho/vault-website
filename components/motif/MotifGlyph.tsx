import { useId } from "react";
import { MONOGRAM, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";

type Props = {
  className?: string;
  /** fill A, C and D with the photographs and B with brass, as the choreography does at its peak */
  photos?: boolean;
  title?: string;
};

const PIECES = ["A", "B", "C", "D"] as const;
const STROKE = { fill: "none", stroke: "#C3AE87", strokeWidth: 1, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };

/**
 * The monogram as a static picture — the still-mode stand-in for the motif layer
 * (narrow viewports and reduced motion), and a plain outline anywhere else.
 */
export default function MotifGlyph({ className, photos = false, title }: Props) {
  const id = useId();
  return (
    <svg
      className={className}
      viewBox={MONOGRAM_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {photos && (
        <>
          <defs>
            <clipPath id={`${id}A`} clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.A} /></clipPath>
            <clipPath id={`${id}C`} clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.C} /></clipPath>
            <clipPath id={`${id}D`} clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.D} /></clipPath>
          </defs>
          <g clipPath={`url(#${id}A)`}>
            <path d={MONOGRAM.A} fill="#0b0a17" />
            <image x="-6" y="-11" width="370" height="405" preserveAspectRatio="xMidYMid slice" href="/images/private-dinner.webp" />
          </g>
          <g clipPath={`url(#${id}C)`}>
            <path d={MONOGRAM.C} fill="#0b0a17" />
            <image x="-3" y="430" width="248" height="374" preserveAspectRatio="xMidYMid slice" href="/images/roundtable.webp" />
          </g>
          <g clipPath={`url(#${id}D)`}>
            <path d={MONOGRAM.D} fill="#0b0a17" />
            <image x="269" y="381" width="396" height="449" preserveAspectRatio="xMidYMid slice" href="/images/executive-breakfast.webp" />
          </g>
          <path d={MONOGRAM.B} fill="#C3AE87" />
        </>
      )}
      {PIECES.map((k) => (
        <path key={k} d={MONOGRAM[k]} {...STROKE} />
      ))}
    </svg>
  );
}

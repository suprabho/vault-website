import { useId } from "react";
import { MONOGRAM, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";

type Props = {
  className?: string;
  /** a photograph to fill the whole mark with, as the Signals stage does at each theme and in the room */
  photo?: string;
  title?: string;
};

const PIECES = ["A", "B", "C", "D"] as const;
const STROKE = { fill: "none", stroke: "#C3AE87", strokeWidth: 1, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };

/**
 * The monogram as a static picture — the still-mode stand-in for the motif layer and the
 * Signals stage (narrow viewports and reduced motion), and a plain outline anywhere else.
 */
export default function MotifGlyph({ className, photo, title }: Props) {
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
      {photo && (
        <>
          <defs>
            <clipPath id={id} clipPathUnits="userSpaceOnUse">
              {PIECES.map((k) => (
                <path key={k} d={MONOGRAM[k]} />
              ))}
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`}>
            <rect width="662" height="827" fill="#0b0a17" />
            <image width="662" height="827" preserveAspectRatio="xMidYMid slice" href={photo} />
          </g>
        </>
      )}
      {PIECES.map((k) => (
        <path key={k} d={MONOGRAM[k]} {...STROKE} />
      ))}
    </svg>
  );
}

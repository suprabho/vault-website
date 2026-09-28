import MotifGlyph from "@/components/motif/MotifGlyph";
import Lines from "@/components/type/Lines";
import RhythmPath from "./RhythmPath";
import styles from "./Between.module.css";

/** weeks in a quarter: each stop lights the weeks it lands on */
const WEEKS = 13;

type Stop = {
  n: string;
  when: string;
  what: string;
  /** lit weeks out of WEEKS, or "all" drawn as one continuous line */
  beat: number[] | "always";
  c: string;
  o: string;
  last?: boolean;
};

const RHYTHM: Stop[] = [
  { n: "01", when: "Monday", what: "Five things worth knowing before the week starts.", beat: Array.from({ length: WEEKS }, (_, i) => i), c: "1 / span 3", o: "0" },
  { n: "02", when: "As needed", what: "The regulatory or enforcement signal that cannot wait until Monday.", beat: [1, 5, 6, 10], c: "5 / span 3", o: "72px" },
  { n: "03", when: "Monthly", what: "The cases, decisions and developments worth understanding properly.", beat: [4, 8, 12], c: "9 / span 3", o: "24px" },
  { n: "04", when: "Quarterly", what: "Where regulation, enforcement and the market appear to be heading next.", beat: [12], c: "3 / span 3", o: "0" },
  { n: "05", when: "Always available", what: "Playbooks, recordings, tools and trusted introductions.", beat: "always", c: "7 / span 6", o: "40px", last: true },
];

/** the cadence of one stop across a quarter, as a row of week ticks */
function Beat({ beat }: { beat: Stop["beat"] }) {
  const gap = 10;
  const w = (WEEKS - 1) * gap + 1;
  return (
    <svg className={styles.beat} viewBox={`0 0 ${w} 14`} width={w} height="14" aria-hidden="true">
      {beat === "always" ? (
        <path d={`M0.5 7H${w - 0.5}`} className={styles.beatOn} />
      ) : (
        Array.from({ length: WEEKS }, (_, i) => {
          const on = beat.includes(i);
          const x = i * gap + 0.5;
          return <path key={i} d={on ? `M${x} 1V13` : `M${x} 5V9`} className={on ? styles.beatOn : styles.beatOff} />;
        })
      )}
    </svg>
  );
}

/** 05 · the mark arrives upright at the right of the headline (motif layer), then the cadence follows. */
export default function Between() {
  return (
    <section id="between" data-motif-track="between" className={`c5 ${styles.between}`}>
      <MotifGlyph className={styles.stillGlyph} />
      <div className="c5-sheet c5-grid" data-reveal>
        <div className={`c5c ${styles.head}`}>
          <span className="c5-lab">05 — Between the rooms</span>
          <h2 className="c5-h2 mt-[22px]" data-reveal>
            <Lines lines={["Membership should make", "the working week easier."]} />
          </h2>
        </div>
        <RhythmPath className={`c5c ${styles.rhy}`} pathClassName={styles.rhyPath} data-reveal>
          {RHYTHM.map((r) => (
            <div
              key={r.n}
              className={`${styles.rm} ${r.last ? styles.rmLast : ""}`}
              style={{ "--c": r.c, "--o": r.o } as React.CSSProperties}
            >
              <span className={styles.rmN} data-marker>
                <i />
                {r.n}
              </span>
              <span className="c5-lab">{r.when}</span>
              <Beat beat={r.beat} />
              <p>{r.what}</p>
            </div>
          ))}
        </RhythmPath>
      </div>
    </section>
  );
}

import RhythmPath from "./RhythmPath";
import styles from "./Between.module.css";

const RHYTHM = [
  { n: "01", when: "Monday", what: "Five things that matter this week.", c: "1 / span 3", o: "0" },
  { n: "02", when: "As needed", what: "High-priority regulatory or enforcement signal.", c: "5 / span 3", o: "72px" },
  { n: "03", when: "Monthly", what: "Enforcement digest and practical interpretation.", c: "9 / span 3", o: "24px" },
  { n: "04", when: "Quarterly", what: "Market and policy outlook.", c: "3 / span 3", o: "0" },
  { n: "05", when: "Always available", what: "Playbooks, recordings, tools and trusted introductions.", c: "7 / span 6", o: "40px", last: true },
];

export default function Between() {
  return (
    <section id="between" className={`c5 ${styles.between}`}>
      <div className="c5-sheet c5-grid" data-reveal>
        <div className={`c5c ${styles.head}`}>
          <span className="c5-lab">05 — Between the rooms</span>
          <h2 className="c5-h2 mt-[22px]" data-reveal>
            <span className="c5-ln"><span>Membership should make</span></span>
            <span className="c5-ln"><span>the working week easier.</span></span>
          </h2>
        </div>
        <p className={`c5c c5-copy c5-fade d1 ${styles.co}`} data-reveal>
          Vault filters regulatory movement, enforcement, financial crime developments and practical implementation
          questions into the context members need to make decisions. The purpose is simple: reduce noise, uncertainty
          and duplicated work.
        </p>
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
              <p>{r.what}</p>
            </div>
          ))}
        </RhythmPath>
        <div className={`c5c c5-fade ${styles.promiseWrap}`} data-reveal>
          <span className={styles.promiseRule} aria-hidden="true" />
          <p className={styles.promise}>Every week, Vault should save members time or help them act with more confidence.</p>
        </div>
      </div>
    </section>
  );
}

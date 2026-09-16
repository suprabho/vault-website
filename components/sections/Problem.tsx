import { MONOGRAM, MONOGRAM_FULL } from "@/components/brand/monogram";
import styles from "./Problem.module.css";

const SIGNALS = [
  { n: "01", name: "Regulation", desc: "Policy updates and rulemaking across key jurisdictions.", viewBox: "0 -10 362 402", d: MONOGRAM.A, delay: "" },
  { n: "02", name: "Enforcement", desc: "Actions and priorities from global enforcement bodies.", viewBox: "392 0 270 340", d: MONOGRAM.B, delay: "d1" },
  { n: "03", name: "Financial crime", desc: "Emerging typologies and risk patterns to monitor.", viewBox: "0 432 242 368", d: MONOGRAM.C, delay: "d2", active: true },
  { n: "04", name: "Market infrastructure", desc: "Infrastructure shifts shaping the digital asset ecosystem.", viewBox: "270 382 392 446", d: MONOGRAM.D, delay: "d3" },
  { n: "05", name: "Action", desc: "What it means for your team and what to do next.", viewBox: "0 0 662 827", d: MONOGRAM_FULL, delay: "d3" },
];

export default function Problem() {
  return (
    <section id="problem" className={`c5 light-c5 ${styles.problem}`}>
      <div className="c5-sheet c5-grid" data-reveal>
        <div className={`c5c ${styles.head}`}>
          <span className="c5-lab">02 — The problem</span>
          <h2 className="c5-h2 mt-[22px]" data-reveal>
            <span className="c5-ln"><span>Crypto compliance</span></span>
            <span className="c5-ln"><span>does not wait for</span></span>
            <span className="c5-ln"><span>the next conference.</span></span>
          </h2>
        </div>
        <p className={`c5c c5-copy c5-fade d1 ${styles.side}`} data-reveal>
          Rules shift across jurisdictions. Enforcement changes the meaning of yesterday&apos;s guidance. New typologies
          appear before most teams have time to process the last one. The information exists. The difficulty is knowing
          what matters, what it changes and what to do next.
        </p>
        <div className={`c5c ${styles.ledger}`}>
          {SIGNALS.map((s) => (
            <div key={s.n} className={`${styles.row} c5-fade ${s.delay} ${s.active ? styles.active : ""}`} data-reveal>
              <span className={styles.n}>{s.n}</span>
              <span className={styles.nm}>{s.name}</span>
              <span className={styles.ds}>{s.desc}</span>
              <span className={styles.pt}>
                <svg viewBox={s.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  <path className="ap" d={s.d} fill="none" stroke="#8A7754" strokeWidth="4" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
        <p className={`c5c c5-fade ${styles.claim}`} data-reveal>
          Vault turns movement into context.
        </p>
      </div>
    </section>
  );
}

import { Icon } from "@/lib/icons";
import styles from "./Membership.module.css";

const BUILT_FOR = [
  "Senior compliance and AML leaders",
  "Financial crime and investigations teams",
  "Risk leaders",
  "Relevant digital asset operators and advisers",
  "People willing to contribute, not only consume",
];
const NOT_FOR = [
  "Mass prospecting",
  "Directory extraction",
  "Status without contribution",
  "Public attribution of private discussions",
  "Pay-to-play access",
];

/** 09 · the standard */
export default function Membership() {
  return (
    <section id="membership" className="section-pad light-2">
      <div className="canvas">
        <div className={`reveal ${styles.head}`} data-reveal>
          <p className="eyebrow mb-6 text-[#7A6A48]">The standard</p>
          <h2 className={`h2 ${styles.h2}`}>Not open to everyone. Built for the people who carry the responsibility.</h2>
          <p className={styles.lead}>
            Vault is for people directly responsible for the decisions, controls and investigations shaping digital asset
            compliance.
          </p>
        </div>

        <div className={`reveal ${styles.cols}`} data-reveal>
          <div>
            <h3 className={styles.colHead}>Built for</h3>
            <ul className={styles.list}>
              {BUILT_FOR.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`${styles.colHead} ${styles.mutedHead}`}>Not built for</h3>
            <ul className={`${styles.list} ${styles.not}`}>
              {NOT_FOR.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`reveal ${styles.trust}`} data-reveal>
          <Icon name="shieldCheck" strokeWidth={1.3} className={styles.trustIcon} />
          <p>No sponsorship, payment or commercial relationship buys a seat in the room.</p>
        </div>
        <p className={styles.links}>
          <a href="/code-of-conduct">Code of Conduct</a>
          <a href="/privacy">Privacy</a>
        </p>
      </div>
    </section>
  );
}

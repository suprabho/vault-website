import { Icon, type IconName } from "@/lib/icons";
import { MONOGRAM_FULL } from "@/components/brand/monogram";
import styles from "./Membership.module.css";

const BUILT_FOR: { icon: IconName; title: string; text: string }[] = [
  { icon: "shieldCheck", title: "Carry the responsibility", text: "Senior compliance, AML, financial crime, investigations and risk leaders." },
  { icon: "peopleSm", title: "Bring relevant expertise", text: "Operators and advisers with directly relevant digital asset expertise." },
  { icon: "chat", title: "Contribute to the room", text: "People willing to contribute context, not only consume it." },
  { icon: "lockKey", title: "Protect the conversation", text: "Members who respect confidentiality and considered introductions." },
];
const NOT_FOR: { icon: IconName; text: string }[] = [
  { icon: "xCircle", text: "Unsolicited selling, mass prospecting or extracting the member directory." },
  { icon: "personOff", text: "Status without contribution." },
  { icon: "eyeOff", text: "Public attribution of private discussions without permission." },
  { icon: "cartOff", text: "Admission purchased through sponsorship or a commercial relationship." },
];

/** 10 · the standard */
export default function Membership() {
  return (
    <section id="membership" className={`section-pad light-2 ${styles.section}`} aria-labelledby="membership-title">
      <div className="canvas">
        <div className={styles.intro}>
          <div className="reveal" data-reveal>
            <p className={`eyebrow ${styles.eyebrow}`}>The standard</p>
            <h2 id="membership-title" className={styles.heading}>Not open to everyone.<br />Built for the people who carry the responsibility.</h2>
            <p className={styles.description}>
              Vault is designed for professionals with meaningful responsibility for compliance, financial crime,
              investigations, regulation or risk in digital assets. Membership is based on relevance, contribution and
              the composition of the room.
            </p>
          </div>
          <div className={`${styles.seal} reveal`} data-reveal>
            <svg viewBox="0 0 440 400" className={styles.sealDrawing} aria-hidden="true">
              <circle cx="220" cy="200" r="158" className={styles.outerRing} />
              <circle cx="220" cy="200" r="137" className={styles.dottedRing} />
              <path d="M220 42 357 279H83Z" className={styles.triangle} />
              <circle cx="220" cy="200" r="88" className={styles.innerRing} />
              <circle cx="220" cy="200" r="76" className={styles.innerRule} />
              <svg x="192" y="153" width="56" height="70" viewBox="0 0 662 827">
                <path d={MONOGRAM_FULL} fill="none" stroke="#c3ae87" strokeWidth="10" />
              </svg>
              <text x="220" y="249" textAnchor="middle" className={styles.sealWord}>VAULT</text>
              <circle cx="220" cy="42" r="5" className={styles.dot} />
              <circle cx="357" cy="279" r="5" className={styles.dot} />
              <circle cx="83" cy="279" r="5" className={styles.dot} />
            </svg>
            <span className={`${styles.sealLabel} ${styles.relevance}`}>01 / Relevance</span>
            <span className={`${styles.sealLabel} ${styles.contribution}`}>02 / Contribution</span>
            <span className={`${styles.sealLabel} ${styles.confidence}`}>03 / Trust</span>
            <p className={styles.sealCaption}>A considered room. A shared standard.</p>
          </div>
        </div>

        <div className={styles.panels}>
          <div className={`${styles.builtPanel} reveal`} data-reveal>
            <div className={styles.panelHeader}>
              <h3>Built for</h3><Icon name="check" className={styles.headerIcon} />
            </div>
            <ul className={styles.cards}>
              {BUILT_FOR.map((item, index) => (
                <li key={item.title} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}><Icon name={item.icon} strokeWidth={1.3} /></span>
                    <span className={styles.number}>0{index + 1}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.boundaries} reveal`} data-reveal>
            <div className={styles.panelHeader}>
              <h3>Not built for</h3><Icon name="xCircle" className={styles.headerIcon} />
            </div>
            <p className={styles.boundaryIntro}>Clear boundaries protect the room.</p>
            <ul className={styles.exclusions}>
              {NOT_FOR.map((item) => (
                <li key={item.text}><Icon name={item.icon} strokeWidth={1.3} /><span>{item.text}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.trust}>
          <Icon name="shieldCheck" strokeWidth={1.35} />
          <div><p className={styles.trustLabel}>Trust statement</p>
            <p className={styles.trustText}>Payment, sponsorship or a commercial relationship with Merkle Science does not guarantee membership.</p>
          </div>
          <p className={styles.links}><a href="#">Code of Conduct</a><a href="#">Privacy</a></p>
        </div>
      </div>
    </section>
  );
}

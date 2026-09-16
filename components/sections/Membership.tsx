import { Icon, type IconName } from "@/lib/icons";
import styles from "./Membership.module.css";

const BUILT_FOR: { icon: IconName; text: string }[] = [
  { icon: "targetSm", text: "Senior compliance, AML, financial crime, investigations and risk leaders." },
  { icon: "peopleSm", text: "Operators and advisers with directly relevant digital asset expertise." },
  { icon: "nextSm", text: "People willing to contribute context, not only consume it." },
  { icon: "lockKey", text: "Members who respect confidentiality and considered introductions." },
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
    <section id="membership" className="section-pad light-2">
      <div className="canvas grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="reveal lg:col-span-5" data-reveal>
          <p className="eyebrow mb-6 text-[#7A6A48]">The standard</p>
          <h2 className="h2">Not open to everyone. Built for the people who carry the responsibility.</h2>
          <p className="body mt-8 text-on-light-2">
            Vault is designed for professionals with meaningful responsibility for compliance, financial crime,
            investigations, regulation or risk in digital assets. Membership is based on relevance, contribution and
            the composition of the room.
          </p>
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7" data-reveal>
          <h3 className="h4 mb-5">Built for</h3>
          <ul className={styles.std}>
            {BUILT_FOR.map((i) => (
              <li key={i.text}>
                <span className={styles.badge}>
                  <Icon name={i.icon} strokeWidth={1.35} className="h-[19px] w-[19px] text-brass-ink" />
                </span>
                <span>{i.text}</span>
              </li>
            ))}
          </ul>
          <h3 className="h4 mb-5 mt-10 text-[#6E6C7E]">Not built for</h3>
          <ul className={`${styles.std} ${styles.muted}`}>
            {NOT_FOR.map((i) => (
              <li key={i.text}>
                <span className={styles.badge}>
                  <Icon name={i.icon} strokeWidth={1.35} className="h-[19px] w-[19px] text-brass-ink" />
                </span>
                <span>{i.text}</span>
              </li>
            ))}
          </ul>
          <div className={styles.trust}>
            <span className={styles.badge}>
              <Icon name="shieldCheck" strokeWidth={1.35} className="h-[19px] w-[19px] text-brass-ink" />
            </span>
            <div>
              <p className={styles.trustLabel}>Trust statement</p>
              <p className={styles.trustText}>
                Payment, sponsorship or a commercial relationship with Merkle Science does not guarantee membership.
              </p>
            </div>
          </div>
          <p className="meta mt-4 text-[#7A6A48]">
            <a href="#" className="underline">Code of Conduct</a> &nbsp; <a href="#" className="underline">Privacy</a>
          </p>
        </div>
      </div>
    </section>
  );
}

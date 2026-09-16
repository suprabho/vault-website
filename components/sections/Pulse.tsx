import { Icon } from "@/lib/icons";
import styles from "./Pulse.module.css";

const ROWS = [
  { n: "01", label: "Latest briefing", title: "Five things every crypto compliance team should care about this week", meta: [{ icon: "calendar", text: "25 Aug 2026" }] },
  { n: "02", label: "Next convening", title: "Private dinner — institutional custody exposure", meta: [{ icon: "pin", text: "Singapore" }, { text: "September" }] },
  { n: "03", label: "New playbook", title: "Travel Rule exceptions: a defensible handling standard", meta: [{ icon: "calendar", text: "21 Aug 2026" }] },
] as const;

/** 08 · vault pulse */
export default function Pulse() {
  return (
    <section id="pulse" className="section-pad relative overflow-hidden bg-night">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#C3AE87">
          <circle cx="1080" cy="120" r="230" strokeOpacity=".22" />
          <circle cx="1080" cy="120" r="360" strokeOpacity=".16" />
          <circle cx="1080" cy="120" r="500" strokeOpacity=".11" />
          <circle cx="1080" cy="120" r="650" strokeOpacity=".07" />
          <circle cx="1080" cy="120" r="810" strokeOpacity=".05" />
        </g>
      </svg>
      <div className="canvas relative">
        <p className="eyebrow reveal mb-[22px] text-brass" data-reveal>Vault pulse</p>
        <h2 className="h2 reveal max-w-[16ch]" data-reveal>A network should feel alive before you enter it.</h2>

        <div className={`reveal ${styles.board}`} data-reveal>
          <span className={styles.tick} aria-hidden="true" />
          <span className={styles.line} aria-hidden="true" />
          <ol className={styles.list}>
            {ROWS.map((r) => (
              <li key={r.n} className={styles.row}>
                <span className={styles.node} aria-hidden="true" />
                <span className={styles.num}>{r.n}</span>
                <div>
                  <p className={styles.label}>{r.label}</p>
                  <h3 className={styles.title}>{r.title}</h3>
                </div>
                <div className={styles.meta}>
                  {r.meta.map((m, i) =>
                    "icon" in m ? (
                      <span key={m.text} className="contents">
                        <Icon name={m.icon} strokeWidth={1.4} className="h-5 w-5 text-brass" />
                        <p className={styles.meta1}>{m.text}</p>
                      </span>
                    ) : (
                      <p key={m.text} className={i === 0 ? styles.meta1 : styles.meta2}>{m.text}</p>
                    ),
                  )}
                </div>
                <span className={styles.go}>
                  <Icon name="arrowLong" className={styles.arrow} />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className={`reveal ${styles.note}`} data-reveal>
          <Icon name="shield" strokeWidth={1.4} className="mt-0.5 h-5 w-5 flex-none text-brass" />
          <span>
            City, month and format only. Venue and attendees are never exposed publicly.
            <br />
            Rows hide automatically when stale.
          </span>
        </p>
      </div>
    </section>
  );
}

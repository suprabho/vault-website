import { MONOGRAM_FULL, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";
import { Icon, type IconName } from "@/lib/icons";
import { LEAD } from "@/lib/briefing";
import styles from "./Pulse.module.css";

/*
 * What is open inside Vault right now. City and format only for convenings: venues and
 * guests are never published. Update these three when the briefing, table or resource changes.
 */
const TABLE: { title: string; text: string; details: { icon: IconName; label: string }[] } = {
  title: "Private dinner, London",
  text: "One conversation around where crypto enforcement is heading next.",
  /** the setting, never the venue */
  details: [
    { icon: "lamp", label: "Private dining room" },
    { icon: "convening", label: "Twelve seats" },
    { icon: "chef", label: "Chef-led table" },
    { icon: "doorClosed", label: "Closed door" },
  ],
};
const RESOURCE = {
  title: "Transaction Monitoring Control Pack",
  text: "A plug-and-play framework for reviewing crypto transaction monitoring coverage.",
  meta: ["Playbook", "Template + checklist"],
  /** the pack's contents, shown as a checklist: the first two legible, the rest out of focus */
  contents: ["Coverage map by product and chain", "Scenario-to-typology matrix", "Threshold tuning log", "Alert quality review", "Board reporting template"],
};

/** twelve seats around an oval table, drawn over the photograph */
const SEATS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return [60 + 50 * Math.cos(a), 34 + 24 * Math.sin(a)] as const;
});

/** 07 · vault pulse: the next table carries the window, with this week's briefing and the newest resource beside it. */
export default function Pulse() {
  return (
    <section id="pulse" className="section-pad relative overflow-hidden bg-night">
      <svg data-motif-field className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#C3AE87">
          <circle cx="1080" cy="120" r="230" strokeOpacity=".22" />
          <circle cx="1080" cy="120" r="360" strokeOpacity=".16" />
          <circle cx="1080" cy="120" r="500" strokeOpacity=".11" />
          <circle cx="1080" cy="120" r="650" strokeOpacity=".07" />
          <circle cx="1080" cy="120" r="810" strokeOpacity=".05" />
        </g>
      </svg>
      <div className="canvas relative">
        <h2 className={`h2 reveal ${styles.h2}`} data-reveal>
          See what is happening inside Vault right now.
        </h2>

        <div className={styles.grid}>
          {/* next private table */}
          <article className={`reveal ${styles.feature}`} data-reveal>
            <div className={styles.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/private-dinner.webp" alt="" loading="lazy" />
              <svg className={styles.seats} viewBox="0 0 120 68" aria-hidden="true">
                <ellipse cx="60" cy="34" rx="36" ry="14" />
                {SEATS.map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" />
                ))}
              </svg>
              <p className={styles.seal}>
                <span className={styles.sealMark} aria-hidden="true">
                  <svg viewBox={MONOGRAM_VIEWBOX}>
                    <path d={MONOGRAM_FULL} />
                  </svg>
                </span>
                Invitation only
              </p>
            </div>
            <h3 className={`${styles.title} ${styles.featureTitle}`}>{TABLE.title}</h3>
            <p className={styles.text}>{TABLE.text}</p>
            <ul className={styles.details}>
              {TABLE.details.map((d) => (
                <li key={d.label}>
                  <Icon name={d.icon} strokeWidth={1.4} />
                  <span>{d.label}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className={styles.side}>
            {/* this week's intelligence */}
            <article className={`reveal ${styles.entry} ${styles.brief}`} data-reveal>
              <div className={styles.sheet} aria-hidden="true">
                <span className={styles.sheetHead} />
                <span className={styles.sheetHead} />
                <span />
                <span />
                <span className={styles.sheetShort} />
              </div>
              <div>
                <h3 className={styles.title}>{LEAD.title}</h3>
                <p className={styles.text}>{LEAD.context[0].text}</p>
                <p className={styles.meta}>
                  <span>{LEAD.theme}</span>
                  <span>Four more inside</span>
                </p>
              </div>
            </article>

            {/* new member resource */}
            <article className={`reveal ${styles.entry}`} data-reveal>
              <h3 className={styles.title}>{RESOURCE.title}</h3>
              <p className={styles.text}>{RESOURCE.text}</p>
              <ul className={styles.pack} aria-label="What the pack contains">
                {RESOURCE.contents.map((c, i) => (
                  <li key={c} className={i > 1 ? styles.packLocked : undefined}>
                    <Icon name={i > 1 ? "lock" : "check"} strokeWidth={1.5} className={styles.packIcon} />
                    <span aria-hidden={i > 1 ? true : undefined}>{c}</span>
                    {i > 1 && <span className="sr-only">Reserved for members.</span>}
                  </li>
                ))}
              </ul>
              <p className={styles.meta}>
                {RESOURCE.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </p>
            </article>
          </div>
        </div>

        <p className={`reveal ${styles.note}`} data-reveal>
          <Icon name="shield" strokeWidth={1.4} className="h-[18px] w-[18px] flex-none text-brass" />
          <span>Venues and guests are never published.</span>
        </p>
      </div>
    </section>
  );
}

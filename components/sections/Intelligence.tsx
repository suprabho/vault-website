import { Icon } from "@/lib/icons";
import { EDITION, LEAD, LOCKED } from "@/lib/briefing";
import { CTA } from "@/lib/site";
import styles from "./Intelligence.module.css";

/** 06 · the weekly briefing: the first item open, the rest visible but out of reach. */
export default function Intelligence() {
  return (
    <section id="intelligence" className={`section-pad ${styles.intelligence}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#010016">
          <circle cx="1290" cy="200" r="300" strokeOpacity=".05" />
          <circle cx="1290" cy="200" r="470" strokeOpacity=".04" />
          <circle cx="1290" cy="200" r="650" strokeOpacity=".03" />
          <circle cx="1290" cy="200" r="840" strokeOpacity=".022" />
        </g>
        <circle cx="1340" cy="212" r="4" fill="#C3AE87" />
      </svg>
      <div className="canvas relative">
        <header className={`reveal ${styles.head}`} data-reveal>
          <p className={`eyebrow ${styles.eyebrow}`}>This week in Vault</p>
          <h2 className={`h2 text-night ${styles.h2}`}>
            Five things every crypto compliance team should care about this week.{" "}
            <span className={styles.judge}>Judge for yourself.</span>
          </h2>
        </header>

        <div className={styles.paper}>
          <p className={styles.edition}>
            <span className={styles.kind}>
              {EDITION.kind.map((e) => (
                <span key={e}>{e}</span>
              ))}
            </span>
            <span>{EDITION.length}</span>
          </p>

          <article className={`reveal ${styles.lead}`} data-reveal>
            <span className={styles.num}>01</span>
            <div>
              <p className={styles.theme}>{LEAD.theme}</p>
              <h3 className={styles.leadTitle}>{LEAD.title}</h3>
              <p className={styles.summary}>{LEAD.summary}</p>
              <dl className={styles.context}>
                {LEAD.context.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd>{c.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <div className={styles.locked}>
            <ol className={styles.list} start={2}>
              {LOCKED.map((it, i) => (
                <li key={it.theme} className={styles.item} style={{ "--i": i } as React.CSSProperties}>
                  <span className={styles.num}>{String(i + 2).padStart(2, "0")}</span>
                  <div>
                    <p className={styles.theme}>
                      {it.theme}
                      <Icon name="lock" strokeWidth={1.6} className={styles.lk} />
                    </p>
                    {/* the headline is shown out of focus: legible enough to want, not to use */}
                    <p className={styles.blur} aria-hidden="true">
                      {it.title}
                    </p>
                    {" "}
                    <span className="sr-only">Headline reserved for members.</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.veil}>
              <p>Four more inside this edition.</p>
              <a href={CTA.href}>
                {CTA.label}
                <Icon name="arrow" strokeWidth={1.6} className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

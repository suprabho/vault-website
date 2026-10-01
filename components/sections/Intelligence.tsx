import { Icon } from "@/lib/icons";
import { EDITION, motifFor, type BriefingAsset } from "@/lib/briefing";
import { CTA } from "@/lib/site";
import AssetBackdrop from "./AssetBackdrop";
import AssetVisual from "./AssetVisual";
import styles from "./Intelligence.module.css";

const COUNT = ["None", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

/** the card's picture: the motif ground, and the visual over it as glass */
function Thumb({ asset, className = "" }: { asset: BriefingAsset; className?: string }) {
  return (
    <div className={`${styles.thumb} ${className}`}>
      <AssetBackdrop motif={motifFor(asset)} uid={asset.id} />
      <div className={styles.fg} aria-hidden={asset.locked ? true : undefined}>
        <AssetVisual visual={asset.visual} />
      </div>
    </div>
  );
}

function AssetCard({ asset, index, className = "" }: { asset: BriefingAsset; index?: number; className?: string }) {
  return (
    <article className={`${styles.card} ${asset.locked ? styles.locked : ""} ${className}`} style={{ "--i": index ?? 0 } as React.CSSProperties}>
      <Thumb asset={asset} />
      <div className={styles.body}>
        <p className={styles.kicker}>
          {index !== undefined && <span className={styles.num}>{String(index + 2).padStart(2, "0")}</span>}
          <span>{asset.locked ? asset.theme : asset.kind}</span>
          {asset.locked && <Icon name="lock" strokeWidth={1.5} className={styles.lockIcon} />}
        </p>
        <h4 className={styles.cardTitle} aria-hidden={asset.locked ? true : undefined}>
          {asset.title}
        </h4>
        {asset.locked && <span className="sr-only">{asset.theme}: headline reserved for members.</span>}
      </div>
    </article>
  );
}

/** 06 · the weekly briefing as a set of asset cards: the lead open, the rest visible but out of reach. */
export default function Intelligence() {
  const { lead, support, more } = EDITION;
  return (
    <section id="intelligence" className={`section-pad ${styles.intelligence}`}>
      <svg data-motif-field className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
          <h2 className={`h2 text-night ${styles.h2}`}>
            Five things every crypto compliance team should care about this week.{" "}
            <span className={styles.judge}>Judge for yourself.</span>
          </h2>
        </header>

        <div className={styles.grid}>
          <article className={`reveal ${styles.card} ${styles.lead}`} data-reveal>
            <div className={styles.leadText}>
              <p className={styles.kicker}>
                <span className={styles.num}>01</span>
                <span>{lead.theme}</span>
              </p>
              <h3 className={styles.leadTitle}>{lead.title}</h3>
              <p className={styles.dek}>{lead.dek}</p>
            </div>
            <Thumb asset={lead} className={styles.leadThumb} />
          </article>

          {support.map((a) => (
            <div key={a.id} className="reveal" data-reveal>
              <AssetCard asset={a} className={styles.fill} />
            </div>
          ))}
        </div>

        <div className={styles.more}>
          <div className={styles.moreGrid}>
            {more.map((a, i) => (
              <AssetCard key={a.id} asset={a} index={i} />
            ))}
          </div>
          <div className={styles.veil}>
            <p>{COUNT[more.length] ?? more.length} more inside this edition.</p>
            <a href={CTA.href}>
              {CTA.label}
              <Icon name="arrow" strokeWidth={1.6} className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

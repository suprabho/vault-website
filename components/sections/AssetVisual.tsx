import { Icon } from "@/lib/icons";
import type { AssetVisual as Visual } from "@/lib/briefing";
import styles from "./AssetVisual.module.css";

/** Draws one briefing card's visual. Each `type` maps to a fixed drawing so CMS entries only supply data. */
export default function AssetVisual({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case "flow":
      return (
        <ol className={`${styles.glass} ${styles.flow}`}>
          {visual.steps.map((s, i) => {
            const broken = visual.breaks.includes(i);
            return (
              <li key={s} className={broken ? styles.flowBreak : undefined}>
                <span className={styles.flowDot}>{broken && <Icon name="xCircle" strokeWidth={1.6} />}</span>
                <span className={styles.flowLabel}>{s}</span>
              </li>
            );
          })}
        </ol>
      );

    case "types":
      return (
        <ul className={styles.types}>
          {visual.items.map((it) => (
            <li key={it.label}>
              <Icon name={it.icon} strokeWidth={1.4} className={styles.typeIcon} />
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      );

    case "roles":
      return (
        <ul className={styles.roles}>
          {visual.items.map((r, i) => (
            <li key={r} style={{ "--i": i } as React.CSSProperties}>
              <Icon name="person" strokeWidth={1.4} className={styles.roleIcon} />
              {r}
            </li>
          ))}
        </ul>
      );

    case "checklist":
      return (
        <ul className={`${styles.glass} ${styles.checklist}`}>
          {visual.items.map((it, i) => (
            <li key={it} className={i < visual.done ? styles.done : undefined}>
              <span className={styles.box} aria-hidden="true">
                {i < visual.done && <Icon name="check" strokeWidth={1.6} />}
              </span>
              {it}
            </li>
          ))}
        </ul>
      );

    case "bars": {
      const max = Math.max(...visual.values);
      return (
        <div className={styles.glass} aria-hidden="true">
          <div className={styles.bars}>
            {visual.values.map((v, i) => (
              <span key={i} className={i === visual.highlight ? styles.barHi : undefined} style={{ height: `${(v / max) * 100}%` }} />
            ))}
          </div>
        </div>
      );
    }

    case "network": {
      const n = visual.nodes;
      const pts = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return [Math.round((60 + Math.cos(a) * 44) * 10) / 10, Math.round((50 + Math.sin(a) * 36) * 10) / 10];
      });
      return (
        <div className={styles.glass} aria-hidden="true">
          <svg className={styles.network} viewBox="0 0 120 100">
            {pts.map(([x, y], i) => (
              <line key={`l${i}`} x1="60" y1="50" x2={x} y2={y} />
            ))}
            {pts.map(([x, y], i) => (
              <circle key={`c${i}`} cx={x} cy={y} r="4.5" />
            ))}
            <circle className={styles.hub} cx="60" cy="50" r="8" />
          </svg>
        </div>
      );
    }

    case "gap":
      return (
        <div className={styles.gap} aria-hidden="true">
          <span>{visual.left}</span>
          <i />
          <span>{visual.right}</span>
        </div>
      );
  }
}

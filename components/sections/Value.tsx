import { Icon, type IconName } from "@/lib/icons";
import styles from "./Value.module.css";

const CARDS: { icon: IconName; title: string; body: string; outcome: string }[] = [
  { icon: "briefing", title: "Weekly briefings", body: "The developments that matter, what changed and what to do next.", outcome: "Removes the Monday scan of twelve newsletters." },
  { icon: "digest", title: "Enforcement digests", body: "The cases worth understanding, interpreted for operating teams.", outcome: "Turns a legal summary into a control decision." },
  { icon: "radar", title: "Threat radar", body: "Emerging typologies, risk signals and issues that deserve attention.", outcome: "Gives the team something to screen against this week." },
  { icon: "playbook", title: "Practical playbooks", body: "Templates, checklists, AI prompts and implementation guidance.", outcome: "Replaces work another member has already done." },
  { icon: "link", title: "Considered introductions", body: "Access to people with relevant experience — without public directory spam.", outcome: "One relevant call instead of forty cold messages." },
  { icon: "convening", title: "Private convenings", body: "Small rooms designed around relevance, confidentiality and contribution.", outcome: "A seat where the question can actually be asked." },
];

/** 07 · member value */
export default function Value() {
  return (
    <section id="value" className="section-pad light">
      <div className="canvas">
        <div className="reveal mb-14 max-w-[720px]" data-reveal>
          <p className="eyebrow mb-6">What members open</p>
          <h2 className="h2">Built to reduce noise, uncertainty and duplicated work.</h2>
        </div>
        <div className="reveal grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]" data-reveal>
          {CARDS.map((c) => (
            <div key={c.title} className={`card ${styles.vcard}`}>
              <span className={styles.badge}>
                <Icon name={c.icon} className="block h-5 w-5 overflow-visible text-brass-ink" />
              </span>
              <h3 className="h4">{c.title}</h3>
              <p className="body mt-2.5">{c.body}</p>
              <p className={styles.outcome}>{c.outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

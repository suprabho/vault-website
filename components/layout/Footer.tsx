import VaultLogo from "@/components/brand/VaultLogo";
import { CONTACT_EMAIL, CTA, LEGAL_LINKS, MEMBER_ACCESS_HREF, NAV_LINKS } from "@/lib/site";
import styles from "./Footer.module.css";

const NAV_PRIMARY = [...NAV_LINKS, CTA];
const NAV_SECONDARY = [{ href: MEMBER_ACCESS_HREF, label: "Member access" }, ...LEGAL_LINKS];

export default function Footer() {
  return (
    <footer id="c5foot" className={styles.foot} data-reveal>
      <div className="c5-sheet">
        <div className={styles.cols}>
          <div>
            <VaultLogo className="block h-[34px] w-auto text-white" />
            <p className={`${styles.folio} mt-3.5`}>Powered by Merkle Science</p>
          </div>
          <nav className={styles.nav} aria-label="Site">
            {NAV_PRIMARY.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <nav className={styles.nav} aria-label="Members and legal">
            {NAV_SECONDARY.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          {CONTACT_EMAIL && (
            <div className={styles.folio}>
              Contact{" "}
              <br />
              <a className="text-cream-2" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </div>
        <p className={styles.fine}>© 2026 Merkle Science. Vault is an invitation-only professional network.</p>
      </div>
    </footer>
  );
}

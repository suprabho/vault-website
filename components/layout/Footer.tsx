import VaultLogo from "@/components/brand/VaultLogo";
import styles from "./Footer.module.css";

const NAV_PRIMARY = [
  { href: "#room", label: "The Room" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#membership", label: "Membership" },
  { href: "#request", label: "Request consideration" },
];
const NAV_SECONDARY = [
  { href: "#", label: "Member access" },
  { href: "#", label: "Code of Conduct" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

export default function Footer() {
  return (
    <footer id="c5foot" className={styles.foot} data-reveal>
      <div className="c5-sheet">
        <div className={styles.cols}>
          <div>
            <VaultLogo className="block h-[34px] w-auto text-white" />
            <p className={`${styles.folio} mt-3.5`}>Powered by Merkle Science</p>
          </div>
          <nav className={styles.nav}>
            {NAV_PRIMARY.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <nav className={styles.nav}>
            {NAV_SECONDARY.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className={styles.folio}>
            Contact
            <br />
            <span className="text-cream-2">[Approved community email]</span>
          </div>
        </div>
        <p className={styles.fine}>© 2026 Merkle Science. Vault is an invitation-only professional network.</p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Subpage from "@/components/layout/Subpage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy — The Vault" };

/*
 * LEGAL: a plain summary of what this website does with personal data. Have it reviewed
 * (and replaced by the counsel-approved policy if there is one) before launch.
 */
export default function Privacy() {
  return (
    <Subpage
      eyebrow="Privacy"
      title="How this site handles your information."
      intro={<p>Vault is operated by Merkle Science. This page covers the Vault website and invitation requests.</p>}
    >
      <h2>When you request an invitation</h2>
      <p>
        We ask for your name, work email, organisation, role and what you choose to tell us about your
        responsibilities. We use it to consider your request and, where relevant, to contact you about it.
      </p>
      <h2>Private discussions</h2>
      <p>
        We do not publish venues, guests or attributed views from Vault rooms. See the{" "}
        <a href="/code-of-conduct">Code of Conduct</a> for what members agree to.
      </p>
      <h2>Browsing this site</h2>
      <p>
        This site does not set its own cookies. The opening background is loaded from a third-party host, which
        receives the standard information your browser sends with any request, such as your IP address.
      </p>
      <h2>Your information</h2>
      <p>
        You can ask to see, correct or delete the information you have sent us
        {CONTACT_EMAIL ? (
          <>
            {" "}by writing to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : (
          " by contacting Merkle Science."
        )}
      </p>
    </Subpage>
  );
}

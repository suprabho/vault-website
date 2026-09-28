import type { Metadata } from "next";
import Subpage from "@/components/layout/Subpage";

export const metadata: Metadata = { title: "Terms — The Vault" };

/* LEGAL: plain-language website terms. Have them reviewed before launch. */
export default function Terms() {
  return (
    <Subpage
      eyebrow="Terms"
      title="Terms of use for this website."
      intro={<p>This website is operated by Merkle Science. By using it, you accept these terms.</p>}
    >
      <h2>Information, not advice</h2>
      <p>
        Content on this site — including the sample briefing — is published for information and to show the format
        of Vault&apos;s work. It is not legal, regulatory or compliance advice, and should not be relied on as such.
      </p>
      <h2>Membership</h2>
      <p>
        Requesting an invitation does not create a right to membership. Invitations are extended at Vault&apos;s
        discretion, and members agree to the <a href="/code-of-conduct">Code of Conduct</a>.
      </p>
      <h2>Content</h2>
      <p>
        The text, design and marks on this site belong to Merkle Science or its licensors and may not be reproduced
        without permission.
      </p>
      <h2>Privacy</h2>
      <p>
        How we handle the information you send us is described on the <a href="/privacy">Privacy</a> page.
      </p>
    </Subpage>
  );
}

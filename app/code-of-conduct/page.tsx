import type { Metadata } from "next";
import Subpage from "@/components/layout/Subpage";

export const metadata: Metadata = { title: "Code of Conduct — The Vault" };

/* The standards members already agree to on the landing page, written out in full. */
export default function CodeOfConduct() {
  return (
    <Subpage
      eyebrow="Code of Conduct"
      title="What every seat in the room asks of you."
      intro={<p>Vault works because members can speak openly. These standards keep it that way.</p>}
    >
      <h2>Confidentiality</h2>
      <p>
        What is said in a Vault room stays there. Members may use what they learn, but may not attribute a view to a
        person or organisation outside the room without that person&apos;s permission.
      </p>
      <h2>Contribution</h2>
      <p>
        Membership is built on contribution, not status. Share context, answer the questions you can, and bring the
        problems you are genuinely working on.
      </p>
      <h2>No prospecting</h2>
      <ul>
        <li>No unsolicited selling, to members or through them.</li>
        <li>No extracting, copying or exporting the member directory.</li>
        <li>Introductions are requested, considered and made with consent — never assumed.</li>
      </ul>
      <h2>No pay-to-play</h2>
      <p>No sponsorship, payment or commercial relationship buys a seat in the room, or keeps one.</p>
      <h2>If the standard is not met</h2>
      <p>
        Membership is reviewed where these standards are not respected, and may be withdrawn. The composition and
        trust of the room come first.
      </p>
    </Subpage>
  );
}

import type { Metadata } from "next";
import Subpage from "@/components/layout/Subpage";
import { CTA } from "@/lib/site";

export const metadata: Metadata = { title: "Member access — The Vault" };

export default function MemberAccess() {
  return (
    <Subpage
      eyebrow="Member access"
      title="The member area is open to invited members."
      intro={
        <>
          <p>
            Not a member yet? <a href={CTA.href}>{CTA.label}</a>.
          </p>
        </>
      }
    />
  );
}

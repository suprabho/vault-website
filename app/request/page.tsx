import type { Metadata } from "next";
import Subpage from "@/components/layout/Subpage";
import RequestForm from "@/components/forms/RequestForm";

export const metadata: Metadata = {
  title: "Request an invitation — The Vault",
  description: "Tell us who you are, what you are responsible for and why the room is relevant to you now.",
};

export default function RequestPage() {
  return (
    <Subpage
      eyebrow="Request an invitation"
      title="Tell us why this is your room."
      intro={<p>A few details, in your own words.</p>}
    >
      <RequestForm />
    </Subpage>
  );
}

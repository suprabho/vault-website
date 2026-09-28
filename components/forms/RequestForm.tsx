"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL, CTA } from "@/lib/site";
import styles from "./RequestForm.module.css";

type State = "idle" | "sending" | "sent" | "invalid" | "unavailable";

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Work email", type: "email", autoComplete: "email", required: true },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization", required: true },
  { name: "role", label: "Role", type: "text", autoComplete: "organization-title", required: true },
] as const;

export default function RequestForm() {
  const [state, setState] = useState<State>("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    setState(res?.ok ? "sent" : res?.status === 400 ? "invalid" : "unavailable");
  };

  if (state === "sent") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneHead}>Thank you. Your request is with the team.</p>
        <p>If there is a fit, the next step is a short conversation.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.grid}>
        {FIELDS.map((f) => (
          <label key={f.name} className={styles.field}>
            <span>{f.label}</span>
            <input name={f.name} type={f.type} autoComplete={f.autoComplete} required={f.required} />
          </label>
        ))}
      </div>
      <label className={styles.field}>
        <span>What are you responsible for?</span>
        <input name="responsibility" type="text" placeholder="e.g. AML programme, investigations, Travel Rule operations" />
      </label>
      <label className={styles.field}>
        <span>Why is the room relevant to you now?</span>
        <textarea name="why" rows={5} required maxLength={2000} />
      </label>
      <label className={styles.field}>
        <span>
          Referred by a member? <em>Optional</em>
        </span>
        <input name="referral" type="text" />
      </label>
      {/* left empty by people; filled by bots */}
      <input className={styles.trap} name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <p className={styles.fine}>
        We use these details only to consider your request. See <a href="/privacy">Privacy</a>.
      </p>

      <div className={styles.actions}>
        <button className="btn btn-brass" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : CTA.label}
        </button>
        <p className={styles.error} role="alert">
          {state === "invalid" && "Please complete the required fields with a valid work email."}
          {state === "unavailable" &&
            (CONTACT_EMAIL ? (
              <>
                We could not receive your request just now. Please try again, or write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </>
            ) : (
              "We could not receive your request just now. Please try again shortly."
            ))}
        </p>
      </div>
    </form>
  );
}

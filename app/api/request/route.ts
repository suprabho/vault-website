/**
 * Receives an invitation request and forwards it to the team's inbox or CRM.
 *
 * Set VAULT_REQUEST_WEBHOOK_URL to any endpoint that accepts a JSON POST (a CRM form
 * endpoint, a Slack/Zapier/Make hook…). Until it is set, requests are refused with 503 so the
 * form can say so honestly rather than pretend it was received.
 */

const FIELDS = ["name", "email", "organisation", "role", "responsibility", "why", "referral"] as const;
const REQUIRED = ["name", "email", "organisation", "role", "why"] as const;
const MAX = 2000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    data[f] = typeof v === "string" ? v.trim().slice(0, MAX) : "";
  }
  // a field no person can see: anything in it came from a bot
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });
  if (REQUIRED.some((f) => !data[f]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const hook = process.env.VAULT_REQUEST_WEBHOOK_URL;
  if (!hook) return Response.json({ error: "unavailable" }, { status: 503 });

  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
  }).catch(() => null);
  if (!res?.ok) return Response.json({ error: "unavailable" }, { status: 502 });
  return Response.json({ ok: true });
}

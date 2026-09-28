/**
 * Site-wide copy and destinations. Anything a non-developer is likely to change —
 * the call to action, the contact address, the member portal — lives here.
 */

/** The one call to action, used verbatim everywhere it appears. */
export const CTA = { label: "Request an invitation", href: "/request" } as const;

/**
 * Where the approved community inbox and member portal live. Leave `null` until they are
 * confirmed: the footer hides the contact line and "Member access" falls back to its own page.
 */
export const CONTACT_EMAIL: string | null = null;
export const MEMBER_PORTAL_URL: string | null = null;

export const MEMBER_ACCESS_HREF = MEMBER_PORTAL_URL ?? "/member-access";

/** In-page anchors are written from the root so they also work from the legal pages. */
export const NAV_LINKS = [
  { href: "/#room", label: "The Room" },
  { href: "/#intelligence", label: "Intelligence" },
  { href: "/#membership", label: "Membership" },
] as const;

export const LEGAL_LINKS = [
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** Section ids in page order — used by the progress arcs and active nav state. */
export const SECTION_IDS = [
  "top",
  "problem",
  "continuation",
  "between",
  "intelligence",
  "pulse",
  "people",
  "membership",
  "process",
  "request",
] as const;

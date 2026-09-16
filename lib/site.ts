export const NAV_LINKS = [
  { href: "#room", label: "The Room" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#membership", label: "Membership" },
] as const;

/** Section ids in page order — used by the progress arcs and active nav state. */
export const SECTION_IDS = [
  "top",
  "problem",
  "continuation",
  "between",
  "intelligence",
  "value",
  "pulse",
  "people",
  "membership",
  "process",
  "request",
] as const;

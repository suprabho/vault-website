import type { SVGProps } from "react";

/** Line icons used across the site, all drawn on a 24 × 24 grid. */
export const ICONS = {
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="M13.6 6.4 19.2 12l-5.6 5.6" />
    </>
  ),
  arrowLong: (
    <>
      <path d="M3.6 12h16" />
      <path d="M13.6 5.8 19.8 12l-6.2 6.2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.2 12.3 11 15l5-5.6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.6" y="10.4" width="14.8" height="10.4" rx="2.2" />
      <path d="M8.4 10.4V7.6a3.6 3.6 0 0 1 7.2 0v2.8" />
    </>
  ),
  lockKey: (
    <>
      <rect x="5" y="10.6" width="14" height="9.8" rx="2.2" />
      <path d="M8.4 10.6V7.8a3.6 3.6 0 0 1 7.2 0v2.8" />
      <path d="M12 14.4v2.4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M12 1.8v2.2M12 20v2.2M1.8 12h2.2M20 12h2.2" />
    </>
  ),
  targetSm: (
    <>
      <circle cx="12" cy="12" r="7.6" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M12 2.6v1.8M12 19.6v1.8M2.6 12h1.8M19.6 12h1.8" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9.4" r="2.9" />
      <circle cx="16.4" cy="10.4" r="2.3" />
      <path d="M3.6 18.6a5.5 5.5 0 0 1 10.8 0" />
      <path d="M15.6 15.2a4.4 4.4 0 0 1 5 3.4" />
    </>
  ),
  peopleSm: (
    <>
      <circle cx="9" cy="9" r="3" />
      <circle cx="16.6" cy="10.2" r="2.2" />
      <path d="M4 18.8a5.2 5.2 0 0 1 10 0" />
      <path d="M15.2 15.4a4 4 0 0 1 4.8 3.4" />
    </>
  ),
  group: (
    <>
      <circle cx="12" cy="8.4" r="2.8" />
      <circle cx="5.4" cy="10.4" r="2.2" />
      <circle cx="18.6" cy="10.4" r="2.2" />
      <path d="M7.4 18.4a4.8 4.8 0 0 1 9.2 0" />
      <path d="M2.2 17.4a3.8 3.8 0 0 1 3.6-3.2" />
      <path d="M21.8 17.4a3.8 3.8 0 0 0-3.6-3.2" />
    </>
  ),
  next: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M9.4 14.6 14.8 9.2" />
      <path d="M10.4 9.2h4.4v4.4" />
    </>
  ),
  nextSm: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.4 14.6 15 9" />
      <path d="M10.4 9h4.6v4.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.4" />
      <path d="M8 3.2v3.6M16 3.2v3.6M3.6 10h16.8" />
      <path d="M7.6 13.6h.01M12 13.6h.01M16.4 13.6h.01M7.6 17h.01M12 17h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.4s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  shield: <path d="M12 2.8 19.4 5.8v6c0 4.3-3.1 7.1-7.4 9.4-4.3-2.3-7.4-5.1-7.4-9.4v-6Z" />,
  shieldCheck: (
    <>
      <path d="M12 2.8 19.2 5.8v6c0 4.2-3 6.9-7.2 9.2-4.2-2.3-7.2-5-7.2-9.2v-6Z" />
      <path d="M9.6 12.2l1.8 1.8 3.4-3.6" />
    </>
  ),
  briefing: (
    <>
      <rect x="5.2" y="3.4" width="13.6" height="17.2" rx="2.4" />
      <path d="M8.6 8.6h6.8M8.6 12h6.8M8.6 15.4h4.4" />
    </>
  ),
  digest: (
    <>
      <rect x="4" y="3.4" width="12.4" height="15.6" rx="2.2" />
      <path d="M7.2 8h6M7.2 11.2h4.2" />
      <circle cx="17.6" cy="17.2" r="4.4" />
      <path d="M17.6 15.2v2.2" />
      <path d="M17.6 19.2h.01" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M12 12 18.1 7.6" />
    </>
  ),
  playbook: (
    <>
      <rect x="5.2" y="3.4" width="13.6" height="17.2" rx="2.4" />
      <path d="M8.8 11.4l2 2 4.4-4.6" />
      <path d="M8.8 16.6h6.4" />
    </>
  ),
  link: (
    <>
      <circle cx="7.2" cy="7.6" r="3" />
      <circle cx="16.8" cy="16.4" r="3" />
      <path d="M9.4 9.8 14.6 14.2" />
    </>
  ),
  convening: (
    <>
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="4.2" r="1.5" />
      <circle cx="19.8" cy="12" r="1.5" />
      <circle cx="12" cy="19.8" r="1.5" />
      <circle cx="4.2" cy="12" r="1.5" />
    </>
  ),
  exchange: <path d="M4.6 9.4h14.8M16.2 6.2l3.2 3.2-3.2 3.2M19.4 15.2H4.6M7.8 12l-3.2 3.2 3.2 3.2" />,
  bank: <path d="M3.4 9.6 12 4.4l8.6 5.2M5.6 9.6v8.6M10 9.6v8.6M14 9.6v8.6M18.4 9.6v8.6M3.2 19.8h17.6" />,
  scales: <path d="M12 4.2v15.6M7.4 19.8h9.2M5 8.4h14M5 8.4 2.6 14a2.5 2.5 0 0 0 4.8 0ZM19 8.4 16.6 14a2.5 2.5 0 0 0 4.8 0Z" />,
  person: (
    <>
      <circle cx="12" cy="8.6" r="3.4" />
      <path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
    </>
  ),
  personOff: (
    <>
      <circle cx="12" cy="8.6" r="3.2" />
      <path d="M5.8 19.6a6.2 6.2 0 0 1 12.4 0" />
      <path d="M3.4 3.4l17.2 17.2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M2.8 12s3.4-5.8 9.2-5.8c1.5 0 2.8.4 4 1" />
      <path d="M18.6 9.2c1.6 1.4 2.6 2.8 2.6 2.8s-3.4 5.8-9.2 5.8c-1.9 0-3.5-.6-4.8-1.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M3.4 3.4l17.2 17.2" />
    </>
  ),
  cartOff: (
    <>
      <path d="M3 4.4h2.6l2.2 10.4h9.4l1.8-7.4H6.6" />
      <circle cx="9.4" cy="19" r="1.4" />
      <circle cx="16.6" cy="19" r="1.4" />
      <path d="M3.4 3.4l17.2 17.2" />
    </>
  ),
  docEdit: (
    <>
      <path d="M5.4 3.6h8.2l4 4v12.8H5.4Z" />
      <path d="M13.4 3.8v3.8h3.8" />
      <path d="M8.2 12h4.4M8.2 15.4h3" />
      <path d="M17.4 12.6 20 15.2l-3.8 3.8-2.6.4.4-2.6Z" />
    </>
  ),
  chat: (
    <>
      <path d="M3.2 5.6h11.2v7.6H7.4L3.2 16.2Z" />
      <path d="M9.6 9.4h11.2v7.6h-3.2l-4.2 3v-3H9.6Z" />
    </>
  ),
  door: (
    <>
      <path d="M4.4 3.6h7.2v16.8H4.4Z" />
      <path d="M11.6 3.6 19.6 5.4v13.2l-8 1.8" />
      <path d="M14.4 11.6v1.6" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  strokeWidth?: number;
};

export function Icon({ name, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {ICONS[name]}
    </svg>
  );
}

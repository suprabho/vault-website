"use client";

import VaultLogo from "@/components/brand/VaultLogo";
import { CTA, MEMBER_ACCESS_HREF, NAV_LINKS } from "@/lib/site";

type Props = { open: boolean; onClose: () => void };

export default function MobileSheet({ open, onClose }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[110] flex-col overflow-y-auto overscroll-contain bg-night px-[var(--gutter)] pb-10 ${open ? "flex" : "hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      {/* the same row as the header, so the logo and the button stay put as the sheet opens */}
      <div className="flex h-[var(--navh)] w-full shrink-0 items-center justify-between gap-6">
        <span className="flex items-center gap-2.5 text-white">
          <VaultLogo className="block h-9 w-auto" />
        </span>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent"
          aria-label="Close menu"
          onClick={onClose}
        >
          <i className="absolute block h-px w-[18px] rotate-45 bg-cream" />
          <i className="absolute block h-px w-[18px] -rotate-45 bg-cream" />
        </button>
      </div>
      <nav className="mb-10 mt-10 flex shrink-0 flex-col gap-2">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            className="border-b border-arc py-3 font-display text-[32px] no-underline"
          >
            {label}
          </a>
        ))}
        <a href={MEMBER_ACCESS_HREF} onClick={onClose} className="py-3 font-display text-[32px] no-underline">
          Member access
        </a>
      </nav>
      <a className="btn btn-brass mt-auto shrink-0" href={CTA.href} onClick={onClose}>
        {CTA.label}
      </a>
    </div>
  );
}

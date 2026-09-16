"use client";

import VaultLogo from "@/components/brand/VaultLogo";
import { NAV_LINKS } from "@/lib/site";

type Props = { open: boolean; onClose: () => void };

export default function MobileSheet({ open, onClose }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[110] flex-col bg-night px-[var(--gutter)] pb-10 pt-6 ${open ? "flex" : "hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex w-full items-center justify-between gap-6">
        <span className="flex items-center gap-2.5 text-white">
          <VaultLogo className="block h-[30px] w-auto" />
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
      <nav className="mt-12 flex flex-col gap-2">
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
        <a href="#" onClick={onClose} className="py-3 font-display text-[32px] no-underline">
          Member access
        </a>
      </nav>
      <a className="btn btn-brass mt-auto" href="#request" onClick={onClose}>
        Request consideration
      </a>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import VaultLogo from "@/components/brand/VaultLogo";
import { CTA, MEMBER_ACCESS_HREF, NAV_LINKS } from "@/lib/site";
import MobileSheet from "./MobileSheet";

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // the hero and the close carry the call to action; the header only offers it in between
  const [cta, setCta] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 24);
      const hero = document.getElementById("top");
      const close = document.getElementById("request");
      const pastHero = !hero || window.scrollY > window.innerHeight * 0.6;
      const atClose = !!close && close.getBoundingClientRect().top < window.innerHeight * 0.5;
      setCta(pastHero && !atClose);
      const mid = window.scrollY + window.innerHeight * 0.4;
      let active: string | null = null;
      for (const { href } of NAV_LINKS) {
        const el = document.getElementById(href.split("#")[1]);
        if (!el) continue;
        // anchors inside pinned stages sit on a zero-height span; use the section that owns them
        const box = el.closest("section") ?? el;
        const top = box.getBoundingClientRect().top + window.scrollY;
        if (top <= mid && top + box.offsetHeight > mid) active = href;
      }
      setCurrent(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  const toggle = useCallback((o: boolean) => {
    setOpen(o);
    document.body.style.overflow = o ? "hidden" : "";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <>
      <a href="#main" className="btn btn-sm absolute left-[-9999px] focus:left-4 focus:top-4 focus:z-[200]">
        Skip to content
      </a>
      <header
        id="hdr"
        className={`fixed inset-x-0 top-0 z-[100] flex h-[72px] items-center border-b transition-[background-color,border-color,backdrop-filter] duration-300 lg:h-[88px] ${
          stuck ? "border-arc bg-night backdrop-blur-xl" : "border-transparent"
        }`}
      >
        <div className="canvas flex w-full items-center justify-between gap-6">
          <Link href="/#top" className="flex items-center gap-2.5 text-white no-underline" aria-label="The Vault — home">
            <VaultLogo className="block h-9 w-auto lg:h-[41px]" />
          </Link>
          <nav className="hidden gap-9 text-[15px] text-quiet lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                aria-current={current === href ? "true" : undefined}
                className="no-underline transition-colors duration-200 hover:text-cream aria-[current=true]:text-cream"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <a href={MEMBER_ACCESS_HREF} className="hidden text-sm text-quiet no-underline transition-colors duration-200 hover:text-cream lg:inline">
              Member access
            </a>
            {path !== CTA.href && (
              <a
                className={`btn btn-ghost-brass btn-sm hidden transition-[opacity,background-color,border-color] duration-500 sm:inline-flex ${
                  cta ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                href={CTA.href}
                tabIndex={cta ? undefined : -1}
                aria-hidden={cta ? undefined : true}
              >
                {CTA.label}
              </a>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1 border-0 bg-transparent lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => toggle(true)}
            >
              <i className="block h-px w-[18px] bg-cream" />
              <i className="block h-px w-[18px] bg-cream" />
            </button>
          </div>
        </div>
      </header>
      <MobileSheet open={open} onClose={() => toggle(false)} />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/lib/site";

/** Fixed rail of brass arcs on the right edge: one per section, lit up to the current one. */
export default function ProgressArcs() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let c = 0;
      SECTION_IDS.forEach((id, i) => {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top + window.scrollY <= mid) c = i;
      });
      setCur(c);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 z-[70] hidden -translate-y-1/2 flex-col gap-2.5 lg:flex" aria-hidden="true">
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          type="button"
          tabIndex={-1}
          aria-label={`Section ${i + 1}`}
          className="h-3.5 w-3.5 cursor-pointer border-0 bg-transparent p-0"
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" className="block">
            <path
              d="M7 1a6 6 0 0 1 0 12"
              fill="none"
              strokeWidth="1.5"
              className={`transition-[stroke] duration-250 ${i <= cur ? "stroke-brass" : "stroke-arc-strong"}`}
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

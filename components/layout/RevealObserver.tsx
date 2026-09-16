"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page. Any element carrying
 * `data-reveal` gets the `in` class once it enters the viewport.
 * Also flags <html> with `c5-anim` so entrance-only styles (the footer)
 * know the page can animate.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("c5-anim");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => io.observe(el));

    // the footer must never stay hidden: resolve it when the page bottom is reached
    const foot = document.getElementById("c5foot");
    const footCheck = () => {
      if (!foot) return;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40) {
        foot.classList.add("in");
        window.removeEventListener("scroll", footCheck);
      }
    };
    window.addEventListener("scroll", footCheck, { passive: true });
    footCheck();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", footCheck);
    };
  }, []);
  return null;
}

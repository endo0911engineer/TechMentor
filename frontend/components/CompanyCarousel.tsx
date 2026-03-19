"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import CompanyCard from "@/components/CompanyCard";
import { CompanyWithStats } from "@/lib/api";

export default function CompanyCarousel({ companies }: { companies: CompanyWithStats[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const n = companies.length;
  // Triple the array for infinite loop: [copy | original | copy]
  const items = [...companies, ...companies, ...companies];
  const isScrolling = useRef(false);

  // Get card width from DOM
  const cardWidth = useCallback(() => {
    const el = ref.current;
    if (!el || !el.children[0]) return 0;
    const child = el.children[0] as HTMLElement;
    return child.offsetWidth + 16; // 16 = gap-4
  }, []);

  // Silently jump to middle set without animation
  const silentReset = useCallback((toIndex: number) => {
    const el = ref.current;
    if (!el) return;
    const w = cardWidth();
    // disable smooth scroll temporarily
    el.style.scrollBehavior = "auto";
    el.scrollLeft = toIndex * w;
    requestAnimationFrame(() => {
      el.style.scrollBehavior = "";
    });
  }, [cardWidth]);

  // Initialize scroll to start of middle set
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // wait for layout
    requestAnimationFrame(() => {
      const w = cardWidth();
      el.style.scrollBehavior = "auto";
      el.scrollLeft = n * w;
      requestAnimationFrame(() => { el.style.scrollBehavior = ""; });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = useCallback((absIndex: number) => {
    const el = ref.current;
    if (!el) return;
    const w = cardWidth();
    el.scrollTo({ left: absIndex * w, behavior: "smooth" });
    setCurrent(absIndex % n);
  }, [cardWidth, n]);

  const next = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = cardWidth();
    const abs = Math.round(el.scrollLeft / w);
    scrollToIndex(abs + 1);
  }, [cardWidth, scrollToIndex]);

  const prev = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = cardWidth();
    const abs = Math.round(el.scrollLeft / w);
    scrollToIndex(abs - 1);
  }, [cardWidth, scrollToIndex]);

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  // On scroll end: if in first or third copy, silently reset to middle
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const w = cardWidth();
        if (w === 0) return;
        const abs = Math.round(el.scrollLeft / w);
        setCurrent(abs % n);
        if (abs < n) {
          // in left copy → jump to middle
          silentReset(abs + n);
        } else if (abs >= n * 2) {
          // in right copy → jump to middle
          silentReset(abs - n);
        }
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timeout); };
  }, [cardWidth, n, silentReset]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: "8px" }}
      >
        {items.map((c, i) => (
          <div key={i} className="shrink-0 w-72 sm:w-80 snap-start">
            <CompanyCard company={c} stats={c.stats} />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition z-10"
        aria-label="前へ"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition z-10"
        aria-label="次へ"
      >
        ›
      </button>

      <div className="flex justify-center gap-1.5 mt-4">
        {companies.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = ref.current;
              if (!el) return;
              const w = cardWidth();
              const abs = Math.round(el.scrollLeft / w);
              const base = Math.floor(abs / n) * n;
              scrollToIndex(base + i);
            }}
            className={`rounded-full transition-all ${i === current ? "w-4 h-2 bg-blue-600" : "w-2 h-2 bg-gray-300"}`}
            aria-label={`${i + 1}枚目`}
          />
        ))}
      </div>
    </div>
  );
}

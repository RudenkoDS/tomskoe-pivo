"use client";
import { useEffect, useState } from "react";

const NAV = [
  { label: "История", anchor: "#karl" },
  { label: "AI-Фильмы", anchor: "#films" },
  { label: "Хронология", anchor: "#soviet" },
  { label: "Завод сегодня", anchor: "#today" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (anchor: string) => {
    setMenuOpen(false);
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(10,8,4,0.82)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(200,146,42,0.12)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10" style={{ height: "64px" }}>

          {/* Лого */}
          <button
            onClick={() => scrollTo("#hero")}
            className="flex flex-col items-start leading-none group"
            style={{ gap: "3px" }}
          >
            <span className="font-mono text-[11px] tracking-[0.32em] text-accent uppercase group-hover:text-accent/80 transition-colors">
              Томское Пиво
            </span>
            <span className="font-mono text-[9px] tracking-[0.28em] text-muted/70 uppercase">
              1876 · Томск
            </span>
          </button>

          {/* Desktop nav — правая сторона */}
          <div className="hidden md:flex items-center gap-7">
            {NAV.map(n => (
              <button
                key={n.anchor}
                onClick={() => scrollTo(n.anchor)}
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted hover:text-accent transition-colors"
              >
                {n.label}
              </button>
            ))}
            <button className="ml-2 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/25 px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-accent hover:bg-accent/20 transition-all">
              Викторина
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Меню"
          >
            <div className="flex flex-col gap-[5px] w-5">
              <span className={`block h-px bg-current transition-all origin-center ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-px bg-current transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px bg-current transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(10,8,4,0.97)", backdropFilter: "blur(24px)" }}
      >
        {NAV.map(n => (
          <button
            key={n.anchor}
            onClick={() => scrollTo(n.anchor)}
            className="font-sans text-2xl font-bold tracking-tight text-foreground hover:text-accent transition-colors"
          >
            {n.label}
          </button>
        ))}
        <button className="mt-2 rounded-full bg-accent px-8 py-3 font-mono text-sm tracking-[0.2em] uppercase text-[#0a0804] font-semibold">
          Викторина
        </button>
      </div>
    </>
  );
}

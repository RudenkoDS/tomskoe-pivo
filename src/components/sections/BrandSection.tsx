"use client";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";

const stats = [
  { label: "Год основания", value: "1876", note: "Карл Крюгер · Томск" },
  { label: "Производство", value: "175 млн", note: "литров в год" },
  { label: "Доля рынка", value: "2%", note: "по всей России" },
  { label: "Лет непрерывно", value: "150", note: "без остановки" },
];

export function BrandSection() {
  return (
    <section id="today" className="relative border-t border-amber-900/20 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32 overflow-hidden">
      {/* Subtle background text */}
      <div className="absolute bottom-0 right-0 font-sans font-black text-[20vw] text-white/[0.015] leading-none tracking-tighter select-none pointer-events-none">
        1876
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-16 md:grid md:grid-cols-[5fr_4fr] md:gap-20">
        <AnimatedSection className="flex flex-col gap-8">
          <AnimatedItem>
            <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase">Завод сегодня · 2026</p>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="max-w-[18ch] font-sans text-4xl font-black leading-[0.92] tracking-tighter text-foreground md:text-6xl">
              Варить пиво{" "}
              <span className="text-accent">честно.</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="max-w-[50ch] font-sans text-base leading-relaxed text-muted md:text-lg">
              Принцип Крюгера не изменился за 150 лет. Лучший солод, отборный хмель,
              вода из томских скважин и технологии мирового уровня. Имя на этикетке —
              это гарантия качества, как в 1876-м.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <div className="flex flex-wrap gap-3">
              <a href="#hero" className="group inline-flex items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0a0804] transition-all duration-200 hover:bg-accent/90">
                Начало истории ↑
              </a>
              <a href="#films" className="group inline-flex items-center gap-2 self-start rounded-full border border-amber-700/30 bg-amber-900/10 px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-amber-900/20">
                Смотреть AI-фильмы →
              </a>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="flex flex-col divide-y divide-amber-900/20 border-t border-amber-900/20 font-mono md:mt-3">
          {stats.map(row => (
            <AnimatedItem key={row.label}>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted">{row.label}</span>
                  <span className="font-sans text-[13px] text-muted/70">{row.note}</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-accent md:text-3xl">{row.value}</span>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

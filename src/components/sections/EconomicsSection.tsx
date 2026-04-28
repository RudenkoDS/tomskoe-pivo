"use client";
import { useRef, useState, useEffect } from "react";

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Огоньки по краю секции ── */
function EmberLine({ count = 18, side = "top" }: { count?: number; side?: "top" | "bottom" }) {
  return (
    <div className={`absolute left-0 right-0 ${side === "top" ? "top-0" : "bottom-0"} h-6 overflow-hidden pointer-events-none`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${(i / count) * 100 + Math.random() * 2}%`,
            width: `${1 + Math.random() * 1.5}px`,
            height: `${6 + Math.random() * 14}px`,
            background: `linear-gradient(to top, rgba(201,162,39,${0.6 + Math.random() * 0.4}), transparent)`,
            animation: `ember ${1.8 + Math.random() * 2.4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

const SALARY_DATA = [
  { label: "Ямщик", rub: "15–25", today: "180–300 тыс.", barH: 14, color: "rgba(201,162,39,0.35)" },
  { label: "Рабочий", rub: "12–20", today: "144–240 тыс.", barH: 11, color: "rgba(201,162,39,0.3)" },
  { label: "Служащий", rub: "30–50", today: "360–600 тыс.", barH: 22, color: "rgba(201,162,39,0.45)" },
  { label: "Пивовар ★", rub: "50–100", today: "600 тыс.–1,2 млн", barH: 38, color: "rgba(201,162,39,0.95)", highlight: true },
  { label: "Инженер", rub: "80–150", today: "960 тыс.–1,8 млн", barH: 52, color: "rgba(201,162,39,0.55)" },
  { label: "Купец 1-й", rub: "500–5000+", today: "6–60 млн", barH: 100, color: "rgba(201,162,39,0.7)" },
];

const PRICE_DATA = [
  { item: "Хлеб ржаной, кг", old: "3–5 коп.", now: "360–600 ₽" },
  { item: "Говядина, кг", old: "15–25 коп.", now: "1 800–3 000 ₽" },
  { item: "Водка, ведро ~12 л", old: "7–10 руб.", now: "84–120 тыс. ₽" },
  { item: "Аренда комнаты / мес", old: "5–15 руб.", now: "60–180 тыс. ₽" },
  { item: "Пара сапог", old: "3–8 руб.", now: "36–96 тыс. ₽" },
  { item: "Пиво Крюгера 0,5 л ★", old: "15–20 коп.", now: "1 800–2 400 ₽", highlight: true },
];

const WHY = [
  { n: "01", title: "33 800 жителей и рост +54%", body: "К 1897 году — 52 221 человек. Постоянно прибывающее население = постоянный спрос." },
  { n: "02", title: "Золотая элита с деньгами", body: "Купцы Асташев, Горохов, Гадалов. Доходы в миллионы рублей. Им нужно качественное пиво." },
  { n: "03", title: "100 000+ ямщиков на тракте", body: "Московско-Сибирский тракт шёл через Томск. Люди хотят холодного пива после дороги." },
  { n: "04", title: "Конкурентов практически нет", body: "Местного пива не было — всё привозное и дорогое. Рынок полностью открыт." },
  { n: "05", title: "Природный холод горы +4°C", body: "Склон Острожной горы давал постоянную температуру без льда и машин. Идеально для лагера." },
];

export function EconomicsSection() {
  const hdr = useReveal(0.15);
  const sal = useReveal(0.08);
  const prc = useReveal(0.08);
  const why = useReveal(0.08);

  return (
    <section id="economics" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      <style>{`
        @keyframes ember {
          0%,100% { transform: translateY(0) scaleX(1); opacity:.7 }
          50% { transform: translateY(-14px) scaleX(0.6); opacity:.3 }
        }
      `}</style>

      <EmberLine side="top" count={22} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

        {/* ── Заголовок ── */}
        <div ref={hdr.ref} style={{ opacity: hdr.visible ? 1 : 0, transform: hdr.visible ? "none" : "translateY(28px)", transition: "all .8s ease", willChange: "transform,opacity" }} className="mb-16">
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">Экономика · 1880–1900</p>
          <h2 className="font-sans text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.88] mb-6">
            Почему именно<br /><span className="text-accent">Томск?</span>
          </h2>
          <p className="font-sans text-lg text-muted max-w-[52ch] leading-relaxed">
            Крюгер не просто «приехал в Сибирь». Он выбрал Томск осознанно — понимал, где есть деньги и где нет пива.
          </p>
        </div>

        {/* ── Конвертер — большой баннер ── */}
        <div
          className="mb-16 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-10"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.09), rgba(201,162,39,0.02))",
            border: "1px solid rgba(201,162,39,0.22)",
            opacity: hdr.visible ? 1 : 0,
            transition: "opacity .9s ease .3s",
          }}
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-accent/60 uppercase mb-2">Курс пересчёта</p>
            <p className="font-sans text-4xl md:text-6xl font-black text-foreground leading-none">
              1 <span className="text-muted/50">рубль</span> <span className="text-muted/30 font-light">1890-х</span>
            </p>
          </div>
          <div className="text-5xl md:text-7xl font-black text-accent/30 leading-none hidden md:block">=</div>
          <div>
            <p className="font-sans text-4xl md:text-6xl font-black text-accent leading-none">~10 000–12 000 ₽</p>
            <p className="font-mono text-[11px] text-muted/50 mt-2">сегодня · все цены в таблице пересчитаны</p>
          </div>
        </div>

        {/* ── Зарплаты + Цены ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

          {/* Зарплаты */}
          <div ref={sal.ref} className="card-surface p-7 md:p-8" style={{ opacity: sal.visible ? 1 : 0, transform: sal.visible ? "none" : "translateX(-28px)", transition: "all .8s ease", willChange: "transform,opacity" }}>
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent/70 uppercase mb-1">Зарплаты в Томске</p>
            <p className="font-mono text-[10px] text-muted/40 mb-7">1880–1900 · руб/мес</p>

            {/* Бар-чарт */}
            <div className="flex items-end gap-2 mb-5" style={{ height: "140px" }}>
              {SALARY_DATA.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-t-md relative overflow-hidden"
                    style={{
                      height: sal.visible ? `${s.barH}%` : "0%",
                      background: s.highlight
                        ? "linear-gradient(to top, rgba(201,162,39,1), rgba(201,162,39,0.4))"
                        : s.color,
                      transition: `height .9s cubic-bezier(.34,1.56,.64,1) ${i * 90}ms`,
                      minHeight: "3px",
                      boxShadow: s.highlight ? "0 0 12px rgba(201,162,39,0.4)" : "none",
                    }}
                  >
                    {s.highlight && (
                      <div className="absolute inset-0 animate-pulse" style={{ background: "linear-gradient(to top, rgba(201,162,39,0.2), transparent)" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Легенда */}
            <div className="flex flex-col gap-2.5">
              {SALARY_DATA.map(s => (
                <div key={s.label} className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-[11px] ${s.highlight ? "text-accent font-semibold" : "text-muted/60"}`}>{s.label}</span>
                  <div className="flex-1 border-b border-dashed border-white/5" />
                  <div className="text-right">
                    <span className={`font-mono text-[11px] font-semibold ${s.highlight ? "text-accent" : "text-foreground/60"}`}>{s.rub} руб.</span>
                    <span className="font-mono text-[9px] text-muted/35 ml-2">≈ {s.today}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Цены */}
          <div ref={prc.ref} className="card-surface p-7 md:p-8" style={{ opacity: prc.visible ? 1 : 0, transform: prc.visible ? "none" : "translateX(28px)", transition: "all .8s ease", willChange: "transform,opacity" }}>
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent/70 uppercase mb-1">Цены в Томске</p>
            <p className="font-mono text-[10px] text-muted/40 mb-7">1880–1900 · архивные данные</p>

            <div className="flex flex-col gap-1">
              {PRICE_DATA.map((row, i) => (
                <div key={row.item}
                  className={`flex items-center gap-3 py-3.5 px-3 rounded-xl transition-colors ${row.highlight ? "bg-accent/8" : "hover:bg-white/[0.02]"}`}
                  style={{ opacity: prc.visible ? 1 : 0, transition: `opacity .5s ease ${i * 70}ms` }}
                >
                  <span className={`font-mono text-[11px] flex-1 leading-snug ${row.highlight ? "text-accent" : "text-muted/65"}`}>{row.item}</span>
                  <div className="text-right shrink-0">
                    <span className={`font-mono text-sm font-bold block ${row.highlight ? "text-accent" : "text-foreground/75"}`}>{row.old}</span>
                    <span className="font-mono text-[9px] text-muted/40">≈ {row.now}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-amber-900/15">
              <p className="font-mono text-[10px] text-muted/40 leading-relaxed">
                Бутылка пива Крюгера — как пачка хлеба. Доступно рабочему, привлекательно купцу.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5 причин — крупные карточки ── */}
        <div ref={why.ref}>
          <div style={{ opacity: why.visible ? 1 : 0, transition: "opacity .6s ease" }} className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-[0.4em] text-accent/70 uppercase">5 причин выбрать Томск</span>
            <div className="flex-1 h-px bg-accent/15" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY.map((w, i) => (
              <div key={w.n}
                className="card-surface p-7 group hover:border-accent/35 transition-all duration-300 cursor-default"
                style={{ opacity: why.visible ? 1 : 0, transform: why.visible ? "none" : "translateY(24px)", transition: `all .6s ease ${i * 80}ms`, willChange: "transform,opacity" }}
              >
                <span className="font-sans text-5xl font-black text-accent/20 group-hover:text-accent/35 transition-colors leading-none block mb-4">{w.n}</span>
                <p className="font-sans text-base font-bold text-foreground mb-2 leading-snug">{w.title}</p>
                <p className="font-mono text-[11px] text-muted/65 leading-relaxed">{w.body}</p>
              </div>
            ))}

            {/* Итоговая карточка */}
            <div className="p-7 rounded-2xl flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.02))",
                border: "1px solid rgba(201,162,39,0.2)",
                opacity: why.visible ? 1 : 0,
                transform: why.visible ? "none" : "translateY(24px)",
                transition: "all .6s ease 400ms",
              }}
            >
              <div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-accent/50 uppercase mb-4">Итог</p>
                <p className="font-sans text-xl md:text-2xl font-bold text-foreground/85 italic leading-snug">
                  «Он понял это<br />лучше, чем многие»
                </p>
              </div>
              <p className="font-mono text-[10px] text-muted/50 mt-4">Карл Крюгер · Томск · 1876</p>
            </div>
          </div>
        </div>
      </div>

      <EmberLine side="bottom" count={16} />
    </section>
  );
}

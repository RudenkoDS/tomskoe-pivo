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
            left: `${(i / count) * 100 + (i % 3) * 0.7}%`,
            width: `${1 + (i % 3) * 0.5}px`,
            height: `${6 + (i % 5) * 3}px`,
            background: `linear-gradient(to top, rgba(201,162,39,${0.5 + (i % 4) * 0.12}), transparent)`,
            animation: `ember ${1.8 + (i % 5) * 0.5}s ease-in-out infinite`,
            animationDelay: `${(i % 7) * 0.4}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

const SALARY_DATA = [
  { label: "Ямщик",     rub: "15–25",    today: "180–300 тыс.",       pct: 14,  color: "rgba(201,162,39,0.35)" },
  { label: "Рабочий",   rub: "12–20",    today: "144–240 тыс.",       pct: 11,  color: "rgba(201,162,39,0.28)" },
  { label: "Служащий",  rub: "30–50",    today: "360–600 тыс.",       pct: 22,  color: "rgba(201,162,39,0.42)" },
  { label: "Пивовар ★", rub: "50–100",   today: "600 тыс. – 1,2 млн", pct: 38,  color: "rgba(201,162,39,1)",    highlight: true },
  { label: "Инженер",   rub: "80–150",   today: "960 тыс. – 1,8 млн", pct: 52,  color: "rgba(201,162,39,0.52)" },
  { label: "Купец 1-й", rub: "500–5000+",today: "6–60 млн",           pct: 100, color: "rgba(201,162,39,0.65)" },
];

const PRICE_DATA = [
  { item: "Хлеб ржаной, кг",         old: "3–5 коп.",    now: "360–600 ₽" },
  { item: "Говядина, кг",             old: "15–25 коп.",  now: "1 800–3 000 ₽" },
  { item: "Водка, ведро ~12 л",       old: "7–10 руб.",   now: "84–120 тыс. ₽" },
  { item: "Аренда комнаты / мес",     old: "5–15 руб.",   now: "60–180 тыс. ₽" },
  { item: "Пара сапог",               old: "3–8 руб.",    now: "36–96 тыс. ₽" },
  { item: "Пиво Крюгера 0,5 л ★",    old: "15–20 коп.",  now: "1 800–2 400 ₽", highlight: true },
];

const WHY = [
  { n: "01", title: "33 800 жителей и рост +54%",      body: "К 1897 году — 52 221 человек. Постоянно прибывающее население = постоянный спрос." },
  { n: "02", title: "Золотая элита с деньгами",         body: "Купцы Асташев, Горохов, Гадалов. Доходы в миллионы рублей. Им нужно качественное пиво." },
  { n: "03", title: "100 000+ ямщиков на тракте",       body: "Московско-Сибирский тракт шёл через Томск. Люди хотят холодного пива после дороги." },
  { n: "04", title: "Конкурентов практически нет",      body: "Местного пива не было — всё привозное и дорогое. Рынок полностью открыт." },
  { n: "05", title: "Природный холод горы +4°C",        body: "Склон Острожной горы давал постоянную температуру без льда и машин. Идеально для лагера." },
];

/* ── Калькулятор зарплат ── */
const RATIO = 11000; // средний коэфф. пересчёта
const SALARY_TABLE = [
  { role: "Ямщик",      rubMin: 15,  rubMax: 25   },
  { role: "Рабочий",    rubMin: 12,  rubMax: 20   },
  { role: "Служащий",   rubMin: 30,  rubMax: 50   },
  { role: "Пивовар",    rubMin: 50,  rubMax: 100  },
  { role: "Инженер",    rubMin: 80,  rubMax: 150  },
  { role: "Купец 1-й",  rubMin: 500, rubMax: 5000 },
];

function SalaryCalc() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<null | { rubMin: number; rubMax: number; role: string; eq: string }>(null);

  const calculate = () => {
    const num = parseFloat(income.replace(/\s/g, "").replace(",", "."));
    if (!num || num <= 0) return;
    const rubEquiv = num / RATIO;
    // Найти ближайшую профессию
    let best = SALARY_TABLE[0];
    let bestDist = Infinity;
    for (const s of SALARY_TABLE) {
      const mid = (s.rubMin + s.rubMax) / 2;
      const d = Math.abs(rubEquiv - mid);
      if (d < bestDist) { bestDist = d; best = s; }
    }
    const eqMin = Math.round(best.rubMin * RATIO / 1000) * 1000;
    const eqMax = Math.round(best.rubMax * RATIO / 1000) * 1000;
    const fmtK = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)} млн ₽` : `${(v / 1000).toFixed(0)} тыс. ₽`;
    setResult({ rubMin: best.rubMin, rubMax: best.rubMax, role: best.role, eq: `${fmtK(eqMin)} – ${fmtK(eqMax)}` });
  };

  return (
    <div className="rounded-2xl p-7 md:p-9" style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.07), rgba(201,162,39,0.02))", border: "1px solid rgba(201,162,39,0.2)" }}>
      <p className="font-mono text-[10px] tracking-[0.4em] text-accent/70 uppercase mb-1">Персональный пересчёт</p>
      <p className="font-sans text-xl md:text-2xl font-black text-foreground mb-2">Сколько вы зарабатывали бы в 1900-м?</p>
      <p className="font-mono text-[10px] text-muted/50 mb-6">Данные не собираются и нигде не сохраняются.</p>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="number"
            value={income}
            onChange={e => { setIncome(e.target.value); setResult(null); }}
            onKeyDown={e => e.key === "Enter" && calculate()}
            placeholder="Ваша зарплата в рублях ₽"
            className="w-full bg-white/5 border border-accent/20 rounded-xl px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <button
          onClick={calculate}
          className="px-6 py-3 rounded-xl font-mono text-[11px] tracking-[0.2em] uppercase transition-all"
          style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.35)", color: "rgba(201,162,39,0.9)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,162,39,0.25)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,162,39,0.15)")}
        >
          Пересчитать
        </button>
      </div>

      {result && (
        <div className="mt-6 p-5 rounded-xl" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)" }}>
          <p className="font-mono text-[10px] text-accent/60 uppercase tracking-widest mb-3">Результат</p>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div>
              <p className="font-sans text-3xl font-black text-accent leading-none">{result.rubMin}–{result.rubMax} <span className="text-lg text-accent/60">руб./мес.</span></p>
              <p className="font-mono text-[11px] text-muted/70 mt-1">Профессия: <span className="text-foreground/80">{result.role}</span></p>
            </div>
            <div className="text-accent/20 font-black text-3xl hidden md:block">=</div>
            <div>
              <p className="font-sans text-xl font-bold text-foreground/80">≈ {result.eq}</p>
              <p className="font-mono text-[10px] text-muted/50 mt-1">сегодня по курсу 1 руб. 1890-х ≈ 10–12 тыс. ₽</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function EconomicsSection() {
  const hdr = useReveal(0.15);
  const sal = useReveal(0.08);
  const prc = useReveal(0.08);
  const why = useReveal(0.08);
  const calc = useReveal(0.08);

  return (
    <section id="economics" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      <style>{`
        @keyframes ember {
          0%,100% { transform: translateY(0) scaleX(1); opacity:.7 }
          50% { transform: translateY(-14px) scaleX(0.6); opacity:.3 }
        }
        @keyframes bar-grow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
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
          className="mb-10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-10"
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

        {/* ── ДАШБОРД: зарплаты + цены ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* ── Бар-диаграмма зарплат — дашборд стиль ── */}
          <div ref={sal.ref} className="card-surface p-6 md:p-8" style={{ opacity: sal.visible ? 1 : 0, transform: sal.visible ? "none" : "translateX(-28px)", transition: "all .8s ease", willChange: "transform,opacity" }}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] text-accent/70 uppercase mb-1">Зарплаты в Томске</p>
                <p className="font-mono text-[10px] text-muted/40">1880–1900 · руб/мес</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-3xl font-black text-accent">50–100</p>
                <p className="font-mono text-[9px] text-accent/60 uppercase">руб. пивовар</p>
              </div>
            </div>

            {/* Горизонтальные полосы-бары — дашборд стиль */}
            <div className="flex flex-col gap-3">
              {SALARY_DATA.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-[11px] ${s.highlight ? "text-accent font-semibold" : "text-muted/65"}`}>{s.label}</span>
                    <div className="text-right">
                      <span className={`font-mono text-[12px] font-bold ${s.highlight ? "text-accent" : "text-foreground/70"}`}>{s.rub} руб.</span>
                      <span className="font-mono text-[9px] text-muted/40 ml-2">≈ {s.today}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        width: sal.visible ? `${s.pct}%` : "0%",
                        background: s.highlight
                          ? "linear-gradient(to right, rgba(201,162,39,1), rgba(201,162,39,0.6))"
                          : s.color,
                        transition: `width .9s cubic-bezier(.34,1.2,.64,1) ${i * 80}ms`,
                        boxShadow: s.highlight ? "0 0 8px rgba(201,162,39,0.5)" : "none",
                      }}
                    >
                      {s.highlight && (
                        <div className="absolute inset-0 animate-pulse" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Акцент-плашка */}
            <div className="mt-6 rounded-xl p-4 flex items-center gap-4" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)" }}>
              <div>
                <p className="font-sans text-2xl font-black text-accent leading-none">×5–10</p>
                <p className="font-mono text-[9px] text-muted/50 uppercase mt-0.5">к рабочему</p>
              </div>
              <p className="font-mono text-[10px] text-muted/70 leading-relaxed">
                Пивовар зарабатывал как 5–10 рабочих. Дефицитная профессия — конкуренции почти нет.
              </p>
            </div>
          </div>

          {/* ── Цены — дашборд с прогресс-плашками ── */}
          <div ref={prc.ref} className="card-surface p-6 md:p-8" style={{ opacity: prc.visible ? 1 : 0, transform: prc.visible ? "none" : "translateX(28px)", transition: "all .8s ease", willChange: "transform,opacity" }}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] text-accent/70 uppercase mb-1">Цены в Томске</p>
                <p className="font-mono text-[10px] text-muted/40">1880–1900 · архивные данные</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-3xl font-black text-accent">15–20</p>
                <p className="font-mono text-[9px] text-accent/60 uppercase">коп. за пиво</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {PRICE_DATA.map((row, i) => {
                // Нормализация для полоски (чтобы водка была максимумом)
                const maxVal = 10;
                const vals: Record<string, number> = {
                  "Хлеб ржаной, кг": 0.5, "Говядина, кг": 2, "Водка, ведро ~12 л": maxVal,
                  "Аренда комнаты / мес": 8, "Пара сапог": 5, "Пиво Крюгера 0,5 л ★": 0.175,
                };
                const pctBar = Math.round((vals[row.item] ?? 1) / maxVal * 100);
                return (
                  <div key={row.item}
                    className={`rounded-xl px-4 py-3 ${row.highlight ? "" : ""}`}
                    style={{
                      background: row.highlight ? "rgba(201,162,39,0.07)" : "transparent",
                      border: row.highlight ? "1px solid rgba(201,162,39,0.2)" : "1px solid transparent",
                      opacity: prc.visible ? 1 : 0,
                      transition: `opacity .5s ease ${i * 60}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className={`font-mono text-[11px] ${row.highlight ? "text-accent" : "text-muted/70"}`}>{row.item}</span>
                      <div className="text-right shrink-0">
                        <span className={`font-mono text-sm font-bold ${row.highlight ? "text-accent" : "text-foreground/80"}`}>{row.old}</span>
                        <span className="font-mono text-[9px] text-muted/40 ml-2">≈ {row.now}</span>
                      </div>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: prc.visible ? `${pctBar}%` : "0%",
                          background: row.highlight
                            ? "linear-gradient(to right, rgba(201,162,39,0.9), rgba(201,162,39,0.4))"
                            : "rgba(201,162,39,0.3)",
                          transition: `width .8s ease ${i * 60}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-amber-900/15">
              <p className="font-mono text-[10px] text-muted/50 leading-relaxed">
                Бутылка пива Крюгера — как пачка хлеба. Доступно рабочему, привлекательно купцу.
              </p>
            </div>
          </div>
        </div>

        {/* ── Калькулятор ── */}
        <div ref={calc.ref} className="mb-10" style={{ opacity: calc.visible ? 1 : 0, transform: calc.visible ? "none" : "translateY(24px)", transition: "all .8s ease", willChange: "transform,opacity" }}>
          <SalaryCalc />
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

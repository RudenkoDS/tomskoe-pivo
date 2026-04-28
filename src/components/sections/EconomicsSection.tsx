"use client";
import { useRef, useState, useEffect } from "react";

function useReveal(threshold = 0.15) {
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

// Данные о зарплатах — высота бара в % (логарифмическая шкала визуально)
const SALARY_BARS = [
  { label: "Ямщик", range: "15–25 руб/мес", today: "180–300 тыс. ₽", barH: 15, highlight: false },
  { label: "Рабочий", range: "12–20 руб/мес", today: "144–240 тыс. ₽", barH: 12, highlight: false },
  { label: "Служащий", range: "30–50 руб/мес", today: "360–600 тыс. ₽", barH: 25, highlight: false },
  { label: "Пивовар", range: "50–100 руб/мес", today: "600 тыс. – 1,2 млн ₽", barH: 40, highlight: true },
  { label: "Инженер", range: "80–150 руб/мес", today: "960 тыс. – 1,8 млн ₽", barH: 55, highlight: false },
  { label: "Купец 1-й гильдии", range: "500–5000+ руб/год", today: "6–60 млн ₽/год", barH: 100, highlight: false },
];

const PRICE_ROWS = [
  { item: "Кг ржаного хлеба", price1890: "3–5 коп.", today: "360–600 ₽" },
  { item: "Кг говядины", price1890: "15–25 коп.", today: "1 800–3 000 ₽" },
  { item: "Водка (ведро ~12 л)", price1890: "7–10 руб.", today: "84 000–120 000 ₽" },
  { item: "Аренда комнаты / мес", price1890: "5–15 руб.", today: "60–180 тыс. ₽" },
  { item: "Пара сапог", price1890: "3–8 руб.", today: "36–96 тыс. ₽" },
  { item: "Бутылка пива Крюгера (0,5 л)", price1890: "15–20 коп.", today: "1 800–2 400 ₽", highlight: true },
];

const WHY_TOMSK = [
  {
    num: "01",
    title: "33 800 жителей и быстрый рост",
    text: "К 1897 году — 52 221. Постоянно прибывающее население значит постоянный спрос.",
  },
  {
    num: "02",
    title: "Золотая элита с деньгами",
    text: "Купцы-золотопромышленники: Асташев, Горохов, Гадалов. Доходы в миллионы. Им нужно качественное пиво.",
  },
  {
    num: "03",
    title: "Ямщики и рабочий класс",
    text: "100 000+ ямщиков на тракте. Постоянный поток людей, которые хотят выпить холодного пива после дороги.",
  },
  {
    num: "04",
    title: "Конкурентов практически нет",
    text: "Местного производства нормального пива не было. Привозное — дорогое. Рынок открыт.",
  },
  {
    num: "05",
    title: "Природный холод горы",
    text: "Склон Острожной горы — постоянные +4°C в подвалах без машин и льда. Идеальные условия для лагерного пива.",
  },
];

export function EconomicsSection() {
  const headerReveal = useReveal(0.2);
  const salaryReveal = useReveal(0.1);
  const priceReveal = useReveal(0.1);
  const whyReveal = useReveal(0.1);

  return (
    <section id="economics" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

        {/* Заголовок */}
        <div
          ref={headerReveal.ref}
          className="mb-16"
          style={{
            opacity: headerReveal.visible ? 1 : 0,
            transform: headerReveal.visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            willChange: "transform, opacity",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">
            Экономика · 1880–1900
          </p>
          <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
            Почему именно<br />
            <span className="text-accent">Томск?</span>
          </h2>
          <p className="mt-5 font-sans text-base md:text-lg text-muted max-w-[54ch] leading-relaxed">
            Крюгер не просто «приехал в Сибирь». Он выбрал Томск осознанно — потому что
            понимал: здесь есть люди, которые будут платить за хорошее пиво.
          </p>
        </div>

        {/* Конвертер */}
        <div
          className="mb-12 p-6 md:p-8 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.02))",
            border: "1px solid rgba(201,162,39,0.2)",
            opacity: headerReveal.visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-accent/60 uppercase mb-3">Курс пересчёта</p>
          <p className="font-sans text-3xl md:text-4xl font-black text-foreground leading-none mb-2">
            1 рубль 1890-х
            <span className="text-muted/50 mx-3 font-light">=</span>
            <span className="text-accent">~10 000–12 000 ₽</span>
          </p>
          <p className="font-mono text-[11px] text-muted/60 mt-2">
            Все цены ниже даны в современном эквиваленте для понимания масштаба
          </p>
        </div>

        {/* Двухколоночная раскладка: зарплаты + цены */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Диаграмма зарплат */}
          <div
            ref={salaryReveal.ref}
            className="card-surface p-6 md:p-8"
            style={{
              opacity: salaryReveal.visible ? 1 : 0,
              transform: salaryReveal.visible ? "translateX(0)" : "translateX(-32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              willChange: "transform, opacity",
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-1">
              Зарплаты в Томске
            </p>
            <p className="font-mono text-[10px] text-muted/50 mb-6">1880–1900 годы</p>

            {/* Бары */}
            <div className="flex items-end gap-2 h-36 mb-4">
              {SALARY_BARS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: salaryReveal.visible ? `${s.barH}%` : "0%",
                      background: s.highlight
                        ? "linear-gradient(to top, rgba(201,162,39,1), rgba(201,162,39,0.5))"
                        : "linear-gradient(to top, rgba(201,162,39,0.4), rgba(201,162,39,0.15))",
                      transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms`,
                      minHeight: "2px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Легенда */}
            <div className="flex flex-col gap-2 mt-2">
              {SALARY_BARS.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <span className={`font-mono text-[10px] ${s.highlight ? "text-accent" : "text-muted/70"}`}>
                    {s.label}
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-muted/50 block">{s.range}</span>
                    <span className="font-mono text-[9px] text-muted/35">≈ {s.today}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Таблица цен */}
          <div
            ref={priceReveal.ref}
            className="card-surface p-6 md:p-8"
            style={{
              opacity: priceReveal.visible ? 1 : 0,
              transform: priceReveal.visible ? "translateX(0)" : "translateX(32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              willChange: "transform, opacity",
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-1">
              Цены в Томске
            </p>
            <p className="font-mono text-[10px] text-muted/50 mb-6">1880–1900 годы</p>

            <div className="flex flex-col divide-y divide-amber-900/15">
              {PRICE_ROWS.map((row, i) => (
                <div
                  key={row.item}
                  className={`flex items-center justify-between gap-3 py-3 ${row.highlight ? "rounded-lg px-2 -mx-2" : ""}`}
                  style={row.highlight ? {
                    background: "rgba(201,162,39,0.06)",
                    opacity: priceReveal.visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 60}ms`,
                  } : {
                    opacity: priceReveal.visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 60}ms`,
                  }}
                >
                  <span className={`font-mono text-[10px] leading-relaxed ${row.highlight ? "text-accent" : "text-muted/70"}`}>
                    {row.item}
                    {row.highlight && <span className="ml-1 text-accent/50">★</span>}
                  </span>
                  <div className="text-right shrink-0">
                    <span className={`font-mono text-[11px] font-bold block ${row.highlight ? "text-accent" : "text-foreground/70"}`}>
                      {row.price1890}
                    </span>
                    <span className="font-mono text-[9px] text-muted/40">≈ {row.today}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 font-mono text-[9px] text-muted/30 leading-relaxed">
              Бутылка пива Крюгера стоила ~15–20 коп. — примерно как пачка хлеба.
              Доступно для рабочего, но качественно для купца.
            </p>
          </div>
        </div>

        {/* Почему Томск — 5 пунктов */}
        <div ref={whyReveal.ref}>
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              opacity: whyReveal.visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.4em] text-accent/70 uppercase">
              5 причин выбрать Томск
            </span>
            <div className="flex-1 h-px bg-amber-900/25" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_TOMSK.map((item, i) => (
              <div
                key={item.num}
                className="card-surface p-6 flex flex-col gap-3 group hover:border-accent/30 transition-colors duration-300"
                style={{
                  opacity: whyReveal.visible ? 1 : 0,
                  transform: whyReveal.visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-sans text-3xl font-black text-accent/25 leading-none shrink-0 group-hover:text-accent/40 transition-colors">
                    {item.num}
                  </span>
                  <p className="font-sans text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                </div>
                <p className="font-mono text-[10px] text-muted/70 leading-relaxed">{item.text}</p>
              </div>
            ))}
            {/* Итоговая цитата — 6-й блок */}
            <div
              className="p-6 rounded-2xl flex flex-col justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(201,162,39,0.07), rgba(201,162,39,0.02))",
                border: "1px solid rgba(201,162,39,0.18)",
                opacity: whyReveal.visible ? 1 : 0,
                transform: whyReveal.visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease 400ms, transform 0.6s ease 400ms",
                willChange: "transform, opacity",
              }}
            >
              <p className="font-mono text-[8px] tracking-[0.3em] text-accent/50 uppercase mb-3">Итог</p>
              <p className="font-sans text-base md:text-lg text-foreground/80 italic leading-snug">
                «Он понял это лучше, чем многие»
              </p>
              <p className="mt-3 font-mono text-[9px] text-muted/50">
                Карл Крюгер выбрал Томск не случайно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

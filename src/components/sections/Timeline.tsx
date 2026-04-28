"use client";
import { useRef, useState } from "react";

const EVENTS = [
  {
    year: "1876",
    title: "Основание",
    text: "9 сентября. Карл Крюгер заложил первый камень пивоварни у подножия Острожной горы в Томске. Приехал из Германии с дисциплиной пивовара и инженерным умом.",
    accent: true,
  },
  {
    year: "1877",
    title: "Первая варка",
    text: "Завод на 4 человека. Первое пиво отгружено в город. Начало легенды.",
    accent: false,
  },
  {
    year: "1884",
    title: "Московский тракт",
    text: "Университет потребовал землю — Крюгер не стал спорить и перенёс завод к склону Острожной горы. Подвалы врезали в землю: постоянные +4°C без льда и машин.",
    accent: true,
  },
  {
    year: "1890",
    title: "Роберт Крюгер",
    text: "Племянник Карла вводит паровые двигатели и пастеризацию. Мощность растёт с 10 000 до 50 000 вёдер в год. Начало промышленной эры.",
    accent: false,
  },
  {
    year: "1900",
    title: "Медали Парижа",
    text: "Томское «Баварское» получает награды на парижской и генуэзской выставках. Газеты пишут: конкурирует с лучшими немецкими сортами.",
    accent: true,
  },
  {
    year: "1914",
    title: "Война и сухой закон",
    text: "Российская империя объявляет «сухой закон». Завод переходит на «ячменный кофе» и безалкогольные напитки. Выживает там, где другие закрылись навсегда.",
    accent: false,
  },
  {
    year: "1941",
    title: "«Жидкий хлеб»",
    text: "Мужчины на фронте. За варочными котлами — женщины и подростки. Солодовая каша стала питательной добавкой для раненых в госпиталях Томска.",
    accent: true,
  },
  {
    year: "1987",
    title: "Точка излома",
    text: "Антиалкогольная кампания. Пиво сливают в канализацию. Завод на грани закрытия. Но не закрылся.",
    accent: false,
  },
  {
    year: "1991",
    title: "Возрождение",
    text: "Новый директор в резиновых сапогах. Второе рождение завода. Из руин — в лидеры сибирского рынка.",
    accent: true,
  },
  {
    year: "2026",
    title: "150 лет",
    text: "175 млн литров в год. 2% рынка страны. Старейшая пивоварня за Уралом. Принцип Крюгера не изменился.",
    accent: true,
  },
];

export function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <section id="soviet" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      {/* Big background year */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-sans font-black text-[30vw] text-white/[0.02] leading-none tracking-tighter transition-all duration-500"
        >
          {EVENTS[active].year}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">Хронология · 1876–2026</p>
          <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
            150 лет<br />
            <span className="text-accent">истории</span>
          </h2>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          {/* Timeline list */}
          <div className="flex flex-col gap-0">
            {EVENTS.map((e, i) => (
              <button
                key={e.year}
                onClick={() => setActive(i)}
                className={`text-left flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 group ${active === i ? "bg-amber-900/15 border border-amber-900/25" : "hover:bg-white/3"}`}
              >
                <span className={`font-mono text-sm font-bold tabular-nums w-12 shrink-0 transition-colors ${active === i ? "text-accent" : "text-muted/50 group-hover:text-muted"}`}>
                  {e.year}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${active === i ? "bg-accent" : "bg-muted/20 group-hover:bg-muted/40"}`} />
                <span className={`font-sans text-sm transition-colors ${active === i ? "text-foreground font-medium" : "text-muted/70 group-hover:text-muted"}`}>
                  {e.title}
                </span>
                {e.accent && active !== i && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Active detail */}
          <div className="card-surface p-8 md:p-10">
            <p className="font-mono text-[10px] tracking-[0.4em] text-accent/70 uppercase mb-4">
              {EVENTS[active].year}
            </p>
            <h3 className="font-sans text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-5 leading-tight">
              {EVENTS[active].title}
            </h3>
            <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
              {EVENTS[active].text}
            </p>

            {/* Navigation dots */}
            <div className="flex gap-2 mt-8">
              {EVENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${i === active ? "w-6 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-muted/25 hover:bg-muted/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

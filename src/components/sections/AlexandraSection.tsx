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

const BARLEY_BARS = [
  { month: "Авг 1914", value: 20, label: "20 пудов" },
  { month: "Окт 1914", value: 60, label: "60 пудов" },
  { month: "Янв 1915", value: 130, label: "130 пудов" },
  { month: "Апр 1915", value: 200, label: "200 пудов" },
  { month: "Авг 1915", value: 280, label: "280 пудов" },
  { month: "Янв 1916", value: 350, label: "350 пудов" },
  { month: "Апр 1916", value: 400, label: "400 пудов" },
];

export function AlexandraSection() {
  const headerReveal = useReveal(0.2);
  const quoteReveal = useReveal(0.15);
  const statsReveal = useReveal(0.1);
  const chartReveal = useReveal(0.1);
  const bottleReveal = useReveal(0.1);

  return (
    <section id="war" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      {/* Фоновый текст */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-sans font-black text-[25vw] text-white/[0.018] leading-none tracking-tighter">
          1914
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

        {/* Заголовок */}
        <div
          ref={headerReveal.ref}
          style={{
            opacity: headerReveal.visible ? 1 : 0,
            transform: headerReveal.visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            willChange: "transform, opacity",
          }}
          className="mb-16"
        >
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">
            1914–1916 · Невидимый фронт
          </p>
          <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
            Александра<br /><span className="text-accent">Крюгер</span>
          </h2>
          <p className="mt-5 font-sans text-base md:text-lg text-muted max-w-[54ch] leading-relaxed">
            Война началась — Роберт застрял в Германии. Россия объявила сухой закон.
            Пиво оказалось под запретом. Александра осталась одна.
          </p>
        </div>

        {/* Основная раскладка: цитата + статистика */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-10">

          {/* Цитата и история */}
          <div
            ref={quoteReveal.ref}
            className="card-surface p-8 md:p-10 flex flex-col justify-between"
            style={{
              opacity: quoteReveal.visible ? 1 : 0,
              transform: quoteReveal.visible ? "translateX(0)" : "translateX(-32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              willChange: "transform, opacity",
            }}
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 uppercase mb-5">
                Решение · 1914
              </p>
              <p className="font-sans text-2xl md:text-3xl text-foreground leading-snug italic font-light mb-6">
                «Пока есть зерно — завод живёт»
              </p>
              <div className="h-px bg-accent/15 mb-6" />
              <p className="font-sans text-base text-muted leading-relaxed mb-4">
                Когда пиво запретили, Александра не закрыла завод. Она запустила производство
                <strong className="text-foreground/80"> ячменного кофе</strong> — горячий напиток из жареного ячменя,
                популярный в Германии и технологически близкий к пивоварению.
              </p>
              <p className="font-sans text-base text-muted leading-relaxed">
                Это был гениальный манёвр: оборудование работало, сотрудники получали жалованье,
                а завод сохранял юридический статус и право на здание. Когда война кончилась —
                вернуться к пиву было просто.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-accent/30 bg-accent/5 flex items-center justify-center text-accent font-sans font-black text-xl">А</div>
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">Александра Крюгер</p>
                <p className="font-mono text-[10px] text-muted">Управляющая · 1914–1916</p>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div
            ref={statsReveal.ref}
            className="flex flex-col gap-4"
            style={{
              opacity: statsReveal.visible ? 1 : 0,
              transform: statsReveal.visible ? "translateX(0)" : "translateX(32px)",
              transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
              willChange: "transform, opacity",
            }}
          >
            {[
              { val: "400", unit: "пудов/мес", desc: "Максимальный объём ячменного кофе", sub: "≈ 6,5 тонны в месяц" },
              { val: "2", unit: "года", desc: "Непрерывная работа под запретом", sub: "1914–1916, без остановки" },
              { val: "0", unit: "закрытий", desc: "Завод пережил войну и сухой закон", sub: "Единственный в регионе" },
            ].map((s, i) => (
              <div
                key={s.desc}
                className="card-surface p-6 flex flex-col gap-2"
                style={{
                  opacity: statsReveal.visible ? 1 : 0,
                  transform: statsReveal.visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`,
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-black text-accent">{s.val}</span>
                  <span className="font-mono text-sm text-accent/70">{s.unit}</span>
                </div>
                <p className="font-sans text-sm text-foreground/80">{s.desc}</p>
                <p className="font-mono text-[10px] text-muted/60">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* График роста производства ячменного кофе */}
        <div
          ref={chartReveal.ref}
          className="card-surface p-6 md:p-8 mb-10"
          style={{
            opacity: chartReveal.visible ? 1 : 0,
            transform: chartReveal.visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            willChange: "transform, opacity",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-1">
            Производство ячменного кофе · 1914–1916
          </p>
          <p className="font-mono text-[10px] text-muted/50 mb-6">
            Объём в пудах в месяц (1 пуд ≈ 16,4 кг)
          </p>
          <div className="flex items-end gap-3 h-32 md:h-40">
            {BARLEY_BARS.map((bar, i) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 flex-1">
                <p className="font-mono text-[9px] text-accent/80 text-center transition-all duration-300"
                  style={{ opacity: chartReveal.visible ? 1 : 0, transition: `opacity 0.4s ease ${i * 80 + 400}ms` }}>
                  {bar.label}
                </p>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: chartReveal.visible ? `${(bar.value / 400) * 100}%` : "0%",
                    background: `linear-gradient(to top, rgba(201,162,39,0.9), rgba(201,162,39,0.4))`,
                    transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms`,
                    minHeight: "2px",
                  }}
                />
                <p className="font-mono text-[8px] text-muted/60 text-center leading-tight">{bar.month}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[9px] text-muted/40">
            Завод не остановился ни на один день. За 2 года сохранил оборудование, команду и право на производство.
          </p>
        </div>

        {/* 1927 — Конец династии + находка бутылки 2012 */}
        <div
          ref={bottleReveal.ref}
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6"
          style={{
            opacity: bottleReveal.visible ? 1 : 0,
            transform: bottleReveal.visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            willChange: "transform, opacity",
          }}
        >
          {/* 1927 */}
          <div className="card-surface p-7 md:p-8 flex flex-col gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-accent/60 uppercase mb-3">1927</p>
              <h3 className="font-sans text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-tight mb-4">
                Конец<br />династии
              </h3>
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed">
              В августе 1927 года семья Крюгеров навсегда покинула Томск. Советская власть
              национализировала завод. Они уезжали с одним чемоданом — но оставили рецепты,
              технологии и имя.
            </p>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Имя вернулось в город спустя 70 лет — вместе с возрождением завода в 1990-х.
            </p>
            <div className="mt-auto pt-4 border-t border-amber-900/20 flex items-center gap-3">
              <span className="font-sans text-3xl font-black text-accent/30">70</span>
              <span className="font-mono text-[10px] text-muted/60 uppercase leading-tight">лет без<br/>семьи Крюгер</span>
            </div>
          </div>

          {/* Находка бутылки 2012 */}
          <div
            className="p-7 md:p-8 flex flex-col gap-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(201,162,39,0.07), rgba(201,162,39,0.02))",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-accent/80 uppercase mb-3">
                2012 · Находка
              </p>
              <h3 className="font-sans text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-tight mb-4">
                122 года<br /><span className="text-accent">в земле</span>
              </h3>
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed">
              В июле 2012 года на площади Батенькова при строительстве гостиницы нашли
              целую запечатанную бутылку пива Крюгера — пролежавшую в земле с эпохи
              великого наводнения 1890 года.
            </p>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Пиво сохранилось идеально чистым. Специалисты завода совместно с немецкими
              экспертами восстановили рецепт. Так родилось <strong className="text-foreground/80">«Богемское»</strong> — пиво
              по рецепту 1884 года.
            </p>
            <div className="mt-auto pt-4 border-t border-accent/15 flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted/50 leading-relaxed">
                Площадь Батенькова · Томск · 2012<br />
                «Богемское» — рецепт 1884 года
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

const TOMSK_CARDS = [
  {
    stat: "~33 800",
    label: "Жителей в 1876",
    detail: "К 1897 году — 52 221. Рост на 54% за 17 лет. Быстрее любой российской столицы.",
    delay: 0,
  },
  {
    stat: "Золото",
    label: "Двигатель экономики",
    detail: "Купцы Поповы нашли золото на Енисее в 1828-м. Томск стал финансовым центром всей сибирской добычи.",
    delay: 60,
  },
  {
    stat: "Купечество",
    label: "Платёжеспособная элита",
    detail: "Гадалов, Кухтерин, Асташев. Доходы купцов 1-й гильдии — миллионы рублей в год. Им нужно хорошее пиво.",
    delay: 120,
  },
  {
    stat: "100 000+",
    label: "Ямщиков на тракте",
    detail: "Московско-Сибирский тракт. Томск — главный узел: смена лошадей, отдых, разгрузка. Постоянный поток людей.",
    delay: 180,
  },
  {
    stat: "1878",
    label: "Первый университет за Уралом",
    detail: "Указ Александра II об открытии именно в Томске. Купцы дали 400 000 рублей на строительство.",
    delay: 240,
  },
  {
    stat: "1890",
    label: "Великое наводнение",
    detail: "Томь и Ушайка вышли из берегов. На площади Батенькова плавали лодки. Там же в 2012-м нашли бутылку Крюгера.",
    delay: 300,
  },
  {
    stat: "1896",
    label: "Транссиб обошёл Томск",
    detail: "Мост через Обь построили в Новосибирске — дешевле. Томск получил 100-вёрстную ветку и остался региональным центром.",
    delay: 360,
  },
  {
    stat: "Областники",
    label: "Сибирская идентичность",
    detail: "Потанин и Ядринцев считали Сибирь колонией Петербурга. Боролись за университет и справедливый раздел доходов.",
    delay: 420,
  },
];

const WORLD_CARDS = [
  {
    year: "1871",
    label: "Объединение Германии",
    detail: "Отто фон Бисмарк объединил немецкие земли. Страна вошла в промышленный бум. Именно там учился пивному делу Карл Крюгер.",
    delay: 0,
  },
  {
    year: "1870–1900",
    label: "Belle Époque",
    detail: "Время мира и расцвета в Европе. Первые Олимпийские игры — 1896, Эйфелева башня — 1889. Мир менялся стремительно.",
    delay: 80,
  },
  {
    year: "1861–1881",
    label: "Реформы Александра II",
    detail: "Отмена крепостного права, суд присяжных, земства. Россия открывалась новым людям — и новым предпринимателям.",
    delay: 160,
  },
];

export function WorldOf1876Section() {
  const headerReveal = useReveal(0.2);
  const tomskReveal = useReveal(0.05);
  const worldReveal = useReveal(0.05);

  return (
    <section id="world-1876" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      {/* Фоновый год */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-sans font-black text-[35vw] text-white/[0.015] leading-none tracking-tighter">
          1876
        </span>
      </div>

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
            Контекст · 1876 год
          </p>
          <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
            Томск<br />
            <span className="text-accent">в зеркале</span> мира
          </h2>
          <p className="mt-5 font-sans text-base md:text-lg text-muted max-w-[54ch] leading-relaxed">
            Карл Крюгер приехал не в «глухую Сибирь». Он выбрал Томск — богатый,
            растущий, амбициозный торговый город. Вот каким был мир в 1876 году.
          </p>
        </div>

        {/* Томск — 8 карточек */}
        <div className="mb-12">
          <div
            className="flex items-center gap-4 mb-8"
            style={{ opacity: headerReveal.visible ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
          >
            <span className="font-mono text-[10px] tracking-[0.4em] text-accent/80 uppercase">Томск · 1876</span>
            <div className="flex-1 h-px bg-accent/20" />
          </div>
          <div
            ref={tomskReveal.ref}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {TOMSK_CARDS.map((card) => (
              <div
                key={card.label}
                className="card-surface p-5 flex flex-col gap-3 group hover:border-accent/30 transition-colors duration-300"
                style={{
                  opacity: tomskReveal.visible ? 1 : 0,
                  transform: tomskReveal.visible ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.6s ease ${card.delay}ms, transform 0.6s ease ${card.delay}ms`,
                  willChange: "transform, opacity",
                }}
              >
                <div>
                  <p className="font-sans text-xl md:text-2xl font-black text-accent leading-none mb-1 group-hover:scale-105 transition-transform origin-left">
                    {card.stat}
                  </p>
                  <p className="font-sans text-sm font-semibold text-foreground/80">{card.label}</p>
                </div>
                <p className="font-mono text-[10px] text-muted/70 leading-relaxed">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Разделитель */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{ opacity: tomskReveal.visible ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}
        >
          <div className="flex-1 h-px bg-amber-900/30" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted/40 uppercase px-3">Мир</span>
          <div className="flex-1 h-px bg-amber-900/30" />
        </div>

        {/* Мир — 3 карточки */}
        <div
          ref={worldReveal.ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {WORLD_CARDS.map((card) => (
            <div
              key={card.year}
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: worldReveal.visible ? 1 : 0,
                transform: worldReveal.visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.7s ease ${card.delay}ms, transform 0.7s ease ${card.delay}ms`,
                willChange: "transform, opacity",
              }}
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted/50 uppercase">{card.year}</p>
              <p className="font-sans text-base font-semibold text-foreground/70">{card.label}</p>
              <p className="font-mono text-[11px] text-muted/60 leading-relaxed">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Итоговый вывод */}
        <div
          className="mt-12 p-6 md:p-8 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.06), rgba(201,162,39,0.02))",
            border: "1px solid rgba(201,162,39,0.15)",
            opacity: worldReveal.visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 uppercase mb-3">Вывод</p>
          <p className="font-sans text-base md:text-lg text-foreground/80 leading-relaxed max-w-[70ch]">
            В 1876 году Томск был <strong className="text-foreground">богатым, растущим городом</strong> с платёжеспособной элитой
            и отсутствием нормального местного пива. Крюгер увидел это раньше других.
          </p>
        </div>
      </div>
    </section>
  );
}

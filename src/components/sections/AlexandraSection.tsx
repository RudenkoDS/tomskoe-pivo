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

const B = process.env.NEXT_PUBLIC_BASE ?? "";

const BARLEY_DATA = [
  { month: "Авг '14", value: 20,  label: "20" },
  { month: "Окт '14", value: 60,  label: "60" },
  { month: "Янв '15", value: 130, label: "130" },
  { month: "Апр '15", value: 200, label: "200" },
  { month: "Авг '15", value: 280, label: "280" },
  { month: "Янв '16", value: 350, label: "350" },
  { month: "Апр '16", value: 400, label: "400" },
];

const MAX_VAL = 400;
const CHART_W = 700;
const CHART_H = 180;
const PAD_L = 0;
const PAD_R = 0;
const PAD_T = 20;
const PAD_B = 0;

function barleyX(i: number): number {
  const step = (CHART_W - PAD_L - PAD_R) / (BARLEY_DATA.length - 1);
  return PAD_L + i * step;
}
function barleyY(v: number): number {
  return PAD_T + (CHART_H - PAD_T - PAD_B) * (1 - v / MAX_VAL);
}

function BarleyChart({ visible }: { visible: boolean }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 1600;

  useEffect(() => {
    if (!visible) return;
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min((now - startRef.current) / DURATION, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  // Build animated path — draw up to progress point
  const totalPoints = BARLEY_DATA.length;
  const animIndex = progress * (totalPoints - 1);

  // Interpolate points up to animIndex
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < totalPoints; i++) {
    if (i <= animIndex) {
      if (i < Math.floor(animIndex) || i === totalPoints - 1) {
        points.push({ x: barleyX(i), y: barleyY(BARLEY_DATA[i].value) });
      } else {
        // partial last segment
        const frac = animIndex - Math.floor(animIndex);
        const x0 = barleyX(Math.floor(animIndex));
        const y0 = barleyY(BARLEY_DATA[Math.floor(animIndex)].value);
        const x1 = barleyX(Math.floor(animIndex) + 1);
        const y1 = barleyY(BARLEY_DATA[Math.floor(animIndex) + 1].value);
        points.push({ x: x0 + (x1 - x0) * frac, y: y0 + (y1 - y0) * frac });
      }
    }
  }

  const linePath = points.length > 1
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${CHART_H} L ${points[0].x} ${CHART_H} Z`
    : "";

  const lastPoint = points[points.length - 1];

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H + 30}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "auto", display: "block", minHeight: 140 }}
      >
        <defs>
          <linearGradient id="barley-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,162,39,0.35)" />
            <stop offset="100%" stopColor="rgba(201,162,39,0.03)" />
          </linearGradient>
        </defs>

        {/* Горизонтальные сетки */}
        {[0, 100, 200, 300, 400].map(v => (
          <line key={v}
            x1={PAD_L} y1={barleyY(v)}
            x2={CHART_W - PAD_R} y2={barleyY(v)}
            stroke="rgba(201,162,39,0.08)" strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#barley-area)" />
        )}

        {/* Line */}
        {linePath && (
          <path d={linePath} fill="none" stroke="rgba(201,162,39,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Dots — только завершённые точки */}
        {BARLEY_DATA.map((d, i) => {
          if (i > animIndex) return null;
          const x = barleyX(i);
          const y = barleyY(d.value);
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="#C9A227" opacity={i === 6 ? 1 : 0.6} />
          );
        })}

        {/* Glowing dot at last animated point */}
        {lastPoint && progress > 0 && (
          <>
            <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill="rgba(201,162,39,0.15)" />
            <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#C9A227" />
          </>
        )}

        {/* X-axis labels */}
        {BARLEY_DATA.map((d, i) => (
          <text key={i} x={barleyX(i)} y={CHART_H + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="10"
            fontFamily="monospace"
            style={{ opacity: i / (totalPoints - 1) <= progress ? 1 : 0, transition: "opacity .3s" }}
          >
            {d.month}
          </text>
        ))}

        {/* Value labels above dots */}
        {BARLEY_DATA.map((d, i) => (
          <text key={i} x={barleyX(i)} y={barleyY(d.value) - 10}
            textAnchor="middle"
            fill="rgba(201,162,39,0.8)"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
            style={{ opacity: i / (totalPoints - 1) <= progress ? 1 : 0, transition: "opacity .3s" }}
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function AlexandraVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play().catch(() => {}); setPlaying(true); }
  };
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black cursor-pointer group" style={{ aspectRatio: "16/9" }} onClick={toggle}>
      <video ref={ref} src={`${B}/scenes/aleksandra.mp4`}
        className="absolute inset-0 w-full h-full object-cover" muted playsInline loop />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent/70 bg-accent/15 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
            <span className="text-accent text-xl ml-1">▶</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 card-surface px-2.5 py-1">
        <p className="font-mono text-[8px] tracking-[0.25em] text-accent uppercase">AI-сцена · Александра</p>
      </div>
    </div>
  );
}

// Координаты Александры на фото (женщина справа) — в % от размера фото
// Семья Роберта: он сидит в центре, Александра — женщина стоит справа
const ALEKSANDRA_X = 78; // % from left
const ALEKSANDRA_Y = 28; // % from top

function FamilyPhoto() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4" }}>
      <img
        src={`${B}/history/family-robert.jpg`}
        alt="Семья Крюгеров"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Стрелка + подпись Александры */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {/* Стрелка от подписи к Александре */}
          {/* Подпись будет снизу (~65% Y), стрелка тянется к точке Александры */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(201,162,39,0.9)" />
            </marker>
          </defs>
          <path
            d={`M 55 72 Q 75 58 ${ALEKSANDRA_X} ${ALEKSANDRA_Y + 5}`}
            fill="none"
            stroke="rgba(201,162,39,0.75)"
            strokeWidth="0.7"
            strokeDasharray="2,1.5"
            markerEnd="url(#arrowhead)"
          />
          {/* Точка на Александре */}
          <circle cx={ALEKSANDRA_X} cy={ALEKSANDRA_Y} r="2" fill="rgba(201,162,39,0.9)" />
        </svg>

        {/* Подпись */}
        <div
          style={{ position: "absolute", left: "30%", top: "67%", transform: "translateX(-50%)" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className="bg-black/80 backdrop-blur-sm border border-accent/40 rounded-lg px-3 py-1.5 pointer-events-auto"
            style={{ transition: "border-color .2s", borderColor: hovered ? "rgba(201,162,39,0.8)" : "rgba(201,162,39,0.4)" }}
          >
            <p className="font-mono text-[9px] tracking-[0.2em] text-accent uppercase whitespace-nowrap">Александра Крюгер</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-3">
        <p className="font-mono text-[8px] tracking-[0.25em] text-white/50 uppercase">Семья Крюгеров</p>
      </div>
    </div>
  );
}

export function AlexandraSection() {
  const mainReveal = useReveal(0.1);
  const chartReveal = useReveal(0.1);
  const bottleReveal = useReveal(0.1);

  return (
    <section id="war" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      {/* Фоновый текст */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-sans font-black text-[25vw] text-white/[0.018] leading-none tracking-tighter">1914</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">

        {/* ── Заголовок ── */}
        <div
          ref={mainReveal.ref}
          style={{ opacity: mainReveal.visible ? 1 : 0, transform: mainReveal.visible ? "none" : "translateY(24px)", transition: "all .8s ease", willChange: "transform,opacity" }}
        >
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">1914–1916 · Невидимый фронт</p>
            <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
              Александра<br /><span className="text-accent">Крюгер</span>
            </h2>
            <p className="mt-4 font-sans text-base md:text-lg text-muted max-w-[54ch] leading-relaxed">
              Война началась — Роберт застрял в Германии. Россия объявила сухой закон.
              Пиво оказалось под запретом. Александра осталась одна.
            </p>
          </div>

          {/* ── Верхняя сетка: видео (слева) + текст (справа) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 mb-6">
            {/* Левая колонка: большое горизонтальное видео */}
            <AlexandraVideo />

            {/* Правая колонка: цитата + история */}
            <div className="card-surface p-7 flex flex-col gap-4" style={{ borderLeft: "2px solid rgba(201,162,39,0.4)" }}>
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 uppercase mb-3">Решение · 1914</p>
                <p className="font-sans text-xl md:text-2xl text-foreground leading-snug italic font-light mb-4">
                  «Пока есть зерно — завод живёт»
                </p>
                <div className="h-px bg-accent/15 mb-4" />
                <p className="font-sans text-sm text-muted leading-relaxed mb-3">
                  Когда пиво запретили, Александра не закрыла завод. Она запустила производство
                  <strong className="text-foreground/80"> ячменного кофе</strong> — горячий напиток из жареного ячменя,
                  популярный в Германии и технологически близкий к пивоварению.
                </p>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Гениальный манёвр: оборудование работало, сотрудники получали жалованье,
                  завод сохранял юридический статус. Когда война кончилась — вернуться к пиву было просто.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-amber-900/20">
                <div className="w-9 h-9 rounded-full border border-accent/30 bg-accent/5 flex items-center justify-center text-accent font-sans font-black text-base shrink-0">А</div>
                <div>
                  <p className="font-sans text-sm font-semibold text-foreground">Александра Крюгер</p>
                  <p className="font-mono text-[10px] text-muted">Управляющая · 1914–1916</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Нижняя сетка: фото семьи (слева) + статы (справа) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-8">
            {/* Фото семьи — вертикальное, компактное */}
            <FamilyPhoto />

            {/* Правая часть: три стата */}
            <div className="flex flex-col gap-4 justify-center">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: "400", unit: "пудов/мес", desc: "Максимум ячменного кофе", sub: "≈ 6,5 т/мес" },
                  { val: "2",   unit: "года",       desc: "Без остановки",          sub: "1914–1916" },
                  { val: "0",   unit: "закрытий",   desc: "Пережил войну",          sub: "Единственный" },
                ].map((s) => (
                  <div key={s.desc} className="card-surface p-5 flex flex-col gap-1 text-center">
                    <p className="font-sans text-4xl font-black text-accent leading-none">{s.val}</p>
                    <p className="font-mono text-[9px] text-accent/70 uppercase mt-1">{s.unit}</p>
                    <p className="font-mono text-[9px] text-muted/60 leading-tight mt-1">{s.desc}</p>
                    <p className="font-mono text-[8px] text-muted/40">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── График роста ── */}
        <div
          ref={chartReveal.ref}
          className="card-surface p-6 md:p-8 mb-8"
          style={{ opacity: chartReveal.visible ? 1 : 0, transform: chartReveal.visible ? "none" : "translateY(24px)", transition: "all .8s ease .1s", willChange: "transform,opacity" }}
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-1">Производство ячменного кофе · 1914–1916</p>
              <p className="font-mono text-[10px] text-muted/50">Объём в пудах в месяц (1 пуд ≈ 16,4 кг)</p>
            </div>
            <div className="text-right">
              <p className="font-sans text-3xl font-black text-accent">×20</p>
              <p className="font-mono text-[9px] text-muted/50 uppercase">рост за 2 года</p>
            </div>
          </div>

          <BarleyChart visible={chartReveal.visible} />

          <p className="mt-3 font-mono text-[9px] text-muted/40">
            Завод не остановился ни на один день. За 2 года сохранил оборудование, команду и право на производство.
          </p>
        </div>

        {/* ── 1927 + Находка бутылки ── */}
        <div
          ref={bottleReveal.ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          style={{ opacity: bottleReveal.visible ? 1 : 0, transform: bottleReveal.visible ? "none" : "translateY(24px)", transition: "all .8s ease .1s", willChange: "transform,opacity" }}
        >
          <div className="card-surface p-7 flex flex-col gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-accent/60 uppercase mb-3">1927</p>
              <h3 className="font-sans text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-tight mb-3">Конец<br />династии</h3>
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed">
              В августе 1927 года семья Крюгеров навсегда покинула Томск. Советская власть
              национализировала завод. Они уезжали с одним чемоданом — но оставили рецепты,
              технологии и имя. Имя вернулось в город спустя 70 лет.
            </p>
            <div className="mt-auto pt-4 border-t border-amber-900/20 flex items-center gap-3">
              <span className="font-sans text-3xl font-black text-accent/30">70</span>
              <span className="font-mono text-[10px] text-muted/60 uppercase leading-tight">лет без<br/>семьи Крюгер</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.07), rgba(201,162,39,0.02))", border: "1px solid rgba(201,162,39,0.2)" }}>
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-accent/80 uppercase mb-3">2012 · Находка</p>
              <h3 className="font-sans text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-tight mb-3">122 года<br /><span className="text-accent">в земле</span></h3>
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed">
              В июле 2012 года на площади Батенькова при строительстве гостиницы нашли
              целую запечатанную бутылку пива Крюгера — пролежавшую в земле с эпохи
              великого наводнения 1890 года.
            </p>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Пиво сохранилось идеально. Совместно с немецкими экспертами восстановили рецепт.
              Так родилось <strong className="text-foreground/80">«Богемское»</strong> — пиво по рецепту 1884 года.
            </p>
            <div className="mt-auto pt-4 border-t border-accent/15">
              <p className="font-mono text-[10px] text-muted/50">Площадь Батенькова · Томск · 2012 · «Богемское» — рецепт 1884</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

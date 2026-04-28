"use client";
import { useRef, useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _B = process.env.NEXT_PUBLIC_BASE ?? "";

function useReveal(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Данные населения для SVG-графика
const POPULATION_DATA = [
  { year: 1863, value: 32400 },
  { year: 1876, value: 33800 },
  { year: 1880, value: 36000 },
  { year: 1885, value: 40000 },
  { year: 1897, value: 52221 },
];

const TOMSK_CARDS = [
  {
    stat: "~33 800",
    label: "Жителей в 1876",
    detail:
      "К 1897 году — 52 221. Рост на 54% за 17 лет. Быстрее любой российской столицы.",
    delay: 0,
  },
  {
    stat: "Золото",
    label: "Двигатель экономики",
    detail:
      "Купцы Поповы нашли золото на Енисее в 1828-м. Томск стал финансовым центром всей сибирской добычи.",
    delay: 60,
  },
  {
    stat: "Купечество",
    label: "Платёжеспособная элита",
    detail:
      "Гадалов, Кухтерин, Асташев. Доходы купцов 1-й гильдии — миллионы рублей в год. Им нужно хорошее пиво.",
    delay: 120,
  },
  {
    stat: "100 000+",
    label: "Ямщиков на тракте",
    detail:
      "Московско-Сибирский тракт. Томск — главный узел: смена лошадей, отдых, разгрузка. Постоянный поток людей.",
    delay: 180,
  },
  {
    stat: "1878",
    label: "Первый университет за Уралом",
    detail:
      "Указ Александра II об открытии именно в Томске. Купцы дали 400 000 рублей на строительство.",
    delay: 240,
  },
  {
    stat: "1890",
    label: "Великое наводнение",
    detail:
      "Томь и Ушайка вышли из берегов. На площади Батенькова плавали лодки. Там же в 2012-м нашли бутылку Крюгера.",
    delay: 300,
  },
  {
    stat: "1896",
    label: "Транссиб обошёл Томск",
    detail:
      "Мост через Обь построили в Новосибирске — дешевле. Томск получил 100-вёрстную ветку и остался региональным центром.",
    delay: 360,
  },
  {
    stat: "Областники",
    label: "Сибирская идентичность",
    detail:
      "Потанин и Ядринцев считали Сибирь колонией Петербурга. Боролись за университет и справедливый раздел доходов.",
    delay: 420,
  },
];

const WORLD_CARDS = [
  {
    year: "1871",
    label: "Объединение Германии",
    detail:
      "Отто фон Бисмарк объединил немецкие земли. Страна вошла в промышленный бум. Именно там учился пивному делу Карл Крюгер.",
    delay: 0,
  },
  {
    year: "1870–1900",
    label: "Прекрасная эпоха",
    detail:
      "Время мира и расцвета в Европе. Первые Олимпийские игры — 1896, Эйфелева башня — 1889. Мир менялся стремительно.",
    delay: 80,
  },
  {
    year: "1861–1881",
    label: "Реформы Александра II",
    detail:
      "Отмена крепостного права, суд присяжных, земства. Россия открывалась новым людям — и новым предпринимателям.",
    delay: 160,
  },
];

// SVG-график населения
function PopulationChart({ visible }: { visible: boolean }) {
  const W = 300;
  const H = 120;
  const pad = { l: 8, r: 8, t: 12, b: 8 };

  const minY = 30000;
  const maxY = 54000;
  const minX = 1863;
  const maxX = 1897;

  const toX = (year: number) =>
    pad.l + ((year - minX) / (maxX - minX)) * (W - pad.l - pad.r);
  const toY = (val: number) =>
    pad.t + (1 - (val - minY) / (maxY - minY)) * (H - pad.t - pad.b);

  const points = POPULATION_DATA.map((d) => ({ x: toX(d.year), y: toY(d.value) }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${points[points.length - 1].x.toFixed(1)},${(H - pad.b).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(H - pad.b).toFixed(1)} Z`;

  // Длина линии — приблизительная для dashoffset анимации
  const lineLength = 340;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201,162,39,0.35)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0.01)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Горизонтальные сетки */}
      {[0.25, 0.5, 0.75].map((t) => {
        const y = pad.t + t * (H - pad.t - pad.b);
        return (
          <line
            key={t}
            x1={pad.l}
            y1={y}
            x2={W - pad.r}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Заливка */}
      <path
        d={areaPath}
        fill="url(#popGrad)"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}
      />

      {/* Линия с анимацией */}
      <path
        d={linePath}
        fill="none"
        stroke="rgba(201,162,39,0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        style={{
          strokeDasharray: lineLength,
          strokeDashoffset: visible ? 0 : lineLength,
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s",
        }}
      />

      {/* Точки */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === 1 ? 4.5 : 3}
            fill={i === 1 ? "rgba(201,162,39,1)" : "rgba(201,162,39,0.7)"}
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.4s ease ${0.6 + i * 0.12}s`,
            }}
          />
          {i === 1 && (
            <circle
              cx={p.x}
              cy={p.y}
              r={8}
              fill="none"
              stroke="rgba(201,162,39,0.3)"
              strokeWidth="1"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.4s ease 0.8s",
              }}
            />
          )}
        </g>
      ))}

      {/* Подписи годов */}
      {POPULATION_DATA.map((d, i) => (
        <text
          key={d.year}
          x={toX(d.year)}
          y={H - 1}
          textAnchor="middle"
          fontSize="6"
          fill="rgba(255,255,255,0.3)"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${0.8 + i * 0.08}s`,
          }}
        >
          {d.year}
        </text>
      ))}
    </svg>
  );
}

// SVG-иконка самородка (простой многоугольник)
function NuggetIcon() {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40">
      <polygon
        points="16,8 32,6 42,18 40,34 28,44 14,42 6,30 8,16"
        fill="rgba(201,162,39,0.25)"
        stroke="rgba(201,162,39,0.8)"
        strokeWidth="1.5"
      />
      <polygon
        points="20,14 30,12 36,22 34,32 24,38 16,34 12,24 14,16"
        fill="rgba(201,162,39,0.15)"
        stroke="rgba(201,162,39,0.5)"
        strokeWidth="1"
      />
      <circle cx="26" cy="20" r="2.5" fill="rgba(201,162,39,0.7)" />
      <circle cx="20" cy="28" r="1.5" fill="rgba(201,162,39,0.5)" />
    </svg>
  );
}

// SVG-иконка книги
function BookIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <rect x="6" y="8" width="26" height="26" rx="2" fill="rgba(201,162,39,0.1)" stroke="rgba(201,162,39,0.5)" strokeWidth="1.5" />
      <line x1="19" y1="8" x2="19" y2="34" stroke="rgba(201,162,39,0.4)" strokeWidth="1" />
      <line x1="10" y1="15" x2="17" y2="15" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
      <line x1="10" y1="20" x2="17" y2="20" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
      <line x1="10" y1="25" x2="17" y2="25" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
      <line x1="21" y1="15" x2="30" y2="15" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
      <line x1="21" y1="20" x2="30" y2="20" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
      <line x1="21" y1="25" x2="30" y2="25" stroke="rgba(201,162,39,0.3)" strokeWidth="1" />
    </svg>
  );
}

// SVG мини-карта Транссиба
function TranssibMap({ visible }: { visible: boolean }) {
  // Точки: Москва(слева) → ... → Новосибирск → ... → Иркутск
  // Томск — ответвление от линии
  const lineLength = 200;
  return (
    <svg viewBox="0 0 240 80" style={{ width: "100%", height: "64px" }}>
      <defs>
        <filter id="dotglow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Главная линия Транссиба */}
      <line
        x1="10" y1="42" x2="230" y2="42"
        stroke="rgba(201,162,39,0.5)"
        strokeWidth="2"
        style={{
          strokeDasharray: lineLength + 80,
          strokeDashoffset: visible ? 0 : lineLength + 80,
          transition: "stroke-dashoffset 1.0s ease 0.2s",
        }}
      />
      {/* Ответвление к Томску — пунктир */}
      <line
        x1="145" y1="42" x2="145" y2="14"
        stroke="rgba(201,162,39,0.4)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.9s",
        }}
      />
      {/* Города: Москва */}
      <circle cx="10" cy="42" r="3.5" fill="rgba(201,162,39,0.4)" filter="url(#dotglow)" />
      <text x="12" y="56" fontSize="7" fill="rgba(255,255,255,0.4)">Москва</text>
      {/* Новосибирск */}
      <circle cx="145" cy="42" r="4.5" fill="rgba(201,162,39,0.7)" filter="url(#dotglow)" />
      <text x="130" y="56" fontSize="7" fill="rgba(255,255,255,0.5)">Новосибирск</text>
      {/* Иркутск */}
      <circle cx="230" cy="42" r="3.5" fill="rgba(201,162,39,0.4)" filter="url(#dotglow)" />
      <text x="210" y="56" fontSize="7" fill="rgba(255,255,255,0.4)">Иркутск</text>
      {/* Томск */}
      <circle
        cx="145" cy="14" r="4"
        fill="rgba(201,162,39,0.3)"
        stroke="rgba(201,162,39,0.7)"
        strokeWidth="1.5"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.1s" }}
      />
      <text x="148" y="12" fontSize="7.5" fill="rgba(201,162,39,0.85)" fontWeight="600"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.1s" }}
      >
        Томск
      </text>
    </svg>
  );
}

// SVG-дорога тракта
function TraktRoad({ visible }: { visible: boolean }) {
  const len = 220;
  return (
    <svg viewBox="0 0 240 50" style={{ width: "100%", height: "44px" }}>
      {/* Обочины */}
      <path
        d="M10,38 Q120,20 230,38"
        fill="none"
        stroke="rgba(201,162,39,0.2)"
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: visible ? 0 : len,
          transition: "stroke-dashoffset 0.9s ease 0.3s",
        }}
      />
      {/* Пунктир по центру */}
      <path
        d="M10,38 Q120,20 230,38"
        fill="none"
        stroke="rgba(201,162,39,0.6)"
        strokeWidth="1"
        strokeDasharray="6 5"
        style={{
          strokeDasharray: "6 5",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.8s",
        }}
      />
      {/* Москва */}
      <circle cx="10" cy="38" r="3" fill="rgba(201,162,39,0.5)" />
      <text x="4" y="30" fontSize="6.5" fill="rgba(255,255,255,0.4)">Москва</text>
      {/* Томск */}
      <circle cx="120" cy="25" r="4" fill="rgba(201,162,39,0.8)" />
      <text x="110" y="17" fontSize="7" fill="rgba(201,162,39,0.9)" fontWeight="600">Томск</text>
      {/* Иркутск */}
      <circle cx="230" cy="38" r="3" fill="rgba(201,162,39,0.5)" />
      <text x="214" y="30" fontSize="6.5" fill="rgba(255,255,255,0.4)">Иркутск</text>
    </svg>
  );
}

export function WorldOf1876Section() {
  const sectionReveal = useReveal(0.05);
  const row1Reveal = useReveal(0.05);
  const row2Reveal = useReveal(0.05);
  const worldReveal = useReveal(0.05);
  const conclusionReveal = useReveal(0.05);

  const panelBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(201,162,39,0.12)",
    borderRadius: "16px",
    backdropFilter: "blur(4px)",
  };

  const panelDark: React.CSSProperties = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
  };

  return (
    <section
      id="world-1876"
      style={{ background: "#080603", borderTop: "1px solid rgba(201,162,39,0.08)" }}
      className="relative overflow-hidden"
    >
      {/* Фоновый год */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "32vw",
            color: "rgba(255,255,255,0.012)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            fontFamily: "sans-serif",
          }}
        >
          1876
        </span>
      </div>

      <div
        ref={sectionReveal.ref}
        className="relative z-10 mx-auto"
        style={{ maxWidth: "1400px", padding: "6rem 2.5rem 5rem" }}
      >
        {/* ── Заголовок секции ── */}
        <div
          style={{
            marginBottom: "3rem",
            opacity: sectionReveal.visible ? 1 : 0,
            transform: sectionReveal.visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.45em",
              color: "rgba(201,162,39,0.75)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Контекст · 1876 год
          </p>
          <h2
            style={{
              fontFamily: "sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#f5f0e8",
              lineHeight: 0.95,
              marginBottom: "1.25rem",
            }}
          >
            Томск<br />
            <span style={{ color: "rgba(201,162,39,0.95)" }}>в зеркале</span> мира
          </h2>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
              color: "rgba(255,255,255,0.45)",
              maxWidth: "52ch",
              lineHeight: 1.65,
            }}
          >
            Карл Крюгер приехал не в «глухую Сибирь». Он выбрал Томск —
            богатый, растущий, амбициозный торговый город. Вот каким был мир в 1876 году.
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            СТРОКА 1 — Hero-панель + 2 маленькие
        ══════════════════════════════════════════════ */}
        <div
          ref={row1Reveal.ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "16px",
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* ── Hero: Население ── */}
          <div
            style={{
              ...panelBase,
              gridColumn: "1 / 2",
              padding: "28px 28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "rgba(201,162,39,0.04)",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(201,162,39,0.6)",
              }}
            >
              Население Томска
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  fontWeight: 900,
                  color: "rgba(201,162,39,1)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                ~33&nbsp;800
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 400,
                }}
              >
                жителей в 1876
              </span>
            </div>

            {/* SVG-график */}
            <div style={{ flex: 1, minHeight: "100px" }}>
              <PopulationChart visible={row1Reveal.visible} />
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.35)",
                borderTop: "1px solid rgba(201,162,39,0.1)",
                paddingTop: "10px",
              }}
            >
              +54% за 17 лет · быстрее любой столицы
            </div>
          </div>

          {/* ── Маленькая: Золото ── */}
          <div
            style={{
              ...panelBase,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <NuggetIcon />
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(201,162,39,0.55)",
                }}
              >
                Экономика
              </p>
            </div>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                fontWeight: 900,
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Золотая<br />лихорадка
            </p>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "12px",
              }}
            >
              1828 · Купцы Поповы<br />
              Томск — финансовый центр<br />
              Сибири
            </div>
          </div>

          {/* ── Маленькая: Купцы ── */}
          <div
            style={{
              ...panelBase,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(201,162,39,0.55)",
              }}
            >
              Купцы 1-й гильдии
            </p>
            {/* Аватары-инициалы */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["Г", "К", "А"].map((letter, i) => (
                <div
                  key={letter}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      i === 0
                        ? "rgba(201,162,39,0.2)"
                        : i === 1
                        ? "rgba(201,162,39,0.13)"
                        : "rgba(201,162,39,0.08)",
                    border: "1px solid rgba(201,162,39,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "rgba(201,162,39,0.9)",
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
                  fontWeight: 900,
                  color: "rgba(201,162,39,1)",
                  letterSpacing: "-0.02em",
                  marginBottom: "4px",
                }}
              >
                &gt;1 млн руб/год
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Гадалов · Кухтерин · Асташев
              </p>
            </div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9.5px",
                color: "rgba(255,255,255,0.3)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "10px",
                lineHeight: 1.5,
              }}
            >
              Платёжеспособная элита ·<br />им нужно хорошее пиво
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            СТРОКА 2 — 3 горизонтальные панели
        ══════════════════════════════════════════════ */}
        <div
          ref={row2Reveal.ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "32px",
            opacity: row2Reveal.visible ? 1 : 0,
            transform: row2Reveal.visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          {/* ── Московский тракт ── */}
          <div
            style={{
              ...panelBase,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(201,162,39,0.55)",
              }}
            >
              Транспорт
            </p>
            <TraktRoad visible={row2Reveal.visible} />
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                fontWeight: 900,
                color: "rgba(201,162,39,1)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              100 000+
            </p>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
              }}
            >
              ямщиков на тракте
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9.5px",
                color: "rgba(255,255,255,0.3)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "10px",
                lineHeight: 1.5,
              }}
            >
              Главный транспортный<br />узел Сибири
            </p>
          </div>

          {/* ── Университет 1878 ── */}
          <div
            style={{
              ...panelBase,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "rgba(201,162,39,0.03)",
              border: "1px solid rgba(201,162,39,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(201,162,39,0.55)",
                }}
              >
                Образование
              </p>
              <BookIcon />
            </div>

            {/* Большой год как акцент */}
            <div style={{ position: "relative" }}>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  color: "rgba(201,162,39,0.15)",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  position: "absolute",
                  top: "-8px",
                  left: "-4px",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                1878
              </span>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
                  fontWeight: 900,
                  color: "#f5f0e8",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  position: "relative",
                  paddingTop: "clamp(2.5rem, 3vw, 3.5rem)",
                }}
              >
                Первый университет<br />за Уралом
              </p>
            </div>

            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9.5px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
              }}
            >
              Купцы дали 400 000 ₽<br />на строительство
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "8.5px",
                color: "rgba(201,162,39,0.45)",
                borderTop: "1px solid rgba(201,162,39,0.1)",
                paddingTop: "8px",
              }}
            >
              Александр II · указ 1878
            </p>
          </div>

          {/* ── Транссиб обошёл Томск ── */}
          <div
            style={{
              ...panelBase,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(201,162,39,0.55)",
              }}
            >
              Инфраструктура
            </p>
            <TranssibMap visible={row2Reveal.visible} />
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                fontWeight: 900,
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Транссиб обошёл Томск
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9.5px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.55,
              }}
            >
              100-вёрстная ветка<br />1896 · Мост дешевле в Новосибирске
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "1px",
                  background: "rgba(201,162,39,0.5)",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "0",
                  borderTop: "1px dashed rgba(201,162,39,0.4)",
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8.5px",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                Транссиб · ветка к Томску
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            СТРОКА 3 — Мировой контекст
        ══════════════════════════════════════════════ */}
        <div
          ref={worldReveal.ref}
          style={{
            opacity: worldReveal.visible ? 1 : 0,
            transform: worldReveal.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.05s, transform 0.7s ease 0.05s",
          }}
        >
          {/* Разделитель */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.12)" }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.5em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              ——— МИР В 1876 ———
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.12)" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {WORLD_CARDS.map((card, i) => (
              <div
                key={card.year}
                style={{
                  ...panelDark,
                  padding: "24px 24px 24px 28px",
                  borderLeft: `3px solid rgba(201,162,39,${0.6 - i * 0.15})`,
                  borderRadius: "0 12px 12px 0",
                  position: "relative",
                  overflow: "hidden",
                  opacity: worldReveal.visible ? 1 : 0,
                  transform: worldReveal.visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${card.delay}ms, transform 0.6s ease ${card.delay}ms`,
                }}
              >
                {/* Год как фоновый элемент */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "-4px",
                    fontFamily: "sans-serif",
                    fontWeight: 900,
                    fontSize: "4.5rem",
                    color: "rgba(201,162,39,0.06)",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {card.year.split("–")[0].split("–")[0]}
                </span>

                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,162,39,0.55)",
                    marginBottom: "8px",
                  }}
                >
                  {card.year}
                </p>
                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.6,
                  }}
                >
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            СТРОКА 4 — Итоговый вывод
        ══════════════════════════════════════════════ */}
        <div
          ref={conclusionReveal.ref}
          style={{
            marginTop: "28px",
            padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem)",
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.07), rgba(201,162,39,0.02))",
            border: "1px solid rgba(201,162,39,0.18)",
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
            opacity: conclusionReveal.visible ? 1 : 0,
            transition: "opacity 0.9s ease 0.2s",
          }}
        >
          {/* Кавычка-акцент */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20px",
              left: "16px",
              fontFamily: "Georgia, serif",
              fontSize: "8rem",
              color: "rgba(201,162,39,0.08)",
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            "
          </span>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(201,162,39,0.55)",
              marginBottom: "14px",
            }}
          >
            Вывод
          </p>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "clamp(0.95rem, 1.6vw, 1.2rem)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              maxWidth: "72ch",
            }}
          >
            В 1876 году Томск был{" "}
            <strong style={{ color: "#f5f0e8", fontWeight: 800 }}>
              богатым, растущим городом
            </strong>{" "}
            с платёжеспособной элитой и отсутствием нормального местного пива.{" "}
            <span style={{ color: "rgba(201,162,39,0.85)" }}>
              Крюгер увидел это раньше других.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

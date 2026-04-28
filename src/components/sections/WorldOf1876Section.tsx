"use client";
import { useRef, useState, useEffect } from "react";

const B = process.env.NEXT_PUBLIC_BASE ?? "";
void B; // используется в будущих расширениях

function useReveal(threshold = 0.05) {
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

const POPULATION_DATA = [
  { year: 1863, value: 32400 },
  { year: 1876, value: 33800 },
  { year: 1880, value: 36000 },
  { year: 1885, value: 40000 },
  { year: 1897, value: 52221 },
];

// Золотодобыча: условные данные роста (в тыс. пудов)
const GOLD_DATA = [
  { year: "1828", v: 8 },
  { year: "1835", v: 22 },
  { year: "1845", v: 45 },
  { year: "1855", v: 60 },
  { year: "1865", v: 78 },
  { year: "1876", v: 95 },
];

const WORLD_CARDS = [
  {
    year: "1871",
    yearShort: "1871",
    label: "Объединение Германии",
    detail: "Отто фон Бисмарк объединил немецкие земли. Страна вошла в промышленный бум. Именно там учился пивному делу Карл Крюгер.",
    accent: "rgba(201,162,39,0.7)",
  },
  {
    year: "1870–1900",
    yearShort: "1900",
    label: "Прекрасная эпоха",
    detail: "Время мира и расцвета в Европе. Первые Олимпийские игры — 1896, Эйфелева башня — 1889. Мир менялся стремительно.",
    accent: "rgba(201,162,39,0.5)",
  },
  {
    year: "1861–1881",
    yearShort: "1881",
    label: "Реформы Александра II",
    detail: "Отмена крепостного права, суд присяжных, земства. Россия открывалась новым людям — и новым предпринимателям.",
    accent: "rgba(201,162,39,0.35)",
  },
];

/* ─── SVG: График населения ─── */
function PopulationChart({ visible }: { visible: boolean }) {
  const W = 300; const H = 110;
  const pad = { l: 6, r: 6, t: 10, b: 14 };
  const minY = 30000; const maxY = 54000;
  const minX = 1863; const maxX = 1897;
  const toX = (y: number) => pad.l + ((y - minX) / (maxX - minX)) * (W - pad.l - pad.r);
  const toY = (v: number) => pad.t + (1 - (v - minY) / (maxY - minY)) * (H - pad.t - pad.b);
  const pts = POPULATION_DATA.map(d => ({ x: toX(d.year), y: toY(d.value) }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = line + ` L${pts[pts.length-1].x.toFixed(1)},${(H-pad.b).toFixed(1)} L${pts[0].x.toFixed(1)},${(H-pad.b).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:"100%", height:"100%", overflow:"visible" }}>
      <defs>
        <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201,162,39,0.4)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0.0)" />
        </linearGradient>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0.33, 0.66].map(t => (
        <line key={t} x1={pad.l} y1={pad.t + t*(H-pad.t-pad.b)} x2={W-pad.r} y2={pad.t + t*(H-pad.t-pad.b)}
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      ))}
      <path d={area} fill="url(#popGrad)" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }} />
      <path d={line} fill="none" stroke="rgba(201,162,39,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#lineGlow)"
        style={{ strokeDasharray: 360, strokeDashoffset: visible ? 0 : 360, transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === 1 ? 5 : 3.5}
            fill={i === 1 ? "rgba(201,162,39,1)" : "rgba(201,162,39,0.75)"}
            filter={i === 1 ? "url(#lineGlow)" : undefined}
            style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${0.7+i*0.1}s` }} />
          {i === 1 && <circle cx={p.x} cy={p.y} r={9} fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="1"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease 0.9s" }} />}
        </g>
      ))}
      {POPULATION_DATA.map((d, i) => (
        <text key={d.year} x={toX(d.year)} y={H-1} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.28)"
          style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${0.9+i*0.08}s` }}>
          {d.year}
        </text>
      ))}
    </svg>
  );
}

/* ─── SVG: Бар-чарт золота ─── */
function GoldChart({ visible }: { visible: boolean }) {
  const max = 95;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
      {GOLD_DATA.map((d, i) => (
        <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{
            width: "100%",
            height: `${(d.v / max) * 52}px`,
            background: i === GOLD_DATA.length - 1
              ? "linear-gradient(to top, rgba(201,162,39,0.9), rgba(201,162,39,0.5))"
              : `linear-gradient(to top, rgba(201,162,39,${0.35 + i*0.08}), rgba(201,162,39,0.1))`,
            borderRadius: "3px 3px 0 0",
            boxShadow: i === GOLD_DATA.length - 1 ? "0 0 8px rgba(201,162,39,0.4)" : "none",
            transition: `height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`,
            ...(visible ? {} : { height: "2px" }),
          }} />
          <span style={{ fontFamily: "monospace", fontSize: "5.5px", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
            {d.year}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── SVG: Дорога (тракт) ─── */
function TraktRoad({ visible }: { visible: boolean }) {
  const len = 240;
  return (
    <svg viewBox="0 0 240 52" style={{ width: "100%", height: "46px" }}>
      <defs>
        <filter id="roadGlow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M10,40 Q120,18 230,40" fill="none" stroke="rgba(201,162,39,0.18)" strokeWidth="10" strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: visible ? 0 : len, transition: "stroke-dashoffset 0.9s ease 0.3s" }} />
      <path d="M10,40 Q120,18 230,40" fill="none" stroke="rgba(201,162,39,0.7)" strokeWidth="1.5"
        filter="url(#roadGlow)" strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: visible ? 0 : len, transition: "stroke-dashoffset 1.0s ease 0.3s" }} />
      <path d="M10,40 Q120,18 230,40" fill="none" stroke="rgba(201,162,39,0.5)" strokeWidth="0.8" strokeDasharray="5 6" strokeLinecap="round"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.9s" }} />
      {[{ cx:10, cy:40, label:"Москва", anchor:"start" }, { cx:120, cy:24, label:"Томск", anchor:"middle" }, { cx:230, cy:40, label:"Иркутск", anchor:"end" }].map(c => (
        <g key={c.label}>
          <circle cx={c.cx} cy={c.cy} r={c.label === "Томск" ? 5 : 3.5}
            fill={c.label === "Томск" ? "rgba(201,162,39,0.9)" : "rgba(201,162,39,0.45)"}
            filter={c.label === "Томск" ? "url(#roadGlow)" : undefined}
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.8s" }} />
          <text x={c.cx} y={c.label === "Томск" ? 14 : c.cy - 7} textAnchor={c.anchor as "start"|"middle"|"end"}
            fontSize={c.label === "Томск" ? "8" : "6.5"}
            fill={c.label === "Томск" ? "rgba(201,162,39,0.9)" : "rgba(255,255,255,0.35)"}
            fontWeight={c.label === "Томск" ? "700" : "400"}
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.9s" }}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── SVG: Мини-карта Транссиба ─── */
function TranssibMap({ visible }: { visible: boolean }) {
  const len = 230;
  return (
    <svg viewBox="0 0 240 80" style={{ width: "100%", height: "66px" }}>
      <defs>
        <filter id="tglow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="10" y1="50" x2="230" y2="50" stroke="rgba(201,162,39,0.55)" strokeWidth="2"
        filter="url(#tglow)"
        style={{ strokeDasharray: len, strokeDashoffset: visible ? 0 : len, transition: "stroke-dashoffset 1.0s ease 0.2s" }} />
      <line x1="148" y1="50" x2="148" y2="16" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5" strokeDasharray="3.5 3"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.95s" }} />
      {[{ cx:10, cy:50, label:"Москва" }, { cx:230, cy:50, label:"Иркутск" }].map(c => (
        <g key={c.label}>
          <circle cx={c.cx} cy={c.cy} r={3.5} fill="rgba(201,162,39,0.4)" />
          <text x={c.cx} y={c.cy + 11} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.35)"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.85s" }}>{c.label}</text>
        </g>
      ))}
      <circle cx="148" cy="50" r="5" fill="rgba(201,162,39,0.65)" filter="url(#tglow)"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.8s" }} />
      <text x="152" y="63" fontSize="6.5" fill="rgba(255,255,255,0.45)"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.85s" }}>Новосибирск</text>
      <circle cx="148" cy="16" r="4.5" fill="rgba(201,162,39,0.3)" stroke="rgba(201,162,39,0.75)" strokeWidth="1.5"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.05s" }} />
      <text x="152" y="13" fontSize="7.5" fill="rgba(201,162,39,0.9)" fontWeight="600"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.1s" }}>Томск</text>
    </svg>
  );
}

/* ─── Стили ─── */
const PANEL: React.CSSProperties = {
  borderRadius: "18px",
  border: "1px solid rgba(201,162,39,0.13)",
  background: "linear-gradient(145deg, rgba(201,162,39,0.05) 0%, rgba(10,8,4,0.6) 100%)",
  backdropFilter: "blur(6px)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  cursor: "default",
};

const PANEL_HOVER: React.CSSProperties = {
  transform: "translateY(-6px)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(201,162,39,0.12)",
  borderColor: "rgba(201,162,39,0.35)",
};

const GOLD_GLOW: React.CSSProperties = {
  fontFamily: "sans-serif",
  fontWeight: 900,
  color: "rgba(201,162,39,1)",
  letterSpacing: "-0.03em",
  lineHeight: 1,
  textShadow: "0 0 20px rgba(201,162,39,0.45), 0 0 40px rgba(201,162,39,0.2)",
};

const LABEL: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "9px",
  letterSpacing: "0.42em",
  textTransform: "uppercase" as const,
  color: "rgba(201,162,39,0.6)",
};

const DETAIL: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10.5px",
  color: "rgba(255,255,255,0.38)",
  lineHeight: 1.6,
  borderTop: "1px solid rgba(255,255,255,0.05)",
  paddingTop: "10px",
};

function HoverPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...PANEL, ...style, ...(hovered ? PANEL_HOVER : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

/* ─── Карточка Университет с гравюрой ─── */
function UniversityCard({ visible }: { visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const B2 = process.env.NEXT_PUBLIC_BASE ?? "";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...PANEL,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(201,162,39,0.22)",
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? "translateY(-6px)" : "none") : "translateY(28px)",
        transition: "opacity 0.6s ease 80ms, transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(201,162,39,0.12)" : "none",
        borderColor: hovered ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.22)",
        minHeight: "240px",
        background: "#0a0804",
      }}
    >
      {/* Гравюра как фон */}
      <img
        src={`${B2}/history/university-1887.jpg`}
        alt="Томский Императорский университет, 1887"
        loading="eager"
        decoding="async"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          filter: "sepia(0.6) brightness(0.45) contrast(1.1)",
          transition: "filter 0.4s ease, transform 0.4s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Градиент снизу — для читаемости текста */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(8,6,3,0.97) 0%, rgba(8,6,3,0.5) 50%, rgba(8,6,3,0.1) 100%)",
        pointerEvents: "none",
      }} />
      {/* Тонкий золотой оверлей при ховере */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(201,162,39,0.04)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }} />

      {/* Бейдж верхний левый */}
      <div style={{ position: "absolute", top: "14px", left: "14px" }}>
        <span style={{
          fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.4em",
          textTransform: "uppercase", color: "rgba(201,162,39,0.75)",
          background: "rgba(8,6,3,0.7)", backdropFilter: "blur(4px)",
          border: "1px solid rgba(201,162,39,0.25)", borderRadius: "6px",
          padding: "3px 8px",
        }}>
          Образование
        </span>
      </div>
      {/* Год — верхний правый */}
      <div style={{ position: "absolute", top: "14px", right: "14px" }}>
        <span style={{
          fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.3em",
          color: "rgba(201,162,39,0.6)",
          background: "rgba(8,6,3,0.6)", backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px",
          padding: "3px 8px",
        }}>
          1887
        </span>
      </div>

      {/* Текст снизу */}
      <div style={{ position: "relative", padding: "24px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "flex-end", minHeight: "240px" }}>
        <div style={{ marginTop: "auto" }}>
          <p style={{
            fontFamily: "sans-serif", fontSize: "clamp(1rem,1.6vw,1.35rem)",
            fontWeight: 900, color: "#f5f0e8", letterSpacing: "-0.02em", lineHeight: 1.2,
            marginBottom: "8px",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            Первый университет<br />за Уралом
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
            Купцы дали 400&nbsp;000 ₽ · Александр II · 1878
          </p>
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(201,162,39,0.15)" }}>
            <p style={{ fontFamily: "monospace", fontSize: "8.5px", color: "rgba(201,162,39,0.55)", letterSpacing: "0.15em" }}>
              Гравюра · Нива · 1887
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorldOf1876Section() {
  const headerReveal = useReveal(0.1);
  const row1Reveal = useReveal(0.05);
  const row2Reveal = useReveal(0.05);
  const worldReveal = useReveal(0.05);
  const conclusionReveal = useReveal(0.05);

  return (
    <section id="world-1876" style={{ background: "#080603", borderTop: "1px solid rgba(201,162,39,0.08)" }} className="relative overflow-hidden">
      {/* Фоновый год */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span style={{ fontWeight: 900, fontSize: "32vw", color: "rgba(255,255,255,0.012)", lineHeight: 1, letterSpacing: "-0.05em", fontFamily: "sans-serif" }}>
          1876
        </span>
      </div>

      <div className="relative z-10 mx-auto" style={{ maxWidth: "1400px", padding: "6rem 2.5rem 5rem" }}>

        {/* ── Заголовок ── */}
        <div ref={headerReveal.ref} style={{ marginBottom: "3rem", opacity: headerReveal.visible ? 1 : 0, transform: headerReveal.visible ? "none" : "translateY(28px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
          <p style={LABEL}>Контекст · 1876 год</p>
          <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f5f0e8", lineHeight: 0.95, margin: "1rem 0 1.25rem" }}>
            Томск<br /><span style={{ color: "rgba(201,162,39,0.95)" }}>в зеркале</span> мира
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.9rem,1.5vw,1.1rem)", color: "rgba(255,255,255,0.5)", maxWidth: "52ch", lineHeight: 1.65 }}>
            Карл Крюгер приехал не в «глухую Сибирь». Он выбрал Томск — богатый, растущий, амбициозный торговый город.
          </p>
        </div>

        {/* ══ СТРОКА 1 — 3 панели ══ */}
        <div ref={row1Reveal.ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>

          {/* Население — hero */}
          <HoverPanel style={{
            background: "linear-gradient(145deg, rgba(201,162,39,0.07) 0%, rgba(8,6,3,0.8) 100%)",
            border: "1px solid rgba(201,162,39,0.22)",
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms, box-shadow 0.25s ease, border-color 0.25s ease",
          }}>
            <p style={LABEL}>Население Томска</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ ...GOLD_GLOW, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>~33&nbsp;800</span>
              <span style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>жителей в 1876</span>
            </div>
            <div style={{ flex: 1, minHeight: "100px" }}>
              <PopulationChart visible={row1Reveal.visible} />
            </div>
            <div style={DETAIL}>+54% за 17 лет · быстрее любой столицы</div>
          </HoverPanel>

          {/* Золото */}
          <HoverPanel style={{
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 80ms, transform 0.6s ease 80ms, box-shadow 0.25s ease, border-color 0.25s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={LABEL}>Экономика</p>
              {/* Бейдж */}
              <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em", background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.4)", borderRadius: "6px", padding: "2px 7px", color: "rgba(201,162,39,0.9)" }}>
                1828
              </span>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(1.1rem,1.8vw,1.5rem)", fontWeight: 900, color: "#f5f0e8", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Золотая<br />лихорадка
            </p>
            <GoldChart visible={row1Reveal.visible} />
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <svg viewBox="0 0 20 20" width="18" height="18">
                <polygon points="8,2 14,2 18,8 16,16 10,18 4,16 2,10 4,4" fill="rgba(201,162,39,0.2)" stroke="rgba(201,162,39,0.7)" strokeWidth="1.2" />
                <circle cx="11" cy="8" r="2" fill="rgba(201,162,39,0.7)" />
              </svg>
              <span style={{ fontFamily: "sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                Купцы Поповы · Енисей
              </span>
            </div>
            <div style={DETAIL}>Томск — финансовый центр всей сибирской золотодобычи</div>
          </HoverPanel>

          {/* Купцы */}
          <HoverPanel style={{
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 160ms, transform 0.6s ease 160ms, box-shadow 0.25s ease, border-color 0.25s ease",
          }}>
            <p style={LABEL}>Купцы 1-й гильдии</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { l: "Г", name: "Гадалов", opacity: 0.25 },
                { l: "К", name: "Кухтерин", opacity: 0.16 },
                { l: "А", name: "Асташев", opacity: 0.1 },
              ].map((c, i) => (
                <div key={c.l} title={c.name} style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: `rgba(201,162,39,${c.opacity})`,
                  border: `1.5px solid rgba(201,162,39,${0.5 - i*0.1})`,
                  boxShadow: i === 0 ? "0 0 10px rgba(201,162,39,0.2)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "sans-serif", fontWeight: 800, fontSize: "1.05rem",
                  color: "rgba(201,162,39,0.95)", cursor: "default",
                }}>
                  {c.l}
                </div>
              ))}
            </div>
            <div>
              <p style={{ ...GOLD_GLOW, fontSize: "clamp(1rem,1.6vw,1.3rem)", marginBottom: "4px" }}>&gt;1 млн руб/год</p>
              <p style={{ fontFamily: "sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Гадалов · Кухтерин · Асташев</p>
            </div>
            <div style={DETAIL}>Платёжеспособная элита · им нужно хорошее пиво</div>
          </HoverPanel>
        </div>

        {/* ══ СТРОКА 2 — 3 панели ══ */}
        <div ref={row2Reveal.ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>

          {/* Транспорт */}
          <HoverPanel style={{
            opacity: row2Reveal.visible ? 1 : 0,
            transform: row2Reveal.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms, box-shadow 0.25s ease, border-color 0.25s ease",
          }}>
            <p style={LABEL}>Транспорт</p>
            <TraktRoad visible={row2Reveal.visible} />
            <p style={{ ...GOLD_GLOW, fontSize: "clamp(1.4rem,2vw,1.9rem)" }}>100&nbsp;000+</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>ямщиков на тракте</p>
            <div style={DETAIL}>Главный транспортный узел Сибири</div>
          </HoverPanel>

          {/* Образование — с гравюрой */}
          <UniversityCard visible={row2Reveal.visible} />

          {/* Инфраструктура */}
          <HoverPanel style={{
            opacity: row2Reveal.visible ? 1 : 0,
            transform: row2Reveal.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.6s ease 160ms, transform 0.6s ease 160ms, box-shadow 0.25s ease, border-color 0.25s ease",
          }}>
            <p style={LABEL}>Инфраструктура</p>
            <TranssibMap visible={row2Reveal.visible} />
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.9rem,1.3vw,1.1rem)", fontWeight: 900, color: "#f5f0e8", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Транссиб обошёл Томск
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>
              100-вёрстная ветка · 1896<br />Мост дешевле построили в Новосибирске
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              <span style={{ display: "inline-block", width: "18px", height: "2px", background: "rgba(201,162,39,0.55)", borderRadius: "1px" }} />
              <span style={{ display: "inline-block", width: "18px", borderTop: "1.5px dashed rgba(201,162,39,0.4)" }} />
              <span style={{ fontFamily: "monospace", fontSize: "8.5px", color: "rgba(255,255,255,0.22)" }}>Транссиб · ветка к Томску</span>
            </div>
          </HoverPanel>
        </div>

        {/* ══ СТРОКА 3 — Мировой контекст ══ */}
        <div ref={worldReveal.ref} style={{ opacity: worldReveal.visible ? 1 : 0, transform: worldReveal.visible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.14)" }} />
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.55em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              МИР В 1876
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.14)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {WORLD_CARDS.map((card, i) => (
              <HoverPanel key={card.year} style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${card.accent}`,
                borderRadius: "0 14px 14px 0",
                position: "relative",
                overflow: "hidden",
                padding: "24px 24px 24px 26px",
                opacity: worldReveal.visible ? 1 : 0,
                transform: worldReveal.visible ? "none" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i*80}ms, transform 0.6s ease ${i*80}ms, box-shadow 0.25s ease, border-color 0.25s ease`,
              }}>
                <span aria-hidden="true" style={{ position: "absolute", bottom: "-12px", right: "-4px", fontFamily: "sans-serif", fontWeight: 900, fontSize: "5rem", color: "rgba(201,162,39,0.07)", letterSpacing: "-0.05em", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {card.yearShort}
                </span>
                <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(201,162,39,0.6)", marginBottom: "8px" }}>{card.year}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "10px", lineHeight: 1.3 }}>{card.label}</p>
                <p style={{ fontFamily: "monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{card.detail}</p>
              </HoverPanel>
            ))}
          </div>
        </div>

        {/* ══ СТРОКА 4 — Вывод ══ */}
        <div ref={conclusionReveal.ref} style={{
          marginTop: "28px",
          padding: "clamp(1.5rem,3vw,2.5rem)",
          background: "linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.02))",
          border: "1px solid rgba(201,162,39,0.2)",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          opacity: conclusionReveal.visible ? 1 : 0,
          transition: "opacity 0.9s ease 0.2s",
        }}>
          <span aria-hidden="true" style={{ position: "absolute", top: "-24px", left: "14px", fontFamily: "Georgia, serif", fontSize: "9rem", color: "rgba(201,162,39,0.09)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>"</span>
          <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.42em", textTransform: "uppercase", color: "rgba(201,162,39,0.6)", marginBottom: "14px" }}>Вывод</p>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.95rem,1.6vw,1.2rem)", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: "72ch" }}>
            В 1876 году Томск был{" "}
            <strong style={{ color: "#f5f0e8", fontWeight: 800 }}>богатым, растущим городом</strong>{" "}
            с платёжеспособной элитой и отсутствием нормального местного пива.{" "}
            <span style={{ color: "rgba(201,162,39,0.9)" }}>Крюгер увидел это раньше других.</span>
          </p>
        </div>

      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const B = process.env.NEXT_PUBLIC_BASE ?? "";

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
    accent: "rgba(212,175,55,0.75)",
    icon: "⚔",
  },
  {
    year: "1870–1900",
    yearShort: "1900",
    label: "Прекрасная эпоха",
    detail: "Время мира и расцвета в Европе. Первые Олимпийские игры — 1896, Эйфелева башня — 1889. Мир менялся стремительно.",
    accent: "rgba(212,175,55,0.5)",
    icon: "✦",
  },
  {
    year: "1861–1881",
    yearShort: "1881",
    label: "Реформы Александра II",
    detail: "Отмена крепостного права, суд присяжных, земства. Россия открывалась новым людям — и новым предпринимателям.",
    accent: "rgba(212,175,55,0.35)",
    icon: "⚖",
  },
];

/* ─── Хмелевая лоза декор SVG ─── */
function HopVine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 36" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <path d="M4,28 Q30,10 60,18 Q90,26 116,8" fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Шишки хмеля */}
      {[18, 44, 72, 98].map((x, i) => {
        const y = i % 2 === 0 ? 16 : 22;
        return (
          <g key={x} transform={`translate(${x},${y})`}>
            <ellipse rx="4" ry="6" fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth="0.9" />
            <line x1="0" y1="-6" x2="0" y2="-10" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8" />
            <ellipse rx="2.5" ry="3.5" transform="translate(0,-2)" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.7" />
          </g>
        );
      })}
      {/* Листья */}
      {[30, 82].map((x, i) => {
        const y = i === 0 ? 12 : 20;
        return (
          <g key={`leaf-${x}`} transform={`translate(${x},${y})`}>
            <path d="M0,0 Q6,-8 10,-4 Q6,2 0,0" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.18)" strokeWidth="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── График населения ─── */
function PopulationChart({ visible }: { visible: boolean }) {
  const W = 300; const H = 110;
  const pad = { l: 6, r: 6, t: 10, b: 18 };
  const minY = 30000; const maxY = 54000;
  const minX = 1863; const maxX = 1897;
  const toX = (y: number) => pad.l + ((y - minX) / (maxX - minX)) * (W - pad.l - pad.r);
  const toY = (v: number) => pad.t + (1 - (v - minY) / (maxY - minY)) * (H - pad.t - pad.b);
  const pts = POPULATION_DATA.map(d => ({ x: toX(d.year), y: toY(d.value), year: d.year }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = line + ` L${pts[pts.length-1].x.toFixed(1)},${(H-pad.b).toFixed(1)} L${pts[0].x.toFixed(1)},${(H-pad.b).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:"100%", height:"100%", overflow:"visible" }}>
      <defs>
        <linearGradient id="popGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(212,175,55,0.35)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.0)" />
        </linearGradient>
        <filter id="lineGlow2">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0.33, 0.66].map(t => (
        <line key={t} x1={pad.l} y1={pad.t + t*(H-pad.t-pad.b)} x2={W-pad.r} y2={pad.t + t*(H-pad.t-pad.b)}
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      ))}
      <path d={area} fill="url(#popGrad2)" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }} />
      <path d={line} fill="none" stroke="rgba(212,175,55,1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#lineGlow2)"
        style={{ strokeDasharray: 360, strokeDashoffset: visible ? 0 : 360, transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
      {pts.map((p, i) => (
        <g key={p.year}>
          <circle cx={p.x} cy={p.y} r={i === 1 ? 5.5 : 3.5}
            fill={i === 1 ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.7)"}
            filter={i === 1 ? "url(#lineGlow2)" : undefined}
            style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${0.7+i*0.1}s` }} />
          {i === 1 && <circle cx={p.x} cy={p.y} r={10} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="1"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease 0.9s" }} />}
        </g>
      ))}
      {POPULATION_DATA.map((d, i) => (
        <text key={d.year} x={toX(d.year)} y={H-1} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.22)"
          style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${0.9+i*0.08}s` }}>
          {d.year}
        </text>
      ))}
    </svg>
  );
}

/* ─── Бар-чарт золота ─── */
function GoldChart({ visible }: { visible: boolean }) {
  const max = 95;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "72px", paddingTop: "8px" }}>
      {GOLD_DATA.map((d, i) => (
        <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
          <div style={{
            width: "100%",
            height: visible ? `${(d.v / max) * 58}px` : "3px",
            background: i === GOLD_DATA.length - 1
              ? "linear-gradient(to top, rgba(212,175,55,1), rgba(212,175,55,0.6))"
              : `linear-gradient(to top, rgba(212,175,55,${0.3 + i*0.09}), rgba(212,175,55,0.05))`,
            borderRadius: "4px 4px 0 0",
            boxShadow: i === GOLD_DATA.length - 1 ? "0 0 12px rgba(212,175,55,0.55), 0 0 24px rgba(212,175,55,0.2)" : "none",
            transition: `height 0.9s cubic-bezier(0.34,1.56,0.64,1) ${i * 90}ms`,
          }} />
          <span style={{ fontFamily: "monospace", fontSize: "7px", color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}>
            {d.year}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Дорога (тракт) ─── */
function TraktRoad({ visible }: { visible: boolean }) {
  const len = 250;
  return (
    <svg viewBox="0 0 240 56" style={{ width: "100%", height: "48px" }}>
      <defs>
        <filter id="roadGlow2">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M10,44 Q120,18 230,44" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="12" strokeLinecap="round" />
      <path d="M10,44 Q120,18 230,44" fill="none" stroke="rgba(212,175,55,0.75)" strokeWidth="1.8"
        filter="url(#roadGlow2)" strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: visible ? 0 : len, transition: "stroke-dashoffset 1.1s ease 0.3s" }} />
      <path d="M10,44 Q120,18 230,44" fill="none" stroke="rgba(212,175,55,0.45)" strokeWidth="0.9" strokeDasharray="5 6" strokeLinecap="round"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.9s" }} />
      {[{ cx:10, cy:44, label:"Москва", anchor:"start" }, { cx:120, cy:24, label:"Томск", anchor:"middle" }, { cx:230, cy:44, label:"Иркутск", anchor:"end" }].map(c => (
        <g key={c.label}>
          <circle cx={c.cx} cy={c.cy} r={c.label === "Томск" ? 6 : 4}
            fill={c.label === "Томск" ? "rgba(212,175,55,0.95)" : "rgba(212,175,55,0.4)"}
            filter={c.label === "Томск" ? "url(#roadGlow2)" : undefined}
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.8s" }} />
          <text x={c.cx} y={c.label === "Томск" ? 13 : c.cy - 8} textAnchor={c.anchor as "start"|"middle"|"end"}
            fontSize={c.label === "Томск" ? "8.5" : "7"}
            fill={c.label === "Томск" ? "rgba(212,175,55,0.95)" : "rgba(255,255,255,0.32)"}
            fontWeight={c.label === "Томск" ? "700" : "400"}
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.9s" }}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Мини-карта Транссиба ─── */
function TranssibMap({ visible }: { visible: boolean }) {
  const len = 235;
  return (
    <svg viewBox="0 0 240 82" style={{ width: "100%", height: "68px" }}>
      <defs>
        <filter id="tglow2">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="10" y1="52" x2="230" y2="52" stroke="rgba(212,175,55,0.6)" strokeWidth="2.2"
        filter="url(#tglow2)"
        style={{ strokeDasharray: len, strokeDashoffset: visible ? 0 : len, transition: "stroke-dashoffset 1.0s ease 0.2s" }} />
      <line x1="148" y1="52" x2="148" y2="16" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeDasharray="3.5 3"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.95s" }} />
      {[{ cx:10, cy:52, label:"Москва" }, { cx:230, cy:52, label:"Иркутск" }].map(c => (
        <g key={c.label}>
          <circle cx={c.cx} cy={c.cy} r={3.5} fill="rgba(212,175,55,0.4)" />
          <text x={c.cx} y={c.cy + 12} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.32)"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.85s" }}>{c.label}</text>
        </g>
      ))}
      <circle cx="148" cy="52" r="5" fill="rgba(212,175,55,0.6)" filter="url(#tglow2)"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.8s" }} />
      <text x="152" y="65" fontSize="6.5" fill="rgba(255,255,255,0.4)"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.85s" }}>Новосибирск</text>
      <circle cx="148" cy="16" r="5" fill="rgba(212,175,55,0.25)" stroke="rgba(212,175,55,0.8)" strokeWidth="1.5"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.05s" }} />
      <text x="153" y="12" fontSize="8" fill="rgba(212,175,55,0.95)" fontWeight="700"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 1.1s" }}>Томск</text>
    </svg>
  );
}

/* ─── HoverPanel ─── */
function HoverPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const hoverStyle: React.CSSProperties = hovered ? {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 48px rgba(0,0,0,0.55), 0 0 28px rgba(212,175,55,0.1)",
    borderColor: "rgba(212,175,55,0.38)",
  } : {};
  return (
    <div
      className="rounded-[20px] border border-[rgba(212,175,55,0.14)] p-6 flex flex-col gap-[14px] cursor-default"
      style={{
        background: "linear-gradient(145deg, rgba(212,175,55,0.06) 0%, rgba(13,11,7,0.85) 100%)",
        backdropFilter: "blur(8px)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        ...style,
        ...hoverStyle,
      }}
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
  return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-[20px] overflow-hidden relative cursor-default"
        style={{
          padding: 0,
          border: hovered ? "1px solid rgba(212,175,55,0.45)" : "1px solid rgba(212,175,55,0.22)",
          opacity: visible ? 1 : 0,
          transform: visible ? (hovered ? "translateY(-5px)" : "none") : "translateY(28px)",
          transition: "opacity 0.6s ease 80ms, transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
          boxShadow: hovered ? "0 20px 48px rgba(0,0,0,0.55), 0 0 28px rgba(212,175,55,0.12)" : "none",
          minHeight: "260px",
          background: "#0d0b07",
        }}
    >
      <Image
        src={`${B}/history/university-1887.jpg`}
        alt="Томский Императорский университет, 1887"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{
          objectFit: "cover",
          objectPosition: "center 30%",
          filter: hovered ? "sepia(0.5) brightness(0.5) contrast(1.1)" : "sepia(0.65) brightness(0.42) contrast(1.1)",
          transition: "filter 0.4s ease, transform 0.4s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(8,6,3,0.97) 0%, rgba(8,6,3,0.55) 52%, rgba(8,6,3,0.12) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(212,175,55,0.03)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", top: "14px", left: "14px" }}>
        <span style={{
          fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.42em",
          textTransform: "uppercase", color: "rgba(212,175,55,0.8)",
          background: "rgba(8,6,3,0.72)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px",
          padding: "3px 9px",
        }}>
          Образование
        </span>
      </div>
      <div style={{ position: "absolute", top: "14px", right: "14px" }}>
        <span style={{
          fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.3em",
          color: "rgba(212,175,55,0.65)",
          background: "rgba(8,6,3,0.65)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
          padding: "3px 9px",
        }}>
          1887
        </span>
      </div>
      <div style={{
        position: "relative", padding: "24px",
        display: "flex", flexDirection: "column", gap: "8px",
        justifyContent: "flex-end", minHeight: "260px",
      }}>
        <div style={{ marginTop: "auto" }}>
          <p style={{
            fontFamily: "sans-serif", fontSize: "clamp(1rem,1.6vw,1.3rem)",
            fontWeight: 900, color: "#f5ece0", letterSpacing: "-0.02em", lineHeight: 1.2,
            marginBottom: "8px", textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}>
            Первый университет<br />за Уралом
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>
            Купцы дали 400&nbsp;000 ₽ · Александр II · 1878
          </p>
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
            <p style={{ fontFamily: "monospace", fontSize: "8.5px", color: "rgba(212,175,55,0.55)", letterSpacing: "0.18em" }}>
              Гравюра · Нива · 1887
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Кольцевая диаграмма для купцов ─── */
function MerchantsRing({ visible }: { visible: boolean }) {
  const data = [
    { name: "Гадалов", pct: 42, color: "rgba(212,175,55,0.95)" },
    { name: "Кухтерин", pct: 33, color: "rgba(212,175,55,0.55)" },
    { name: "Асташев", pct: 25, color: "rgba(212,175,55,0.28)" },
  ];
  const r = 28; const cx = 40; const cy = 36;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <svg viewBox="0 0 80 72" style={{ width: "72px", height: "64px", flexShrink: 0 }}>
        <defs>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        {data.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap = circ - dash;
          const seg = (
            <circle key={d.name} cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={i === 0 ? 9 : 7}
              strokeDasharray={`${visible ? dash : 0} ${gap}`}
              strokeDashoffset={-offset}
              filter={i === 0 ? "url(#ringGlow)" : undefined}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, transition: `stroke-dasharray 0.8s cubic-bezier(0.34,1.2,0.64,1) ${i*120}ms` }}
            />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="11" fontWeight="800" fill="rgba(212,175,55,0.95)" fontFamily="sans-serif">3</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.35)" fontFamily="monospace">гильдии</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.55)", flex: 1 }}>{d.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(212,175,55,0.7)", fontWeight: 700 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Метка категории ─── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[8px] tracking-[0.42em] uppercase rounded-[6px] px-[9px] py-[3px]"
      style={{
        color: "rgba(212,175,55,0.65)",
        background: "rgba(212,175,55,0.07)",
        border: "1px solid rgba(212,175,55,0.18)",
      }}>{children}</span>
  );
}

const DIVIDER: React.CSSProperties = {
  borderTop: "1px solid rgba(212,175,55,0.08)",
  paddingTop: "12px",
  fontFamily: "monospace",
  fontSize: "10.5px",
  color: "rgba(255,255,255,0.35)",
  lineHeight: 1.62,
};

const GOLD_NUM: React.CSSProperties = {
  fontFamily: "sans-serif",
  fontWeight: 900,
  color: "rgba(212,175,55,1)",
  letterSpacing: "-0.03em",
  lineHeight: 1,
  textShadow: "0 0 22px rgba(212,175,55,0.5), 0 0 44px rgba(212,175,55,0.2)",
};

export function WorldOf1876Section() {
  const headerReveal = useReveal(0.1);
  const row1Reveal = useReveal(0.05);
  const row2Reveal = useReveal(0.05);
  const worldReveal = useReveal(0.05);
  const conclusionReveal = useReveal(0.05);

  return (
    <section id="world-1876" style={{ background: "#0d0b07", borderTop: "1px solid rgba(212,175,55,0.07)" }} className="relative overflow-hidden">

      {/* Фоновый год */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span style={{ fontWeight: 900, fontSize: "30vw", color: "rgba(255,255,255,0.011)", lineHeight: 1, letterSpacing: "-0.05em", fontFamily: "sans-serif" }}>
          1876
        </span>
      </div>

      {/* Декоративная лоза — верхний правый угол */}
      <div className="absolute top-8 right-8 pointer-events-none select-none opacity-70" style={{ width: "140px" }} aria-hidden="true">
        <HopVine />
      </div>

      <div className="relative z-10 mx-auto" style={{ maxWidth: "1400px", padding: "6rem 2.5rem 5rem" }}>

        {/* ── Заголовок ── */}
        <div
          ref={headerReveal.ref}
          style={{
            marginBottom: "3rem",
            opacity: headerReveal.visible ? 1 : 0,
            transform: headerReveal.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Tag>Контекст · 1876 год</Tag>
          <h2 style={{
            fontFamily: "sans-serif",
            fontSize: "clamp(2.2rem,5vw,4rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#f5ece0",
            lineHeight: 0.95,
            margin: "1.1rem 0 1.25rem",
          }}>
            Томск<br /><span style={{ color: "rgba(212,175,55,0.95)" }}>в зеркале</span> мира
          </h2>
          <p style={{
            fontFamily: "sans-serif",
            fontSize: "clamp(0.9rem,1.5vw,1.1rem)",
            color: "rgba(255,255,255,0.46)",
            maxWidth: "52ch",
            lineHeight: 1.65,
          }}>
            Карл Крюгер приехал не в «глухую Сибирь». Он выбрал Томск — богатый, растущий, амбициозный торговый город.
          </p>
        </div>

        {/* ══ СТРОКА 1 — 3 большие карточки ══ */}
        <div ref={row1Reveal.ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "18px" }}>

          {/* ── Население — hero карточка ── */}
          <HoverPanel style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.09) 0%, rgba(13,11,7,0.9) 100%)",
            border: "1px solid rgba(212,175,55,0.22)",
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms, box-shadow 0.28s ease, border-color 0.28s ease",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Декор — лоза в углу */}
            <div style={{ position: "absolute", bottom: "10px", right: "10px", opacity: 0.5, width: "80px" }} aria-hidden="true">
              <HopVine />
            </div>
            <Tag>Население Томска</Tag>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ ...GOLD_NUM, fontSize: "clamp(2rem,3.2vw,2.8rem)" }}>~33&nbsp;800</span>
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.38)" }}>жителей · 1876</span>
            </div>
            <div style={{ flex: 1, minHeight: "100px" }}>
              <PopulationChart visible={row1Reveal.visible} />
            </div>
            <div style={DIVIDER}>+54% за 17 лет · быстрее любой столицы России</div>
          </HoverPanel>

          {/* ── Золото ── */}
          <HoverPanel style={{
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 90ms, transform 0.6s ease 90ms, box-shadow 0.28s ease, border-color 0.28s ease",
            position: "relative", overflow: "hidden",
          }}>
            {/* Декор лоза */}
            <div style={{ position: "absolute", top: "12px", right: "10px", opacity: 0.45, width: "70px" }} aria-hidden="true">
              <HopVine />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Tag>Экономика</Tag>
              <span style={{
                fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em",
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: "6px", padding: "2px 8px",
                color: "rgba(212,175,55,0.9)",
              }}>
                с 1828
              </span>
            </div>
            <p style={{
              fontFamily: "sans-serif", fontSize: "clamp(1.1rem,1.8vw,1.5rem)",
              fontWeight: 900, color: "#f5ece0", letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>
              Золотая<br />лихорадка
            </p>
            <GoldChart visible={row1Reveal.visible} />
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
              {/* Золотая иконка самородка */}
              <svg viewBox="0 0 22 22" width="18" height="18" style={{ flexShrink: 0 }}>
                <polygon points="8,2 15,2 19,8 17,17 11,20 5,17 3,10 5,4" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.75)" strokeWidth="1.2" />
                <circle cx="12" cy="9" r="2.5" fill="rgba(212,175,55,0.75)" />
              </svg>
              <span style={{ fontFamily: "sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
                Купцы Поповы · Енисей
              </span>
            </div>
            <div style={DIVIDER}>Томск — финансовый центр всей сибирской золотодобычи</div>
          </HoverPanel>

          {/* ── Купцы ── */}
          <HoverPanel style={{
            opacity: row1Reveal.visible ? 1 : 0,
            transform: row1Reveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.6s ease 180ms, transform 0.6s ease 180ms, box-shadow 0.28s ease, border-color 0.28s ease",
            position: "relative", overflow: "hidden",
            background: "linear-gradient(145deg, rgba(212,175,55,0.07) 0%, rgba(13,11,7,0.88) 100%)",
          }}>
            {/* Декор лоза */}
            <div style={{ position: "absolute", bottom: "14px", right: "8px", opacity: 0.5, width: "80px" }} aria-hidden="true">
              <HopVine />
            </div>
            <Tag>Купцы 1-й гильдии</Tag>
            <MerchantsRing visible={row1Reveal.visible} />
            <div>
              <p style={{ ...GOLD_NUM, fontSize: "clamp(1rem,1.7vw,1.35rem)", marginBottom: "4px" }}>&gt;1 млн руб/год</p>
              <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.42)", letterSpacing: "0.05em" }}>
                Гадалов · Кухтерин · Асташев
              </p>
            </div>
            <div style={DIVIDER}>Платёжеспособная элита · им нужно хорошее пиво</div>
          </HoverPanel>
        </div>

        {/* ══ СТРОКА 2 — 3 карточки ══ */}
        <div ref={row2Reveal.ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "36px" }}>

          {/* Транспорт */}
          <HoverPanel style={{
            opacity: row2Reveal.visible ? 1 : 0,
            transform: row2Reveal.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms, box-shadow 0.28s ease, border-color 0.28s ease",
          }}>
            <Tag>Транспорт</Tag>
            <TraktRoad visible={row2Reveal.visible} />
            <p style={{ ...GOLD_NUM, fontSize: "clamp(1.5rem,2.2vw,2rem)" }}>100&nbsp;000+</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.52)", fontWeight: 600, marginTop: "-6px" }}>ямщиков на тракте</p>
            <div style={DIVIDER}>Главный транспортный узел Сибири</div>
          </HoverPanel>

          {/* Образование — с гравюрой */}
          <UniversityCard visible={row2Reveal.visible} />

          {/* Инфраструктура */}
          <HoverPanel style={{
            opacity: row2Reveal.visible ? 1 : 0,
            transform: row2Reveal.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.6s ease 180ms, transform 0.6s ease 180ms, box-shadow 0.28s ease, border-color 0.28s ease",
          }}>
            <Tag>Инфраструктура</Tag>
            <TranssibMap visible={row2Reveal.visible} />
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.9rem,1.3vw,1.1rem)", fontWeight: 900, color: "#f5ece0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Транссиб обошёл Томск
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.36)", lineHeight: 1.58, marginTop: "-4px" }}>
              100-вёрстная ветка · 1896<br />Мост дешевле построили в Новосибирске
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "10px" }}>
              <span style={{ display: "inline-block", width: "18px", height: "2px", background: "rgba(212,175,55,0.6)", borderRadius: "1px" }} />
              <span style={{ display: "inline-block", width: "18px", borderTop: "1.5px dashed rgba(212,175,55,0.4)" }} />
              <span style={{ fontFamily: "monospace", fontSize: "8.5px", color: "rgba(255,255,255,0.2)" }}>Транссиб · ветка к Томску</span>
            </div>
          </HoverPanel>
        </div>

        {/* ══ СТРОКА 3 — Мировой контекст ══ */}
        <div ref={worldReveal.ref} style={{ opacity: worldReveal.visible ? 1 : 0, transform: worldReveal.visible ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2))" }} />
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.55em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              МИР В 1876
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(212,175,55,0.2))" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
            {WORLD_CARDS.map((card, i) => (
              <HoverPanel key={card.year} style={{
                background: "rgba(0,0,0,0.38)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${card.accent}`,
                borderRadius: "0 18px 18px 0",
                position: "relative",
                overflow: "hidden",
                padding: "24px 24px 24px 26px",
                opacity: worldReveal.visible ? 1 : 0,
                transform: worldReveal.visible ? "none" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i*90}ms, transform 0.6s ease ${i*90}ms, box-shadow 0.28s ease, border-color 0.28s ease`,
              }}>
                <span aria-hidden="true" style={{
                  position: "absolute", bottom: "-14px", right: "-4px",
                  fontFamily: "sans-serif", fontWeight: 900, fontSize: "4.8rem",
                  color: "rgba(212,175,55,0.06)", letterSpacing: "-0.05em",
                  lineHeight: 1, pointerEvents: "none", userSelect: "none",
                }}>
                  {card.yearShort}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "16px", opacity: 0.7 }}>{card.icon}</span>
                  <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(212,175,55,0.62)" }}>
                    {card.year}
                  </p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "10px", lineHeight: 1.3 }}>
                  {card.label}
                </p>
                <p style={{ fontFamily: "monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.36)", lineHeight: 1.65 }}>
                  {card.detail}
                </p>
              </HoverPanel>
            ))}
          </div>
        </div>

        {/* ══ Вывод ══ */}
        <div ref={conclusionReveal.ref} style={{
          marginTop: "32px",
          padding: "clamp(1.5rem,3vw,2.5rem)",
          background: "linear-gradient(135deg, rgba(212,175,55,0.07), rgba(212,175,55,0.02))",
          border: "1px solid rgba(212,175,55,0.18)",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          opacity: conclusionReveal.visible ? 1 : 0,
          transition: "opacity 0.9s ease 0.2s",
        }}>
          {/* Декоративная лоза в углу заключения */}
          <div style={{ position: "absolute", top: "16px", right: "20px", opacity: 0.6, width: "120px" }} aria-hidden="true">
            <HopVine />
          </div>
          <span aria-hidden="true" style={{
            position: "absolute", top: "-28px", left: "14px",
            fontFamily: "Georgia, serif", fontSize: "9rem",
            color: "rgba(212,175,55,0.08)", lineHeight: 1,
            pointerEvents: "none", userSelect: "none",
          }}>&ldquo;</span>
          <Tag>Вывод</Tag>
          <p style={{
            marginTop: "14px",
            fontFamily: "sans-serif",
            fontSize: "clamp(0.95rem,1.6vw,1.2rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.72,
            maxWidth: "72ch",
          }}>
            В 1876 году Томск был{" "}
            <strong style={{ color: "#f5ece0", fontWeight: 800 }}>богатым, растущим городом</strong>{" "}
            с платёжеспособной элитой и отсутствием нормального местного пива.{" "}
            <span style={{ color: "rgba(212,175,55,0.95)" }}>Крюгер увидел это раньше других.</span>
          </p>
        </div>

      </div>
    </section>
  );
}

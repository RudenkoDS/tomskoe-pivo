"use client";
import React, { useRef, useState, useEffect } from "react";

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ──────────────────────────────────────────────
   Карл Крюгер — сцены
   vertical: true  → 9:16 (716×1284 или 720×1280)
   vertical: false → 16:9 (1284×716)
────────────────────────────────────────────── */
const B = process.env.NEXT_PUBLIC_BASE ?? "";
const KARL_GRID: { src: string; label: string; vertical: boolean }[] = [
  { src: `${B}/scenes/karl-zakl-kamnya.mp4`,  label: "Закладка камня",    vertical: true  },
  { src: `${B}/scenes/karl-lab.mp4`,          label: "Лаборатория",       vertical: true  },
  { src: `${B}/scenes/karl-partnery.mp4`,     label: "Карл и партнёры",   vertical: false },
  { src: `${B}/scenes/karl-handshake.mp4`,    label: "Рукопожатие",       vertical: false },
  { src: `${B}/scenes/karl-chertezh.mp4`,     label: "Карл и чертёж",     vertical: false },
  { src: `${B}/scenes/karl-kvartira.mp4`,     label: "В квартире",        vertical: false },
];

/* ──────────────────────────────────────────────
   Роберт Крюгер — сцены (все 16:9)
────────────────────────────────────────────── */
const ROBERT_GRID = [
  { src: `${B}/scenes/robert-chertezh.mp4`,  label: "Роберт и чертёж"    },
  { src: `${B}/scenes/robert-rabochie.mp4`,  label: "Роберт и рабочие"   },
  { src: `${B}/scenes/robert-handshake.mp4`, label: "Рукопожатие"        },
  { src: `${B}/scenes/zames.mp4`,            label: "Замес на заводе"    },
  { src: `${B}/scenes/povozka.mp4`,          label: "Повозки с бочками"  },
  { src: `${B}/scenes/loshadi-led.mp4`,      label: "Лошади и лёд"       },
];

/* ──────────────────────────────────────────────
   Вспомогательные компоненты
────────────────────────────────────────────── */
function VideoThumb({
  src, label, vertical = false,
}: {
  src: string; label: string; vertical?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-black cursor-pointer group"
      style={{ aspectRatio: vertical ? "9/16" : "16/9" }}
      onMouseEnter={() => {
        setActive(true);
        ref.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setActive(false);
        if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
      }}
    >
      <video
        ref={ref}
        src={src}
        className={`absolute inset-0 w-full h-full transition-all duration-500 ${
          vertical ? "object-contain bg-black" : "object-cover"
        } ${active ? "scale-105 opacity-100" : "opacity-75"}`}
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {!active && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full border border-accent/50 bg-accent/10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-accent text-xs ml-0.5">▶</span>
          </div>
        </div>
      )}

      <p className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
        {label}
      </p>
    </div>
  );
}

function MainVideo({ src, vertical = false }: { src: string; vertical?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black cursor-pointer group"
      style={{ aspectRatio: vertical ? "9/16" : "16/9" }}
      onClick={toggle}
    >
      <video
        ref={ref}
        src={src}
        className={`absolute inset-0 w-full h-full ${vertical ? "object-contain" : "object-cover"}`}
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent/60 bg-accent/15 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
            <span className="text-accent text-xl ml-1">▶</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 card-surface px-3 py-1.5">
        <p className="font-mono text-[9px] tracking-[0.3em] text-accent uppercase">
          AI-Фильм · Эпизод 01
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Основной компонент
────────────────────────────────────────────── */
/* ──────────────────────────────────────────────
   Архивный блок — reveal-анимация
────────────────────────────────────────────── */
const ARCHIVE_ITEMS = [
  { src: `${B}/history/factory-engraving.jpg`,  alt: "Гравюра завода",             label: "Гравюра · 1884",        contain: false },
  { src: `${B}/history/zavod-kruger.jpg`,        alt: "Завод Крюгеръ",              label: "Пивзавод · Томск",      contain: false },
  { src: `${B}/history/label-bavarian.jpg`,      alt: "Баварское пиво — этикетка",  label: "Баварское",             contain: true  },
  { src: `${B}/history/label-pilsner.jpg`,       alt: "Пильзенское — этикетка",     label: "Пильзенское",           contain: true  },
  { src: `${B}/history/pivo-kruger.jpg`,         alt: "Пиво Крюгеръ — реклама",    label: "Пиво Крюгеръ",          contain: true  },
];

function ArchiveSection() {
  const sectionReveal = useReveal(0.05);

  return (
    <div className="relative border-t border-amber-900/15 overflow-hidden" style={{ background: "linear-gradient(to bottom, #080603, #0a0804)" }}>

      <div
        ref={sectionReveal.ref}
        className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28"
        style={{
          opacity: sectionReveal.visible ? 1 : 0,
          transform: sectionReveal.visible ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >

        {/* Заголовок */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end gap-4 md:gap-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.45em] text-accent/60 uppercase mb-3">
              Архив · Реальные документы и фотографии
            </p>
            <h3 className="font-sans text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              Свидетели<br /><span className="text-accent">эпохи</span>
            </h3>
          </div>
          <p className="max-w-[44ch] font-mono text-[11px] text-muted/70 leading-relaxed">
            Гравюры, этикетки и фотографии из архива завода Крюгера. Каждый артефакт — прямой след 150-летней истории.
          </p>
        </div>

        {/* Основная раскладка: портрет + сетка */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 md:gap-6 items-start">

          {/* Портрет Карла — слева, высокий */}
          <div className="relative overflow-hidden rounded-2xl group" style={{ aspectRatio: "3/4" }}>
            <img
              src={`${B}/history/karl-kruger.jpg`}
              alt="Карл Крюгер. Основатель завода"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,6,3,0.9) 100%)", mixBlendMode: "multiply" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080603]/90 via-transparent to-transparent" />
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)" }} />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1.5">Основатель завода</p>
              <p className="font-sans text-xl font-black text-white leading-none">Карл Крюгер</p>
              <p className="font-mono text-[10px] text-white/40 mt-1">Томск · 1876</p>
            </div>
            <div className="absolute top-4 right-4 font-sans font-black text-white/5 leading-none select-none" style={{ fontSize: "clamp(48px, 8vw, 90px)" }}>
              1876
            </div>
          </div>

          {/* Правая сетка артефактов */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ARCHIVE_ITEMS.map((item) => (
              <div
                key={item.src}
                className="relative overflow-hidden rounded-xl group cursor-pointer"
                style={{ aspectRatio: item.contain ? "3/4" : "4/3", background: "#0d0b08" }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="eager"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 ${item.contain ? "object-contain p-3" : "object-cover"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
                <p className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase group-hover:text-accent/80 transition-colors duration-300">
                  {item.label}
                </p>
              </div>
            ))}

            {/* Цитата-карточка */}
            <div
              className="relative rounded-xl flex flex-col justify-center p-5 col-span-1"
              style={{
                background: "linear-gradient(135deg, rgba(200,146,42,0.08), rgba(200,146,42,0.03))",
                border: "1px solid rgba(200,146,42,0.15)",
                aspectRatio: "4/3",
              }}
            >
              <p className="font-mono text-[8px] tracking-[0.3em] text-accent/60 uppercase mb-3">Цитата · 1876</p>
              <p className="font-sans text-sm text-foreground/80 leading-snug italic">
                «Природа сама стала нашим технологом»
              </p>
              <p className="mt-3 font-mono text-[9px] text-muted/50">— К. Крюгер</p>
              <div className="mt-4 pt-3 border-t border-accent/10 flex items-center gap-2">
                <span className="font-sans text-2xl font-black text-accent">150</span>
                <span className="font-mono text-[8px] text-muted/50 uppercase leading-tight">лет<br/>истории</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[9px] text-muted/30 tracking-widest uppercase">
          Источник: архив Томского пивоваренного завода · 1876–1920
        </p>
      </div>
    </div>
  );
}

/* ── Огоньки ── */
function EmberLine({ count = 18, side = "top" }: { count?: number; side?: "top" | "bottom" }) {
  return (
    <div className={`absolute left-0 right-0 ${side === "top" ? "top-0" : "bottom-0"} h-6 overflow-hidden pointer-events-none z-10`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="absolute bottom-0 rounded-full" style={{
          left: `${(i / count) * 100 + (i % 3) * 0.8}%`,
          width: `${1 + (i % 3) * 0.6}px`,
          height: `${5 + (i % 5) * 3}px`,
          background: `linear-gradient(to top, rgba(201,162,39,${0.5 + (i % 4) * 0.12}), transparent)`,
          animation: `kruger-ember ${1.6 + (i % 5) * 0.5}s ease-in-out infinite`,
          animationDelay: `${(i % 7) * 0.4}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Мини-таймлайн ── */
interface TimelineItem { year: string; text: string; icon: string; }
function MiniTimeline({ items, visible }: { items: TimelineItem[]; visible: boolean }) {
  return (
    <div className="relative flex flex-col gap-0">
      {/* Вертикальная линия */}
      <div className="absolute left-[17px] top-3 bottom-3 w-px" style={{ background: "rgba(201,162,39,0.15)" }} />
      {items.map((item, i) => (
        <div
          key={item.year}
          className="flex items-start gap-4 py-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-16px)",
            transition: `opacity .5s ease ${i * 120}ms, transform .5s ease ${i * 120}ms`,
          }}
        >
          {/* Иконка/точка */}
          <div className="relative shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-sm z-10"
            style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}>
            {item.icon}
          </div>
          <div className="pt-1.5">
            <p className="font-mono text-[10px] text-accent/70 leading-none mb-1">{item.year}</p>
            <p className="font-mono text-[10px] text-muted/70 leading-snug">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const KARL_TIMELINE: TimelineItem[] = [
  { year: "1834", text: "Родился в Кальтенборне, Пруссия", icon: "🇩🇪" },
  { year: "1860–75", text: "Пивовар в Германии, изучает технологию лагера", icon: "🍺" },
  { year: "1876", text: "Прибыл в Томск, арендует участок за 100 руб./год", icon: "🚂" },
  { year: "1878", text: "Университет требует землю — переезд на Московский тракт", icon: "⚡" },
  { year: "1884", text: "Открытие завода. Подвалы +4°C — без льда", icon: "🏭" },
];

const ROBERT_TIMELINE: TimelineItem[] = [
  { year: "1890", text: "Получил завод от дяди, начал модернизацию", icon: "⚙️" },
  { year: "1895", text: "Паровые машины, пастеризация, объём ×5", icon: "🔧" },
  { year: "1900", text: "Демпинговая война: цена 1.40 → 0.80 руб./ведро", icon: "⚔️" },
  { year: "1907", text: "Золото Парижа и Генуи. 26 пивных лавок в городе", icon: "🥇" },
  { year: "1912", text: "Рекорд: 156 440 вёдер пива в год", icon: "📈" },
];

/* ── Попап компонент ── */
function InfoModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-xl card-surface p-8 md:p-10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted/50 hover:text-foreground transition-colors font-mono text-lg">✕</button>
        <p className="font-mono text-[10px] tracking-[0.35em] text-accent/70 uppercase mb-4">{title}</p>
        <div className="font-sans text-base text-muted leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function KrugerSection() {
  const [popup, setPopup] = useState<null | "karl-move" | "robert-war">(null);
  const karlTl = useReveal(0.1);
  const robertTl = useReveal(0.1);

  return (
    <section id="robert" className="relative bg-background border-t border-amber-900/15 overflow-hidden">
      <style>{`@keyframes kruger-ember { 0%,100%{transform:translateY(0) scaleX(1);opacity:.7} 50%{transform:translateY(-12px) scaleX(0.6);opacity:.25} }`}</style>

      {/* ═══════════════ КАРЛ КРЮГЕР ═══════════════ */}
      <div className="relative">
        <EmberLine side="top" count={20} />
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

          {/* Header + портрет */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
            {/* Текст + кнопка */}
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">1876 — Основание</p>
              <h2 className="font-sans text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.88] mb-6">
                Карл<br /><span className="text-accent">Крюгер</span>
              </h2>
              <p className="max-w-[48ch] font-sans text-base md:text-lg text-muted leading-relaxed mb-3">
                Прусский пивовар из Кальтенборна. В 42 года пересёк полмира — из Германии в Сибирь. Он приехал не в глушь, а в крупнейший город Западной Сибири с богатым купечеством и полным отсутствием нормального пива.
              </p>
              <p className="max-w-[48ch] font-sans text-base text-muted leading-relaxed mb-6">
                9 сентября 1876 года заложил первый камень у подножия Острожной горы. Когда университет потребовал землю — не стал спорить. Купил новый участок на Московском тракте и врезал подвалы прямо в склон горы: постоянные +4°C без льда и машин.
              </p>
              <button
                onClick={() => setPopup("karl-move")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 text-foreground/80 font-mono text-[10px] tracking-[0.2em] uppercase hover:border-accent/60 hover:text-accent transition-all"
              >
                ↳ Подробнее: «Великий переезд» 1880–1884
              </button>
            </div>

            {/* Таймлайн + Портрет Карла */}
            <div className="flex flex-col lg:flex-row gap-5 items-start shrink-0">
              {/* Мини-таймлайн */}
              <div ref={karlTl.ref} className="card-surface px-4 py-5 rounded-2xl min-w-[220px]">
                <p className="font-mono text-[9px] tracking-[0.35em] text-accent/50 uppercase mb-3">Хронология</p>
                <MiniTimeline items={KARL_TIMELINE} visible={karlTl.visible} />
              </div>

              {/* Портрет Карла */}
              <div className="shrink-0 w-[180px] md:w-[200px]">
                <div className="relative overflow-hidden rounded-2xl group" style={{ aspectRatio: "3/4" }}>
                  <img src={`${B}/history/karl-portrait.jpg`} alt="Карл Крюгер" loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080603]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="font-mono text-[8px] tracking-[0.3em] text-accent uppercase mb-1">Основатель</p>
                    <p className="font-sans text-sm font-black text-white">Карл Крюгер</p>
                    <p className="font-mono text-[9px] text-white/40">1834–1884</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Видеосетка */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 items-start">
            <div className="flex gap-3 justify-center lg:justify-start">
              {KARL_GRID.filter(v => v.vertical).map(v => (
                <div key={v.src} className="w-[150px] md:w-[190px]">
                  <VideoThumb src={v.src} label={v.label} vertical={true} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <MainVideo src={`${B}/scenes/karl-istfak-1.mp4`} vertical={false} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {KARL_GRID.filter(v => !v.vertical).map(v => (
                  <VideoThumb key={v.src} src={v.src} label={v.label} vertical={false} />
                ))}
              </div>
            </div>
          </div>

          {/* Цитата + статы */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
            <div className="card-surface p-6 rounded-2xl flex flex-col justify-center" style={{ borderLeft: "2px solid rgba(201,162,39,0.4)" }}>
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-3">Цитата · 1884</p>
              <p className="font-sans text-xl text-foreground leading-snug italic">
                «Хороший завод должен стоять там, где сама природа помогает пивовару.»
              </p>
              <p className="mt-2 font-mono text-[11px] text-muted">— Карл Крюгер</p>
            </div>
            {[
              { val: "1876", desc: "Год основания" },
              { val: "1884", desc: "Московский тракт" },
              { val: "+4°C", desc: "Холод подвалов" },
            ].map(f => (
              <div key={f.val} className="card-surface p-5 rounded-2xl text-center flex flex-col items-center justify-center">
                <p className="font-sans text-4xl md:text-5xl font-black text-accent">{f.val}</p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ ИСТОРИЧЕСКИЙ АРХИВ ═══════════════ */}
      <ArchiveSection />

      {/* ═══════════════ РОБЕРТ КРЮГЕР ═══════════════ */}
      <div className="relative border-t border-amber-900/15">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

          {/* Header + портрет */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">1890–1912 — Золотой век</p>
              <h2 className="font-sans text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.88] mb-6">
                Роберт<br /><span className="text-accent">Крюгер</span>
              </h2>
              <p className="max-w-[48ch] font-sans text-base md:text-lg text-muted leading-relaxed mb-3">
                Племянник Карла получил завод в 1890 году и превратил его в технологическую витрину Сибири. Паровые машины, пастеризация, собственная сеть трактиров. К 1912 году — абсолютный рекорд: 156 440 вёдер пива в год.
              </p>
              <p className="max-w-[48ch] font-sans text-base text-muted leading-relaxed mb-6">
                В 1900-м снизил цену с 1 рубля 40 копеек до 80 копеек за ведро. Конкуренты не выдержали — объёмы Крюгера были в разы больше. Золотые медали Парижа и Генуи. 5 трактиров и 26 пивных лавок в Томске.
              </p>
              <button
                onClick={() => setPopup("robert-war")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 text-foreground/80 font-mono text-[10px] tracking-[0.2em] uppercase hover:border-accent/60 hover:text-accent transition-all"
              >
                ↳ Демпинговая война 1900 года
              </button>
            </div>

            {/* Таймлайн + Портрет Роберта */}
            <div className="flex flex-col lg:flex-row gap-5 items-start shrink-0">
              {/* Мини-таймлайн */}
              <div ref={robertTl.ref} className="card-surface px-4 py-5 rounded-2xl min-w-[220px]">
                <p className="font-mono text-[9px] tracking-[0.35em] text-accent/50 uppercase mb-3">Хронология</p>
                <MiniTimeline items={ROBERT_TIMELINE} visible={robertTl.visible} />
              </div>

              {/* Портрет Роберта */}
              <div className="shrink-0 w-[180px] md:w-[200px]">
                <div className="relative overflow-hidden rounded-2xl group" style={{ aspectRatio: "3/4" }}>
                  <img src={`${B}/history/robert-portrait.jpg`} alt="Роберт Крюгер" loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080603]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="font-mono text-[8px] tracking-[0.3em] text-accent uppercase mb-1">Золотой век</p>
                    <p className="font-sans text-sm font-black text-white">Роберт Крюгер</p>
                    <p className="font-mono text-[9px] text-white/40">1890–1914</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Видеосетка Роберта */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {ROBERT_GRID.map(v => (
              <VideoThumb key={v.src} src={v.src} label={v.label} vertical={false} />
            ))}
          </div>

          {/* Чехов + достижения */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4">
            <div className="card-surface p-6 rounded-2xl" style={{ borderLeft: "2px solid rgba(201,162,39,0.4)" }}>
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-3">Современник · 1890</p>
              <p className="font-sans text-xl md:text-2xl text-foreground leading-snug italic">
                «Стакан пива — лучшее моё средство от бессонницы в Томске»
              </p>
              <p className="mt-3 font-mono text-[11px] text-muted">— Антон Павлович Чехов, Томск, 1890</p>
            </div>
            <div className="card-surface p-6 rounded-2xl text-center flex flex-col items-center justify-center min-w-[160px]">
              <p className="font-sans text-4xl md:text-5xl font-black text-accent">156 440</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-muted uppercase leading-snug">вёдер<br/>рекорд 1912</p>
            </div>
            <div className="card-surface p-6 rounded-2xl text-center flex flex-col items-center justify-center min-w-[160px]">
              <p className="font-sans text-4xl font-black text-accent">2 🥇</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-muted uppercase leading-snug">Медали<br/>Париж · Генуя</p>
            </div>
          </div>
        </div>
        <EmberLine side="bottom" count={18} />
      </div>

      {/* ═══════════════ ПОПАПЫ ═══════════════ */}
      {popup === "karl-move" && (
        <InfoModal title="1880–1884 · Великий переезд" onClose={() => setPopup(null)}>
          <p>В 1878 году Александр II подписал указ об открытии первого университета в азиатской части России — именно в Томске. Площадка идеально совпала с участком Крюгера.</p>
          <p>Власти всерьёз боялись, что студенты будут проводить время в заводском трактире, а не на лекциях. «Наука против духа» — так называли этот конфликт современники.</p>
          <p>Карл не стал спорить. Он купил новый участок на Московском тракте и врезал подвалы прямо в склон Острожной горы — постоянные +4°C без льда и машин.</p>
          <p><strong className="text-foreground">27 октября 1884 года</strong> завод официально запустили на новом месте. С этого дня и по сей день он стоит там же.</p>
        </InfoModal>
      )}
      {popup === "robert-war" && (
        <InfoModal title="1900 · Демпинговая война" onClose={() => setPopup(null)}>
          <p>После раскола среди местных пивоваров Роберт пошёл на радикальный шаг: опустил отпускную цену с <strong className="text-foreground">1 рубля 40 копеек до 80 копеек за ведро</strong>.</p>
          <p>Конкуренты не выдержали — объёмы Крюгера были в разы больше. Они работали в убыток, пока не закрылись. Роберт выиграл ценовую войну и монополизировал томский рынок.</p>
          <p>К 1914 году он владел <strong className="text-foreground">5 трактирами и 26 пивными лавками</strong> в самом Томске — и контролировал весь путь пива от варочного котла до кружки покупателя.</p>
          <p>Медали Парижской и Генуэзской выставок подтвердили: томское «Баварское» конкурировало с лучшими немецкими сортами.</p>
        </InfoModal>
      )}
    </section>
  );
}

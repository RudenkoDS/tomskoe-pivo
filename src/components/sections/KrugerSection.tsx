"use client";
import { useRef, useState, useEffect } from "react";

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
const KARL_GRID: { src: string; label: string; vertical: boolean }[] = [
  { src: "/scenes/karl-zakl-kamnya.mp4",  label: "Закладка камня",    vertical: true  },
  { src: "/scenes/karl-lab.mp4",          label: "Лаборатория",       vertical: true  },
  { src: "/scenes/karl-partnery.mp4",     label: "Карл и партнёры",   vertical: false },
  { src: "/scenes/karl-handshake.mp4",    label: "Рукопожатие",       vertical: false },
  { src: "/scenes/karl-chertezh.mp4",     label: "Карл и чертёж",     vertical: false },
  { src: "/scenes/karl-kvartira.mp4",     label: "В квартире",        vertical: false },
];

/* ──────────────────────────────────────────────
   Роберт Крюгер — сцены (все 16:9)
────────────────────────────────────────────── */
const ROBERT_GRID = [
  { src: "/scenes/robert-chertezh.mp4",  label: "Роберт и чертёж"    },
  { src: "/scenes/robert-rabochie.mp4",  label: "Роберт и рабочие"   },
  { src: "/scenes/robert-handshake.mp4", label: "Рукопожатие"        },
  { src: "/scenes/zames.mp4",            label: "Замес на заводе"    },
  { src: "/scenes/povozka.mp4",          label: "Повозки с бочками"  },
  { src: "/scenes/loshadi-led.mp4",      label: "Лошади и лёд"       },
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
  { src: "/history/factory-engraving.jpg",  alt: "Гравюра завода",             label: "Гравюра · 1884",        contain: false, delay: 0   },
  { src: "/history/zavod-kruger.jpg",        alt: "Завод Крюгеръ",              label: "Пивзавод · Томск",      contain: false, delay: 80  },
  { src: "/history/label-bavarian.jpg",      alt: "Баварское пиво — этикетка",  label: "Баварское",             contain: true,  delay: 160 },
  { src: "/history/label-pilsner.jpg",       alt: "Пильзенское — этикетка",     label: "Пильзенское",           contain: true,  delay: 240 },
  { src: "/history/pivo-kruger.jpg",         alt: "Пиво Крюгеръ — реклама",    label: "Пиво Крюгеръ",          contain: true,  delay: 320 },
];

function ArchiveSection() {
  const titleReveal = useReveal(0.2);
  const portraitReveal = useReveal(0.1);
  const gridReveal = useReveal(0.05);

  return (
    <div className="border-t border-amber-900/15 overflow-hidden" style={{ background: "linear-gradient(to bottom, #080603, #0a0804)" }}>
      {/* Зернистость */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">

        {/* Заголовок */}
        <div
          ref={titleReveal.ref}
          className="mb-14 flex flex-col md:flex-row md:items-end gap-4 md:gap-16 transition-all duration-1000"
          style={{ opacity: titleReveal.visible ? 1 : 0, transform: titleReveal.visible ? "translateY(0)" : "translateY(32px)", filter: titleReveal.visible ? "blur(0)" : "blur(6px)" }}
        >
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
          <div
            ref={portraitReveal.ref}
            className="transition-all duration-1000 delay-100"
            style={{ opacity: portraitReveal.visible ? 1 : 0, transform: portraitReveal.visible ? "translateX(0) scale(1)" : "translateX(-40px) scale(0.97)", filter: portraitReveal.visible ? "blur(0)" : "blur(8px)" }}
          >
            <div className="relative overflow-hidden rounded-2xl group" style={{ aspectRatio: "3/4" }}>
              <img
                src="/history/karl-kruger.jpg"
                alt="Карл Крюгер. Основатель завода"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Сепия-оверлей */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,6,3,0.9) 100%)", mixBlendMode: "multiply" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080603]/90 via-transparent to-transparent" />
              {/* Виньетка */}
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)" }} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1.5">Основатель завода</p>
                <p className="font-sans text-xl font-black text-white leading-none">Карл Крюгер</p>
                <p className="font-mono text-[10px] text-white/40 mt-1">Томск · 1876</p>
              </div>
              {/* Год — большой фоновый текст */}
              <div className="absolute top-4 right-4 font-sans font-black text-white/5 leading-none select-none" style={{ fontSize: "clamp(48px, 8vw, 90px)" }}>
                1876
              </div>
            </div>
          </div>

          {/* Правая сетка артефактов */}
          <div
            ref={gridReveal.ref}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {ARCHIVE_ITEMS.map((item, i) => (
              <div
                key={item.src}
                className="relative overflow-hidden rounded-xl group cursor-pointer"
                style={{
                  aspectRatio: item.contain ? "3/4" : "4/3",
                  background: "#0d0b08",
                  opacity: gridReveal.visible ? 1 : 0,
                  transform: gridReveal.visible ? "translateY(0) scale(1)" : "translateY(48px) scale(0.96)",
                  filter: gridReveal.visible ? "blur(0)" : "blur(10px)",
                  transition: `opacity 0.8s ease ${item.delay}ms, transform 0.8s ease ${item.delay}ms, filter 0.8s ease ${item.delay}ms`,
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${item.contain ? "object-contain p-3" : "object-cover"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* hover-оверлей */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
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
                opacity: gridReveal.visible ? 1 : 0,
                transform: gridReveal.visible ? "translateY(0)" : "translateY(48px)",
                transition: `opacity 0.8s ease 400ms, transform 0.8s ease 400ms`,
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

export function KrugerSection() {
  return (
    <section id="robert" className="bg-background border-t border-amber-900/15">

      {/* ═══════════════ КАРЛ КРЮГЕР ═══════════════ */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
          <div className="flex-1">
            <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">
              1876 — Основание
            </p>
            <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
              Карл<br /><span className="text-accent">Крюгер</span>
            </h2>
          </div>
          <p className="max-w-[46ch] font-sans text-base text-muted leading-relaxed md:mb-1">
            В 1876 году немецкий пивовар Карл Крюгер заложил первый камень своей пивоварни в Томске.
            Когда университет потребовал землю — перенёс завод к подножию Острожной горы
            на Московском тракте. Подвалы врезали в склон горы — постоянные +4°C без льда и машин.
          </p>
        </div>

        {/*
          Раскладка:
          - слева: два вертикальных видео рядом (karl-zakl-kamnya + karl-lab)
          - справа: главное горизонтальное видео + 2×2 сетка горизонтальных сцен
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 items-start">

          {/* Левая колонка — два вертикальных видео */}
          <div className="flex gap-3 justify-center lg:justify-start">
            {KARL_GRID.filter(v => v.vertical).map(v => (
              <div key={v.src} className="w-[160px] md:w-[200px]">
                <VideoThumb src={v.src} label={v.label} vertical={true} />
              </div>
            ))}
          </div>

          {/* Правая колонка — главное видео + горизонтальные сцены */}
          <div className="flex flex-col gap-3">
            <MainVideo src="/scenes/karl-istfak-1.mp4" vertical={false} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {KARL_GRID.filter(v => !v.vertical).map(v => (
                <VideoThumb key={v.src} src={v.src} label={v.label} vertical={false} />
              ))}
            </div>
          </div>
        </div>

        {/* Цитата + факты */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
          <div className="card-surface p-6 rounded-2xl flex flex-col justify-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-3">
              Цитата · 1884
            </p>
            <p className="font-sans text-lg text-foreground leading-snug italic">
              «Хороший завод должен стоять там, где сама природа помогает пивовару.»
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted">
              — Карл Крюгер, при переносе на Московский тракт
            </p>
          </div>
          {[
            { val: "1876", desc: "Год основания" },
            { val: "1884", desc: "Московский тракт" },
            { val: "+4°C", desc: "Холод подвалов" },
          ].map(f => (
            <div key={f.val} className="card-surface p-5 rounded-2xl text-center flex flex-col items-center justify-center">
              <p className="font-sans text-3xl md:text-4xl font-black text-accent">{f.val}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase leading-snug">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ ИСТОРИЧЕСКИЙ АРХИВ ═══════════════ */}
      <ArchiveSection />

      {/* ═══════════════ РОБЕРТ КРЮГЕР ═══════════════ */}
      <div className="border-t border-amber-900/15 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
          <div className="flex-1">
            <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">
              1890–1912 — Золотой век
            </p>
            <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
              Роберт<br /><span className="text-accent">Крюгер</span>
            </h2>
          </div>
          <p className="max-w-[46ch] font-sans text-base text-muted leading-relaxed md:mb-1">
            Племянник Карла превратил завод в технологическую витрину Сибири. Паровые двигатели,
            пастеризация, 50 000 вёдер в год. Медали Парижа и Генуи. Снизил цену с 1р.40к
            до 80к за ведро — и одним ударом выбил конкурентов с томского рынка.
          </p>
        </div>

        {/* Robert 3×2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {ROBERT_GRID.map(v => (
            <VideoThumb key={v.src} src={v.src} label={v.label} vertical={false} />
          ))}
        </div>

        {/* Чехов + факт */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="card-surface p-6 rounded-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase mb-3">
              Современник · 1890
            </p>
            <p className="font-sans text-xl md:text-2xl text-foreground leading-snug italic">
              «Стакан пива — лучшее моё средство от бессонницы в Томске»
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted">
              — Антон Павлович Чехов, из письма, Томск, 1890
            </p>
          </div>
          <div className="card-surface p-8 rounded-2xl text-center flex flex-col items-center justify-center min-w-[180px]">
            <p className="font-sans text-4xl font-black text-accent">50 000</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              вёдер в год
            </p>
            <p className="mt-2 font-mono text-[10px] text-muted/50">Медали Парижа и Генуи</p>
          </div>
        </div>
      </div>

    </section>
  );
}

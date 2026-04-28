"use client";
import { useEffect, useRef, useState } from "react";
import { FRAME_COUNT, framePath, DIALOGUES } from "@/lib/hero";
import { useAudio } from "@/lib/audioContext";

const EPOCHS = [
  { year: "1876", label: "ОСНОВАНИЕ", anchor: "#karl" },
  { year: "1890", label: "ЗОЛОТОЙ ВЕК", anchor: "#robert" },
  { year: "1914", label: "ВОЙНА", anchor: "#war" },
  { year: "1960", label: "СССР", anchor: "#soviet" },
  { year: "1991", label: "ВОЗРОЖДЕНИЕ", anchor: "#revival" },
  { year: "2026", label: "СЕГОДНЯ", anchor: "#today" },
];

// Высота epoch strip + progress bar внизу
const BOTTOM_BAR = 52; // px

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const { muted, setMuted } = useAudio();

  useEffect(() => {
    let done = 0;
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = framePath(i + 1);
      img.onload = () => {
        done++;
        setLoadProgress(Math.round((done / FRAME_COUNT) * 100));
        if (done === 10) setReadyToShow(true);
        if (done === FRAME_COUNT) setLoaded(true);
      };
      img.onerror = () => { done++; if (done === FRAME_COUNT) setLoaded(true); };
      return img;
    });
    imagesRef.current = imgs;
  }, []);

  useEffect(() => {
    if (!readyToShow) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const section = sectionRef.current!;

    // Размер canvas обновляется только при resize, не при каждом кадре
    let cw = 0, ch = 0, dpr = 1;
    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const drawFrame = (idx: number) => {
      const img = imagesRef.current[idx];
      if (!img?.complete || cw === 0) return;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (section.offsetHeight - window.innerHeight)));
        const idx = Math.min(Math.floor(progress * FRAME_COUNT), FRAME_COUNT - 1);
        drawFrame(idx);

        if (heroTextRef.current) {
          if (progress < 0.1) {
            heroTextRef.current.style.opacity = "1";
            heroTextRef.current.style.transform = "translateY(0px)";
          } else if (progress < 0.2) {
            const t = (progress - 0.1) / 0.1;
            heroTextRef.current.style.opacity = String(1 - t);
            heroTextRef.current.style.transform = `translateY(${t * 50}px)`;
          } else {
            heroTextRef.current.style.opacity = "0";
            heroTextRef.current.style.transform = "translateY(50px)";
          }
        }

        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress})`;
        }

        const nowIds = DIALOGUES
          .filter(d => progress >= d.show && progress < d.hide)
          .map(d => d.id);
        const nowKey = [...nowIds].sort().join(",");
        const prevKey = [...visibleCards].sort().join(",");
        if (nowKey !== prevKey) setVisibleCards(nowIds);

        tickingRef.current = false;
      });
    };

    drawFrame(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [readyToShow]);

  const scrollTo = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" ref={sectionRef} className="scroll-animation relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Loading screen ── плавно исчезает когда готово */}
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background gap-6"
          style={{
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            transition: "opacity 0.6s ease",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-accent/80 uppercase">
            Томское Пиво · 150 лет
          </p>
          <div className="h-px w-48 bg-white/10 overflow-hidden rounded">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="font-mono text-xs text-muted">{loadProgress}%</span>
        </div>

        {/* ── Video canvas ── */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/*
          Затемнение:
          - Сильный градиент слева (под текст)
          - Лёгкий сверху и снизу
          - Справа остаётся чистым — видно медаль
        */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(10,8,4,0.92) 0%, rgba(10,8,4,0.75) 28%, rgba(10,8,4,0.35) 48%, transparent 65%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0804]/50 via-transparent to-[#0a0804]/20" />

        {/* ── Hero text (левая панель) ── */}
        <div
          ref={heroTextRef}
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20"
          style={{
            width: "min(520px, 48vw)",
            paddingTop: "72px",           // под navbar
            paddingBottom: `${BOTTOM_BAR + 16}px`, // над epoch strip
            transition: "opacity 0.12s ease, transform 0.12s ease",
          }}
        >
          {/* Eyebrow */}
          <p className="font-mono text-[10px] tracking-[0.42em] text-accent/80 uppercase mb-6">
            Томск · Сибирь · с 1876
          </p>

          {/* «150» — компактный, не вылезает за левую панель */}
          <h1 className="font-sans tracking-tighter leading-none text-foreground">
            <span
              className="block font-black text-accent"
              style={{ fontSize: "clamp(80px, 10vw, 160px)", lineHeight: 1 }}
            >
              150
            </span>
            <span
              className="block font-bold uppercase mt-1"
              style={{ fontSize: "clamp(22px, 3.2vw, 52px)", lineHeight: 1.05 }}
            >
              лет томского
            </span>
            <span
              className="block font-bold uppercase text-accent/90"
              style={{ fontSize: "clamp(22px, 3.2vw, 52px)", lineHeight: 1.05 }}
            >
              пива
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="mt-5 font-mono text-xs text-muted/90 tracking-wide">
            Живая летопись Сибири · 1876–2026
          </p>
          <p className="mt-2 font-sans text-sm text-foreground/50 leading-relaxed hidden md:block" style={{ maxWidth: "38ch" }}>
            Сто пятьдесят лет назад немецкий пивовар Карл Крюгер основал завод в Томске.
            Пережили две войны, советский запрет, распад страны.
          </p>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("#karl")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-[#0a0804] font-mono text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all whitespace-nowrap"
            >
              ▶ Начать путешествие
            </button>
            <button
              onClick={() => scrollTo("#films")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 text-foreground/80 font-mono text-[10px] tracking-[0.2em] uppercase hover:border-accent/60 transition-all backdrop-blur-md bg-white/4 whitespace-nowrap"
            >
              AI-фильм
            </button>
          </div>
        </div>

        {/* ── Scroll-cards (появляются только после ухода текста) ── */}
        {DIALOGUES.map(d => (
          <div
            key={d.id}
            className={`absolute bottom-20 right-6 md:right-14 card-surface p-4 md:p-5 transition-all duration-500 ${
              visibleCards.includes(d.id)
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            style={{ maxWidth: "280px" }}
          >
            <p className="font-sans text-base font-semibold text-foreground leading-tight">{d.quote}</p>
            <p className="mt-1.5 font-mono text-[10px] text-muted tracking-wide leading-relaxed">{d.sub}</p>
            {d.videoSrc && (
              <button
                onClick={() => setModalVideo(d.videoSrc!)}
                className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors group"
              >
                <span className="w-5 h-5 rounded-full border border-accent/50 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <span className="text-[8px] ml-0.5">▶</span>
                </span>
                Смотреть эпизод
              </button>
            )}
          </div>
        ))}

        {/* ── Video modal ── */}
        {modalVideo && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            onClick={() => { setModalVideo(null); }}
          >
            <div
              className="relative w-full max-w-[480px] mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase">
                  AI-Фильм · Эпизод 01 · Закладка камня
                </p>
                <button
                  onClick={() => setModalVideo(null)}
                  className="text-muted hover:text-foreground transition-colors font-mono text-lg leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
                <video
                  ref={modalVideoRef}
                  src={modalVideo}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  playsInline
                  loop
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Кнопка звука — управляет звуком второго экрана ── */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute top-20 right-6 md:right-14 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted/60 hover:text-accent transition-colors group z-10"
        >
          <span className="w-7 h-7 rounded-full border border-white/15 group-hover:border-accent/40 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-colors text-xs">
            {muted ? "🔇" : "♪"}
          </span>
          {muted ? "Без звука" : "Звук вкл"}
        </button>

        {/* ── Progress bar ── */}
        <div
          className="absolute left-0 right-0 h-px bg-white/5 origin-left"
          style={{ bottom: `${BOTTOM_BAR}px` }}
        >
          <div
            ref={progressBarRef}
            className="h-full bg-accent origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* ── Epoch anchor strip ── */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t border-amber-900/20 bg-[#0a0804]/85 backdrop-blur-xl"
          style={{ height: `${BOTTOM_BAR}px` }}
        >
          <div className="h-full mx-auto max-w-[1400px] px-2 flex items-stretch overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {EPOCHS.map((e) => (
              <button
                key={e.year}
                onClick={() => scrollTo(e.anchor)}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-0.5 px-3 md:px-6 group transition-all hover:bg-amber-900/10 border-r border-amber-900/15 last:border-r-0 h-full"
              >
                <span className="font-mono text-sm font-bold text-accent leading-none">{e.year}</span>
                <span className="font-mono text-[8px] tracking-[0.15em] text-muted uppercase whitespace-nowrap group-hover:text-foreground/70 transition-colors">
                  {e.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

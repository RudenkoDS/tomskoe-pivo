"use client";
import { useEffect, useRef, useState } from "react";
import { CINE_FRAME_COUNT, cineFramePath, BEATS } from "@/lib/cinematic";
import { useAudio } from "@/lib/audioContext";

export function CinematicReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleBeats, setVisibleBeats] = useState<string[]>([]);

  const { muted } = useAudio();
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    let done = 0;
    const imgs = Array.from({ length: CINE_FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = cineFramePath(i + 1);
      img.onload = () => {
        done++;
        setLoadProgress(Math.round((done / CINE_FRAME_COUNT) * 100));
        if (done === 8) setReadyToShow(true);
        if (done === CINE_FRAME_COUNT) setLoaded(true);
      };
      img.onerror = () => { done++; if (done === CINE_FRAME_COUNT) setLoaded(true); };
      return img;
    });
    imagesRef.current = imgs;
  }, []);

  // Инициализация аудио
  useEffect(() => {
    const audio = new Audio(`${process.env.NEXT_PUBLIC_BASE ?? ""}/audio/karl-pribytie.aac`);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    if (!readyToShow) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const section = sectionRef.current!;

    let cw = 0, ch = 0, dpr = 1, isMobile = false;
    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      isMobile = cw < 768;
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
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * (isMobile ? 1.2 : 1);
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
        const idx = Math.min(Math.floor(progress * CINE_FRAME_COUNT), CINE_FRAME_COUNT - 1);
        drawFrame(idx);

        // Заголовок виден в начале, уходит при скролле
        if (introRef.current) {
          if (progress < 0.03) {
            introRef.current.style.opacity = "1";
            introRef.current.style.transform = "translateY(0)";
          } else if (progress < 0.08) {
            const t = (progress - 0.03) / 0.05;
            introRef.current.style.opacity = String(1 - t);
            introRef.current.style.transform = `translateY(${t * 40}px)`;
          } else {
            introRef.current.style.opacity = "0";
            introRef.current.style.transform = "translateY(40px)";
          }
        }

        if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${progress})`;

        // Аудио: плавное появление/затухание по прогрессу секции
        const audio = audioRef.current;
        if (audio) {
          const inView = progress > 0 && progress < 1;
          if (inView && !mutedRef.current) {
            if (audio.paused) audio.play().catch(() => {});
            const vol = progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;
            audio.volume = Math.min(0.7, vol * 0.7);
          } else {
            audio.pause();
          }
        }

        const nowIds = BEATS.filter(b => progress >= b.show && progress < b.hide).map(b => b.id);
        const nowKey = [...nowIds].sort().join(",");
        const prevKey = [...visibleBeats].sort().join(",");
        if (nowKey !== prevKey) setVisibleBeats(nowIds);

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

  return (
    <section id="karl" ref={sectionRef} className="scroll-animation relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Loading — плавно исчезает */}
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background gap-6"
          style={{
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            transition: "opacity 0.6s ease",
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-accent/80 uppercase">
            Эпизод 01 · Карл Крюгер · 1876
          </p>
          <div className="h-px w-48 bg-white/10 overflow-hidden rounded">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="font-mono text-xs text-muted">{loadProgress}%</span>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Затемнение снизу и слева */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0804]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0804]/40 to-transparent" />

        {/* Заголовок — левый нижний угол, уходит при скролле */}
        <div
          ref={introRef}
          className="absolute left-8 md:left-16 bottom-24 flex flex-col gap-3"
          style={{ transition: "opacity 0.12s ease, transform 0.12s ease" }}
        >
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase">
            Эпоха I · AI-Фильм
          </p>
          <h2 className="font-sans tracking-tighter text-foreground leading-none">
            <span className="block font-black text-accent" style={{ fontSize: "clamp(48px, 7vw, 100px)" }}>
              Карл
            </span>
            <span className="block font-black" style={{ fontSize: "clamp(48px, 7vw, 100px)" }}>
              Крюгер
            </span>
          </h2>
          <p className="font-mono text-sm text-muted">
            1876 — Основание · Прокрути чтобы узнать историю
          </p>
        </div>

        {/* Beat cards — правый нижний угол */}
        {BEATS.map(b => (
          <div
            key={b.id}
            className={`absolute bottom-24 right-6 md:right-16 card-surface p-5 transition-all duration-500 ${
              visibleBeats.includes(b.id)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            style={{ maxWidth: "300px" }}
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase mb-2">
              {b.label}
            </p>
            <p className="font-sans text-sm text-foreground leading-relaxed">{b.quote}</p>
          </div>
        ))}

        {/* Episode badge — верхний левый */}
        <div className="absolute top-20 left-8 md:left-16 font-mono text-[10px] tracking-[0.3em] text-muted/60 uppercase">
          Эпизод 01 из 06 · На основе архивных материалов
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 origin-left">
          <div ref={progressBarRef} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef, useState } from "react";

const FILMS = [
  {
    id: "f1",
    episode: "01",
    title: "Карл Крюгер · 1876",
    desc: "Как немецкий пивовар изменил судьбу сибирского города",
    duration: "~1 мин",
    status: "ready" as const,
    video: "/scenes/karl-chertezh.mp4",
  },
  {
    id: "f2",
    episode: "02",
    title: "Золотой век · 1890–1912",
    desc: "Роберт Крюгер, медали Парижа и демпинговые войны",
    duration: "~45 сек",
    status: "progress" as const,
    video: "/scenes/robert-chertezh.mp4",
  },
  {
    id: "f3",
    episode: "03",
    title: "Добыча льда · XIX век",
    desc: "Лёд с Томи. Рубили зимой, хранили до лета — природный холод вместо машин",
    duration: "~30 сек",
    status: "progress" as const,
    video: "/scenes/dobyvcha-lda.mp4",
  },
  {
    id: "f4",
    episode: "04",
    title: "Завод и повозки",
    desc: "Развозка пива по городу на лошадях — первая логистика Томска",
    duration: "~30 сек",
    status: "progress" as const,
    video: "/scenes/zavod-povozki.mp4",
  },
  {
    id: "f5",
    episode: "05",
    title: "Александра Крюгер",
    desc: "Женщина, которая вела дела завода в переломные годы",
    duration: "~45 сек",
    status: "progress" as const,
    video: "/scenes/aleksandra.mp4",
  },
  {
    id: "f6",
    episode: "06",
    title: "Завод сегодня · 2026",
    desc: "175 млн литров и 2% рынка страны",
    duration: "~45 сек",
    status: "planned" as const,
    video: "/scenes/karl-zavod.mp4",
  },
];

const STATUS_LABEL = {
  ready: "✅ Готово",
  progress: "В разработке",
  planned: "В планах",
};

function FilmCard({ film }: { film: typeof FILMS[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <div
      className="flex-shrink-0 w-[280px] md:w-[320px] card-surface overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video preview */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={film.video}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-60"}`}
          muted
          playsInline
          loop
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Episode badge */}
        <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] text-accent bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
          EP·{film.episode}
        </div>
        {/* Status */}
        <div className={`absolute top-3 right-3 font-mono text-[9px] px-2 py-1 rounded-full backdrop-blur-sm ${film.status === "ready" ? "bg-green-900/60 text-green-400" : "bg-amber-900/40 text-amber-400/70"}`}>
          {STATUS_LABEL[film.status]}
        </div>
        {/* Play icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-accent text-sm ml-0.5">▶</span>
          </div>
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-3 font-mono text-[9px] text-muted/80">{film.duration}</div>
      </div>

      {/* Text */}
      <div className="p-4">
        <p className="font-sans text-sm font-semibold text-foreground leading-tight group-hover:text-accent transition-colors">
          {film.title}
        </p>
        <p className="mt-1.5 font-mono text-[11px] text-muted leading-relaxed">{film.desc}</p>
      </div>
    </div>
  );
}

export function FilmsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <section id="films" className="relative overflow-hidden bg-background border-t border-amber-900/15">
      {/* Video background (dimmed) */}
      <div className="absolute inset-0 z-0">
        <video
          src="/screen2.mp4"
          className="w-full h-full object-cover opacity-15"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent/80 uppercase mb-4">AI-Серия · 6 эпизодов</p>
          <h2 className="font-sans text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.92]">
            История,<br />
            которая <span className="text-accent">оживает</span>
          </h2>
          <p className="mt-5 font-sans text-base md:text-lg text-muted max-w-[54ch] leading-relaxed">
            Серия AI-роликов по ключевым эпохам завода: от первой варки Карла Крюгера до послевоенного
            восстановления. Архивные документы и воспоминания превращаются в кино.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {FILMS.map(f => (
            <div key={f.id} style={{ scrollSnapAlign: "start" }}>
              <FilmCard film={f} />
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 font-mono text-[10px] text-muted/50 max-w-[60ch] leading-relaxed">
          Серия создаётся на основе архивных документов, музейных материалов и исторических свидетельств.
          Визуализация — AI. Факты — реальные. [На основе материалов музея завода]
        </p>
      </div>
    </section>
  );
}

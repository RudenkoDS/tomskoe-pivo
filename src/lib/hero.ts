export const FRAME_COUNT = 188;
const BASE = process.env.NEXT_PUBLIC_BASE ?? "";
export const framePath = (n: number) => `${BASE}/frames/frame_${String(n).padStart(4, "0")}.jpg?v=2`;

export type Dialogue = { id: string; show: number; hide: number; quote: string; sub: string; videoSrc?: string };

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.20,   // Появляется только после того как заголовок ушёл
    hide: 0.38,
    quote: "9 сентября 1876",
    sub: "Карл Крюгер закладывает первый камень завода у подножия Острожной горы",
    videoSrc: `${BASE}/scenes/karl-zakl-kamnya.mp4`,
  },
  {
    id: "d2",
    show: 0.42,
    hide: 0.58,
    quote: "Природа стала технологией",
    sub: "Подвалы врезаны в склон горы — постоянные +4°C без льда и машин",
  },
  {
    id: "d3",
    show: 0.62,
    hide: 0.78,
    quote: "1884 — Московский тракт",
    sub: "Университет потребовал земли — Крюгер переехал и выиграл",
  },
  {
    id: "d4",
    show: 0.82,
    hide: 0.96,
    quote: "Первое промышленное пиво Сибири",
    sub: "«Хороший завод должен стоять там, где сама природа помогает пивовару»",
  },
];

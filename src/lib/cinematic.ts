export const CINE_FRAME_COUNT = 99;
const BASE = process.env.NEXT_PUBLIC_BASE ?? "";
export const cineFramePath = (n: number) => `${BASE}/frames2/frame_${String(n).padStart(4, "0")}.jpg?v=4`;

export type Beat = { id: string; show: number; hide: number; label: string; quote: string };

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.02,
    hide: 0.28,
    label: "1876 — Прибытие в Томск",
    quote: "Карл Крюгер пересёк половину континента — из Германии в Сибирь. Он вёз с собой рецептуры, оборудование и мечту.",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.58,
    label: "Первые шаги",
    quote: "9 сентября 1876 — первый камень заложен у подножия Острожной горы. Томск получил своего пивовара.",
  },
  {
    id: "b3",
    show: 0.63,
    hide: 0.82,
    label: "Природа как технология",
    quote: "Склон горы стал частью завода. Подвалы врезали в землю — постоянные +4°C без льда и машин.",
  },
  {
    id: "b4",
    show: 0.86,
    hide: 0.97,
    label: "Начало эпохи",
    quote: "«Хороший завод должен стоять там, где сама природа помогает пивовару.» — Карл Крюгер, 1876",
  },
];

import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { KrugerSection } from "@/components/sections/KrugerSection";
import { FilmsSection } from "@/components/sections/FilmsSection";
import { Timeline } from "@/components/sections/Timeline";
import { BrandSection } from "@/components/sections/BrandSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Экран 1: Hero — scroll-анимация "Финал Заставка для сайта + щит" */}
        <Hero />
        {/* Экран 2: Карл Крюгер AI-фильм — "Прибытие" */}
        <CinematicReveal />
        {/* Экран 3: Богатая галерея AI-сцен Карла и Роберта */}
        <KrugerSection />
        {/* Экран 4: Hub AI-фильмов + слайдер */}
        <FilmsSection />
        {/* Экран 5: Хронология 1876–2026 */}
        <Timeline />
        {/* Экран 6: Завод сегодня + цифры */}
        <BrandSection />
      </main>
      <Footer />
    </>
  );
}

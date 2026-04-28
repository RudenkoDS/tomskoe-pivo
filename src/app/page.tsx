import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { KrugerSection } from "@/components/sections/KrugerSection";
import { WorldOf1876Section } from "@/components/sections/WorldOf1876Section";
import { EconomicsSection } from "@/components/sections/EconomicsSection";
import { FilmsSection } from "@/components/sections/FilmsSection";
import { Timeline } from "@/components/sections/Timeline";
import { AlexandraSection } from "@/components/sections/AlexandraSection";
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
        {/* Экран 4: Томск и мир в 1876 году — контекст */}
        <WorldOf1876Section />
        {/* Экран 5: Экономика — зарплаты, цены, почему Томск */}
        <EconomicsSection />
        {/* Экран 6: Hub AI-фильмов + слайдер */}
        <FilmsSection />
        {/* Экран 7: Хронология 1876–2026 */}
        <Timeline />
        {/* Экран 8: Александра Крюгер 1914-1916 + конец династии 1927 */}
        <AlexandraSection />
        {/* Экран 9: Завод сегодня + цифры */}
        <BrandSection />
      </main>
      <Footer />
    </>
  );
}

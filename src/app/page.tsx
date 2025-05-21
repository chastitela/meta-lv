import HeroSection from "@/components/sections/HeroSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main className="space-y-24 py-12">
      <HeroSection
        headline="Твоя реальность начинается здесь"
        subheadline="Мы создаём цифровые миры, которыми ты управляешь"
      />

      <ReviewsSection
        reviews={[
          { author: "Анна", content: "Это был лучший опыт с digital-командой!" },
          { author: "Максим", content: "Сайт не просто красивый — он живой." },
        ]}
      />

      <CTASection />
    </main>
  );
}

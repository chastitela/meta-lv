export default function HeroSection({ headline, subheadline }: { headline?: string; subheadline?: string }) {
  return (
    <section className="py-20 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">{headline || "Заголовок"}</h1>
      <p className="text-xl opacity-80">{subheadline || "Подзаголовок"}</p>
    </section>
  );
}

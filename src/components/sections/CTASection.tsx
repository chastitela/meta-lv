import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 text-center bg-accent text-white">
      <h2 className="text-3xl font-bold mb-4">Готов начать проект с нами?</h2>
      <p className="text-lg mb-6">Оставь заявку, и мы свяжемся с тобой в течение дня.</p>
      <Link
        href="/contacts"
        className="inline-block bg-white text-accent font-semibold px-6 py-3 rounded hover:bg-gray-100 transition"
      >
        Связаться
      </Link>
    </section>
  );
}

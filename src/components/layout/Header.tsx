"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О нас" },
  { href: "/services", label: "Услуги" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-accent">
          METASAPIENS
        </Link>

        <nav className="flex gap-6 text-sm font-medium">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition ${
                pathname === href
                  ? "text-accent"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

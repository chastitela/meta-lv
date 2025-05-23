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
    <header className="w-full border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
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
                  : "text-muted hover:text-black"
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

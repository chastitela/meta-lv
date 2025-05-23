import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 py-10 border-t border-border text-sm text-muted text-center">
      <p className="mb-2">
        © {new Date().getFullYear()} METASAPIENS. Цифровая инфраструктура под контролем.
      </p>
      <p>
        <Link href="/admin" className="hover:underline">
          Войти в систему
        </Link>
      </p>
    </footer>
  );
}

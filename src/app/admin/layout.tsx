'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, FileText, MessageCircle, Brain } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border p-6">
        <h2 className="text-xl font-bold mb-6 text-accent">META:LV</h2>

        <nav className="space-y-8 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-black/50 mb-2">Структура</p>
            <Link
              href="/admin/pages"
              className={`flex items-center gap-2 ${
                pathname.startsWith('/admin/pages')
                  ? 'text-accent font-semibold'
                  : 'hover:text-accent text-black'
              }`}
            >
              <Layers size={18} /> Контур
            </Link>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-black/50 mb-2">Система</p>
            <Link
              href="/admin/cases"
              className={`flex items-center gap-2 ${
                pathname.startsWith('/admin/cases')
                  ? 'text-accent font-semibold'
                  : 'hover:text-accent text-black'
              }`}
            >
              <FileText size={18} /> Инъекции
            </Link>
            <Link
              href="/admin/leads"
              className={`flex items-center gap-2 ${
                pathname.startsWith('/admin/leads')
                  ? 'text-accent font-semibold'
                  : 'hover:text-accent text-black'
              }`}
            >
              <MessageCircle size={18} /> Протоколы
            </Link>
            <Link
              href="/admin/meta"
              className={`flex items-center gap-2 ${
                pathname.startsWith('/admin/meta')
                  ? 'text-accent font-semibold'
                  : 'hover:text-accent text-black'
              }`}
            >
              <Brain size={18} /> Meta-уровень
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
      <ThemeToggle />
    </div>
  );
}

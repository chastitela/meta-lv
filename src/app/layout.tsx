import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <div className="min-h-screen">{children}</div>
        <ThemeToggle />
      </body>
    </html>
  );
}

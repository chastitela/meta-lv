'use client';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-[9999] bg-accent text-accent-foreground rounded-full p-3 text-xl shadow-lg hover:opacity-90 transition"
    >
      🌗
    </button>
  );
}

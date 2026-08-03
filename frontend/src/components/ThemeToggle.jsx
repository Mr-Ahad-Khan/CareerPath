import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme.jsx';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted transition-all duration-200 hover:text-accent ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

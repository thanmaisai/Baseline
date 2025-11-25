import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = "relative flex-shrink-0 rounded-full text-[var(--brand-ink)] dark:text-[var(--brand-sand)] !bg-transparent transition-all duration-200 ease-out hover:!bg-[var(--brand-sand)]/12 dark:hover:!bg-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--brand-sunset)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(baseClasses, className)}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

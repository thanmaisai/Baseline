import { ReactNode } from 'react';
import { useThemeTokens } from '@/theme/useThemeTokens';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  const { colors, brand, isDark } = useThemeTokens();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-4 md:px-6 py-8 md:py-12 relative overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(180deg, ${brand.ink} 0%, ${brand.sunset} 100%)`
          : `linear-gradient(180deg, ${brand.sand} 0%, ${brand.dunes} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-50" aria-hidden>
        <div className="absolute -top-16 -right-10 w-64 h-64 blur-3xl bg-[var(--brand-sunset)]/30 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 blur-[120px] bg-[var(--brand-dunes)]/60 dark:bg-[var(--brand-sunset)]/20 rounded-full" />
      </div>
      <main
        className={`w-full max-w-[1200px] min-h-[85vh] border rounded-[32px] shadow-[0_20px_60px_-15px_rgba(34,34,34,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden z-10 ${className}`}
        style={{
          backgroundColor: isDark ? colors.background.secondary : brand.sand,
          borderColor: isDark ? colors.border.default : brand.dunes,
        }}
      >
        {children}
      </main>
    </div>
  );
};


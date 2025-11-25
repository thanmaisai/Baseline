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
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden"
      style={{
        background: isDark
          ? colors.background.primary
          : `linear-gradient(135deg, ${brand.sand}, ${brand.dunes})`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-30" aria-hidden>
        <div className="absolute -top-16 -right-10 w-64 h-64 blur-3xl bg-[var(--brand-sunset)]/20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 blur-[120px] bg-white/40 dark:bg-white/5 rounded-full" />
      </div>
      <main
        className={`w-full max-w-[1200px] h-[85vh] border rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden z-10 ${className}`}
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


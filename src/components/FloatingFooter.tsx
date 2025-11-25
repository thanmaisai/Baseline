import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useThemeTokens } from '@/theme/useThemeTokens';

interface FloatingFooterProps {
  branding?: string;
  statusLabel: string;
  statusText: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  primaryButtonText: string;
  primaryButtonIcon?: React.ReactNode;
  onPrimaryAction: () => void;
  primaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  secondaryButtonIcon?: React.ReactNode;
  onSecondaryAction?: () => void;
  secondaryButtonDisabled?: boolean;
  showThemeToggle?: boolean;
  showKeyboardShortcuts?: boolean;
}

const Kbd = ({ children, variant = 'dark' }: { children: React.ReactNode; variant?: 'dark' | 'light' }) => {
  const baseStyles = "inline-flex items-center justify-center text-[10px] font-mono rounded px-1.5 py-0.5 border";
  const variants = {
    dark: "text-[var(--brand-sand)] border-[var(--brand-sand)]/20 bg-[var(--brand-ink)]/60",
    light: "text-[var(--brand-ink)] border-[var(--brand-ink)]/20 bg-[var(--brand-sand)]/80",
  };

  return <span className={`${baseStyles} ${variants[variant]}`}>{children}</span>;
};

export const FloatingFooter = ({
  branding = 'Baseline.',
  statusLabel,
  statusText,
  showBackButton = true,
  backButtonText = 'Back',
  onBack,
  primaryButtonText,
  primaryButtonIcon,
  onPrimaryAction,
  primaryButtonDisabled = false,
  secondaryButtonText,
  secondaryButtonIcon,
  onSecondaryAction,
  secondaryButtonDisabled = false,
  showThemeToggle = true,
  showKeyboardShortcuts = true,
}: FloatingFooterProps) => {
  const navigate = useNavigate();
  const { brand, colors, isDark } = useThemeTokens();

  const shellStyles = {
    backgroundColor: isDark ? colors.background.secondary : brand.ink,
    color: isDark ? colors.text.primary : brand.sand,
    borderColor: isDark ? colors.border.default : brand.ink,
  };

  const primaryButtonStyles = {
    backgroundColor: brand.sunset,
    color: brand.ink,
  };

  const secondaryButtonStyles = {
    backgroundColor: isDark ? 'transparent' : brand.dunes,
    color: isDark ? brand.sand : brand.ink,
    borderColor: isDark ? brand.sand : brand.ink,
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="rounded-2xl py-3 px-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6 border ring-1 ring-[var(--brand-sand)]/20 w-auto whitespace-nowrap backdrop-blur-xl"
        style={shellStyles}
      >

        {/* Branding + Status Container */}
        <div className="flex items-center gap-6">
          {/* Branding (clickable) */}
          <div className="flex items-center gap-2">
            <button
              tabIndex={0}
              onClick={() => navigate('/')}
              className="text-lg font-bold tracking-tight hover:underline focus:outline-none rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {branding}
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-[var(--brand-sand)]/20 hidden md:block"></div>

          {/* Status Info */}
          <div className="hidden md:flex flex-col py-1 opacity-80">
            <span className="text-[10px] font-bold tracking-widest uppercase mb-0.5">
              {statusLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{statusText}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation Actions */}
        <div className="flex items-center gap-3 pl-4 md:pl-0">
          {/* Theme Toggle - Moved before Back button */}
          {showThemeToggle && (
            <div className="flex items-center">
              <div className="h-8 w-px bg-[var(--brand-sand)]/20 mr-3"></div>
              <div className="[&_button]:text-[var(--brand-sand)] [&_button]:hover:text-[var(--brand-sand)] [&_button]:hover:bg-[var(--brand-sunset)]/20 [&_button]:h-8 [&_button]:w-8">
                <ThemeToggle />
              </div>
            </div>
          )}

          {/* Back Button with Keyboard Shortcut */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--brand-sand)]/20 hover:bg-[var(--brand-sunset)]/10 transition-all duration-200"
              aria-keyshortcuts="Meta+ArrowLeft"
            >
              {showKeyboardShortcuts && (
                <span className="flex items-center gap-0.5">
                  <Kbd variant="dark">⌘</Kbd>
                  <Kbd variant="dark">←</Kbd>
                </span>
              )}
              <span className="text-sm font-medium">{backButtonText}</span>
            </button>
          )}

          {/* Primary Button with Keyboard Shortcut */}
          <Button
            onClick={onPrimaryAction}
            disabled={primaryButtonDisabled}
            className="group relative font-bold py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-[var(--brand-ink)]/10"
            style={primaryButtonStyles}
            aria-keyshortcuts="Meta+ArrowRight"
          >
            {primaryButtonIcon}
            <span>{primaryButtonText}</span>
            {showKeyboardShortcuts && (
              <span className="flex items-center gap-0.5 ml-2">
                <Kbd variant="light">⌘</Kbd>
                <Kbd variant="light">→</Kbd>
              </span>
            )}
          </Button>

          {secondaryButtonText && onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              disabled={secondaryButtonDisabled}
              className="group relative font-semibold py-2.5 px-5 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 border"
              style={secondaryButtonStyles}
              aria-keyshortcuts="Meta+Digit2"
            >
              {secondaryButtonIcon}
              <span>{secondaryButtonText}</span>
              {showKeyboardShortcuts && (
                <span className="flex items-center gap-0.5 ml-1">
                  <Kbd variant="dark">⌘</Kbd>
                  <Kbd variant="dark">2</Kbd>
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

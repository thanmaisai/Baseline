import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
  showThemeToggle?: boolean;
  showKeyboardShortcuts?: boolean;
}

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
  showThemeToggle = true,
  showKeyboardShortcuts = true,
}: FloatingFooterProps) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-[#1A1A1A] dark:bg-gray-900 text-white rounded-2xl py-3 px-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6 border border-gray-800 dark:border-gray-700 ring-1 ring-white/10 w-auto whitespace-nowrap">
        
        {/* Branding + Status Container */}
        <div className="flex items-center gap-6">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">{branding}</span>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-700 dark:bg-gray-600 hidden md:block"></div>

          {/* Status Info */}
          <div className="hidden md:flex flex-col py-1">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-0.5">
              {statusLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{statusText}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation Actions */}
        <div className="flex items-center gap-3 pl-4 md:pl-0">
          {/* Theme Toggle - Moved before Back button */}
          {showThemeToggle && (
            <div className="flex items-center">
              <div className="h-8 w-px bg-gray-700 dark:bg-gray-600 mr-3"></div>
              <div className="[&_button]:text-white [&_button]:hover:text-white [&_button]:hover:bg-white/10 [&_button]:h-8 [&_button]:w-8">
                <ThemeToggle />
              </div>
            </div>
          )}

          {/* Back Button with Keyboard Shortcut */}
          {showBackButton && onBack && (
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-white transition-colors duration-200 uppercase tracking-wider px-2 flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backButtonText}</span>
                {showKeyboardShortcuts && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono ml-1">
                    ⌘←
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Primary Button with Keyboard Shortcut */}
          <Button
            onClick={onPrimaryAction}
            disabled={primaryButtonDisabled}
            className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {primaryButtonIcon}
            <span>{primaryButtonText}</span>
            {!primaryButtonIcon && <ArrowRight className="h-4 w-4" />}
            {showKeyboardShortcuts && !primaryButtonIcon && (
              <span className="text-[10px] text-gray-500 font-mono ml-1">
                ⌘→
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

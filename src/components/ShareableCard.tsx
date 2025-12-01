import { useState, useRef, useEffect } from 'react';
import { Tool } from '@/types/tools';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';

export type CardTheme = 'dark' | 'sunset' | 'ocean' | 'forest' | 'light' | 'neon' | 'midnight' | 'rose' | 'cyber';
export type CardPattern = 'wave' | 'dots' | 'grid' | 'gradient' | 'minimal' | 'circles' | 'hexagon' | 'diagonal' | 'zigzag';

interface ShareableCardProps {
  selectedTools: Tool[];
  onDownload?: () => void;
}

const themes = {
  dark: {
    name: 'Dark Mode',
    bg: '#0A0A0A',
    cardBg: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#A0A0A0',
    accent: '#3B82F6',
    accentLight: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    gradientFrom: '#3B82F6',
    gradientTo: '#1E40AF',
  },
  sunset: {
    name: 'Sunset',
    bg: '#222222',
    cardBg: '#1A1A1A',
    text: '#FAF3E1',
    textMuted: '#F5E7C6',
    accent: '#FF6D1F',
    accentLight: 'rgba(255, 109, 31, 0.1)',
    border: 'rgba(235, 222, 201, 0.2)',
    gradientFrom: '#FF6D1F',
    gradientTo: '#AF3C43',
  },
  ocean: {
    name: 'Ocean',
    bg: '#0F172A',
    cardBg: '#1E293B',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    accent: '#06B6D4',
    accentLight: 'rgba(6, 182, 212, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
    gradientFrom: '#06B6D4',
    gradientTo: '#0284C7',
  },
  forest: {
    name: 'Forest',
    bg: '#14120B',
    cardBg: '#1C1917',
    text: '#FAFAF9',
    textMuted: '#A8A29E',
    accent: '#10B981',
    accentLight: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(168, 162, 158, 0.2)',
    gradientFrom: '#10B981',
    gradientTo: '#059669',
  },
  light: {
    name: 'Light',
    bg: '#FFFFFF',
    cardBg: '#F9FAFB',
    text: '#111827',
    textMuted: '#6B7280',
    accent: '#3B82F6',
    accentLight: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(0, 0, 0, 0.1)',
    gradientFrom: '#3B82F6',
    gradientTo: '#1E40AF',
  },
  neon: {
    name: 'Neon',
    bg: '#0D0D0D',
    cardBg: '#1A1A1A',
    text: '#E0E7FF',
    textMuted: '#A5B4FC',
    accent: '#A78BFA',
    accentLight: 'rgba(167, 139, 250, 0.1)',
    border: 'rgba(167, 139, 250, 0.2)',
    gradientFrom: '#A78BFA',
    gradientTo: '#EC4899',
  },
  midnight: {
    name: 'Midnight',
    bg: '#0C1222',
    cardBg: '#151B2C',
    text: '#E2E8F0',
    textMuted: '#94A3B8',
    accent: '#6366F1',
    accentLight: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.2)',
    gradientFrom: '#6366F1',
    gradientTo: '#8B5CF6',
  },
  rose: {
    name: 'Rose',
    bg: '#1F1416',
    cardBg: '#2D1B20',
    text: '#FCE7F3',
    textMuted: '#F9A8D4',
    accent: '#F472B6',
    accentLight: 'rgba(244, 114, 182, 0.1)',
    border: 'rgba(244, 114, 182, 0.2)',
    gradientFrom: '#F472B6',
    gradientTo: '#EC4899',
  },
  cyber: {
    name: 'Cyber',
    bg: '#0A0E1A',
    cardBg: '#13182B',
    text: '#00FFF5',
    textMuted: '#6DD5FA',
    accent: '#00FFF5',
    accentLight: 'rgba(0, 255, 245, 0.1)',
    border: 'rgba(0, 255, 245, 0.2)',
    gradientFrom: '#00FFF5',
    gradientTo: '#0066FF',
  },
};

const patterns = {
  wave: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <path d="M0,0 L400,0 L400,240 C350,240 320,160 270,160 C220,160 200,260 140,260 C80,260 60,180 0,180 Z" fill="url(#waveGrad)"/>
    </svg>
  `,
  dots: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="${theme.accent}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#dots)"/>
      <rect width="400" height="300" fill="url(#dots)" transform="translate(20, 20)"/>
    </svg>
  `,
  grid: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)"/>
    </svg>
  `,
  gradient: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.6" />
        </linearGradient>
        <radialGradient id="radial">
          <stop offset="0%" style="stop-color:${theme.accent};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <ellipse cx="100" cy="80" rx="120" ry="120" fill="url(#radial)"/>
      <ellipse cx="320" cy="220" rx="100" ry="100" fill="url(#radial)"/>
    </svg>
  `,
  minimal: () => ``,
  circles: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="100" fill="url(#circleGrad)"/>
      <circle cx="320" cy="160" r="120" fill="url(#circleGrad)"/>
      <circle cx="200" cy="250" r="90" fill="url(#circleGrad)"/>
    </svg>
  `,
  hexagon: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagon" x="0" y="0" width="50" height="43.3" patternUnits="userSpaceOnUse">
          <path d="M25 0 L50 12.5 L50 37.5 L25 50 L0 37.5 L0 12.5 Z" 
                fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#hexagon)"/>
    </svg>
  `,
  diagonal: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.5" />
          <stop offset="50%" style="stop-color:${theme.gradientTo};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${theme.gradientFrom};stop-opacity:0.5" />
        </linearGradient>
        <pattern id="diagLines" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="${theme.accent}" stroke-width="2" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#diagGrad)"/>
      <rect width="400" height="300" fill="url(#diagLines)"/>
    </svg>
  `,
  zigzag: (theme: typeof themes.dark) => `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zigzagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.7" />
        </linearGradient>
      </defs>
      <path d="M0,0 L400,0 L400,120 L350,140 L300,120 L250,140 L200,120 L150,140 L100,120 L50,140 L0,120 Z" 
            fill="url(#zigzagGrad)"/>
      <path d="M0,180 L50,160 L100,180 L150,160 L200,180 L250,160 L300,180 L350,160 L400,180 L400,300 L0,300 Z" 
            fill="url(#zigzagGrad)" opacity="0.5"/>
    </svg>
  `,
};

export const ShareableCard = ({ selectedTools, onDownload }: ShareableCardProps) => {
  // Randomly select theme and pattern on mount
  const getRandomTheme = (): CardTheme => {
    const themeKeys = Object.keys(themes) as CardTheme[];
    return themeKeys[Math.floor(Math.random() * themeKeys.length)];
  };

  const getRandomPattern = (): CardPattern => {
    const patternKeys = Object.keys(patterns) as CardPattern[];
    return patternKeys[Math.floor(Math.random() * patternKeys.length)];
  };

  const [currentTheme, setCurrentTheme] = useState<CardTheme>(() => getRandomTheme());
  const [currentPattern, setCurrentPattern] = useState<CardPattern>(() => getRandomPattern());
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get current date dynamically
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short'
  });

  const theme = themes[currentTheme];
  const patternSvg = patterns[currentPattern](theme);

  // Group tools by category
  const toolsByCategory = selectedTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const topCategories = Object.entries(toolsByCategory)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 3);

  // Get all tool names for the pills
  const toolNames = selectedTools.map(t => t.name).slice(0, 24); // Limit to avoid overflow

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);

    try {
      // Temporarily reset any transforms
      const originalTransform = cardRef.current.style.transform;
      cardRef.current.style.transform = 'none';

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: 400,
        windowHeight: 640,
      });

      cardRef.current.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `dev-stack-${currentTheme}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.accent, theme.text, theme.textMuted],
      });

      onDownload?.();
    } catch (error) {
      console.error('Failed to export card:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const randomizePattern = () => {
    const patternKeys = Object.keys(patterns) as CardPattern[];
    let nextPattern: CardPattern;
    do {
      nextPattern = patternKeys[Math.floor(Math.random() * patternKeys.length)];
    } while (nextPattern === currentPattern && patternKeys.length > 1);
    setCurrentPattern(nextPattern);
  };

  const randomizeTheme = () => {
    const themeKeys = Object.keys(themes) as CardTheme[];
    let nextTheme: CardTheme;
    do {
      nextTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    } while (nextTheme === currentTheme && themeKeys.length > 1);
    setCurrentTheme(nextTheme);
  };

  const randomizeAll = () => {
    randomizeTheme();
    randomizePattern();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Card Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div
          ref={cardRef}
          className="relative w-[400px] h-[640px] rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
          }}
        >
          {/* Pattern Background */}
          {currentPattern !== 'minimal' && (
            <div
              className="absolute top-0 left-0 w-full h-[300px] pointer-events-none"
              dangerouslySetInnerHTML={{ __html: patternSvg }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8">
            {/* Top Section */}
            <div className="mt-[45%]">
              <div
                className="w-10 h-1 rounded-full mb-4"
                style={{ backgroundColor: theme.accent }}
              />
              <h2
                className="text-[3.5rem] font-black tracking-tighter leading-[0.85] mb-3"
                style={{ color: theme.text }}
              >
                MY DEV
                <br />
                STACK
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase px-2 py-1 rounded border"
                  style={{
                    color: theme.accent,
                    backgroundColor: theme.accentLight,
                    borderColor: theme.accent,
                  }}
                >
                  {selectedTools.length} TOOLS
                </span>
                <span className="h-px w-8" style={{ backgroundColor: theme.border }} />
                <span className="text-[10px] font-mono" style={{ color: theme.textMuted }}>
                  {currentDate}
                </span>
              </div>
            </div>

            {/* Tool Pills */}
            <div className="flex-1 mt-6 mb-6 overflow-hidden">
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto no-scrollbar">
                {toolNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-default select-none"
                    style={{
                      color: theme.textMuted,
                      backgroundColor: theme.accentLight,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-end justify-between pt-6 border-t"
              style={{ borderColor: theme.border }}
            >
              {/* Left: Stats */}
              <div className="flex flex-col gap-2">
                <div className="text-[9px] font-mono tracking-wider uppercase" style={{ color: theme.textMuted }}>
                  TOP CATEGORIES
                </div>
                {topCategories.map(([category, tools]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: theme.text }}>
                      {category} ({tools.length})
                    </span>
                  </div>
                ))}
              </div>

              {/* Right: Branding */}
              <div className="text-right leading-none">
                <span
                  className="block text-[8px] font-bold tracking-widest uppercase mb-1"
                  style={{ color: theme.textMuted }}
                >
                  POWERED BY
                </span>
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="font-sans text-2xl font-black tracking-tight" style={{ color: theme.text }}>
                    Baseline
                  </span>
                  <span className="text-3xl" style={{ color: theme.accent }}>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button
            onClick={randomizeAll}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Randomize All
          </Button>
          <Button
            onClick={randomizeTheme}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            New Theme
          </Button>
          <Button
            onClick={randomizePattern}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Pattern
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isExporting}
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isExporting ? (
              <>Exporting...</>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Save Card
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Theme: <span className="font-medium">{theme.name}</span> • Pattern: <span className="font-medium capitalize">{currentPattern}</span>
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

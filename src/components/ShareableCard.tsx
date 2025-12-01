import { useState, useRef, useEffect } from 'react';
import { Tool } from '@/types/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Palette, X, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';

export type CardTheme = 'dark' | 'sunset' | 'ocean' | 'forest' | 'light' | 'neon' | 'midnight' | 'rose' | 'cyber';
export type CardPattern = 'wave' | 'dots' | 'grid' | 'gradient' | 'minimal' | 'circles' | 'hexagon' | 'diagonal' | 'zigzag';

interface ShareableCardProps {
  selectedTools: Tool[];
  onDownload?: () => void;
}

interface ToolSelectionModalProps {
  tools: Tool[];
  selectedToolIds: string[];
  onToggle: (toolId: string) => void;
  onConfirm: () => void;
  maxSelection: number;
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
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 480 300">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <path d="M0,0 L480,0 L480,240 C420,240 384,160 324,160 C264,160 240,260 168,260 C96,260 72,180 0,180 Z" fill="url(#waveGrad)"/>
    </svg>
  `,
  dots: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="${theme.accent}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#dots)"/>
      <rect width="480" height="300" fill="url(#dots)" transform="translate(20, 20)"/>
    </svg>
  `,
  grid: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#grid)"/>
    </svg>
  `,
  gradient: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
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
      <rect width="480" height="300" fill="url(#grad)"/>
      <ellipse cx="120" cy="80" rx="120" ry="120" fill="url(#radial)"/>
      <ellipse cx="384" cy="220" rx="100" ry="100" fill="url(#radial)"/>
    </svg>
  `,
  minimal: () => ``,
  circles: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <circle cx="96" cy="80" r="100" fill="url(#circleGrad)"/>
      <circle cx="384" cy="160" r="120" fill="url(#circleGrad)"/>
      <circle cx="240" cy="250" r="90" fill="url(#circleGrad)"/>
    </svg>
  `,
  hexagon: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagon" x="0" y="0" width="50" height="43.3" patternUnits="userSpaceOnUse">
          <path d="M25 0 L50 12.5 L50 37.5 L25 50 L0 37.5 L0 12.5 Z" 
                fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#hexagon)"/>
    </svg>
  `,
  diagonal: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
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
      <rect width="480" height="300" fill="url(#diagGrad)"/>
      <rect width="480" height="300" fill="url(#diagLines)"/>
    </svg>
  `,
  zigzag: (theme: typeof themes.dark) => `
    <svg width="480" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zigzagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.gradientFrom};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${theme.gradientTo};stop-opacity:0.7" />
        </linearGradient>
      </defs>
      <path d="M0,0 L480,0 L480,120 L420,140 L360,120 L300,140 L240,120 L180,140 L120,120 L60,140 L0,120 Z" 
            fill="url(#zigzagGrad)"/>
      <path d="M0,180 L60,160 L120,180 L180,160 L240,180 L300,160 L360,180 L420,160 L480,180 L480,300 L0,300 Z" 
            fill="url(#zigzagGrad)" opacity="0.5"/>
    </svg>
  `,
};

export const ShareableCard = ({ selectedTools, onDownload }: ShareableCardProps) => {
  const MAX_DISPLAY_TOOLS = 24;
  const needsSelection = selectedTools.length > MAX_DISPLAY_TOOLS;

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
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [selectedToolsForCard, setSelectedToolsForCard] = useState<string[]>(() => {
    // Initially select first 24 tools if more than 24
    return selectedTools.slice(0, MAX_DISPLAY_TOOLS).map(t => t.id);
  });
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

  // Get tools to display on card
  const displayTools = needsSelection
    ? selectedTools.filter(t => selectedToolsForCard.includes(t.id))
    : selectedTools;
  
  const toolNames = displayTools.map(t => t.name);
  const remainingCount = selectedTools.length - displayTools.length;

  const toggleToolSelection = (toolId: string) => {
    setSelectedToolsForCard(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else if (prev.length < MAX_DISPLAY_TOOLS) {
        return [...prev, toolId];
      }
      return prev;
    });
  };

  // Calculate dynamic font size based on number of tools
  const getToolPillFontSize = () => {
    return '10px'; // Fixed size since we're limiting to 24
  };

  const getToolPillPadding = () => {
    return 'px-2.5 py-1.5'; // Fixed padding since we're limiting to 24
  };

  const toolPillFontSize = getToolPillFontSize();
  const toolPillPadding = getToolPillPadding();

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);

    try {
      // Temporarily reset any transforms and ensure clean state
      const originalTransform = cardRef.current.style.transform;
      const originalBoxShadow = cardRef.current.style.boxShadow;
      
      cardRef.current.style.transform = 'none';
      cardRef.current.style.boxShadow = 'none';

      // Wait a bit for styles to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: 480,
        windowHeight: 720,
        width: 480,
        height: 720,
        imageTimeout: 0,
        removeContainer: true,
      });

      // Restore original styles
      cardRef.current.style.transform = originalTransform;
      cardRef.current.style.boxShadow = originalBoxShadow;

      const link = document.createElement('a');
      link.download = `dev-stack-${currentTheme}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
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
    <div className="w-full flex gap-8 items-start justify-center px-4">
      {/* Card Preview - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex-shrink-0"
      >
        <div
          ref={cardRef}
          className="relative w-[480px] h-[720px] rounded-3xl overflow-hidden shadow-2xl"
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
          <div className="relative z-10 h-full flex flex-col p-8">
            {/* Top Section */}
            <div className="mt-[24%] flex-shrink-0">
              <div
                className="w-10 h-1 rounded-full mb-3"
                style={{ backgroundColor: theme.accent }}
              />
              <h2
                className="text-[3rem] font-black tracking-tighter leading-[0.8] mb-2.5"
                style={{ 
                  color: theme.text,
                  textShadow: `0 2px 20px ${theme.accent}40`
                }}
              >
                MY DEV
                <br />
                STACK
              </h2>
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-lg border-2"
                  style={{
                    color: theme.accent,
                    backgroundColor: theme.accentLight,
                    borderColor: theme.accent,
                  }}
                >
                  {selectedTools.length} TOOLS
                </span>
                <span className="h-px w-5" style={{ backgroundColor: theme.border }} />
                <span className="text-[10px] font-mono font-semibold" style={{ color: theme.textMuted }}>
                  {currentDate}
                </span>
              </div>
            </div>

            {/* Tool Pills Section - Fixed height with scroll */}
            <div className="flex-shrink-0 mb-4" style={{ height: '260px' }}>
              <div className="h-full flex flex-wrap gap-2 overflow-y-auto no-scrollbar content-start">
                {toolNames.map((name, idx) => (
                  <span
                    key={idx}
                    className={`font-mono font-medium rounded-md transition-all cursor-default select-none backdrop-blur-sm flex-shrink-0 ${toolPillPadding}`}
                    style={{
                      fontSize: toolPillFontSize,
                      color: theme.text,
                      backgroundColor: theme.accentLight,
                      border: `1px solid ${theme.border}`,
                      height: 'fit-content',
                    }}
                  >
                    {name}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span
                    className={`font-mono font-bold rounded-md transition-all cursor-default select-none backdrop-blur-sm flex-shrink-0 ${toolPillPadding}`}
                    style={{
                      fontSize: toolPillFontSize,
                      color: theme.accent,
                      backgroundColor: theme.accentLight,
                      border: `2px solid ${theme.accent}`,
                      height: 'fit-content',
                    }}
                  >
                    +{remainingCount} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats Row - Minimal inline design */}
            <div 
              className="flex-shrink-0 mb-4 pb-3 border-b"
              style={{
                borderColor: theme.border,
              }}
            >
              <div className="text-[7px] font-mono tracking-widest uppercase mb-1.5" style={{ color: theme.textMuted }}>
                TOP CATEGORIES
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {topCategories.map(([category, tools]) => (
                  <div key={category} className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="text-[10px] font-medium capitalize whitespace-nowrap" style={{ color: theme.text }}>
                      {category}
                    </span>
                    <span 
                      className="text-[9px] font-mono font-bold whitespace-nowrap"
                      style={{ 
                        color: theme.accent,
                      }}
                    >
                      {tools.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer - QR Code and Branding */}
            <div className="flex-shrink-0 flex items-center justify-between mt-auto pt-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mac-baseline.vercel.app/&color=222222"
                    alt="Scan to visit"
                    style={{ display: 'block', width: '52px', height: '52px' }}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    SCAN TO VISIT
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: theme.text }}>
                    mac-baseline
                  </span>
                </div>
              </div>
              
              {/* Branding */}
              <div className="text-right leading-none flex-shrink-0">
                <span
                  className="block text-[8px] font-bold tracking-widest uppercase mb-1.5"
                  style={{ color: theme.textMuted }}
                >
                  POWERED BY
                </span>
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="font-sans text-[22px] font-black tracking-tight" style={{ color: theme.text }}>
                    Baseline
                  </span>
                  <span className="text-[28px]" style={{ color: theme.accent }}>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls - Right Side */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 w-full max-w-sm flex-shrink-0"
      >
        {/* Tool Selection Notice */}
        {needsSelection && (
          <div className="w-full p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {selectedToolsForCard.length} of {MAX_DISPLAY_TOOLS} tools selected
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  You have {selectedTools.length} tools. Choose your top {MAX_DISPLAY_TOOLS} to display on the card.
                </p>
              </div>
              <Button
                onClick={() => setShowToolSelector(true)}
                size="sm"
                variant="outline"
                className="flex-shrink-0"
              >
                Select Tools
              </Button>
            </div>
          </div>
        )}

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
      </motion.div>

      {/* Tool Selection Modal */}
      <AnimatePresence>
        {showToolSelector && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowToolSelector(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Select Tools for Card
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Choose {MAX_DISPLAY_TOOLS} tools to display ({selectedToolsForCard.length}/{MAX_DISPLAY_TOOLS} selected)
                  </p>
                </div>
                <button
                  onClick={() => setShowToolSelector(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Tool Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedTools.map((tool) => {
                    const isSelected = selectedToolsForCard.includes(tool.id);
                    const canSelect = selectedToolsForCard.length < MAX_DISPLAY_TOOLS;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleToolSelection(tool.id)}
                        disabled={!isSelected && !canSelect}
                        className={`
                          relative p-4 rounded-lg border-2 transition-all text-left
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : canSelect 
                              ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600' 
                              : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`
                            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 dark:border-gray-600'
                            }
                          `}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isSelected 
                                ? 'text-blue-900 dark:text-blue-100' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {tool.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedToolsForCard.length < MAX_DISPLAY_TOOLS && (
                    <>Select {MAX_DISPLAY_TOOLS - selectedToolsForCard.length} more tools</>
                  )}
                  {selectedToolsForCard.length === MAX_DISPLAY_TOOLS && (
                    <>All {MAX_DISPLAY_TOOLS} tools selected</>
                  )}
                </p>
                <Button
                  onClick={() => setShowToolSelector(false)}
                  disabled={selectedToolsForCard.length === 0}
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

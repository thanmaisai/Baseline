import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tool } from '@/types/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Palette, X, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { CardContainer, CardBody } from './ui/3d-card';
import { useThemeTokens } from '@/theme/useThemeTokens';

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
  const tokens = useThemeTokens();

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
      // Create a completely standalone export container
      const exportWrapper = document.createElement('div');
      exportWrapper.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 520px;
        height: 720px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 50%, ${theme.bg} 100%);
        padding: 60px;
        box-sizing: border-box;
      `;
      
      // Add subtle pattern overlay
      const patternOverlay = document.createElement('div');
      patternOverlay.style.cssText = `
        position: absolute;
        inset: 0;
        background-image: radial-gradient(circle at 20% 20%, ${theme.accent}15 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${theme.gradientTo}15 0%, transparent 50%);
        pointer-events: none;
      `;
      exportWrapper.appendChild(patternOverlay);
      
      // Create a fresh card element (not cloning) for better rendering
      const cardElement = document.createElement('div');
      cardElement.style.cssText = `
        width: 400px;
        height: 600px;
        border-radius: 16px;
        overflow: hidden;
        background-color: ${theme.cardBg};
        border: 1px solid ${theme.border};
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      `;
      
      // Add pattern background
      if (currentPattern !== 'minimal') {
        const patternDiv = document.createElement('div');
        patternDiv.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 250px;
          pointer-events: none;
        `;
        patternDiv.innerHTML = patternSvg;
        cardElement.appendChild(patternDiv);
      }
      
      // Create content container
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = `
        position: relative;
        z-index: 10;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 28px;
        box-sizing: border-box;
      `;
      
      // Top section with title
      const topSection = document.createElement('div');
      topSection.style.cssText = `margin-top: 20%; flex-shrink: 0;`;
      
      // Accent bar
      const accentBar = document.createElement('div');
      accentBar.style.cssText = `
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        margin-bottom: 10px;
        background-color: ${theme.accent};
      `;
      topSection.appendChild(accentBar);
      
      // Title
      const title = document.createElement('h2');
      title.style.cssText = `
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 0.85;
        margin-bottom: 10px;
        color: ${theme.text};
        text-shadow: 0 2px 20px ${theme.accent}40;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      title.innerHTML = 'MY DEV<br/>STACK';
      topSection.appendChild(title);
      
      // Badge row
      const badgeRow = document.createElement('div');
      badgeRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      `;
      
      const badge = document.createElement('span');
      badge.style.cssText = `
        font-size: 9px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        padding: 2px 10px;
        border-radius: 6px;
        border: 2px solid ${theme.accent};
        color: ${theme.accent};
        background-color: ${theme.accentLight};
      `;
      badge.textContent = `${selectedTools.length} TOOLS`;
      badgeRow.appendChild(badge);
      
      const separator = document.createElement('span');
      separator.style.cssText = `
        height: 1px;
        width: 20px;
        background-color: ${theme.border};
      `;
      badgeRow.appendChild(separator);
      
      const dateSpan = document.createElement('span');
      dateSpan.style.cssText = `
        font-size: 9px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-weight: 600;
        color: ${theme.textMuted};
      `;
      dateSpan.textContent = currentDate;
      badgeRow.appendChild(dateSpan);
      
      topSection.appendChild(badgeRow);
      contentDiv.appendChild(topSection);
      
      // Tool pills section
      const toolsSection = document.createElement('div');
      toolsSection.style.cssText = `
        flex-shrink: 0;
        margin-bottom: 16px;
        height: 210px;
        overflow: hidden;
      `;
      
      const toolsContainer = document.createElement('div');
      toolsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-content: flex-start;
      `;
      
      toolNames.forEach(name => {
        const pill = document.createElement('span');
        pill.style.cssText = `
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 9px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          color: ${theme.text};
          background-color: ${theme.accentLight};
          border: 1px solid ${theme.border};
          white-space: nowrap;
        `;
        pill.textContent = name;
        toolsContainer.appendChild(pill);
      });
      
      if (remainingCount > 0) {
        const morePill = document.createElement('span');
        morePill.style.cssText = `
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 9px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          color: ${theme.accent};
          background-color: ${theme.accentLight};
          border: 2px solid ${theme.accent};
          white-space: nowrap;
        `;
        morePill.textContent = `+${remainingCount} more`;
        toolsContainer.appendChild(morePill);
      }
      
      toolsSection.appendChild(toolsContainer);
      contentDiv.appendChild(toolsSection);
      
      // Categories section
      const categoriesSection = document.createElement('div');
      categoriesSection.style.cssText = `
        flex-shrink: 0;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid ${theme.border};
      `;
      
      const categoriesLabel = document.createElement('div');
      categoriesLabel.style.cssText = `
        font-size: 7px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 6px;
        color: ${theme.textMuted};
      `;
      categoriesLabel.textContent = 'TOP CATEGORIES';
      categoriesSection.appendChild(categoriesLabel);
      
      const categoriesRow = document.createElement('div');
      categoriesRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      `;
      
      topCategories.forEach(([category, tools]) => {
        const catItem = document.createElement('div');
        catItem.style.cssText = `
          display: flex;
          align-items: center;
          gap: 6px;
        `;
        
        const dot = document.createElement('div');
        dot.style.cssText = `
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${theme.accent};
          flex-shrink: 0;
        `;
        catItem.appendChild(dot);
        
        const catName = document.createElement('span');
        catName.style.cssText = `
          font-size: 9px;
          font-weight: 500;
          text-transform: capitalize;
          color: ${theme.text};
        `;
        catName.textContent = category;
        catItem.appendChild(catName);
        
        const catCount = document.createElement('span');
        catCount.style.cssText = `
          font-size: 8px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-weight: 700;
          color: ${theme.accent};
        `;
        catCount.textContent = String(tools.length);
        catItem.appendChild(catCount);
        
        categoriesRow.appendChild(catItem);
      });
      
      categoriesSection.appendChild(categoriesRow);
      contentDiv.appendChild(categoriesSection);
      
      // Footer
      const footer = document.createElement('div');
      footer.style.cssText = `
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        padding-top: 12px;
      `;
      
      // QR section
      const qrSection = document.createElement('div');
      qrSection.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      
      const qrWrapper = document.createElement('div');
      qrWrapper.style.cssText = `
        padding: 6px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      `;
      
      const qrImg = document.createElement('img');
      qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mac-baseline.vercel.app/&color=222222';
      qrImg.style.cssText = `
        display: block;
        width: 42px;
        height: 42px;
      `;
      qrWrapper.appendChild(qrImg);
      qrSection.appendChild(qrWrapper);
      
      const qrText = document.createElement('div');
      qrText.style.cssText = `display: flex; flex-direction: column; gap: 0;`;
      
      const scanLabel = document.createElement('span');
      scanLabel.style.cssText = `
        font-size: 7px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${theme.textMuted};
      `;
      scanLabel.textContent = 'SCAN TO VISIT';
      qrText.appendChild(scanLabel);
      
      const siteName = document.createElement('span');
      siteName.style.cssText = `
        font-size: 10px;
        font-weight: 700;
        color: ${theme.text};
      `;
      siteName.textContent = 'mac-baseline';
      qrText.appendChild(siteName);
      
      qrSection.appendChild(qrText);
      footer.appendChild(qrSection);
      
      // Branding
      const branding = document.createElement('div');
      branding.style.cssText = `
        text-align: right;
        flex-shrink: 0;
      `;
      
      const poweredBy = document.createElement('span');
      poweredBy.style.cssText = `
        display: block;
        font-size: 7px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 4px;
        color: ${theme.textMuted};
      `;
      poweredBy.textContent = 'POWERED BY';
      branding.appendChild(poweredBy);
      
      const brandName = document.createElement('div');
      brandName.style.cssText = `
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
        gap: 2px;
      `;
      
      const baseline = document.createElement('span');
      baseline.style.cssText = `
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: -0.025em;
        color: ${theme.text};
      `;
      baseline.textContent = 'Baseline';
      brandName.appendChild(baseline);
      
      const dot = document.createElement('span');
      dot.style.cssText = `
        font-size: 22px;
        color: ${theme.accent};
      `;
      dot.textContent = '.';
      brandName.appendChild(dot);
      
      branding.appendChild(brandName);
      footer.appendChild(branding);
      
      contentDiv.appendChild(footer);
      cardElement.appendChild(contentDiv);
      exportWrapper.appendChild(cardElement);
      
      // Add branding watermark at bottom
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 500;
        color: ${theme.textMuted};
        opacity: 0.6;
        z-index: 2;
        letter-spacing: 0.5px;
      `;
      watermark.textContent = 'mac-baseline.vercel.app';
      exportWrapper.appendChild(watermark);
      
      document.body.appendChild(exportWrapper);
      
      // Wait for image to load and styles to settle
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(exportWrapper, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: 520,
        height: 720,
        imageTimeout: 5000,
        removeContainer: false,
      });

      // Clean up
      document.body.removeChild(exportWrapper);

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

  const shareToTwitter = () => {
    const text = `Check out my dev stack! ${selectedTools.length} essential tools for macOS development 🚀\n\nBuilt with @baseline_dev`;
    const url = 'https://mac-baseline.vercel.app';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareToLinkedIn = () => {
    const url = 'https://mac-baseline.vercel.app';
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
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
    <>
    <div className="w-full flex gap-8 items-center justify-center px-4 py-2">
      {/* Card Preview - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex-shrink-0"
      >
        <CardContainer containerClassName="py-0">
          <CardBody className="relative">
            <div
              ref={cardRef}
              className="relative w-[400px] h-[600px] rounded-2xl overflow-hidden shadow-xl"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Pattern Background */}
              {currentPattern !== 'minimal' && (
                <div
                  className="absolute top-0 left-0 w-full h-[250px] pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: patternSvg }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-7">
                {/* Top Section */}
                <div className="mt-[20%] flex-shrink-0">
                  <div
                className="w-9 h-1 rounded-full mb-2.5"
                style={{ backgroundColor: theme.accent }}
              />
              <h2
                className="text-[2.5rem] font-black tracking-tighter leading-[0.85] mb-2.5"
                style={{ 
                  color: theme.text,
                  textShadow: `0 2px 20px ${theme.accent}40`
                }}
              >
                MY DEV
                <br />
                STACK
              </h2>
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="text-[9px] font-mono font-bold tracking-[0.15em] uppercase px-2.5 py-0.5 rounded-md border-2"
                  style={{
                    color: theme.accent,
                    backgroundColor: theme.accentLight,
                    borderColor: theme.accent,
                  }}
                >
                  {selectedTools.length} TOOLS
                </span>
                <span className="h-px w-5" style={{ backgroundColor: theme.border }} />
                <span className="text-[9px] font-mono font-semibold" style={{ color: theme.textMuted }}>
                  {currentDate}
                </span>
              </div>
            </div>

            {/* Tool Pills Section - Fixed height with scroll */}
            <div className="flex-shrink-0 mb-4" style={{ height: '210px' }}>
              <div className="h-full flex flex-wrap gap-1.5 overflow-y-auto no-scrollbar content-start">
                {toolNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="font-mono font-medium rounded-md transition-all cursor-default select-none backdrop-blur-sm flex-shrink-0 px-2.5 py-1"
                    style={{
                      fontSize: '9px',
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
                    className="font-mono font-bold rounded-md transition-all cursor-default select-none backdrop-blur-sm flex-shrink-0 px-2.5 py-1"
                    style={{
                      fontSize: '9px',
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
              className="flex-shrink-0 mb-3 pb-2.5 border-b"
              style={{
                borderColor: theme.border,
              }}
            >
              <div className="text-[7px] font-mono tracking-widest uppercase mb-1.5" style={{ color: theme.textMuted }}>
                TOP CATEGORIES
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {topCategories.map(([category, tools]) => (
                  <div key={category} className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="text-[9px] font-medium capitalize whitespace-nowrap" style={{ color: theme.text }}>
                      {category}
                    </span>
                    <span 
                      className="text-[8px] font-mono font-bold whitespace-nowrap"
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
            <div className="flex-shrink-0 flex items-center justify-between mt-auto pt-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white rounded-lg shadow-md flex-shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mac-baseline.vercel.app/&color=222222"
                    alt="Scan to visit"
                    style={{ display: 'block', width: '42px', height: '42px' }}
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    SCAN TO VISIT
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: theme.text }}>
                    mac-baseline
                  </span>
                </div>
              </div>
              
              {/* Branding */}
              <div className="text-right leading-none flex-shrink-0">
                <span
                  className="block text-[7px] font-bold tracking-widest uppercase mb-1"
                  style={{ color: theme.textMuted }}
                >
                  POWERED BY
                </span>
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="font-sans text-[18px] font-black tracking-tight" style={{ color: theme.text }}>
                    Baseline
                  </span>
                  <span className="text-[22px]" style={{ color: theme.accent }}>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
            </div>
          </CardBody>
        </CardContainer>
      </motion.div>

      {/* Controls - Right Side */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 w-full max-w-xs flex-shrink-0"
      >
        {/* Header */}
        <div className="text-left">
          <h2 
            className="text-2xl font-black mb-1 tracking-tight"
            style={{ color: tokens.colors.text.primary }}
          >
            Share Your Dev Stack
          </h2>
          <p 
            className="text-sm font-medium"
            style={{ color: tokens.colors.text.secondary }}
          >
            {selectedTools.length} {selectedTools.length === 1 ? 'tool' : 'tools'} selected • Create a shareable card
          </p>
        </div>

        {/* Tool Selection Notice */}
        {needsSelection && (
          <div 
            className="w-full p-3 rounded-xl border-2"
            style={{
              backgroundColor: tokens.colors.background.card,
              borderColor: tokens.brand.sunset,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p 
                  className="text-sm font-bold mb-0.5"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {selectedToolsForCard.length} of {MAX_DISPLAY_TOOLS} tools selected
                </p>
                <p 
                  className="text-xs"
                  style={{ color: tokens.colors.text.secondary }}
                >
                  Choose your top {MAX_DISPLAY_TOOLS} to display.
                </p>
              </div>
              <button
                onClick={() => setShowToolSelector(true)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: tokens.brand.sunset,
                  color: '#fff',
                  boxShadow: `0 4px 14px ${tokens.brand.sunset}40`,
                }}
              >
                Select Tools
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div 
          className="p-3 rounded-xl border"
          style={{
            backgroundColor: tokens.colors.background.card,
            borderColor: tokens.colors.border.card,
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={randomizeAll}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border"
              style={{
                backgroundColor: tokens.colors.background.secondary,
                borderColor: tokens.colors.border.card,
                color: tokens.colors.text.primary,
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Randomize
            </button>
            <button
              onClick={randomizeTheme}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border"
              style={{
                backgroundColor: tokens.colors.background.secondary,
                borderColor: tokens.colors.border.card,
                color: tokens.colors.text.primary,
              }}
            >
              <Palette className="w-3.5 h-3.5" />
              Theme
            </button>
            <button
              onClick={randomizePattern}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border"
              style={{
                backgroundColor: tokens.colors.background.secondary,
                borderColor: tokens.colors.border.card,
                color: tokens.colors.text.primary,
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Pattern
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${tokens.brand.sunset} 0%, #e85d10 100%)`,
                color: '#fff',
                boxShadow: `0 4px 14px ${tokens.brand.sunset}40`,
              }}
            >
              {isExporting ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Save Card
                </>
              )}
            </button>
          </div>
          
          <p 
            className="text-[10px] text-center mt-2 pt-2 border-t"
            style={{ 
              color: tokens.colors.text.secondary,
              borderColor: tokens.colors.border.card,
            }}
          >
            Theme: <span className="font-semibold" style={{ color: tokens.colors.text.primary }}>{theme.name}</span> • Pattern: <span className="font-semibold capitalize" style={{ color: tokens.colors.text.primary }}>{currentPattern}</span>
          </p>
        </div>

        {/* Share Section */}
        <div 
          className="p-3 rounded-xl border"
          style={{
            backgroundColor: tokens.colors.background.card,
            borderColor: tokens.colors.border.card,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-3.5 h-3.5" style={{ color: tokens.colors.text.secondary }} />
            <span 
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: tokens.colors.text.secondary }}
            >
              Share Your Stack
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={shareToTwitter}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Post on X
            </button>
            <button
              onClick={shareToLinkedIn}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#0A66C2',
                color: '#ffffff',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Installation Instructions */}
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: tokens.colors.background.card,
            borderColor: tokens.colors.border.card,
          }}
        >
          <h3 
            className="text-[10px] font-bold mb-3 uppercase tracking-wider"
            style={{ color: tokens.colors.text.primary }}
          >
            Installation Instructions
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span 
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ 
                  backgroundColor: `${tokens.brand.sunset}20`,
                  color: tokens.brand.sunset 
                }}
              >
                1
              </span>
              <p 
                className="font-medium text-[11px]"
                style={{ color: tokens.colors.text.primary }}
              >
                Download the script below
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span 
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ 
                  backgroundColor: `${tokens.brand.sunset}20`,
                  color: tokens.brand.sunset 
                }}
              >
                2
              </span>
              <div>
                <p 
                  className="font-medium text-[11px]"
                  style={{ color: tokens.colors.text.primary }}
                >
                  Make it executable
                </p>
                <code 
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded mt-0.5 inline-block"
                  style={{ 
                    backgroundColor: tokens.colors.background.secondary,
                    color: tokens.colors.text.secondary 
                  }}
                >
                  chmod +x setup-macos.sh
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span 
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ 
                  backgroundColor: `${tokens.brand.sunset}20`,
                  color: tokens.brand.sunset 
                }}
              >
                3
              </span>
              <div>
                <p 
                  className="font-medium text-[11px]"
                  style={{ color: tokens.colors.text.primary }}
                >
                  Run it
                </p>
                <code 
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded mt-0.5 inline-block"
                  style={{ 
                    backgroundColor: tokens.colors.background.secondary,
                    color: tokens.colors.text.secondary 
                  }}
                >
                  ./setup-macos.sh
                </code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

      {/* Tool Selection Modal */}
      {createPortal(
        <AnimatePresence>
          {showToolSelector && (
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
              onClick={() => setShowToolSelector(false)}
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[90%] max-w-3xl max-h-[85vh] rounded-xl flex flex-col overflow-hidden"
                style={{ 
                  backgroundColor: tokens.colors.background.primary,
                  border: `1px solid ${tokens.colors.border.card}`
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 
                      className="text-base font-semibold"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      Select Tools for Card
                    </h3>
                    <p 
                      className="text-xs mt-0.5"
                      style={{ color: tokens.colors.text.secondary }}
                    >
                      {selectedToolsForCard.length}/{MAX_DISPLAY_TOOLS} selected
                    </p>
                  </div>
                  <button
                    onClick={() => setShowToolSelector(false)}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: tokens.colors.text.secondary }}
                    onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.text.secondary}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tool Pills */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedTools.map((tool) => {
                      const isSelected = selectedToolsForCard.includes(tool.id);
                      const canSelect = selectedToolsForCard.length < MAX_DISPLAY_TOOLS;

                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleToolSelection(tool.id)}
                          disabled={!isSelected && !canSelect}
                          className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                          style={{
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderColor: isSelected ? tokens.brand.sunset : tokens.colors.border.card,
                            backgroundColor: tokens.colors.background.card,
                            color: tokens.colors.text.primary,
                            opacity: !isSelected && !canSelect ? 0.3 : 1,
                            cursor: !isSelected && !canSelect ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {tool.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

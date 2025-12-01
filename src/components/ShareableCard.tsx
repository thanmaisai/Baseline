import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tool } from '@/types/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Palette, X, Share2, Check, Clipboard } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { CardContainer, CardBody } from './ui/3d-card';
import { useThemeTokens } from '@/theme/useThemeTokens';
import { toast } from 'sonner';

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

// Helper to format category names (e.g., "PackageManagers" -> "Package-Managers")
const formatCategoryName = (name: string): string => {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');
};

// Generate unique ID for each render to prevent SVG ID conflicts
const generatePatternId = () => Math.random().toString(36).substring(2, 8);

const patterns = {
  wave: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 250">
      <defs>
        <linearGradient id="waveGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.gradientFrom}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="${theme.gradientTo}" stop-opacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M0,0 L400,0 L400,200 C350,200 320,133 270,133 C220,133 200,217 140,217 C80,217 60,150 0,150 Z" fill="url(#waveGrad${id})"/>
    </svg>
  `;
  },
  dots: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots${id}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="${theme.accent}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#dots${id})"/>
    </svg>
  `;
  },
  grid: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid${id}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#grid${id})"/>
    </svg>
  `;
  },
  gradient: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.gradientFrom}" stop-opacity="0.4" />
          <stop offset="100%" stop-color="${theme.gradientTo}" stop-opacity="0.6" />
        </linearGradient>
        <radialGradient id="radial${id}">
          <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill="url(#grad${id})"/>
      <ellipse cx="100" cy="67" rx="100" ry="100" fill="url(#radial${id})"/>
      <ellipse cx="320" cy="183" rx="83" ry="83" fill="url(#radial${id})"/>
    </svg>
  `;
  },
  minimal: () => ``,
  circles: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circleGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.gradientFrom}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${theme.gradientTo}" stop-opacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="67" r="83" fill="url(#circleGrad${id})"/>
      <circle cx="320" cy="133" r="100" fill="url(#circleGrad${id})"/>
      <circle cx="200" cy="208" r="75" fill="url(#circleGrad${id})"/>
    </svg>
  `;
  },
  hexagon: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagon${id}" x="0" y="0" width="50" height="43.3" patternUnits="userSpaceOnUse">
          <path d="M25 0 L50 12.5 L50 37.5 L25 50 L0 37.5 L0 12.5 Z" 
                fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#hexagon${id})"/>
    </svg>
  `;
  },
  diagonal: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diagGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.gradientFrom}" stop-opacity="0.5" />
          <stop offset="50%" stop-color="${theme.gradientTo}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${theme.gradientFrom}" stop-opacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#diagGrad${id})"/>
    </svg>
  `;
  },
  zigzag: (theme: typeof themes.dark) => {
    const id = generatePatternId();
    return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zigzagGrad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.gradientFrom}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="${theme.gradientTo}" stop-opacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M0,0 L400,0 L400,100 L350,117 L300,100 L250,117 L200,100 L150,117 L100,100 L50,117 L0,100 Z" 
            fill="url(#zigzagGrad${id})"/>
      <path d="M0,150 L50,133 L100,150 L150,133 L200,150 L250,133 L300,150 L350,133 L400,150 L400,250 L0,250 Z" 
            fill="url(#zigzagGrad${id})" opacity="0.5"/>
    </svg>
  `;
  },
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
  const [redirectCountdown, setRedirectCountdown] = useState<{ platform: 'twitter' | 'linkedin', seconds: number, url: string, caption: string } | null>(null);
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
      // Create wrapper with background - positioned off-screen but still rendered
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 520px;
        height: 720px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 50%, ${theme.bg} 100%);
        padding: 60px;
        box-sizing: border-box;
        z-index: -1;
        opacity: 1;
      `;
      
      // Add glow overlay
      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 20%, ${theme.accent}20 0%, transparent 50%), 
                    radial-gradient(circle at 80% 80%, ${theme.gradientTo}20 0%, transparent 50%);
        pointer-events: none;
      `;
      wrapper.appendChild(glow);
      
      // Clone the card
      const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
      cardClone.style.transform = 'none';
      cardClone.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
      wrapper.appendChild(cardClone);
      
      // Add watermark
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        font-weight: 500;
        color: ${theme.textMuted};
        opacity: 0.6;
        letter-spacing: 0.5px;
        font-family: system-ui, -apple-system, sans-serif;
        white-space: nowrap;
      `;
      watermark.textContent = 'mac-baseline.vercel.app';
      wrapper.appendChild(watermark);
      
      document.body.appendChild(wrapper);
      
      // Force layout calculation
      wrapper.offsetHeight;
      
      // Wait for render
      await new Promise(r => setTimeout(r, 50));
      
      // Temporarily move into view for capture (html-to-image needs this)
      wrapper.style.left = '0';
      wrapper.style.zIndex = '-9999';
      wrapper.style.pointerEvents = 'none';
      
      await new Promise(r => setTimeout(r, 10));
      
      const dataUrl = await toPng(wrapper, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: 520,
        height: 720,
      });
      
      // Clean up
      document.body.removeChild(wrapper);

      const link = document.createElement('a');
      link.download = `dev-stack-${currentTheme}-${Date.now()}.png`;
      link.href = dataUrl;
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

  // Helper to generate image blob for sharing
  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: 0;
      left: -9999px;
      width: 520px;
      height: 720px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 50%, ${theme.bg} 100%);
      padding: 60px;
      box-sizing: border-box;
      z-index: -1;
    `;
    
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 20%, ${theme.accent}20 0%, transparent 50%), 
                  radial-gradient(circle at 80% 80%, ${theme.gradientTo}20 0%, transparent 50%);
      pointer-events: none;
    `;
    wrapper.appendChild(glow);
    
    const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
    cardClone.style.transform = 'none';
    cardClone.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    wrapper.appendChild(cardClone);
    
    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: 500;
      color: ${theme.textMuted};
      opacity: 0.6;
      letter-spacing: 0.5px;
      font-family: system-ui, -apple-system, sans-serif;
      white-space: nowrap;
    `;
    watermark.textContent = 'mac-baseline.vercel.app';
    wrapper.appendChild(watermark);
    
    document.body.appendChild(wrapper);
    wrapper.offsetHeight;
    await new Promise(r => setTimeout(r, 50));
    
    wrapper.style.left = '0';
    wrapper.style.zIndex = '-9999';
    wrapper.style.pointerEvents = 'none';
    await new Promise(r => setTimeout(r, 10));
    
    try {
      const dataUrl = await toPng(wrapper, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: 520,
        height: 720,
      });
      
      document.body.removeChild(wrapper);
      
      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      document.body.removeChild(wrapper);
      console.error('Failed to generate image:', error);
      return null;
    }
  };

  const copyImageToClipboard = async (): Promise<boolean> => {
    try {
      const blob = await generateImageBlob();
      if (!blob) return false;
      
      // Copy image to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch (error) {
      console.error('Failed to copy image:', error);
      return false;
    }
  };

  // Engaging post messages for different platforms
  const getTwitterMessage = () => {
    const toolCount = selectedTools.length;
    const displayCount = toolCount > 24 ? "24+" : toolCount.toString();
    const isMany = toolCount > 24;
    
    const messages = [
      `🔥 Just discovered the perfect dev setup!\n\n${isMany ? `My top ${displayCount} tools` : `${displayCount} essential tools`} that make my Mac a coding beast.\n\nYou know that pain of downloading apps one by one? mac-baseline lets you install ${isMany ? 'ALL of them' : 'your entire dev environment'} with ONE command. Game changer!\n\nhttps://mac-baseline.vercel.app`,
      `Hey devs! 👋\n\nHere's my current tech stack - ${isMany ? `${displayCount} tools and counting` : `${displayCount} tools`} that I can't live without.\n\nTired of manually downloading and installing each app? Found this incredible site called mac-baseline that ${isMany ? 'bulk installs everything automatically' : 'sets up your Mac in minutes'}. Seriously, it's amazing!\n\nhttps://mac-baseline.vercel.app`,
      `My dev toolkit just leveled up!\n\n${isMany ? `${displayCount} carefully curated tools plus more` : `${displayCount} carefully curated tools`} for maximum productivity.\n\nSetting up a new Mac used to take HOURS of repetitive installs. Now? mac-baseline does ${isMany ? 'dozens of apps' : 'everything'} with a single script. The time savings are unreal!\n\nhttps://mac-baseline.vercel.app`,
      `Setting up a new Mac?\n\n${isMany ? `I've got ${displayCount} essential apps (and more!)` : `Here are my ${displayCount} must-have tools`} ready to go.\n\nNo more tab-switching between download pages and installation wizards. With mac-baseline, ${isMany ? 'batch installing is completely automated' : 'your entire setup runs on autopilot'}. One script, done!\n\nhttps://mac-baseline.vercel.app`,
      `Developer workflow optimization 101:\n\n${isMany ? `Showing off ${displayCount} of my favorite tools` : `My ${displayCount} go-to applications`} that power my daily coding.\n\nRemember spending half a day setting up your dev environment? Those days are over. mac-baseline makes ${isMany ? 'mass app deployment' : 'Mac configuration'} stupidly simple. ${isMany ? 'No more clicking through dozens of installers!' : 'Pure automation magic!'}\n\nhttps://mac-baseline.vercel.app`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getLinkedInMessage = () => {
    const toolCount = selectedTools.length;
    const displayCount = toolCount > 24 ? "24+" : toolCount.toString();
    const isMany = toolCount > 24;
    
    const messages = [
      `Hey connections! 👋\n\nExcited to share my current tech stack - ${isMany ? `my top ${displayCount} essential tools and more` : `${displayCount} essential tools`} that power my development workflow.\n\nSetting up a new Mac used to be exhausting - clicking through endless download pages, waiting for installers, repeating the process ${isMany ? 'dozens' : 'multiple'} times. Now? mac-baseline automates ${isMany ? 'mass app installation' : 'the entire setup'} with a single command. The productivity boost is incredible!\n\n#developer #productivity #macOS #devtools #coding`,
      `Just organized my dev toolkit!\n\nAs developers, our tools define our productivity. Here are ${isMany ? `${displayCount} of my favorite apps (and counting!)` : `the ${displayCount} apps I use daily`}.\n\nYou know that tedious process of downloading apps one by one? Installing each separately? I discovered mac-baseline - it generates a custom script that ${isMany ? 'installs dozens of applications automatically' : 'handles your entire Mac setup effortlessly'}. Total game changer for anyone who values their time!\n\n#programming #devlife #macos #productivity`,
      `New Mac? Here's the secret sauce!\n\nSharing my curated list of ${isMany ? `${displayCount} top dev tools (plus more!)` : `${displayCount} dev tools`} that make my workflow seamless.\n\nThe traditional setup nightmare - visiting ${isMany ? 'countless' : 'multiple'} websites, downloading installers, clicking through setup wizards over and over? That's history. I used mac-baseline to generate a one-click install script. ${isMany ? 'Bulk installing multiple applications is now completely automated' : 'Setting up a new Mac has never been this smooth'}!\n\n#developer #techstack #productivity`,
      `Time is money, especially in software development.\n\nI'm sharing ${isMany ? `${displayCount} applications from my toolkit (with more in use!)` : `${displayCount} mission-critical tools`} that accelerate my work.\n\nThink about it: manually downloading and installing ${isMany ? 'dozens of apps' : 'multiple applications'} can take hours. It's repetitive, boring, and error-prone. mac-baseline transforms this into a single automated script. ${isMany ? 'It handles mass app installation effortlessly' : 'It automates Mac setup from scratch'}. Highly recommend for any dev looking to optimize their workflow!\n\n#softwaredevelopment #devtools #automation #macOS`,
      `Fellow developers, let's talk efficiency!\n\nMy workflow runs on ${isMany ? `${displayCount}+ carefully selected tools` : `these ${displayCount} powerful applications`}. Each one serves a purpose.\n\nRemember the pain of setting up your last Mac? Downloading each app individually, running installers one after another, losing hours to repetitive tasks? That frustration is exactly why mac-baseline exists. ${isMany ? 'Deploying numerous apps simultaneously' : 'Automated installation'} saves literal hours on every new machine. If you value your time (and sanity), check it out!\n\n#coding #developertools #productivityhacks #macos`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const shareToTwitter = async () => {
    setIsExporting(true);
    
    try {
      const tweetText = getTwitterMessage();
      
      // Directly copy image to clipboard
      const imageCopied = await copyImageToClipboard();
      
      if (!imageCopied) {
        toast.error("Failed to copy image", { description: "Please try again" });
        setIsExporting(false);
        return;
      }
      
      // Twitter supports text via URL parameter
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      
      // Start countdown with caption
      setRedirectCountdown({ platform: 'twitter', seconds: 3, url: twitterUrl, caption: tweetText });
      
      // Countdown timer
      let count = 3;
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          setRedirectCountdown(prev => prev ? { ...prev, seconds: count } : null);
        } else {
          clearInterval(interval);
          setRedirectCountdown(null);
          window.open(twitterUrl, '_blank', 'noopener,noreferrer');
          setIsExporting(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Share failed:', error);
      const fallbackText = getTwitterMessage();
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fallbackText)}`, '_blank', 'noopener,noreferrer');
      setIsExporting(false);
    }
  };

  const shareToLinkedIn = async () => {
    setIsExporting(true);
    
    try {
      const linkedInText = getLinkedInMessage();
      
      // Directly copy image to clipboard
      const imageCopied = await copyImageToClipboard();
      
      if (!imageCopied) {
        toast.error("Failed to copy image", { description: "Please try again" });
        setIsExporting(false);
        return;
      }
      
      // LinkedIn supports pre-filled text via the text parameter
      const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInText)}`;
      
      // Start countdown with caption
      setRedirectCountdown({ platform: 'linkedin', seconds: 3, url: linkedInUrl, caption: linkedInText });
      
      // Countdown timer
      let count = 3;
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          setRedirectCountdown(prev => prev ? { ...prev, seconds: count } : null);
        } else {
          clearInterval(interval);
          setRedirectCountdown(null);
          window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
          setIsExporting(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Share failed:', error);
      const fallbackText = getLinkedInMessage();
      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(fallbackText)}`, '_blank', 'noopener,noreferrer');
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
                  data-pattern="true"
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
                      {formatCategoryName(category)}
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
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {isExporting ? 'Preparing...' : 'Post on X'}
            </button>
            <button
              onClick={shareToLinkedIn}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#0A66C2',
                color: '#ffffff',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {isExporting ? 'Preparing...' : 'Share'}
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

      {/* Redirect Countdown Modal */}
      {createPortal(
        <AnimatePresence>
          {redirectCountdown && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl max-w-md w-full mx-4 relative overflow-hidden"
                style={{ 
                  backgroundColor: tokens.colors.background.card,
                  border: `1px solid ${tokens.colors.border.card}`,
                }}
              >
                {/* Header with icon and countdown */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: redirectCountdown.platform === 'twitter' ? '#000000' : '#0A66C2',
                      }}
                    >
                      {redirectCountdown.platform === 'twitter' ? (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: tokens.colors.text.primary }}>
                        Share to {redirectCountdown.platform === 'twitter' ? 'X (Twitter)' : 'LinkedIn'}
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.text.secondary }}>
                        Opening in {redirectCountdown.seconds}s...
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRedirectCountdown(null);
                      setIsExporting(false);
                    }}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/10"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Success message */}
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                  style={{ backgroundColor: '#10b98120' }}
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-500">
                    Image copied to clipboard!
                  </p>
                </div>

                {/* Instructions */}
                <div 
                  className="text-xs px-3 py-2 rounded-lg mb-4"
                  style={{ 
                    backgroundColor: tokens.colors.background.primary,
                    color: tokens.colors.text.secondary 
                  }}
                >
                  {redirectCountdown.platform === 'linkedin' ? (
                    <>
                      <span className="block mb-2">Caption is pre-filled. Paste the image first!</span>
                      <span className="block text-[10px] opacity-70">Then add this link in the comments:</span>
                    </>
                  ) : (
                    `Caption is pre-filled. You'll be redirected in ${redirectCountdown.seconds} seconds...`
                  )}
                </div>

                {/* URL Copy Section - LinkedIn only */}
                {redirectCountdown.platform === 'linkedin' && (
                  <div 
                    className="p-3 rounded-lg mb-4 border"
                    style={{ 
                      backgroundColor: tokens.colors.background.secondary,
                      borderColor: tokens.colors.border.card
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <code 
                        className="text-xs flex-1 text-left"
                        style={{ color: '#0A66C2' }}
                      >
                        https://mac-baseline.vercel.app
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('https://mac-baseline.vercel.app');
                          toast.success('URL copied to clipboard!');
                        }}
                        className="px-3 py-1 text-[10px] rounded transition-all hover:opacity-80"
                        style={{ 
                          backgroundColor: '#0A66C2',
                          color: '#fff'
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={() => {
                    setRedirectCountdown(null);
                    setIsExporting(false);
                    window.open(redirectCountdown.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: redirectCountdown.platform === 'twitter' ? '#000000' : '#0A66C2',
                    color: '#fff'
                  }}
                >
                  Open {redirectCountdown.platform === 'twitter' ? 'X (Twitter)' : 'LinkedIn'} Now
                </button>
              </motion.div>
            </motion.div>
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

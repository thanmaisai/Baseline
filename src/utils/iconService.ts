/**
 * Icon Service - Dynamically fetches application logos
 * Uses multiple CDN sources as fallbacks
 */

// Cache for successfully loaded icons
const iconCache = new Map<string, string>();

interface IconSource {
  name: string;
  getUrl: (appName: string) => string;
  priority: number;
}

// Map of common app names to their proper identifiers
const APP_NAME_MAPPINGS: Record<string, string> = {
  'vscode': 'visual-studio-code',
  'vs code': 'visual-studio-code',
  'visual studio code': 'visual-studio-code',
  'google chrome': 'google-chrome',
  'arc browser': 'arc',
  'brave browser': 'brave',
  'firefox': 'firefox',
  'safari': 'safari',
  'docker': 'docker',
  'figma': 'figma',
  'slack': 'slack',
  'notion': 'notion',
  'spotify': 'spotify',
  'postman': 'postman',
  'github': 'github',
  'git': 'git',
  'node': 'node-dot-js',
  'nodejs': 'node-dot-js',
  'python': 'python',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mongodb': 'mongodb',
  'redis': 'redis',
  'mysql': 'mysql',
  'zoom': 'zoom',
  'discord': 'discord',
  'telegram': 'telegram',
  'whatsapp': 'whatsapp',
  'obsidian': 'obsidian',
  'raycast': 'raycast',
  'rectangle': 'rectangle',
  'iterm': 'iterm2',
  'iterm2': 'iterm2',
  'warp': 'warp',
  'homebrew': 'homebrew',
  '1password': '1password',
  'bitwarden': 'bitwarden',
  'vlc': 'vlc',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'react': 'react',
  'vue': 'vue-dot-js',
  'angular': 'angular',
  'kubernetes': 'kubernetes',
  'terraform': 'terraform',
  'aws': 'amazon-aws',
  'intellij': 'intellij-idea',
  'pycharm': 'pycharm',
  'webstorm': 'webstorm',
  'android studio': 'android-studio',
  'xcode': 'xcode',
  'sublime text': 'sublime-text',
  'atom': 'atom',
  'vim': 'vim',
  'neovim': 'neovim',
  'tableplus': 'tableplus',
  'dbeaver': 'dbeaver',
};

// Icon sources with fallback priority
const ICON_SOURCES: IconSource[] = [
  {
    name: 'Simple Icons',
    getUrl: (appName: string) => {
      const slug = normalizeAppName(appName);
      return `https://cdn.simpleicons.org/${slug}`;
    },
    priority: 1,
  },
  {
    name: 'DevIcon',
    getUrl: (appName: string) => {
      const slug = normalizeAppName(appName);
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
    },
    priority: 2,
  },
  {
    name: 'Icon Horse',
    getUrl: (appName: string) => {
      const slug = normalizeAppName(appName);
      return `https://icon.horse/icon/${slug}`;
    },
    priority: 3,
  },
];

/**
 * Normalize app name to slug format
 */
function normalizeAppName(appName: string): string {
  const lower = appName.toLowerCase().trim();
  
  // Check if we have a mapping
  if (APP_NAME_MAPPINGS[lower]) {
    return APP_NAME_MAPPINGS[lower];
  }
  
  // Convert to slug format
  return lower
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get the icon URL for an application
 * This works for ANY application, not just hardcoded ones!
 */
export function getAppIcon(appName: string, homepage?: string): string {
  const slug = normalizeAppName(appName);
  
  // Primary: Simple Icons (2000+ logos)
  // Works for: Chrome, Firefox, Slack, VS Code, Docker, Figma, GitHub, etc.
  return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Get multiple fallback URLs for an icon
 * Tries multiple CDNs automatically for ANY app
 */
export function getAppIconFallbacks(appName: string, homepage?: string): string[] {
  // Check cache first
  const cacheKey = `${appName}-${homepage || ''}`;
  if (iconCache.has(cacheKey)) {
    return [iconCache.get(cacheKey)!];
  }
  
  const urls: string[] = [];
  const slug = normalizeAppName(appName);
  
  // 1. Simple Icons - 2000+ brand logos (best quality)
  urls.push(`https://cdn.simpleicons.org/${slug}`);
  
  // 2. Try alternative Simple Icons names (with color)
  urls.push(`https://cdn.simpleicons.org/${slug}/000000`);
  
  // 3. CDN.js - icon libraries
  urls.push(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`);
  
  // 4. DevIcon - developer tools
  urls.push(`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`);
  urls.push(`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`);
  
  // 5. If homepage provided, try favicon services
  if (homepage) {
    try {
      const domain = new URL(homepage).hostname;
      // Google's high-res favicon service
      urls.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      // Icon Horse - universal favicon fetcher
      urls.push(`https://icon.horse/icon/${domain}`);
      // Clearbit Logo API
      urls.push(`https://logo.clearbit.com/${domain}`);
    } catch (e) {
      // Invalid URL, skip
    }
  }
  
  // 6. Try the app name as direct domain guess
  urls.push(`https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`);
  urls.push(`https://logo.clearbit.com/${slug}.com`);
  
  return urls;
}

/**
 * Cache a working icon URL
 */
export function cacheIconUrl(appName: string, homepage: string | undefined, url: string): void {
  const cacheKey = `${appName}-${homepage || ''}`;
  iconCache.set(cacheKey, url);
}

/**
 * Preload an image to check if it exists
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get the first working icon URL from fallbacks
 */
export async function getWorkingIcon(appName: string, homepage?: string): Promise<string | null> {
  const fallbacks = getAppIconFallbacks(appName, homepage);
  
  for (const url of fallbacks) {
    const works = await preloadImage(url);
    if (works) {
      return url;
    }
  }
  
  return null;
}

/**
 * Get default fallback emoji based on category
 */
export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'browsers': '🌐',
    'dev-tools': '💻',
    'design-tools': '🎨',
    'communication': '💬',
    'productivity': '📝',
    'languages': '⚡',
    'devops': '🚀',
    'databases': '💾',
    'terminal': '⌨️',
    'cli-tools': '🔧',
    'media': '🎵',
    'security': '🔒',
    'utilities': '⚙️',
  };
  
  return emojiMap[category] || '📦';
}

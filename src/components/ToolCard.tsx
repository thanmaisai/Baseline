import { Tool } from '@/types/tools';
import { Check, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { getAppIconFallbacks, getCategoryEmoji, cacheIconUrl } from '@/utils/iconService';

interface ToolCardProps {
  tool: Tool;
  selected: boolean;
  onToggle: () => void;
}

export const ToolCard = ({ tool, selected, onToggle }: ToolCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIconUrl, setCurrentIconUrl] = useState<string>('');
  const [iconLoaded, setIconLoaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const fallbackEmoji = tool.icon || getCategoryEmoji(tool.category);

  // Preload icon and find working URL before rendering
  useEffect(() => {
    let isMounted = true;
    setIsPreloading(true);
    setIconLoaded(false);
    
    const fallbackUrls = getAppIconFallbacks(tool.name, tool.url);
    
    // If we have cached URL, use it immediately
    if (fallbackUrls.length === 1) {
      setCurrentIconUrl(fallbackUrls[0]);
      setIconLoaded(true);
      setIsPreloading(false);
      return;
    }
    
    const findWorkingIcon = async () => {
      // Test URLs with stricter validation
      const testUrl = (url: string): Promise<{ url: string; works: boolean }> => {
        return new Promise((resolve) => {
          const img = new Image();
          let resolved = false;
          
          const cleanup = (works: boolean) => {
            if (!resolved) {
              resolved = true;
              resolve({ url, works });
            }
          };
          
          img.onload = () => {
            // Verify it's a valid image (not a placeholder or error page)
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              cleanup(true);
            } else {
              cleanup(false);
            }
          };
          
          // Silently fail on error (don't log to console)
          img.onerror = () => cleanup(false);
          
          // Faster timeout: 300ms (better UX, fail fast)
          setTimeout(() => cleanup(false), 300);
          
          // Set src after handlers to ensure we catch all events
          img.src = url;
        });
      };
      
      // Test first 3 URLs in parallel for speed
      const firstBatch = fallbackUrls.slice(0, 3);
      const results = await Promise.all(firstBatch.map(testUrl));
      
      // Find first working URL
      const working = results.find(r => r.works);
      
      if (working && isMounted) {
        setCurrentIconUrl(working.url);
        setIconLoaded(true);
        setIsPreloading(false);
        cacheIconUrl(tool.name, tool.url, working.url);
        return;
      }
      
      // If first batch failed, try next 2 URLs only (don't waste time on bad sources)
      for (let i = 3; i < Math.min(5, fallbackUrls.length); i++) {
        if (!isMounted) break;
        
        const result = await testUrl(fallbackUrls[i]);
        if (result.works && isMounted) {
          setCurrentIconUrl(result.url);
          setIconLoaded(true);
          setIsPreloading(false);
          cacheIconUrl(tool.name, tool.url, result.url);
          return;
        }
      }
      
      // If no icon works after testing 5 URLs, show emoji (better than wrong icon)
      if (isMounted) {
        setIconLoaded(true);
        setIsPreloading(false);
      }
    };
    
    findWorkingIcon();
    
    return () => {
      isMounted = false;
    };
  }, [tool.name, tool.url]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onToggle}
      className="group relative cursor-pointer"
      style={{
        // @ts-ignore
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      }}
    >
      {isPreloading ? (
        // Shimmer Loading Card
        <div className="relative overflow-hidden rounded-xl h-[200px] flex flex-col bg-[#F5E7C6] dark:bg-[#111111] border-2 border-[#222222] dark:border-[#3A3A3A] shadow-[4px_4px_0px_0px_#222222] dark:shadow-[4px_4px_0px_0px_#3A3A3A]">
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          
          <div className="relative z-10 p-5 flex-1 flex flex-col">
            {/* Icon and badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 bg-white dark:bg-[#1A1A1A] rounded-xl flex-shrink-0 animate-pulse border-2 border-[#222222] dark:border-[#3A3A3A]" />
              <div className="px-2 py-0.5 bg-white dark:bg-[#1A1A1A] rounded-full w-16 h-5 animate-pulse border border-[#222222] dark:border-[#3A3A3A]" />
            </div>

            {/* Title and description */}
            <div className="flex-1 space-y-1.5 min-h-0 overflow-hidden">
              <div className="h-4 bg-white dark:bg-[#1A1A1A] rounded w-3/4 animate-pulse" />
              <div className="h-2.5 bg-white/60 dark:bg-[#1A1A1A]/60 rounded w-full animate-pulse" />
              <div className="h-2.5 bg-white/60 dark:bg-[#1A1A1A]/60 rounded w-5/6 animate-pulse" />
            </div>
            <div className="mt-auto pt-2.5 border-t-2 border-[#222222]/10 dark:border-[#3A3A3A]/30 flex-shrink-0">
              <div className="h-3 bg-white/60 dark:bg-[#1A1A1A]/60 rounded w-10 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        // Neobrutalist Card
        <div
          className={`relative overflow-hidden rounded-xl h-[200px] flex flex-col transition-all duration-200 ${
            selected
              ? 'bg-[#FAF3E1] dark:bg-[#1A1A1A] border-2 border-[#FF6D1F] shadow-[6px_6px_0px_0px_#FF6D1F] -translate-x-0.5 -translate-y-0.5'
              : 'bg-[#F5E7C6] dark:bg-[#111111] border-2 border-[#222222] dark:border-[#3A3A3A] shadow-[4px_4px_0px_0px_#222222] dark:shadow-[4px_4px_0px_0px_#3A3A3A] hover:shadow-[6px_6px_0px_0px_#222222] dark:hover:shadow-[6px_6px_0px_0px_#3A3A3A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          }`}
        >
          <div className="p-5 flex flex-col h-full relative">
            {/* Top Right Badge */}
            {(tool.popular || tool.devPick) && (
              <div className="absolute top-3 right-3 z-10">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide border ${
                  tool.devPick
                    ? 'bg-[#FF6D1F] text-white border-[#222222] dark:border-[#FF6D1F]'
                    : 'bg-white dark:bg-[#1A1A1A] text-[#222222] dark:text-white border-[#222222] dark:border-[#3A3A3A]'
                }`}>
                  {tool.devPick ? (
                    <>
                      <span className="text-[9px]">❤️</span>
                      <span className="leading-none">Dev Pick</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px]">🔥</span>
                      <span className="leading-none">Popular</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Icon */}
            <div className="w-14 h-14 bg-white dark:bg-[#1A1A1A] border-2 border-[#222222] dark:border-[#3A3A3A] rounded-xl flex items-center justify-center text-2xl mb-3.5 group-hover:scale-105 transition-transform duration-300 shadow-sm overflow-hidden flex-shrink-0">
              {currentIconUrl && iconLoaded ? (
                <img
                  src={currentIconUrl}
                  alt={tool.name}
                  className="w-8 h-8 object-contain animate-in fade-in duration-300"
                />
              ) : (
                <span className="text-2xl animate-in fade-in duration-300">{fallbackEmoji}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 mb-3 overflow-hidden">
              <h3 className={`font-bold text-base mb-1 line-clamp-1 transition-colors leading-tight ${
                selected 
                  ? 'text-[#FF6D1F]' 
                  : 'text-[#222222] dark:text-white group-hover:text-[#FF6D1F]'
              }`}>
                {tool.name}
              </h3>
              <p className="text-[10.5px] font-medium text-[#222222]/70 dark:text-gray-400 line-clamp-3 leading-[1.4]">
                {tool.description}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pt-2.5 border-t-2 border-[#222222]/10 dark:border-[#3A3A3A]/30 flex justify-between items-center flex-shrink-0">
              <span className="text-[8.5px] font-black text-[#222222] dark:text-white uppercase tracking-[0.08em] opacity-50 leading-none">
                {tool.type === 'brew-cask' ? 'CASK' : 
                 tool.type === 'brew' ? 'CLI' : 
                 tool.type === 'mas' ? 'APP STORE' :
                 tool.type === 'npm' ? 'NPM' :
                 'CUSTOM'}
              </span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                selected
                  ? 'bg-[#FF6D1F] border-[#222222] dark:border-[#FF6D1F] opacity-100 translate-x-0'
                  : 'bg-[#FAF3E1] dark:bg-[#1A1A1A] border-[#222222] dark:border-[#3A3A3A] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}>
                <Check className={`h-3 w-3 ${selected ? 'text-white' : 'text-[#222222] dark:text-white'}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

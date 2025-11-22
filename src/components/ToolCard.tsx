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
    
    const fallbackUrls = getAppIconFallbacks(tool.name, tool.homepage);
    
    // If we have cached URL, use it immediately
    if (fallbackUrls.length === 1) {
      setCurrentIconUrl(fallbackUrls[0]);
      setIconLoaded(true);
      setIsPreloading(false);
      return;
    }
    
    const findWorkingIcon = async () => {
      // Test first 3 URLs in parallel for speed
      const testUrl = (url: string): Promise<{ url: string; works: boolean }> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ url, works: true });
          img.onerror = () => resolve({ url, works: false });
          img.src = url;
          
          // Timeout after 1.5 seconds
          setTimeout(() => resolve({ url, works: false }), 1500);
        });
      };
      
      // Test first batch in parallel
      const firstBatch = fallbackUrls.slice(0, 3);
      const results = await Promise.all(firstBatch.map(testUrl));
      
      // Find first working URL
      const working = results.find(r => r.works);
      
      if (working && isMounted) {
        setCurrentIconUrl(working.url);
        setIconLoaded(true);
        setIsPreloading(false);
        cacheIconUrl(tool.name, tool.homepage, working.url);
        return;
      }
      
      // If first batch failed, try remaining URLs sequentially
      for (let i = 3; i < fallbackUrls.length; i++) {
        if (!isMounted) break;
        
        const result = await testUrl(fallbackUrls[i]);
        if (result.works && isMounted) {
          setCurrentIconUrl(result.url);
          setIconLoaded(true);
          setIsPreloading(false);
          cacheIconUrl(tool.name, tool.homepage, result.url);
          return;
        }
      }
      
      // If no icon works, show emoji
      if (isMounted) {
        setIconLoaded(true);
        setIsPreloading(false);
      }
    };
    
    findWorkingIcon();
    
    return () => {
      isMounted = false;
    };
  }, [tool.name, tool.homepage]);

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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative cursor-pointer"
      style={{
        // @ts-ignore
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      }}
    >
      {isPreloading ? (
        // Shimmer Loading Card
        <div className="relative overflow-hidden rounded-xl p-6 h-[160px] flex flex-col justify-between bg-card border border-border">
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          
          <div className="relative z-10 flex justify-between items-start gap-3">
            <div className="w-12 h-12 bg-muted/60 rounded-xl flex-shrink-0 animate-pulse" />
            <div className="w-6 h-6 bg-muted/40 rounded-full flex-shrink-0 animate-pulse" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="h-4 bg-muted/60 rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-muted/40 rounded w-full animate-pulse" />
            <div className="h-3 bg-muted/40 rounded w-4/5 animate-pulse" />
          </div>
        </div>
      ) : (
        // Loaded Card
        <div
          className={`relative overflow-hidden rounded-xl p-6 h-[160px] flex flex-col justify-between transition-all duration-200 ${
            selected
              ? 'bg-card border-2 border-primary shadow-lg'
              : 'bg-card border border-border hover:border-primary/50 hover:shadow-md'
          }`}
        >
        {/* Popular Badge - Clean & Minimal */}
        {tool.popular && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-primary/10 border border-primary/30 rounded-md px-2 py-1">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-primary">
                Popular
              </span>
            </div>
          </div>
        )}

        {/* Spotlight hover effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(var(--primary-rgb), 0.08), transparent 50%)',
          }}
        />

        <div className="relative z-10 flex justify-between items-start gap-3">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border flex-shrink-0 overflow-hidden relative">
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
          <div
            className={`w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="font-bold text-foreground text-base mb-1.5 line-clamp-1">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>
      )}
    </motion.div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { themeTokens } from '../theme/tokens';
import { useTheme } from '../contexts/ThemeContext';

interface Step {
  id: string;
  name: string;
  subtitle?: string;
}

interface NotionBreadcrumbProps {
  steps: Step[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

export const NotionBreadcrumb = ({ steps, currentIndex, onStepClick }: NotionBreadcrumbProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const isSnapping = useRef(false);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = theme === 'dark' ? themeTokens.colors.dark : themeTokens.colors.light;

  // Helper to get visible breadcrumb slice
  const getVisibleSteps = () => {
    const prev = currentIndex > 0 ? steps[currentIndex - 1] : null;
    const current = steps[currentIndex];
    const next = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
    return { prev, current, next };
  };

  const visible = getVisibleSteps();

  // Handle Scroll Event to update UI
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    // Clear existing snap timer
    if (snapTimeout.current) clearTimeout(snapTimeout.current);

    // Set new snap timer (debounce)
    snapTimeout.current = setTimeout(() => {
      const currentScroll = target.scrollTop;
      const nearestIndex = Math.round(currentScroll / ITEM_HEIGHT);
      scrollToIndex(nearestIndex);
    }, 150);
  };

  // Smooth scroll to specific index
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      isSnapping.current = true;
      const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
      
      scrollContainerRef.current.scrollTo({
        top: safeIndex * ITEM_HEIGHT,
        behavior: 'smooth'
      });

      // Call onStepClick if provided
      if (onStepClick && safeIndex !== currentIndex) {
        onStepClick(safeIndex);
      }

      // Reset snapping flag after animation roughly finishes
      setTimeout(() => { isSnapping.current = false; }, 500);
    }
  };

  // Initial scroll position when opening hover menu
  useEffect(() => {
    if (isHovering && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = currentIndex * ITEM_HEIGHT;
      setScrollTop(currentIndex * ITEM_HEIGHT);
    }
  }, [isHovering, currentIndex]);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position to keep dropdown within viewport
  useEffect(() => {
    if (isHovering && containerRef.current && dropdownRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownHeight = ITEM_HEIGHT * VISIBLE_ITEMS;
      
      // Check horizontal bounds
      const centerX = rect.left + rect.width / 2;
      const leftEdge = centerX - dropdownWidth / 2;
      const rightEdge = centerX + dropdownWidth / 2;
      
      let left = '50%';
      let transform = 'translateX(-50%)';
      
      if (leftEdge < 20) {
        // Too far left, align to left edge
        left = '0';
        transform = 'translateX(0)';
      } else if (rightEdge > viewportWidth - 20) {
        // Too far right, align to right edge
        left = 'auto';
        transform = 'translateX(0)';
        dropdownRef.current.style.right = '0';
      } else {
        dropdownRef.current.style.right = 'auto';
      }
      
      dropdownRef.current.style.left = left;
      dropdownRef.current.style.transform = transform;
      
      // Check vertical bounds
      const bottomEdge = rect.bottom + dropdownHeight + 20;
      if (bottomEdge > viewportHeight) {
        // Open upward instead
        dropdownRef.current.style.top = 'auto';
        dropdownRef.current.style.bottom = '100%';
        dropdownRef.current.style.marginTop = '0';
        dropdownRef.current.style.marginBottom = '8px';
      } else {
        dropdownRef.current.style.top = '100%';
        dropdownRef.current.style.bottom = 'auto';
        dropdownRef.current.style.marginTop = '8px';
        dropdownRef.current.style.marginBottom = '0';
      }
    }
  }, [isHovering]);

  return (
    <div 
      ref={containerRef}
      className="relative z-50 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* --- Collapsed Breadcrumb View (The "Bar") --- */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors duration-200 cursor-pointer select-none"
        style={{
          backgroundColor: isHovering ? (theme === 'dark' ? '#1A1A1A' : colors.background.hover) : 'transparent',
          opacity: isHovering ? 0 : 1
        }}
      >
        {visible.prev && (
          <div className="flex items-center gap-1" style={{ color: colors.text.tertiary }}>
            <span 
              className="text-[13px] line-through truncate max-w-[80px]"
              style={{ textDecorationColor: theme === 'dark' ? '#404040' : colors.border.cardInner }}
            >
              {visible.prev.name}
            </span>
            <span className="text-[10px]" style={{ color: theme === 'dark' ? '#404040' : colors.text.tertiary }}>
              /
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span 
            className="text-[13px] font-medium underline decoration-dotted underline-offset-4"
            style={{ 
              color: colors.text.primary,
              textDecorationColor: theme === 'dark' ? '#404040' : colors.border.cardInner
            }}
          >
            {visible.current.name}
          </span>
        </div>

        {visible.next && (
          <div className="flex items-center gap-1" style={{ color: colors.text.tertiary }}>
            <span className="text-[10px]" style={{ color: theme === 'dark' ? '#404040' : colors.text.tertiary }}>
              /
            </span>
            <span className="text-[13px] truncate max-w-[80px]">
              {visible.next.name}
            </span>
          </div>
        )}
      </div>

      {/* --- Expanded Hover Dropdown (The "Tumbler") --- */}
      <div 
        ref={dropdownRef}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top"
        style={{ 
          height: `${ITEM_HEIGHT * VISIBLE_ITEMS}px`,
          maxHeight: 'calc(100vh - 200px)',
          maxWidth: 'calc(100vw - 40px)',
          backgroundColor: colors.background.card,
          borderColor: colors.border.card,
          borderWidth: '1px',
          borderStyle: 'solid',
          opacity: isHovering ? 1 : 0,
          transform: isHovering ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.95) translateY(-10px)',
          pointerEvents: isHovering ? 'auto' : 'none'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Selection Highlight (The "Pill" in the background) */}
        <div 
          className="absolute left-4 right-4 rounded-lg pointer-events-none z-0"
          style={{ 
            top: '50%', 
            height: `${ITEM_HEIGHT}px`,
            marginTop: `-${ITEM_HEIGHT / 2}px`,
            backgroundColor: theme === 'dark' ? '#1A1A1A' : colors.background.hover,
            borderColor: theme === 'dark' ? '#262626' : colors.border.cardInner,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        />

        {/* Top Gradient Fade */}
        <div 
          className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(to bottom, #222222, transparent)' 
              : 'linear-gradient(to bottom, #F5E7C6, transparent)'
          }}
        />
        
        {/* Bottom Gradient Fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(to top, #222222, transparent)' 
              : 'linear-gradient(to top, #F5E7C6, transparent)'
          }}
        />

        {/* Scrollable List */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll scrollbar-hide relative z-20"
          style={{ 
            paddingTop: `${(ITEM_HEIGHT * VISIBLE_ITEMS / 2) - (ITEM_HEIGHT / 2)}px`,
            paddingBottom: `${(ITEM_HEIGHT * VISIBLE_ITEMS / 2) - (ITEM_HEIGHT / 2)}px`,
            scrollSnapType: 'y mandatory' 
          }}
        >
          {steps.map((step, idx) => {
            const distance = Math.abs((idx * ITEM_HEIGHT) - scrollTop);
            
            const isCenter = distance < ITEM_HEIGHT / 2;
            const scale = Math.max(0.85, 1 - (distance / (ITEM_HEIGHT * VISIBLE_ITEMS)) * 0.4);
            const opacity = Math.max(0.3, 1 - (distance / (ITEM_HEIGHT * 2.5)));
            const blur = distance > ITEM_HEIGHT ? `blur(${Math.min(2, distance / 100)}px)` : 'none';

            const isCompleted = idx < currentIndex;

            return (
              <div
                key={step.id}
                onClick={() => scrollToIndex(idx)}
                className="flex items-center justify-center cursor-pointer transition-colors"
                style={{ 
                  height: `${ITEM_HEIGHT}px`,
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  filter: blur,
                  transition: 'transform 0.1s, opacity 0.1s, filter 0.1s',
                }}
              >
                <div className="w-full px-8 flex items-center justify-between relative">
                  <span 
                    className="text-[14px] font-medium truncate flex-1 text-center transition-colors duration-300"
                    style={{
                      color: isCenter ? colors.text.primary : colors.text.tertiary,
                      transform: isCenter ? 'scale(1.05)' : 'scale(1)',
                      textDecoration: (isCompleted && !isCenter) ? 'line-through' : 'none',
                      opacity: (isCompleted && !isCenter) ? 0.5 : 1
                    }}
                  >
                    {step.name}
                  </span>
                  
                  {/* Subtle checkmark for completed items if not center */}
                  {isCompleted && !isCenter && (
                    <Check 
                      className="w-3 h-3 absolute right-6" 
                      style={{ color: theme === 'dark' ? '#404040' : colors.text.tertiary }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};


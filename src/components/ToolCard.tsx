import { Tool } from '@/types/tools';
import { Check, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface ToolCardProps {
  tool: Tool;
  selected: boolean;
  onToggle: () => void;
}

export const ToolCard = ({ tool, selected, onToggle }: ToolCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
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
      <div
        className={`relative overflow-hidden rounded-xl p-5 h-40 flex flex-col justify-between transition-all duration-200 ${
          selected
            ? 'bg-card/80 border border-foreground shadow-lg'
            : 'bg-card/30 border border-border hover:border-border/60'
        }`}
      >
        {/* Spotlight hover effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)',
          }}
        />

        {/* Active state glow */}
        {selected && (
          <div className="absolute inset-0 bg-foreground/5 pointer-events-none" />
        )}

        <div className="relative z-10 flex justify-between items-start">
          <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center text-white border border-border/50 text-2xl">
            {tool.icon || '📦'}
          </div>
          <motion.div
            animate={selected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              selected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <Check className="w-3 h-3" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-lg">{tool.name}</h3>
            {tool.popular && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-3 w-3 text-primary" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface DualLineChartProps {
  data1: Array<{ label: string; value: number }>;
  data2: Array<{ label: string; value: number }>;
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
}

export const DualLineChart = ({ 
  data1, 
  data2, 
  label1,
  label2,
  color1 = 'rgb(239, 68, 68)', 
  color2 = 'rgb(34, 197, 94)' 
}: DualLineChartProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const maxValue = Math.max(...data1.map(d => d.value), ...data2.map(d => d.value));
  const height = 200;
  
  return (
    <div ref={ref} className="w-full space-y-6">
      {/* Legend */}
      <div className="flex gap-8 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
          <span className="text-sm text-gray-400 font-mono">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
          <span className="text-sm text-gray-400 font-mono">{label2}</span>
        </div>
      </div>

      <div className="relative h-48 w-full">
        {/* Background Grid Lines - Dashed like the reference */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-dashed border-white/10 w-full" />
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <defs>
            {/* Gradient fill for line 1 */}
            <linearGradient id="fillGradient1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color1} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={color1} stopOpacity="0"/>
            </linearGradient>
            
            {/* Gradient fill for line 2 */}
            <linearGradient id="fillGradient2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color2} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={color2} stopOpacity="0"/>
            </linearGradient>

            {/* Glow effect */}
            <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Line 1 - Manual (stays high/slow) */}
          <motion.path
            d={data1.map((item, i) => {
              const x = (i / (data1.length - 1)) * 1000;
              const y = 200 - ((item.value / maxValue) * 180);
              return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            }).join('')}
            fill="url(#fillGradient1)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          
          <motion.path
            d={data1.map((item, i) => {
              const x = (i / (data1.length - 1)) * 1000;
              const y = 200 - ((item.value / maxValue) * 180);
              return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            }).join('')}
            fill="none"
            stroke={color1}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow1)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Line 2 - Automated (drops low/fast) */}
          <motion.path
            d={data2.map((item, i) => {
              const x = (i / (data2.length - 1)) * 1000;
              const y = 200 - ((item.value / maxValue) * 180);
              return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            }).join('')}
            fill="url(#fillGradient2)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.path
            d={data2.map((item, i) => {
              const x = (i / (data2.length - 1)) * 1000;
              const y = 200 - ((item.value / maxValue) * 180);
              return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            }).join('')}
            fill="none"
            stroke={color2}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow2)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Interactive Points on line 1 */}
          {data1.map((item, i) => {
            const x = (i / (data1.length - 1)) * 1000;
            const y = 200 - ((item.value / maxValue) * 180);
            return (
              <motion.g key={`p1-${i}`} className="group">
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#000"
                  stroke={color1}
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                  className="transition-all duration-300 hover:r-8"
                />
              </motion.g>
            );
          })}

          {/* Interactive Points on line 2 */}
          {data2.map((item, i) => {
            const x = (i / (data2.length - 1)) * 1000;
            const y = 200 - ((item.value / maxValue) * 180);
            return (
              <motion.g key={`p2-${i}`} className="group">
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#000"
                  stroke={color2}
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1), duration: 0.3 }}
                  className="transition-all duration-300 hover:r-8"
                />
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* X-axis labels - styled like the reference */}
      <div className="flex justify-between px-2">
        {data1.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.5 + (i * 0.1), duration: 0.5 }}
            className="text-[10px] text-gray-500 font-mono uppercase tracking-widest"
          >
            {item.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};


import { motion } from 'framer-motion';

interface PageTitleProps {
  subtitle: string;
  title: string;
  description?: string;
}

export const PageTitle = ({ subtitle, title, description }: PageTitleProps) => {
  return (
    <div className="mb-16">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8"
      >
        {subtitle}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight mb-8"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

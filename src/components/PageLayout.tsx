import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <main className={`w-full max-w-[1200px] h-[85vh] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden z-10 ${className}`}>
        {children}
      </main>
    </div>
  );
};


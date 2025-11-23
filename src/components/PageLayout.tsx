import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <main className={`w-full max-w-[1200px] h-[85vh] bg-white dark:bg-[#111111] border border-gray-100 dark:border-[#262626] rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden z-10 ${className}`}>
        {children}
      </main>
    </div>
  );
};


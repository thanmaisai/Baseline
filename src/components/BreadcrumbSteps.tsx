import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
}

interface BreadcrumbStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const BreadcrumbSteps = ({ steps, currentStep, onStepClick }: BreadcrumbStepsProps) => {
  // Show a scrollable timeline with better design
  return (
    <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex items-center gap-2 min-w-max px-1">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          // All steps should be clickable to navigate
          const isClickable = onStepClick !== undefined;

          return (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => isClickable && onStepClick?.(index)}
                className={`group relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 cursor-pointer'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 cursor-pointer'
                }`}
                disabled={!isClickable}
              >
                {isCompleted && !isActive && (
                  <Check className="w-3 h-3 inline-block mr-1.5" />
                )}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 dark:bg-blue-300 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                )}
                <span>{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-10 h-1 flex-shrink-0 rounded-full transition-colors ${
                  isCompleted 
                    ? 'bg-blue-500 dark:bg-blue-400' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


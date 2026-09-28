import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';

/**
 * Visual Stepper Tracker for Order Fulfillment
 */
export const OrderTracker = ({ currentStep = 1 }) => {
  const steps = [
    { id: 0, label: 'Order Confirmed', icon: Clock },
    { id: 1, label: 'Precision Assembly', icon: Package },
    { id: 2, label: 'In Transit (Air)', icon: Truck },
    { id: 3, label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Continuous Track */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-neutral-200 dark:bg-dark-border z-0" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-brand-500 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = step.id <= currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs
                  ${isDone
                    ? 'bg-brand-500 text-white ring-4 ring-white dark:ring-dark-card'
                    : 'bg-white dark:bg-dark-card text-neutral-400 border border-neutral-200 dark:border-dark-border'
                  }
                `}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`
                  text-[9px] xs:text-[10px] sm:text-xs font-semibold mt-2 text-center max-w-[60px] xs:max-w-[72px] sm:max-w-none sm:whitespace-nowrap leading-tight
                  ${isCurrent
                    ? 'text-brand-600 dark:text-brand-400'
                    : isDone
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-400'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;

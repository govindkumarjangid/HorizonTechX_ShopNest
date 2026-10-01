import { Award, ShieldCheck, Truck, RotateCcw, Lock, Cpu } from 'lucide-react';

export const MarqueeStrip = () => {
  const items = [
    { text: 'Free Express Shipping Across India', icon: Truck },
    { text: '2-Year Comprehensive Warranty', icon: ShieldCheck },
    { text: '30-Day Risk-Free Evaluation', icon: RotateCcw },
    { text: 'Bank-Grade 256-Bit SSL Encrypted', icon: Lock },
    { text: 'Aerospace Grade Aluminum & Ceramic', icon: Award },
    { text: 'Small-Batch Precision Hardware', icon: Cpu },
  ];

  // Duplicate for seamless infinite loop
  const repeated = [...items, ...items, ...items];

  return (
    <div className="w-full relative overflow-hidden py-3.5 bg-neutral-900 dark:bg-neutral-950 text-white border-y border-neutral-800 dark:border-neutral-800/80 select-none shadow-inner">
      {/* Edge gradient fades for seamless emergence */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-neutral-900 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-neutral-900 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-8 text-xs sm:text-sm font-medium tracking-wide">
        {repeated.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <Icon className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="text-neutral-200 uppercase tracking-widest font-mono text-[11px] sm:text-xs">
                {item.text}
              </span>
              <span className="text-brand-500 font-bold ml-3">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeStrip;

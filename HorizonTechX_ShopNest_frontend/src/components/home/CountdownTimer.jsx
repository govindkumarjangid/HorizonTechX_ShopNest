import { useState, useEffect } from 'react';

/**
 * Live Countdown Timer for Limited Edition Vault / Drops
 */
export const CountdownTimer = ({
  targetHours = 48,
  compact = false,
  className = '',
}) => {
  // Initialize target date in localStorage or dynamically 48 hours from initial load
  const [timeLeft, setTimeLeft] = useState(() => {
    const STORAGE_KEY = 'shopnest_archive_drop_deadline';
    let targetTimestamp = localStorage.getItem(STORAGE_KEY);

    if (!targetTimestamp || Number(targetTimestamp) <= Date.now()) {
      targetTimestamp = Date.now() + targetHours * 60 * 60 * 1000 + 36 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
    }

    const diff = Math.max(0, Number(targetTimestamp) - Date.now());
    return {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const STORAGE_KEY = 'shopnest_archive_drop_deadline';
      let targetTimestamp = Number(localStorage.getItem(STORAGE_KEY));

      if (!targetTimestamp || targetTimestamp <= Date.now()) {
        targetTimestamp = Date.now() + 36 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
      }

      const diff = Math.max(0, targetTimestamp - Date.now());
      setTimeLeft({
        total: diff,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-tight ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="font-semibold text-amber-500 dark:text-amber-400">
          Ends in: {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 font-mono text-xs ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Vault Closes:
      </span>
      <div className="flex items-center gap-1 font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-dark-card px-2 py-0.5 rounded-md border border-neutral-200/60 dark:border-dark-border">
        <span>{pad(timeLeft.days)}d</span>
        <span>:</span>
        <span>{pad(timeLeft.hours)}h</span>
        <span>:</span>
        <span>{pad(timeLeft.minutes)}m</span>
        <span>:</span>
        <span className="text-brand-500">{pad(timeLeft.seconds)}s</span>
      </div>
    </div>
  );
};

export default CountdownTimer;

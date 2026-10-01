import { useState, useEffect } from 'react';
import { intervalToDuration, isPast, addHours, differenceInMilliseconds } from 'date-fns';

export const CountdownTimer = ({
  targetHours = 48,
  compact = false,
  className = '',
}) => {
  const calculateTimeLeft = (targetDate) => {
    const now = new Date();
    if (isPast(targetDate)) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const duration = intervalToDuration({ start: now, end: targetDate });
    const total = Math.max(0, differenceInMilliseconds(targetDate, now));
    return {
      total,
      days: duration.days || 0,
      hours: duration.hours || 0,
      minutes: duration.minutes || 0,
      seconds: duration.seconds || 0,
    };
  };

  const getTargetDate = () => {
    const STORAGE_KEY = 'shopnest_archive_drop_deadline';
    const targetTimestamp = localStorage.getItem(STORAGE_KEY);
    let targetDate = targetTimestamp ? new Date(Number(targetTimestamp)) : null;

    if (!targetDate || isNaN(targetDate.getTime()) || isPast(targetDate)) {
      targetDate = addHours(new Date(), targetHours);
      localStorage.setItem(STORAGE_KEY, targetDate.getTime().toString());
    }

    return targetDate;
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(getTargetDate()));

  useEffect(() => {
    const interval = setInterval(() => {
      const targetDate = getTargetDate();
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetHours]);

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

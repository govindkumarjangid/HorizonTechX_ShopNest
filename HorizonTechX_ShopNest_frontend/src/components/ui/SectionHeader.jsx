import React from 'react';
import { Badge } from './Badge';
import { H2, Subtitle } from './Typography';

/**
 * Editorial Section Header with badge, title, subtitle, and optional right-aligned action
 */
export const SectionHeader = ({
  badge,
  badgeVariant = 'brand',
  badgeIcon,
  title,
  highlightWord,
  subtitle,
  action,
  className = '',
  align = 'left',
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${className}`}>
      <div className={`flex flex-col gap-2 ${isCentered ? 'items-center text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
        {badge && (
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant} icon={badgeIcon} size="sm">
              {badge}
            </Badge>
          </div>
        )}

        <H2 className="leading-tight">
          {title}{' '}
          {highlightWord && (
            <span className="text-brand-500">{highlightWord}</span>
          )}
        </H2>

        {subtitle && (
          <Subtitle className="text-sm sm:text-base max-w-xl">
            {subtitle}
          </Subtitle>
        )}
      </div>

      {action && !isCentered && (
        <div className="shrink-0 self-start md:self-end">
          {action}
        </div>
      )}
    </div>
  );
};

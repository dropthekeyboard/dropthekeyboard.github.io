import React from 'react';
import { cn } from '@/lib/utils';

interface SlideHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SlideHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: SlideHeaderProps) {
  return (
    <header className={cn('space-y-4', className)}>
      <h1
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight',
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            'text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-5xl',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

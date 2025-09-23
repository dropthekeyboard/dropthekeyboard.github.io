import { cn } from '@/lib/utils';
import { Battery, Signal } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface StatusBarProps {
  className?: string;
  variant?: 'default' | 'program';
}

export function StatusBar({ className, variant = 'default' }: StatusBarProps) {
  const { isDark } = useTheme();

  // Choose the appropriate state based on variant
  const isProgramMode = variant === 'program';

  // Get current time
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Program mode shows different time format or state
  const displayTime = isProgramMode ? 'PROGRAM' : currentTime;

  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-2 text-sm font-medium bg-transparent',
        'relative z-10',
        isDark ? 'text-white' : 'text-gray-700',
        className
      )}
    >
      {/* Left side - Time */}
      <div className="flex-1">
        <span className={cn(
          'font-semibold',
          isDark ? 'text-white' : 'text-gray-700'
        )}>
          {displayTime}
        </span>
      </div>

      {/* Center - Dynamic Island area (empty for content) */}
      <div className="flex-1 flex justify-center">
        <div className="w-16 h-6"></div>
      </div>

      {/* Right side - Status icons */}
      <div className="flex-1 flex items-center justify-end space-x-1">
        {/* Signal strength */}
        <div className="flex items-center">
          <Signal className={cn(
            'w-4 h-4',
            isDark ? 'text-white' : 'text-gray-700'
          )} />
        </div>

        {/* Battery */}
        <div className="flex items-center">
          <Battery className={cn(
            'w-4 h-4',
            isDark ? 'text-white' : 'text-gray-700'
          )} />
          <span
            className={cn(
              'text-xs ml-0.5 font-medium',
              isDark ? 'text-white' : 'text-gray-700'
            )}
          >
            {isProgramMode ? 'AI' : '100%'}
          </span>
        </div>
      </div>
    </div>
  );
}

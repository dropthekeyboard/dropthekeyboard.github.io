import { cn } from '@/lib/utils';
import { useCountAnimation } from '@/hooks/useCountAnimation';

interface AnimatedBarProps {
  value: number;
  maxValue: number;
  label: string;
  subLabel: string;
  isActive: boolean;
  className?: string;
}

export function AnimatedBar({
  value,
  maxValue,
  label,
  subLabel,
  isActive,
  className,
}: AnimatedBarProps) {
  const animatedValue = useCountAnimation(value, isActive);
  const heightPercentage = Math.min((animatedValue / maxValue) * 100, 100);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative flex flex-col items-center">
        <div
          className="w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg absolute bottom-0 transition-all duration-100"
          style={{ height: `${heightPercentage * 2}px` }}
        />
        <div
          className="w-20 bg-muted rounded-lg border-2 border-border"
          style={{ height: '200px' }}
        />
        <span className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-foreground">
          {animatedValue}%
        </span>
      </div>
      <div className="mt-6 text-center space-y-2">
        <div className="text-sm text-muted-foreground">{subLabel}</div>
        <div className="font-bold text-foreground text-lg">{label}</div>
      </div>
    </div>
  );
}

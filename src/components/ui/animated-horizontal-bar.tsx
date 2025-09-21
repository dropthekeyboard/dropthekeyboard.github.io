import { cn } from '@/lib/utils';
import { useCountAnimation } from '@/hooks/useCountAnimation';

interface AnimatedHorizontalBarProps {
  value: number;
  maxValue: number;
  label: string;
  subLabel: string;
  unit?: string;
  isActive: boolean;
  className?: string;
}

export function AnimatedHorizontalBar({
  value,
  maxValue,
  label,
  subLabel,
  unit = '',
  isActive,
  className,
}: AnimatedHorizontalBarProps) {
  const animatedValue = useCountAnimation(value, isActive);
  const widthPercentage = Math.min((animatedValue / maxValue) * 100, 100);

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{label}</p>
          <p className="text-base text-muted-foreground">{subLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-foreground">
            {formatValue(animatedValue)}
            {unit}
          </p>
        </div>
      </div>
      <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
    </div>
  );
}

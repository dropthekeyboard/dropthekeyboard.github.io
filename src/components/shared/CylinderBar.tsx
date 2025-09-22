import { cn } from '@/lib/utils';
import { useCountAnimation } from '@/hooks/useCountAnimation';

interface CylinderBarProps {
  value: number;
  label: string;
  subLabel: string;
  unit?: string;
  isActive: boolean;
  className?: string;
  height?: number;
}

export function CylinderBar({
  value,
  label,
  subLabel,
  unit = '%',
  isActive,
  className,
  height = 200,
}: CylinderBarProps) {
  const animatedValue = useCountAnimation(value * 10, isActive, 1200); // 소수점을 위해 10배
  const displayValue = animatedValue / 10;
  const fillHeight = Math.min((displayValue / 100) * 100, 100);

  return (
    <div className={cn('flex flex-col items-center space-y-4 min-w-0', className)}>
      {/* 백분율 표시 */}
      <div className="text-center">
        <span className="text-4xl font-bold text-foreground">
          {displayValue.toFixed(1)}{unit}
        </span>
      </div>

      {/* 실린더 차트 */}
      <div className="relative flex flex-col items-center">
        <div 
          className="w-20 bg-muted/30 rounded-full border-2 border-border relative overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {/* 채워진 부분 */}
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-1200 ease-out flex items-center justify-center"
            style={{
              height: `${isActive ? fillHeight : 0}%`,
            }}
          >
            {/* 내부 라벨 (연도 등) */}
            {isActive && fillHeight > 20 && (
              <span className="text-xs text-white/80 font-medium">
                {subLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 하단 라벨 */}
      <div className="text-center space-y-1 max-w-28">
        <div className="text-xs text-muted-foreground">{subLabel}기준</div>
        <p className="text-xs lg:text-sm font-medium text-foreground text-center leading-tight break-words">
          {label.replace('*', '')}
        </p>
        {label.includes('*') && (
          <div className="text-xs text-muted-foreground">*</div>
        )}
      </div>
    </div>
  );
}

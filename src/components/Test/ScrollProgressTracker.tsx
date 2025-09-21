import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import type { ProgressNode, ScrollProgressTrackerProps } from '@/types/test';

interface ProgressNodeComponentProps {
  section: ProgressNode;
  onClick: () => void;
  isDark: boolean;
}

function ProgressNodeComponent({ section, onClick, isDark }: ProgressNodeComponentProps) {
  const getNodeStyle = () => {
    const baseClasses = 'absolute w-3 h-3 rounded-full border-2 border-white -left-1 transition-all duration-300 cursor-pointer hover:scale-110';

    if (section.isActive) {
      return cn(baseClasses, 'bg-primary scale-125 shadow-lg ring-2 ring-primary/30');
    }

    if (section.isCompleted) {
      return cn(baseClasses, 'bg-primary');
    }

    // Different styles for different section types
    if (section.type === 'slide') {
      return cn(baseClasses, isDark ? 'bg-gray-600' : 'bg-gray-300');
    }

    if (section.type === 'scenario-intro') {
      return cn(baseClasses, isDark ? 'bg-blue-600' : 'bg-blue-300');
    }

    // scenario type
    return cn(baseClasses, isDark ? 'bg-green-600' : 'bg-green-300');
  };

  const getTooltipContent = () => {
    const typeLabel = section.type === 'slide' ? '슬라이드' :
                     section.type === 'scenario-intro' ? '시나리오 소개' : '시나리오';
    return `${typeLabel}: ${section.title}`;
  };

  return (
    <motion.div
      className={getNodeStyle()}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      title={getTooltipContent()}
      aria-label={getTooltipContent()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    />
  );
}

export function ScrollProgressTracker({
  sections,
  onNodeClick,
  position = 'right',
  className,
}: ScrollProgressTrackerProps) {
  const { isDark } = useTheme();

  // Distribute nodes evenly along the progress line
  const getNodePosition = (index: number) => {
    if (sections.length <= 1) return 0;
    return (index / (sections.length - 1)) * 100;
  };

  return (
    <div
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-30 scrollbar-hide',
        position === 'right' ? 'right-4' : 'left-4',
        'hidden lg:block', // Hidden on mobile
        className
      )}
    >
      {/* Progress Line */}
      <div className="relative">
        <div
          className={cn(
            'w-0.5 h-80 rounded-full',
            isDark ? 'bg-gray-700/60' : 'bg-gray-300/60'
          )}
        />

        {/* Active Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 w-0.5 bg-primary rounded-full origin-top"
          style={{
            height: sections.length > 0
              ? `${((sections.findIndex(s => s.isActive) + 1) / sections.length) * 100}%`
              : '0%'
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Nodes */}
        <div className="absolute inset-0">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="absolute"
              style={{ top: `${getNodePosition(index)}%` }}
            >
              <ProgressNodeComponent
                section={section}
                onClick={() => onNodeClick(index)}
                isDark={isDark}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs space-y-1">
        <div className="flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? 'bg-gray-600' : 'bg-gray-300')} />
          <span className="text-muted-foreground">슬라이드</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? 'bg-blue-600' : 'bg-blue-300')} />
          <span className="text-muted-foreground">시나리오 소개</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? 'bg-green-600' : 'bg-green-300')} />
          <span className="text-muted-foreground">시나리오</span>
        </div>
      </div>
    </div>
  );
}
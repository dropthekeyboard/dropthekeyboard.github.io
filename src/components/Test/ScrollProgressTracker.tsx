import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProgressNode, ScrollProgressTrackerProps } from '@/types/test';

interface ProgressNodeComponentProps {
  section: ProgressNode;
  onClick: () => void;
}

function ProgressNodeComponent({ section, onClick }: ProgressNodeComponentProps) {
  const getNodeStyle = () => {
    const baseClasses = 'absolute w-3 h-3 rounded-full border -left-1 transition-all duration-300 cursor-pointer hover:scale-110 backdrop-blur-sm';

    if (section.isActive) {
      return cn(
        baseClasses,
        'bg-white/20 border-white/40 scale-125 shadow-lg ring-2 ring-white/20',
        'backdrop-blur-md'
      );
    }

    if (section.isCompleted) {
      return cn(
        baseClasses,
        'bg-white/15 border-white/30 backdrop-blur-sm'
      );
    }

    // Glass morphism effect for different section types
    if (section.type === 'slide') {
      return cn(
        baseClasses,
        'bg-white/10 border-white/20 backdrop-blur-sm'
      );
    }

    if (section.type === 'scenario-intro') {
      return cn(
        baseClasses,
        'bg-blue-500/20 border-blue-400/30 backdrop-blur-sm'
      );
    }

    // scenario type
    return cn(
      baseClasses,
      'bg-green-500/20 border-green-400/30 backdrop-blur-sm'
    );
  };

  return (
    <motion.div
      className={getNodeStyle()}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
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

  // Distribute nodes with adaptive spacing
  const getNodePosition = (index: number) => {
    if (sections.length <= 1) return 0;

    const nodeSize = 12; // w-3 h-3 = 12px
    const minGap = 8; // minimum gap between nodes
    const totalHeight = sections.length > 15 ? 384 : 320; // Match dynamic height

    // Calculate optimal spacing
    const availableSpace = totalHeight - (sections.length * nodeSize);
    const optimalGap = Math.max(minGap, availableSpace / (sections.length - 1));

    // If optimal gap is too small, we need more height - but for now, use minimum
    const actualGap = Math.max(minGap, Math.min(24, optimalGap));

    // Center the nodes
    const totalContentHeight = (sections.length * nodeSize) + ((sections.length - 1) * actualGap);
    const startOffset = Math.max(0, (totalHeight - totalContentHeight) / 2);

    return ((startOffset + index * (nodeSize + actualGap)) / totalHeight) * 100;
  };

  return (
    <div
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-30 scrollbar-hide',
        position === 'right' ? 'right-6 pr-2' : 'left-6 pl-2',
        'hidden lg:block', // Hidden on mobile
        className
      )}
    >
      {/* Progress Line */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full bg-white/10 backdrop-blur-sm border border-white/5',
            sections.length > 15 ? 'h-96' : 'h-80' // Dynamic height based on section count
          )}
        />

        {/* Active Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 w-0.5 bg-white/30 rounded-full origin-top backdrop-blur-sm"
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
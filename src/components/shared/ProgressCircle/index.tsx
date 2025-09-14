import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressCircleProps {
  progress: number;
  children: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ProgressCircle({
  progress,
  children,
  size = 120,
  strokeWidth = 4,
  className,
  showPercentage = false,
  color = 'primary',
}: ProgressCircleProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate progress changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500',
  };

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* SVG Progress Circle */}
      <svg
        className="transform -rotate-90 absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
          className={cn('transition-colors duration-300', colorClasses[color])}
        />
      </svg>

      {/* Content in the center */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${progress}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            {children}

            {/* Progress percentage */}
            {showPercentage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-1 text-xs font-medium text-muted-foreground"
              >
                {Math.round(displayProgress)}%
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pulsing effect for active state */}
      {progress > 0 && progress < 100 && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full opacity-20',
            color === 'primary' && 'bg-primary',
            color === 'success' && 'bg-green-500',
            color === 'warning' && 'bg-yellow-500',
            color === 'danger' && 'bg-red-500'
          )}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

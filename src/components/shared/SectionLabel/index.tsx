import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const sectionLabelVariants = cva(
  'px-4 py-1.5 rounded-full text-sm font-semibold',
  {
    variants: {
      size: {
        sm: 'px-3 py-1 text-sm font-medium',
        md: 'px-4 py-1.5 text-sm font-semibold',
        lg: 'px-5 py-2 text-base font-bold',
      },
      position: {
        top: 'absolute -top-6 left-1/2 transform -translate-x-1/2',
        'top-high': 'absolute -top-8 left-1/2 transform -translate-x-1/2',
        'top-low': 'absolute -top-4 left-1/2 transform -translate-x-1/2',
        center:
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        bottom: 'absolute -bottom-6 left-1/2 transform -translate-x-1/2',
      },
      animation: {
        fade: '',
        slide: '',
        bounce: '',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'top',
      animation: 'fade',
    },
  }
);

export interface SectionLabelProps
  extends VariantProps<typeof sectionLabelVariants> {
  label: string;
  labelColor: string;
  className?: string;
  delay?: number;
}

export function SectionLabel({
  label,
  labelColor,
  size,
  position,
  animation,
  className,
  delay = 0.2,
}: SectionLabelProps) {
  const getAnimationProps = () => {
    switch (animation) {
      case 'slide':
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.3 },
        };
      case 'bounce':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            delay,
            duration: 0.4,
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
          },
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay, duration: 0.3 },
        };
    }
  };

  return (
    <motion.div
      {...getAnimationProps()}
      className={cn(
        sectionLabelVariants({ size, position, animation }),
        className
      )}
    >
      <div className={cn(labelColor)}>{label}</div>
    </motion.div>
  );
}

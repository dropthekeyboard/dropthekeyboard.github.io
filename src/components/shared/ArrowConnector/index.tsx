import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ArrowConnectorProps {
  direction?: 'right' | 'left' | 'up' | 'down';
  className?: string;
}

export function ArrowConnector({ direction = 'right', className }: ArrowConnectorProps) {
  const getRotation = () => {
    switch (direction) {
      case 'left': return 'rotate-180';
      case 'up': return '-rotate-90';
      case 'down': return 'rotate-90';
      default: return '';
    }
  };

  return (
    <div className={cn('flex items-center justify-center px-2', className)}>
      <ArrowRight 
        className={cn(
          'w-8 h-8 text-gray-400 transition-transform',
          getRotation()
        )} 
      />
    </div>
  );
}
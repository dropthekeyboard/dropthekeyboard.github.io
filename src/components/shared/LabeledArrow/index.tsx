import { cn } from '@/lib/utils';
import { ArrowRight, Phone, PhoneOff } from 'lucide-react';

interface LabeledArrowProps {
  icon: string;
  label: string;
  status?: 'success' | 'failed' | 'pending';
  className?: string;
}

export function LabeledArrow({ icon, label, status = 'pending', className }: LabeledArrowProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getIconComponent = () => {
    switch (icon) {
      case '📞': return <Phone className="w-5 h-5" />;
      case '📵': return <PhoneOff className="w-5 h-5" />;
      default: return <span className="text-xl">{icon}</span>;
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-3 relative min-w-[120px]', className)}>
      {/* Label */}
      <span className="text-xs text-gray-300 text-center whitespace-pre-line max-w-28">
        {label}
      </span>
      
      {/* Icon with background */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 relative',
        status === 'success' && 'bg-green-500/20 border-green-400',
        status === 'failed' && 'bg-red-500/20 border-red-400',
        status === 'pending' && 'bg-gray-500/20 border-gray-400'
      )}>
        <span className={cn(getStatusColor())}>
          {getIconComponent()}
        </span>
      </div>
      
      {/* Arrow line extending to the right */}
      <div className="absolute top-8 left-10 flex items-center">
        <div className={cn(
          'w-10 h-0.5',
          status === 'success' && 'bg-green-400',
          status === 'failed' && 'bg-red-400',
          status === 'pending' && 'bg-gray-400'
        )} />
        <ArrowRight className={cn(
          'w-3 h-3 -ml-0.5',
          getStatusColor()
        )} />
      </div>
    </div>
  );
}
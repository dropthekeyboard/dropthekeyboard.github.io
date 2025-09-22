import { cn } from '@/lib/utils';

interface PersonaIconProps {
  icon: string;
  label: string;
  className?: string;
}

export function PersonaIcon({ icon, label, className }: PersonaIconProps) {
  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* Icon */}
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
        <span className="text-3xl">{icon}</span>
      </div>
      
      {/* Label */}
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
}
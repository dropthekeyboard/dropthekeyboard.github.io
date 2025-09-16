import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  className,
  fallbackIcon: FallbackIcon,
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden border-2 border-background shadow-sm flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : FallbackIcon ? (
        <FallbackIcon className="w-5 h-5 text-muted-foreground" />
      ) : null}
    </div>
  );
}

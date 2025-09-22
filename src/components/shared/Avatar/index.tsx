import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const handleImageError = () => {
    console.log(`🖼️ Avatar image failed to load: ${src}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`🖼️ Avatar image loaded successfully: ${src}`);
  };

  // Reset error state when src changes
  if (imageError && src) {
    setImageError(false);
  }

  const shouldShowImage = src && !imageError;

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden border-2 border-background shadow-sm flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : FallbackIcon ? (
        <FallbackIcon className="w-5 h-5 text-muted-foreground" />
      ) : (
        <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

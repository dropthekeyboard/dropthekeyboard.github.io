import { VoiceBubbleOverlay } from '@/components/shared/VoiceBubbleOverlay';
// import { useTheme } from '@/hooks/useTheme';
import type { Message, Entity } from '@/contexts/scenario';
import { cn } from '@/lib/utils';

interface CallScreenProps {
  voiceMessages?: Message[];
  onEndCall?: () => void;
  onToggleMute?: () => void;
  ownerEntity: Entity;
  className?: string;
  variant?: 'default' | 'program';
}

export function CallScreen({
  voiceMessages = [],
  ownerEntity,
  variant = 'default',
  className
}: CallScreenProps) {
  // Temporary screen mode - should be passed as prop or derived from state

  return (
    <div className={cn('relative w-full h-full', className)}>
      <VoiceBubbleOverlay
        voiceMessages={voiceMessages}
        ownerEntity={ownerEntity}
        variant={variant}
      />
    </div>
  );
}

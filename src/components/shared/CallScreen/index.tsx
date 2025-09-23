import { VoiceBubbleOverlay } from '@/components/shared/VoiceBubbleOverlay';
// import { useTheme } from '@/hooks/useTheme';
import type { Message, Entity } from '@/contexts/scenario';
import { cn } from '@/lib/utils';

interface CallScreenProps {
  contactName?: string;
  contactNumber?: string;
  callDuration?: number;
  isMuted?: boolean;
  voiceMessages?: Message[];
  onEndCall?: () => void;
  onToggleMute?: () => void;
  ownerName: string;
  from?: string;
  className?: string;
  entity?: Entity | null;
  variant?: 'default' | 'program';
}

export function CallScreen({
  voiceMessages = [],
  ownerName,
  contactName = 'Contact',
  contactNumber: _contactNumber, // eslint-disable-line @typescript-eslint/no-unused-vars
  callDuration = 0,
  isMuted = false,
  from,
  className,
  entity,
  variant = 'default',
}: CallScreenProps) {
  // const { isDark } = useTheme();
  // Temporary screen mode - should be passed as prop or derived from state

  return (
    <div className={cn('relative w-full h-full', className)}>
      <VoiceBubbleOverlay
        voiceMessages={voiceMessages}
        ownerName={ownerName}
        contactName={contactName}
        from={from}
        callDuration={callDuration}
        isMuted={isMuted}
        entity={entity}
        variant={variant}
      />
    </div>
  );
}

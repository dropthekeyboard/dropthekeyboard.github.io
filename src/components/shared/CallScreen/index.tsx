import { VoiceBubbleOverlay } from '@/components/shared/VoiceBubbleOverlay';
import type { Message } from '@/contexts/scenario';
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
}

export function CallScreen({
  voiceMessages = [],
  ownerName,
  contactName = 'Contact',
  contactNumber,
  callDuration = 0,
  isMuted = false,
  from,
  className,
}: CallScreenProps) {
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
      />
    </div>
  );
}

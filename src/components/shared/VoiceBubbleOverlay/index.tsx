import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { VoiceScreen } from '@/components/shared/VoiceScreen';
import type { Message, Entity } from '@/contexts/scenario';

interface VoiceBubbleOverlayProps {
  voiceMessages: Message[];
  ownerName: string;
  contactName?: string;
  from?: string;
  className?: string;
  maxMessages?: number;
  callDuration?: number;
  isMuted?: boolean;
  entity?: Entity | null;
}

export function VoiceBubbleOverlay({
  voiceMessages,
  ownerName,
  contactName = 'Contact',
  from: _from, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  maxMessages = 5,
  callDuration = 0,
  entity,
}: VoiceBubbleOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'absolute inset-0',
        'flex flex-col justify-end',
        'pointer-events-none',
        className
      )}
    >
      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Voice screen container */}
      <div className="relative z-10 flex-1 overflow-hidden shadow-2xl">
        <VoiceScreen
          voiceMessages={voiceMessages}
          ownerName={ownerName}
          contactName={contactName}
          maxMessages={maxMessages}
          callDuration={callDuration}
          className="bg-background/95"
          entity={entity}
        />
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center m-4"
      >
        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          <span className="text-xs text-white/80 font-medium">
            Voice conversation in progress
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

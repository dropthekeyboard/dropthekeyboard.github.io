import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { VoiceScreen } from '@/components/shared/VoiceScreen';
import type { Message } from '@/contexts/scenario';

interface VoiceBubbleOverlayProps {
  voiceMessages: Message[];
  ownerName: string;
  contactName?: string;
  from?: string;
  className?: string;
  maxMessages?: number;
  callDuration?: number;
  isMuted?: boolean;
}

export function VoiceBubbleOverlay({
  voiceMessages,
  ownerName,
  contactName = 'Contact',
  from,
  className,
  maxMessages = 5,
  callDuration = 0,
  isMuted = false,
}: VoiceBubbleOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'absolute inset-0 bg-black/30 backdrop-blur-sm',
        'flex flex-col justify-end p-4',
        'pointer-events-none',
        className
      )}
    >
      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Voice screen container */}
      <div className="relative z-10 flex-1 max-h-[80vh] overflow-hidden rounded-lg border border-white/20 shadow-2xl">
        <VoiceScreen
          voiceMessages={voiceMessages}
          ownerName={ownerName}
          contactName={contactName}
          from={from}
          maxMessages={maxMessages}
          callDuration={callDuration}
          isMuted={isMuted}
          className="bg-background/95 backdrop-blur-sm"
        />
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mt-4"
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

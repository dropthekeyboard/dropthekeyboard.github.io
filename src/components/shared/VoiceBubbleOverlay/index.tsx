import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceBubble } from '@/components/shared/VoiceBubble';
import type { Message } from '@/contexts/scenario';

interface VoiceBubbleOverlayProps {
  voiceMessages: Message[];
  ownerName: string;
  contactName?: string;
  className?: string;
  maxMessages?: number;
}

export function VoiceBubbleOverlay({
  voiceMessages,
  ownerName,
  className,
  maxMessages = 5,
}: VoiceBubbleOverlayProps) {

  // Helper function to convert scenario senderType to component senderType
  const getComponentSenderType = (senderType?: 'agent' | 'customer' | 'server'): 'user' | 'ai' | 'agent' | 'server-human' => {
    switch (senderType) {
      case 'agent':
        return 'ai';
      case 'customer':
        return 'user';
      case 'server':
        return 'server-human';
      default:
        return 'user';
    }
  };

  // Show only the most recent messages
  const displayMessages = voiceMessages.slice(-maxMessages);

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

      {/* Voice bubbles container */}
      <div className="relative z-10 space-y-2 max-h-[50vh] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {displayMessages.map((voiceMessage) => (
            <VoiceBubble
              key={voiceMessage.id || voiceMessage.content}
              message={voiceMessage.content}
              isOwnMessage={voiceMessage.from === ownerName}
              senderType={getComponentSenderType(voiceMessage.senderType)}
              timestamp={voiceMessage.timestamp}
            />
          ))}
        </AnimatePresence>
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

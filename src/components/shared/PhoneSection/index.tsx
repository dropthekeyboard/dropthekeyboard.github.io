import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import { CallScreen } from '@/components/shared/CallScreen';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Message, PhoneState } from '@/contexts/scenario';
import { IncomingCallOverlay } from '@/components/shared/CallScreen/IncomingCallOverlay';

interface PhoneSectionProps {
  entity: {
    name: string;
    state: PhoneState;
    messageBox: Record<string, Message[]>;
  } | null;
  label: string;
  labelColor: string;
  animationDirection: 'left' | 'right';
  contactName: string;
  contactNumber: string;
  contactStatus: string;
  sectionClass: string;
  showAdditionalStatus?: boolean;
}

export function PhoneSection({
  entity,
  label,
  labelColor,
  animationDirection,
  contactName,
  contactNumber,
  contactStatus,
  sectionClass,
  showAdditionalStatus = false,
}: PhoneSectionProps) {
  // Collect all messages from entity's messageBox
  const allMessages: Message[] = Object.values(entity?.messageBox || {}).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'text'
  );

  const voiceMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'voice'
  );

  const animationX = animationDirection === 'left' ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: animationX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(sectionClass, 'relative overflow-hidden')}
    >
      <PhoneFrame>
        {entity?.state === 'call' ? (
          <CallScreen
            contactName={contactName}
            ownerName={entity?.name || 'Unknown'}
            contactNumber={contactNumber}
            callDuration={0}
            voiceMessages={voiceMessages}
          />
        ) : (
          <MessageScreen
            messages={textMessages}
            isTyping={false}
            ownerName={entity?.name || 'Unknown'}
            contactName={contactName}
            contactStatus={contactStatus}
          />
        )}
      </PhoneFrame>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
      >
        <div
          className={`px-3 py-1 ${labelColor} rounded-full text-xs font-medium`}
        >
          {label}
        </div>
      </motion.div>

      {/* Additional status for server section */}
      {showAdditionalStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded"
        >
          {allMessages.length > 0 ? 'Online' : 'Available'}
        </motion.div>
      )}

      {/* Call state indicator */}
      {entity && <IncomingCallOverlay state={entity.state} />}
    </motion.div>
  );
}

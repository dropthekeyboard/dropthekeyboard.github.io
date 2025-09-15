import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import { CallScreen } from '@/components/shared/CallScreen';
import { SectionLabel } from '@/components/shared/SectionLabel';
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
  from?: string;
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
  from,
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
      className={cn('relative')}
    >
      <PhoneFrame>
        {entity?.state === 'call' ? (
          <CallScreen
            contactName={contactName}
            ownerName={entity?.name || 'Unknown'}
            contactNumber={contactNumber}
            callDuration={0}
            voiceMessages={voiceMessages}
            from={from}
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
      <SectionLabel
        label={label}
        labelColor={labelColor}
        position="top-high"
        animation="slide"
        delay={0.3}
      />

      {/* Call state indicator */}
      {entity && <IncomingCallOverlay state={entity.state} />}
    </motion.div>
  );
}

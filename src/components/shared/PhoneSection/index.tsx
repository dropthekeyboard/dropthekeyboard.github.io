import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import { CallScreen } from '@/components/shared/CallScreen';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, PhoneState } from '@/contexts/scenario';
import { IncomingCallOverlay } from '@/components/shared/CallScreen/IncomingCallOverlay';
import { useScenario } from '@/hooks/useScenario';

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
  showAdditionalStatus: _showAdditionalStatus = false, // eslint-disable-line @typescript-eslint/no-unused-vars
}: PhoneSectionProps) {
  const { state } = useScenario();

  // Collect all messages from entity's messageBox
  const allMessages: Message[] = Object.values(entity?.messageBox || {}).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'text'
  );

  const voiceMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'voice'
  );

  // Get caller name from active call session
  const getCallerName = () => {
    if (!entity) return contactName;

    const activeCallSession = state.callSessions?.find(session =>
      session.participants.some(p => p === entity.name) && session.endTime === null
    );

    return activeCallSession?.callerName || contactName;
  };

  const callerName = getCallerName();

  const animationX = animationDirection === 'left' ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: animationX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('relative')}
    >
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {entity?.state === 'call' ? (
            <motion.div
              key="call-screen"
              initial={{ opacity: 0, x: 300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -300, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94], // iOS-style easing
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0"
            >
              <CallScreen
                contactName={contactName}
                ownerName={entity?.name || 'Unknown'}
                contactNumber={contactNumber}
                callDuration={0}
                voiceMessages={voiceMessages}
                from={from}
              />
            </motion.div>
          ) : (
            <motion.div
              key="message-screen"
              initial={{ opacity: 0, x: -300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94], // iOS-style easing
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0"
            >
              <MessageScreen
                messages={textMessages}
                isTyping={false}
                ownerName={entity?.name || 'Unknown'}
                contactName={contactName}
                contactStatus={contactStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
      {entity && <IncomingCallOverlay state={entity.state} callerName={callerName} />}
    </motion.div>
  );
}

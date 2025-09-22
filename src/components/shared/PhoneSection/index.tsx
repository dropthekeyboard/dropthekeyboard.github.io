import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import { CallScreen } from '@/components/shared/CallScreen';
import { HomeScreen } from '@/components/shared/HomeScreen';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { IncomingCallOverlay } from '@/components/shared/CallScreen/IncomingCallOverlay';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, HumanState, CallSession } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';

interface PhoneSectionProps {
  entity: HumanState | null;
  label: string;
  labelColor: string;
  animationDirection: 'left' | 'right';
  contactName?: string;
  contactNumber: string;
  from?: string;
  showAdditionalStatus?: boolean;
  location?: 'customer' | 'server';
}

export function PhoneSection({
  entity,
  label,
  labelColor,
  animationDirection,
  contactName = 'Contact',
  contactNumber,
  from,
  showAdditionalStatus: _showAdditionalStatus = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  location = 'customer',
}: PhoneSectionProps) {
  const { state } = useScenario();

  // Collect all messages from entity's messageBox
  const allMessages: Message[] = Object.values(entity?.messageBox || {}).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'text'
  );

  const voiceMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'voice' || msg.type === 'dtmf'
  );

  // Get caller name from active call session
  const getCallerName = () => {
    if (!entity) return contactName;

    const activeCallSession = state.callSessions?.find(
      (session: CallSession) =>
        session.participants.some((p: string) => p === entity.name) &&
        session.endTime === null
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
      className={cn(
        'relative landscape:w-[30vw] portrait:w-[40vw] aspect-[9/16]'
      )}
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
                scale: { duration: 0.3 },
              }}
              className="absolute inset-0"
            >
              <CallScreen
                contactName={entity?.displayName || entity?.name || contactName}
                ownerName={entity?.displayName || entity?.name || 'Unknown'}
                contactNumber={contactNumber}
                callDuration={0}
                voiceMessages={voiceMessages}
                from={from}
                entity={entity}
              />
            </motion.div>
          ) : entity?.state === 'idle' ? (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94], // iOS-style easing
              }}
              className="absolute inset-0"
            >
              <HomeScreen entity={entity} location={location} />
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
                scale: { duration: 0.3 },
              }}
              className="absolute inset-0"
            >
              <MessageScreen
                messages={textMessages}
                isTyping={false}
                ownerName={entity?.name || 'Unknown'}
                contactName={entity?.name || contactName}
                entity={entity}
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
      {entity && (
        <IncomingCallOverlay state={entity.state} callerName={callerName} />
      )}
    </motion.div>
  );
}

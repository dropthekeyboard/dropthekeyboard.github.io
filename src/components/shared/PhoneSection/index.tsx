import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import { VoiceScreen } from '@/components/shared/VoiceScreen';
import { HomeScreen } from '@/components/shared/HomeScreen';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { IncomingCallOverlay } from '@/components/shared/CallScreen/IncomingCallOverlay';
import { OutgoingCallOverlay } from '@/components/shared/CallScreen/OutgoingCallOverlay';
import { ThemeOverride } from '@/contexts/theme';
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
  location?: 'customer' | 'server';
  statusBarVariant?: 'default' | 'program';
  voiceBubbleVariant?: 'default' | 'program';
}

export function PhoneSection({
  entity,
  label,
  labelColor,
  animationDirection,
  contactName = 'Contact',
  location = 'customer',
  statusBarVariant = 'default',
  voiceBubbleVariant = 'default',
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

  // Get caller entity from active call session
  const getCallerEntity = () => {
    // 현재 scenario 구조에서 다른 entity를 찾는 방법이 명확하지 않으므로
    // 일단 null을 반환하고 추후 개선
    return null;
  };

  const callerName = getCallerName();
  const callerEntity = getCallerEntity();

  const animationX = animationDirection === 'left' ? -50 : 50;

  return (
    <ThemeOverride theme="light">
      <motion.div
        initial={{ opacity: 0, x: animationX }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'relative landscape:w-[30vw] portrait:w-[40vw] aspect-[9/16]'
        )}
      >
        <PhoneFrame statusBarVariant={statusBarVariant}>
          <AnimatePresence mode="wait">
            {entity?.state === 'call' ? (
              <motion.div
                key="voice-screen"
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
                <VoiceScreen
                  voiceMessages={voiceMessages}
                  ownerName={entity?.name || 'Unknown'}
                  contactName={entity?.displayName || entity?.name || contactName}
                  entity={entity}
                  variant={voiceBubbleVariant}
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
            ) : entity?.state === 'ring' ? (
              <motion.div
                key="home-screen-with-overlay"
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

        {/* Call state overlays */}
        {entity && (
          <>
            <IncomingCallOverlay 
              state={entity.state} 
              callerName={callerName}
              callerEntity={callerEntity}
              ownerName={entity.name || 'Unknown'}
            />
            <OutgoingCallOverlay 
              state={entity.state} 
              calleeName={callerName}
              calleeEntity={callerEntity}
              ownerName={entity.name || 'Unknown'}
            />
          </>
        )}
      </motion.div>
    </ThemeOverride>
  );
}

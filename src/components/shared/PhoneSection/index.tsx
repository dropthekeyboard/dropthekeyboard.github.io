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
import type { Message, HumanState, Entity, AIAgentState, AgenticStep, Scenario } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { useMemo } from 'react';

// Entity search utility function
function findEntityByName(scenario: Scenario, name: string): Entity | undefined {
  if (scenario.customer?.name === name) return scenario.customer;
  const agent = scenario.agents?.find((a: AIAgentState) => a.name === name);
  if (agent) return agent;
  const server = scenario.servers?.find((s: Entity) => s.name === name);
  if (server) return server;
  return undefined;
}

// Owner-centric phone state calculation function
function getOwnerPhoneState(owner: Entity, scenario: Scenario): {
  phoneState: 'idle' | 'ring-incoming' | 'ring-outgoing' | 'calling' | 'messaging';
  fromEntity?: Entity;
  toEntity?: Entity;
} {
  // Owner가 관여한 step만 필터링
  const lastStep = scenario.steps
    .filter(
      (step: AgenticStep) =>
        step.action.from === owner.name || step.action.to === owner.name
    )
    .at(-1);

  if (!lastStep) return { phoneState: 'idle' };

  switch (lastStep.type) {
    case 'make-call':
      return {
        phoneState: lastStep.action.from === owner.name ? 'ring-outgoing' : 'ring-incoming',
        fromEntity: findEntityByName(scenario, lastStep.action.from),
        toEntity: findEntityByName(scenario, lastStep.action.to),
      };
    case 'accept-call':
      return {
        phoneState: 'calling',
        fromEntity: findEntityByName(scenario, lastStep.action.from),
        toEntity: findEntityByName(scenario, lastStep.action.to),
      };
    case 'finish-call':
      return { phoneState: 'idle' };
    case 'send-message':
      return {
        phoneState:
          lastStep.action.type === 'voice' || lastStep.action.type === 'dtmf'
            ? 'calling'
            : 'messaging',
        fromEntity: findEntityByName(scenario, lastStep.action.from),
        toEntity: findEntityByName(scenario, lastStep.action.to),
      };
    default:
      return { phoneState: 'idle' };
  }
}

interface PhoneSectionProps {
  entity: HumanState | null;
  label: string;
  labelColor: string;
  animationDirection: 'left' | 'right';
  location?: 'customer' | 'server';
  statusBarVariant?: 'default' | 'program';
  voiceBubbleVariant?: 'default' | 'program';
}

export function PhoneSection({
  entity,
  label,
  labelColor,
  animationDirection,
  location = 'customer',
  statusBarVariant = 'default',
  voiceBubbleVariant = 'default',
}: PhoneSectionProps) {
  const { state } = useScenario();

  // Calculate owner's phone state using the new function
  const ownerState = useMemo(() => {
    if (!entity) return { phoneState: 'idle' as const };
    return getOwnerPhoneState(entity, state);
  }, [entity, state]);

  // Calculate contact name from the ownerState
  const contactName = useMemo(() => {
    const otherEntity = ownerState.fromEntity?.name === entity?.name
      ? ownerState.toEntity
      : ownerState.fromEntity;
    return otherEntity?.displayName || otherEntity?.name || 'Contact';
  }, [ownerState, entity]);

  // Determine current screen based on phone state
  const currentScreen = useMemo(() => {
    switch (ownerState.phoneState) {
      case 'calling': return 'voice';
      case 'ring-incoming':
      case 'ring-outgoing': return 'home-with-overlay';
      case 'messaging': return 'message';
      default: return 'home';
    }
  }, [ownerState.phoneState]);

  // Collect all messages from entity's messageBox
  const allMessages: Message[] = Object.values(entity?.messageBox || {}).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'text'
  );

  const voiceMessages: Message[] = allMessages.filter(
    (msg) => msg.type === 'voice' || msg.type === 'dtmf'
  );

  // Calculate Call Overlay props automatically
  const incomingCallProps = useMemo(() => ({
    callerEntity: ownerState.fromEntity || { name: 'Unknown', type: 'human' as const },
  }), [ownerState]);

  const outgoingCallProps = useMemo(() => ({
    calleeEntity: ownerState.toEntity || { name: 'Unknown', type: 'human' as const },
  }), [ownerState]);

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
            {currentScreen === 'voice' && (
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
                  contactName={contactName}
                  entity={entity}
                  variant={voiceBubbleVariant}
                />
              </motion.div>
            )}
            {(currentScreen === 'home' || currentScreen === 'home-with-overlay') && (
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
            )}
            {currentScreen === 'message' && (
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
                  contactName={contactName}
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
            {ownerState.phoneState === 'ring-incoming' && (
              <IncomingCallOverlay {...incomingCallProps} />
            )}
            {ownerState.phoneState === 'ring-outgoing' && (
              <OutgoingCallOverlay {...outgoingCallProps} />
            )}
          </>
        )}
      </motion.div>
    </ThemeOverride>
  );
}

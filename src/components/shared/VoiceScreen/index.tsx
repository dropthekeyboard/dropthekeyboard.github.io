import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { VoiceBubble } from '@/components/shared/VoiceBubble';
import { Avatar } from '@/components/shared/Avatar';
import { Numpad } from '@/components/shared/Numpad';
import { getEntityAvatarProps, findEntityByName } from '@/components/shared/Avatar/avatarHelpers';
import type { CallSession, Message, Scenario, Entity } from '@/contexts/scenario';
import { useTheme } from '@/hooks/useTheme';
import { useMemo, useEffect, useRef } from 'react';
import { useScenario } from '@/hooks/useScenario';

interface VoiceScreenProps {
  voiceMessages: Message[];
  ownerName: string;
  contactName?: string;
  className?: string;
  maxMessages?: number;
  callDuration?: number;
  entity?: Entity | null;
}

function getRelevantSession(
  scenario: Scenario,
  ownerName: string
): CallSession | null {
  return (
    scenario.callSessions?.find((s) =>
      s.participants.some((p) => p === ownerName)
    ) || null
  );
}

export function VoiceScreen({
  voiceMessages,
  ownerName,
  contactName = 'Contact',
  className,
  callDuration = 0,
  entity,
}: VoiceScreenProps) {
  const { resolvedTheme } = useTheme();
  const { state } = useScenario();

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const session = useMemo(
    () => getRelevantSession(state, ownerName),
    [state, ownerName]
  );
  console.log('voice screen session : ', { session, voiceMessages });

  // Helper function to convert scenario senderType to component senderType
  const getComponentSenderType = (
    senderType?: 'agent' | 'customer' | 'server'
  ): 'user' | 'ai' | 'agent' | 'server-human' => {
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

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show only the messages that belong to the current active call session
  const displayMessages = voiceMessages.filter(
    (m) => m.callSession?.id === session?.id && m.callSession?.endTime === null // Only messages from active calls
  );

  // Auto scroll to bottom when new messages arrive - with scroll isolation
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;

      // Use setTimeout to batch scroll updates and avoid interference with ScrollTrigger
      const timeoutId = setTimeout(() => {
        // Directly set scrollTop to avoid triggering scroll events that affect parent containers
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        if (maxScrollTop > 0) {
          container.scrollTop = maxScrollTop;
        }
      }, 16); // One frame delay to avoid immediate scroll event conflicts

      return () => clearTimeout(timeoutId);
    }
  }, [displayMessages]);

  // Theme-based styling - iPhone-like glass morphism
  const themeStyles = {
    light: {
      background: 'bg-gradient-to-b from-gray-100 via-gray-50 to-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      avatarBg: 'bg-white/40 backdrop-blur-xl',
      avatarBorder: 'border-white/60',
      overlayBg: 'backdrop-blur-md bg-white/10',
      statusText: 'text-green-600',
      dtmfBg: 'bg-white/30 backdrop-blur-lg border border-white/40',
      dtmfText: 'text-green-700',
    },
    dark: {
      background: 'bg-gradient-to-b from-gray-900 via-black to-gray-900',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-200',
      textMuted: 'text-gray-400',
      avatarBg: 'bg-white/10 backdrop-blur-xl',
      avatarBorder: 'border-white/30',
      overlayBg: 'backdrop-blur-md bg-black/10',
      statusText: 'text-green-400',
      dtmfBg: 'bg-white/10 backdrop-blur-lg border border-white/20',
      dtmfText: 'text-green-400',
    },
  };

  const currentTheme = themeStyles[resolvedTheme];

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden flex flex-col',
        currentTheme.background,
        className
      )}
    >
      {/* Top Section - Avatar, Contact Info, Call Duration */}
      <div className="flex-shrink-0 pt-8 pb-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Contact avatar - using Avatar component with CallSession info */}
          <div className="mx-auto">
            <Avatar
              {...getEntityAvatarProps(entity, getComponentSenderType(session?.callerType))}
              size="lg"
              className={cn(
                'scale-150 shadow-2xl',
                currentTheme.avatarBg,
                currentTheme.avatarBorder
              )}
            />
          </div>

          {/* Contact name and call status */}
          <div className="text-center">
            <h1
              className={cn(
                'text-xl font-light mb-1',
                currentTheme.textPrimary
              )}
            >
              {contactName}
            </h1>
            <p className={cn('text-sm', currentTheme.textSecondary)}>
              Voice Call
            </p>
          </div>

          {/* Call duration */}
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full animate-pulse',
                currentTheme.statusText === 'text-green-600'
                  ? 'bg-green-600'
                  : 'bg-green-400'
              )}
            />
            <span
              className={cn(
                'font-mono text-sm font-light',
                currentTheme.statusText
              )}
            >
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Messages Overlay - iPhone style glass effect */}
      {displayMessages.length > 0 && (
        <div className={cn('absolute inset-0 z-20 pointer-events-none')}>
          <div className="h-full flex flex-col">
            {/* Messages in top portion with subtle overlay */}
            <div
              ref={messagesContainerRef}
              className="flex-1 pt-8 pb-24 px-4 overflow-y-auto scrollbar-hide"
            >
              <div className="space-y-2 w-full">
                <AnimatePresence mode="popLayout">
                  {displayMessages
                    .filter((m) => m.type === 'voice')
                    .map((voiceMessage: Message) => (
                      <div
                        key={voiceMessage.id || voiceMessage.content}
                        className="pointer-events-auto w-full"
                      >
                        <VoiceBubble
                          message={voiceMessage.content}
                          isOwnMessage={voiceMessage.from === ownerName}
                          senderType={getComponentSenderType(
                            voiceMessage.senderType
                          )}
                          timestamp={voiceMessage.timestamp}
                          enableMarkdown={
                            voiceMessage.senderType === 'agent' ||
                            voiceMessage.senderType === 'server'
                          }
                          entity={entity}
                          messageFrom={voiceMessage.from}
                          ownerName={ownerName}
                          messageFromEntity={findEntityByName(state, voiceMessage.from)}
                        />
                      </div>
                    ))}
                </AnimatePresence>
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* Spacer to push messages up and avoid keypad overlap */}
            <div className="h-24 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Spacer to push keypad to bottom */}
      <div className="flex-1 min-h-0" />

      {/* Bottom Section - DTMF Numpad */}
      <div className="flex-shrink-0 pb-2 pt-1">
        <Numpad size="md" className="max-w-[80%] max-h-[30%]" />
      </div>
    </div>
  );
}

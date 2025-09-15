import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { VoiceBubble } from '@/components/shared/VoiceBubble';
import { Avatar } from '@/components/shared/Avatar';
import { getCallerAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
import type { CallSession, Message, Scenario } from '@/contexts/scenario';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { useScenario } from '@/hooks/useScenario';

interface VoiceScreenProps {
  voiceMessages: Message[];
  ownerName: string;
  contactName?: string;
  className?: string;
  maxMessages?: number;
  callDuration?: number;
}

function getRelevantSession(scenario: Scenario, ownerName: string): CallSession | null {
  return scenario.callSessions?.find(s => s.participants.some((p) => p === ownerName)) || null;
}

export function VoiceScreen({
  voiceMessages,
  ownerName,
  contactName = 'Contact',
  className,
  callDuration = 0,
}: VoiceScreenProps) {
  const { resolvedTheme } = useTheme();
  const { state } = useScenario();

  const session = useMemo(() => getRelevantSession(state, ownerName), [state, ownerName]);
  console.log("voice screen session : ", { session, voiceMessages });

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

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show only the messages that belong to the current active call session
  const displayMessages = voiceMessages.filter(m =>
    m.callSession?.id === session?.id &&
    m.callSession?.endTime === null // Only messages from active calls
  );

  // Theme-based styling
  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      avatarBg: 'bg-gray-200',
      avatarBorder: 'border-gray-300',
      keypadOpacity: 'opacity-10',
      keypadColor: 'text-gray-800',
      overlayBg: 'bg-white/20',
      statusText: 'text-gray-500',
    },
    dark: {
      background: 'bg-black',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      avatarBg: 'bg-white/10',
      avatarBorder: 'border-white/20',
      keypadOpacity: 'opacity-5',
      keypadColor: 'text-white/20',
      overlayBg: 'bg-black/20',
      statusText: 'text-gray-500',
    },
  };

  const currentTheme = themeStyles[resolvedTheme];

  return (
    <div className={cn(
      'relative w-full h-full overflow-hidden',
      currentTheme.background,
      className
    )}>
      {/* DTMF Keypad Background Pattern */}
      <div className={cn('absolute inset-0', currentTheme.keypadOpacity)}>
        <div className="grid grid-cols-3 gap-1 p-8 h-full">
          {/* Numbers 1-9 */}
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <div key={num} className={cn('flex items-center justify-center text-2xl font-light', currentTheme.keypadColor)}>
              {num}
            </div>
          ))}
          {/* Bottom row: *, 0, # */}
          <div className={cn('flex items-center justify-center text-2xl font-light', currentTheme.keypadColor)}>*</div>
          <div className={cn('flex items-center justify-center text-2xl font-light', currentTheme.keypadColor)}>0</div>
          <div className={cn('flex items-center justify-center text-2xl font-light', currentTheme.keypadColor)}>#</div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className={cn('absolute inset-0', currentTheme.overlayBg)} />

      {/* Contact info and call status - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-6">
        {/* Contact avatar - using Avatar component with CallSession info */}
        <div className="mx-auto">
          <Avatar
            {...getCallerAvatarProps(session?.callerType)}
            size="lg"
            className={cn(
              'backdrop-blur-sm',
              currentTheme.avatarBg,
              currentTheme.avatarBorder
            )}
          />
        </div>

        {/* Contact name */}
        <div className="text-center">
          <h1 className={cn('text-xl font-light mb-1', currentTheme.textPrimary)}>{contactName}</h1>
          <p className={cn('text-sm', currentTheme.textSecondary)}>Voice Call</p>
        </div>

        {/* Call duration - minimal */}
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 font-mono text-sm font-light">
            {formatDuration(callDuration)}
          </span>
        </div>
      </div>

      {/* Voice messages container - full screen with subtle blur - only when messages exist */}
      {displayMessages.length > 0 && (
        <div className={cn('absolute inset-0 flex flex-col justify-end z-20', currentTheme.overlayBg)}>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-full px-4 py-4">
            <AnimatePresence mode="popLayout">
              {displayMessages.map((voiceMessage) => (
                <VoiceBubble
                  key={voiceMessage.id || voiceMessage.content}
                  message={voiceMessage.content}
                  isOwnMessage={voiceMessage.from === ownerName}
                  senderType={getComponentSenderType(voiceMessage.senderType)}
                  timestamp={voiceMessage.timestamp}
                  className="max-w-[280px] mx-auto relative z-30"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

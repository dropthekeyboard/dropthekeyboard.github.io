import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { getAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
import { useTheme } from '@/hooks/useTheme';

interface VoiceBubbleProps {
  message: string;
  isOwnMessage: boolean;
  senderType?: 'user' | 'ai' | 'agent' | 'server-human';
  timestamp?: number;
  className?: string;
}

function VoiceWaveform({ isPlaying }: { isPlaying?: boolean }) {
  const { resolvedTheme } = useTheme();

  // Theme-based waveform colors for better visibility
  const waveformColors = {
    light: 'bg-gradient-to-t from-blue-600/80 to-blue-500',
    dark: 'bg-gradient-to-t from-blue-400/90 to-blue-300',
  };

  return (
    <div className="flex items-end space-x-1 h-8 px-3 py-2 bg-white/30 backdrop-blur-3xl rounded-full border border-white/40 shadow-lg">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'w-1.5 rounded-full shadow-sm',
            waveformColors[resolvedTheme]
          )}
          animate={
            isPlaying
              ? {
                  height: [6, 16, 6, 20, 6],
                  opacity: [0.6, 1, 0.6, 1, 0.6],
                }
              : { height: 6, opacity: 0.6 }
          }
          transition={{
            duration: 1.2,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function VoiceBubble({
  message,
  isOwnMessage,
  senderType = 'user',
  timestamp,
  className,
}: VoiceBubbleProps) {
  const isPlaying = true; // Voice messages are typically playable by default
  const { resolvedTheme } = useTheme();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Theme-based styling for better contrast
  const bubbleStyles = {
    light: {
      background: 'bg-white/70 border border-white/80',
      overlay: 'from-white/40 via-white/30 to-white/20',
      text: 'text-gray-800',
      mutedText: 'text-gray-600',
    },
    dark: {
      background: 'bg-gray-800/90 border border-gray-700/60',
      overlay: 'from-gray-800/50 via-gray-800/40 to-gray-800/30',
      text: 'text-gray-100',
      mutedText: 'text-gray-300',
    },
  };

  const currentStyle = bubbleStyles[resolvedTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex mb-6 w-full items-end',
        isOwnMessage
          ? 'justify-end pl-12'
          : 'justify-start pr-12',
        className
      )}
    >
      {/* Content wrapper with proper spacing */}
      <div className={cn(
        'flex items-end',
        isOwnMessage ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'
      )}>
        {/* Avatar */}
        <Avatar
          {...getAvatarProps(senderType)}
          size="md"
          className="flex-shrink-0 shadow-md"
        />

        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-2xl',
            currentStyle.background,
            'max-w-[280px] min-w-[160px]',
            'relative overflow-hidden',
            'backdrop-blur-ultra'
          )}
        >
          {/* Ultra-strong glass effect overlay with extreme blur kernel */}
          <div className={cn(
            'absolute inset-0 backdrop-blur-extreme bg-gradient-to-br rounded-2xl',
            currentStyle.overlay
          )} />

          {/* Voice visualization header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
              <VoiceWaveform isPlaying={isPlaying} />
            </div>
            {timestamp && (
              <span className={cn(
                'text-xs font-medium flex-shrink-0',
                currentStyle.mutedText
              )}>
                {formatTime(timestamp)}
              </span>
            )}
          </div>

          {/* Message content */}
          <div className={cn(
            'text-base leading-relaxed font-medium relative z-10',
            currentStyle.text,
            isOwnMessage ? 'text-right' : 'text-left'
          )}>
            {message}
          </div>

          {/* Speaker indicator */}
          <div className={cn(
            'mt-4 text-sm font-medium relative z-10',
            currentStyle.mutedText
          )}>
            {isOwnMessage ? 'You' : 'Contact'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex mb-4 max-w-[75%] items-end space-x-4',
        isOwnMessage
          ? 'justify-end ml-auto flex-row-reverse space-x-reverse'
          : 'justify-start',
        className
      )}
    >
      {/* Avatar */}
      <Avatar
        {...getAvatarProps(senderType)}
        size="md"
        className="flex-shrink-0 shadow-md"
      />

      <div
        className={cn(
          'px-4 py-3 rounded-2xl shadow-2xl',
          'bg-white/50 border border-white/60',
          'max-w-[240px] min-w-[160px]',
          'relative overflow-hidden',
          'backdrop-blur-ultra'
        )}
      >
        {/* Ultra-strong glass effect overlay with extreme blur kernel */}
        <div className="absolute inset-0 backdrop-blur-extreme bg-gradient-to-br from-white/30 via-white/20 to-white/15 rounded-2xl" />

        {/* Voice visualization header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
            <VoiceWaveform isPlaying={isPlaying} />
          </div>
          {timestamp && (
            <span className="text-xs text-muted-foreground font-medium flex-shrink-0">
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        {/* Message content */}
        <div className="text-base leading-relaxed text-foreground font-medium relative z-10">
          {message}
        </div>

        {/* Speaker indicator */}
        <div className="mt-4 text-sm text-muted-foreground font-medium relative z-10">
          {isOwnMessage ? 'You' : 'Contact'}
        </div>
      </div>
    </motion.div>
  );
}

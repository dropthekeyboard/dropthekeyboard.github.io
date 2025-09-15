import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { getAvatarProps } from '@/components/shared/Avatar/avatarHelpers';

interface VoiceBubbleProps {
  message: string;
  isOwnMessage: boolean;
  senderType?: 'user' | 'ai' | 'agent' | 'server-human';
  timestamp?: number;
  className?: string;
}

function VoiceWaveform({ isPlaying }: { isPlaying?: boolean }) {
  return (
    <div className="flex items-end space-x-1 h-6 px-2 py-1 bg-black/20 rounded-full">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full"
          animate={
            isPlaying
              ? {
                  height: [4, 12, 4, 16, 4],
                  opacity: [0.5, 1, 0.5, 1, 0.5],
                }
              : { height: 4, opacity: 0.5 }
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
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex mb-3 max-w-[85%] items-end space-x-2',
        isOwnMessage ? 'justify-end ml-auto flex-row-reverse space-x-reverse' : 'justify-start',
        className
      )}
    >
      {/* Avatar */}
      <Avatar
        {...getAvatarProps(senderType)}
        size="md"
        className="flex-shrink-0"
      />

      <div
        className={cn(
          'px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border',
          'bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-white border-white/40',
          'max-w-[320px] min-w-[200px]',
          isOwnMessage ? 'rounded-bl-md' : 'rounded-br-md'
        )}
      >
        {/* Voice visualization header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-green-300 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/70" />
              )}
              <VoiceWaveform isPlaying={isPlaying} />
            </div>
            <span className="text-xs text-white/70 font-medium">
              Voice Message
            </span>
          </div>
          {timestamp && (
            <span className="text-xs text-white/70">
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        {/* Message content */}
        <div className="text-sm leading-relaxed text-white/90">{message}</div>

        {/* Speaker indicator */}
        <div className="mt-2 text-xs text-white/60">
          {isOwnMessage ? 'You' : 'Contact'}
        </div>
      </div>
    </motion.div>
  );
}

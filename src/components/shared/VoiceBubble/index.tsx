import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceBubbleProps {
  message: string;
  isOwnMessage: boolean;
  timestamp?: number;
  className?: string;
}

function VoiceWaveform({ isPlaying }: { isPlaying?: boolean }) {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-current rounded-full"
          animate={
            isPlaying
              ? {
                  height: [3, 8, 3, 12, 3],
                  opacity: [0.7, 1, 0.7, 1, 0.7],
                }
              : { height: 3, opacity: 0.7 }
          }
          transition={{
            duration: 0.8,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.1,
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
  timestamp,
  className,
}: VoiceBubbleProps) {
  const isPlaying = false; // For now, always show as not playing

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
        'flex mb-3 max-w-[85%]',
        isOwnMessage ? 'justify-start' : 'justify-end',
        className
      )}
    >
      <div
        className={cn(
          'px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm',
          'bg-white/20 text-white border border-white/30',
          'max-w-[280px]',
          isOwnMessage ? 'rounded-bl-md' : 'rounded-br-md'
        )}
      >
        {/* Voice visualization header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-white/80" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/60" />
            )}
            <VoiceWaveform isPlaying={isPlaying} />
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

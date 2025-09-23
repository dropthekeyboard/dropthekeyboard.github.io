import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { getEntityAvatarProps, getMessageAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
import { useTheme } from '@/hooks/useTheme';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMarkdownComponents } from '@/lib/markdownComponents';
import type { VoiceBubbleProps } from '@/types/message';

function VoiceWaveform({ isPlaying, variant = 'default' }: { isPlaying?: boolean; variant?: 'default' | 'program' }) {
  const { resolvedTheme } = useTheme();

  // Theme-based waveform colors for better visibility
  const waveformColors = {
    light: {
      default: 'bg-gradient-to-t from-blue-600/80 to-blue-500',
      program: 'bg-gradient-to-t from-green-600/80 to-green-500',
    },
    dark: {
      default: 'bg-gradient-to-t from-blue-400/90 to-blue-300',
      program: 'bg-gradient-to-t from-green-400/90 to-green-300',
    },
  };

  return (
    <div className={cn(
      "flex items-end space-x-1 h-8 px-3 py-2 rounded-full border shadow-lg backdrop-blur-3xl",
      variant === 'program' 
        ? "bg-green-50/30 border-green-200/40" 
        : "bg-white/30 border-white/40"
    )}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'w-1.5 rounded-full shadow-sm',
            waveformColors[resolvedTheme][variant]
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
  enableMarkdown = false,
  markdownOptions = {
    allowHtml: false,
    linkTarget: '_blank',
    enableGfm: true,
  },
  entity,
  messageFrom,
  ownerName,
  messageFromEntity,
  variant = 'default',
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
      default: {
        background: 'bg-white/20 border border-white/40',
        overlay: 'from-white/15 via-white/12 to-white/8',
        text: 'text-gray-900',
        mutedText: 'text-gray-700',
      },
      program: {
        background: 'bg-green-50/30 border border-green-200/50',
        overlay: 'from-green-50/20 via-green-50/15 to-green-50/10',
        text: 'text-gray-900',
        mutedText: 'text-green-800',
      },
    },
    dark: {
      default: {
        background: 'bg-gray-900/25 border border-gray-600/40',
        overlay: 'from-gray-900/20 via-gray-900/15 to-gray-900/10',
        text: 'text-gray-50',
        mutedText: 'text-gray-200',
      },
      program: {
        background: 'bg-green-900/30 border border-green-600/50',
        overlay: 'from-green-900/25 via-green-900/20 to-green-900/15',
        text: 'text-gray-50',
        mutedText: 'text-green-200',
      },
    },
  };

  const currentStyle = bubbleStyles[resolvedTheme][variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex mb-6 w-full items-end',
        isOwnMessage ? 'justify-end pl-12' : 'justify-start pr-12',
        className
      )}
    >
      {/* Content wrapper with proper spacing */}
      <div
        className={cn(
          'flex items-end',
          isOwnMessage
            ? 'flex-row-reverse space-x-reverse space-x-3'
            : 'space-x-3'
        )}
      >
        {/* Avatar */}
        <Avatar
          {...(messageFrom && ownerName
            ? getMessageAvatarProps(messageFrom, ownerName, messageFromEntity, senderType)
            : getEntityAvatarProps(entity, senderType) // fallback to existing logic
          )}
          size="lg"
          className="flex-shrink-0 shadow-md"
        />

        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-2xl',
            currentStyle.background,
            'max-w-[280px] min-w-[160px]',
            'relative overflow-hidden',
            'backdrop-blur-sm'
          )}
        >
          {/* Ultra-strong glass effect overlay with extreme blur kernel */}
          <div
            className={cn('absolute inset-0 rounded-2xl z-0', currentStyle.overlay)}
          />

          {/* Voice visualization header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
              <VoiceWaveform isPlaying={isPlaying} variant={variant} />
            </div>
            {timestamp && (
              <span
                className={cn(
                  'text-xs font-medium flex-shrink-0',
                  currentStyle.mutedText
                )}
              >
                {formatTime(timestamp)}
              </span>
            )}
          </div>

          {/* Message content */}
          {enableMarkdown ? (
            <div
              className={cn(
                'text-base leading-relaxed font-medium relative z-10 message-markdown',
                currentStyle.text,
                isOwnMessage ? 'text-right' : 'text-left'
              )}
            >
              <ReactMarkdown
                remarkPlugins={markdownOptions.enableGfm ? [remarkGfm] : []}
                components={getMarkdownComponents()}
                disallowedElements={
                  markdownOptions.allowHtml
                    ? []
                    : ['script', 'iframe', 'object', 'embed']
                }
              >
                {message}
              </ReactMarkdown>
            </div>
          ) : (
            <div
              className={cn(
                'text-base leading-relaxed font-medium relative z-10',
                currentStyle.text,
                isOwnMessage ? 'text-right' : 'text-left'
              )}
            >
              {message}
            </div>
          )}

          {/* Speaker indicator */}
          <div
            className={cn(
              'mt-4 text-sm font-medium relative z-10',
              currentStyle.mutedText
            )}
          >
            {isOwnMessage ? 'You' : 'Contact'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

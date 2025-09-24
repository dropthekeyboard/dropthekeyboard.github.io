import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { getEntityAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
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
  fromEntity,
  ownerEntity,
  timestamp,
  className,
  enableMarkdown = false,
  markdownOptions = {
    allowHtml: false,
    linkTarget: '_blank',
    enableGfm: true,
  },
  variant = 'default',
}: VoiceBubbleProps) {
  const isPlaying = true; // Voice messages are typically playable by default
  const { resolvedTheme } = useTheme();

  // 발신자 여부 판별
  const isOwnMessage = fromEntity.name === ownerEntity.name;

  // Avatar props 생성 (항상 fromEntity 기준)
  const avatarProps = getEntityAvatarProps(fromEntity, isOwnMessage ? 'user' : 'ai');

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Theme-based styling for better contrast
  const bubbleStyles = {
    light: {
      default: {
        background: 'bg-gray-200/95 border border-gray-300/80',
        overlay: 'from-transparent via-transparent to-transparent',
        text: 'text-gray-900',
        mutedText: 'text-gray-700',
      },
      program: {
        background: 'bg-green-200/95 border border-green-400/80',
        overlay: 'from-transparent via-transparent to-transparent',
        text: 'text-gray-900',
        mutedText: 'text-green-800',
      },
    },
    dark: {
      default: {
        background: 'bg-gray-800/95 border border-gray-600/80',
        overlay: 'from-gray-800/10 via-gray-800/5 to-transparent',
        text: 'text-gray-50',
        mutedText: 'text-gray-200',
      },
      program: {
        background: 'bg-green-800/95 border border-green-600/80',
        overlay: 'from-green-800/10 via-green-800/5 to-transparent',
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
          {...avatarProps}
          size="lg"
          className="flex-shrink-0 shadow-md"
        />

        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-2xl',
            currentStyle.background,
            'max-w-[280px] min-w-[160px]',
            'relative overflow-hidden'
          )}
        >
          {/* Ultra-strong glass effect overlay with extreme blur kernel */}
          <div
            className={cn('absolute inset-0 rounded-2xl z-0', currentStyle.overlay)}
          />

          {/* Voice visualization header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-3">
              <Phone
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-gray-200'
                )}
              />
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
                className={currentStyle.text}
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
              style={{ color: 'inherit' }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

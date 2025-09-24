import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { getEntityAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/hooks/useTheme';
import { getMarkdownComponents } from '@/lib/markdownComponents';
import type { MessageBubbleProps } from '@/types/message';

// 말풍선 꼬리를 위한 SVG 컴포넌트
const BubbleTail = ({ isSender, isLight }: { isSender: boolean; isLight: boolean }) => (
  <svg
    className={`absolute bottom-0 w-2 h-2 ${
      isSender 
        ? `right-0 -mr-1 ${isLight ? 'text-blue-500' : 'text-blue-400'}`
        : `left-0 -ml-1 ${isLight ? 'text-gray-200' : 'text-gray-600'}`
    }`}
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d={isSender ? "M0 8 C4 8 8 4 8 0 Z" : "M8 8 C4 8 0 4 0 0 Z"}
    />
  </svg>
);

export function MessageBubble({
  message,
  isOwnMessage,
  senderType = 'user',
  isTyping = false,
  timestamp,
  isRead = false,
  enableMarkdown = false,
  markdownOptions = {
    allowHtml: false,
    linkTarget: '_blank',
    enableGfm: true,
  },
  messageFromEntity,
}: MessageBubbleProps) {
  const { isLight } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      }}
      className={cn(
        'flex w-full items-end',
        isOwnMessage ? 'justify-end pl-12' : 'justify-start pr-12'
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
          {...getEntityAvatarProps(messageFromEntity, senderType)}
          size="md"
          className="flex-shrink-0"
        />

        <div className="flex flex-col">
          <div className="relative max-w-[280px]">
            <div
              className={cn(
                'relative px-4 py-2 break-words shadow-lg',
                isOwnMessage
                  ? `bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl rounded-br-md`
                  : isLight
                    ? 'bg-gray-200 text-black rounded-r-2xl rounded-tl-2xl rounded-bl-md'
                    : 'bg-gray-600 text-white rounded-r-2xl rounded-tl-2xl rounded-bl-md'
              )}
            >
              {isTyping ? (
                <div className="flex items-center space-x-1">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                  />
                </div>
              ) : enableMarkdown ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className={cn(
                  'text-sm leading-relaxed message-markdown',
                  'text-left'
                )}
              >
                {message.type === 'image' && message.imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full max-w-sm mx-auto">
                      <img
                        src={message.imageUrl}
                        alt={message.content || '이미지'}
                        className="w-full h-auto rounded-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    {message.content && (
                      <div className="text-sm text-muted-foreground text-center">{message.content}</div>
                    )}
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={markdownOptions.enableGfm ? [remarkGfm] : []}
                    components={getMarkdownComponents()}
                    disallowedElements={
                      markdownOptions.allowHtml
                        ? []
                        : ['script', 'iframe', 'object', 'embed']
                    }
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </motion.div>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className={cn(
                  'text-sm leading-relaxed',
                  'text-left'
                )}
              >
                {message.type === 'image' && message.imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full max-w-sm mx-auto">
                      <img
                        src={message.imageUrl}
                        alt={message.content || '이미지'}
                        className="w-full h-auto rounded-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    {message.content && (
                      <div className="text-sm text-muted-foreground text-center">{message.content}</div>
                    )}
                  </div>
                ) : (
                  message.content
                )}
              </motion.span>
            )}
          </div>
          <BubbleTail isSender={isOwnMessage} isLight={isLight} />
        </div>

          {/* Timestamp and read status */}
          {(timestamp || isOwnMessage) && !isTyping && (
            <div
              className={cn(
                'flex items-center mt-1 text-xs text-muted-foreground/60',
                isOwnMessage ? 'justify-end' : 'justify-start'
              )}
            >
              {timestamp && (
                <span className="mr-1">
                  {new Date(timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
              {isOwnMessage && (
                <CheckCheck
                  className={cn(
                    'w-3 h-3 transition-colors',
                    isRead ? 'text-blue-500' : 'text-muted-foreground/60'
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

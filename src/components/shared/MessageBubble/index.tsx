import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  isOwnMessage: boolean;
  isTyping?: boolean;
  timestamp?: number;
  isRead?: boolean;
}

export function MessageBubble({
  message,
  isOwnMessage,
  isTyping = false,
  timestamp,
  isRead = false,
}: MessageBubbleProps) {
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
        'flex mb-3 max-w-[80%]',
        isOwnMessage ? 'justify-end ml-auto' : 'justify-start'
      )}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            'relative px-4 py-2 rounded-2xl break-words shadow-sm',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-muted-foreground rounded-bl-md'
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
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-sm leading-relaxed"
            >
              {message}
            </motion.span>
          )}
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
    </motion.div>
  );
}

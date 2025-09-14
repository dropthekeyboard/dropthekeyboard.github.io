import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import { MessageBubble } from '@/components/shared/MessageBubble';
import type { Message } from '@/contexts/scenario';

interface MessageScreenProps {
  messages: Message[];
  isTyping?: boolean;
  ownerName: string;
  contactName?: string;
  contactStatus?: string;
  className?: string;
}

export function MessageScreen({
  messages,
  isTyping = false,
  contactName = 'Contact',
  ownerName,
  contactStatus = 'Online',
  className,
}: MessageScreenProps) {
  return (
    <div className={cn('w-full h-full bg-background flex flex-col', className)}>
      {/* Message header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
        <div className="flex items-center space-x-3">
          {/* Contact avatar */}
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-medium text-sm">{contactName}</h3>
            <p className="text-xs text-muted-foreground">{contactStatus}</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full" />
        ) : (
          <>
            {/* Sort messages by timestamp to ensure chronological order */}
            {[...messages]
              .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
              .map((msg, index) => (
                <motion.div
                  key={`${msg.timestamp}-${msg.content}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MessageBubble
                    message={msg.content}
                    isOwnMessage={msg.to === ownerName}
                    timestamp={msg.timestamp}
                    isRead={msg.to === 'user'}
                  />
                </motion.div>
              ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <MessageBubble message="" isOwnMessage={false} isTyping={true} />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Message input area */}
      <div className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 bg-muted/50 border border-border/50 rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                readOnly
              />
            </div>
            <button className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Send, MessageCircle, ChevronLeft, Video } from 'lucide-react';
import { MessageBubble } from '@/components/shared/MessageBubble';
import { findEntityByName, getEntityAvatarProps } from '@/components/shared/Avatar/avatarHelpers';
import { useTheme } from '@/hooks/useTheme';
import type { Message, Entity } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { useEffect, useRef } from 'react';

interface MessageScreenProps {
  messages: Message[];
  isTyping?: boolean;
  ownerName: string;
  contactName?: string;
  className?: string;
  entity?: Entity | null;
}

export function MessageScreen({
  messages,
  isTyping = false,
  contactName = 'Contact',
  ownerName,
  className,
  entity,
}: MessageScreenProps) {
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { state } = useScenario();

  // Auto-scroll to bottom when messages change or typing state changes - with scroll isolation
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;

      // Use setTimeout to batch scroll updates and avoid interference with ScrollTrigger
      const timeoutId = setTimeout(() => {
        // Directly set scrollTop to avoid triggering scroll events that affect parent containers
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        if (maxScrollTop > 0) {
          container.scrollTop = maxScrollTop;
        }
      }, 16); // One frame delay to avoid immediate scroll event conflicts

      return () => clearTimeout(timeoutId);
    }
  }, [messages, isTyping]);

  // Helper function to convert scenario senderType to component senderType
  const getComponentSenderType = (
    senderType?: 'agent' | 'customer' | 'server'
  ): 'user' | 'ai' | 'agent' | 'server-human' => {
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

  // Find the appropriate entity for header avatar
  // Priority: 1) If owner sent a message, show the recipient (msg.to)
  //          2) Otherwise, show the sender of received messages (msg.from)
  const sentMessage = messages.find(msg => msg.from === ownerName);
  const receivedMessage = messages.find(msg => msg.from !== ownerName);

  let headerEntity = null;
  let headerSenderType = undefined;

  if (sentMessage) {
    // Owner sent a message - show the recipient
    headerEntity = findEntityByName(state, sentMessage.to);
    headerSenderType = getComponentSenderType(sentMessage.senderType);
  } else if (receivedMessage) {
    // No sent messages - show the sender of received messages
    headerEntity = findEntityByName(state, receivedMessage.from);
    headerSenderType = getComponentSenderType(receivedMessage.senderType);
  }

  const headerAvatarProps = getEntityAvatarProps(headerEntity, headerSenderType);

  return (
    <div className={cn('w-full h-full bg-background flex flex-col', className)}>
      {/* iPhone-style Message Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md">
        {/* Back button */}
        <div className="w-8">
          <ChevronLeft className="h-7 w-7 text-blue-500 cursor-pointer" strokeWidth={3} />
        </div>

        {/* Contact info */}
        <div className="flex flex-col items-center cursor-pointer">
          {headerEntity?.avatarUrl ? (
            <img 
              src={headerEntity.avatarUrl} 
              alt={headerEntity.displayName || headerEntity.name || contactName} 
              className="w-10 h-10 rounded-full" 
            />
          ) : headerAvatarProps.src ? (
            <img 
              src={headerAvatarProps.src} 
              alt={headerAvatarProps.alt} 
              className="w-10 h-10 rounded-full" 
            />
          ) : headerAvatarProps.fallbackIcon ? (
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <headerAvatarProps.fallbackIcon className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex items-center mt-1">
            <p className={cn(
              "font-semibold text-base",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {headerEntity?.displayName || headerEntity?.name || contactName}
            </p>
            <ChevronLeft className="h-4 w-4 text-gray-400 ml-0.5 rotate-180" strokeWidth={2.5} />
          </div>
        </div>

        {/* Video call button */}
        <div className="w-8">
          <Video className="h-7 w-7 text-blue-500 cursor-pointer" strokeWidth={2} />
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="h-full" />
        ) : (
          <div className="w-full">
            {/* Sort messages by timestamp to ensure chronological order */}
            {[...messages]
              .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
              .map((msg, index) => {
                const messageFromEntity = findEntityByName(state, msg.from);
                console.log(`📱 MessageScreen: Processing message from "${msg.from}" to "${msg.to}"`);
                console.log(`📱 MessageScreen: ownerName="${ownerName}", isOwnMessage=${msg.from === ownerName}`);
                console.log(`📱 MessageScreen: messageFromEntity=`, messageFromEntity);

                return (
                  <motion.div
                    key={`${msg.timestamp}-${msg.content}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full mb-3"
                  >
                    <MessageBubble
                      message={msg}
                      isOwnMessage={msg.from === ownerName}
                      senderType={getComponentSenderType(msg.senderType)}
                      timestamp={msg.timestamp}
                      isRead={msg.to === 'user'}
                      enableMarkdown={true}
                      entity={entity}
                      messageFrom={msg.from}
                      ownerName={ownerName}
                      messageFromEntity={messageFromEntity}
                    />
                  </motion.div>
                );
              })}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full mb-3"
              >
                <MessageBubble
                  message={{
                    id: 'typing',
                    from: contactName,
                    to: ownerName,
                    content: '',
                    type: 'text',
                    senderType: 'agent',
                    timestamp: Date.now(),
                  }}
                  isOwnMessage={false}
                  isTyping={true}
                />
              </motion.div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
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

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageBubble } from "@/components/shared/MessageBubble";
import type { Message } from "@/contexts/scenario";

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
  contactName = "Contact",
  ownerName,
  contactStatus = "Online",
  className,
}: MessageScreenProps) {
  return (
    <div
      className={cn(
        "w-full h-full bg-background flex flex-col",
        className,
      )}
    >
      {/* Message header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
        <div className="flex items-center space-x-3">
          {/* Contact avatar */}
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm">💬</span>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-medium text-sm">{contactName}</h3>
            <p className="text-xs text-muted-foreground">{contactStatus}</p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center space-x-2">
          <button className="text-muted-foreground hover:text-foreground">
            <span className="text-lg">📞</span>
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <span className="text-lg">📹</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Messages will appear here during the demo
            </p>
          </motion.div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={msg.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MessageBubble
              message={msg.content}
              isOwnMessage={msg.to === ownerName}
              timestamp={msg.timestamp}
              isRead={msg.to === "user"}
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
            <MessageBubble
              message=""
              isOwnMessage={false}
              isTyping={true}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

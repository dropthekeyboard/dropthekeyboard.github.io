import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { MessageBubble } from "@/components/shared/MessageBubble";
import { InputBox } from "@/components/shared/InputBox";
import { useScenarioStore } from "@/stores/scenarioStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Message } from "@/types";

export function LeftSection() {
  const { leftSectionState, updateLeftSection } = useScenarioStore();

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: Date.now(),
    };

    updateLeftSection({
      messages: [...leftSectionState.messages, newMessage],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("left-section", "relative overflow-hidden")}
    >
      <PhoneFrame variant="user">
        <div className="flex flex-col h-full">
          {/* Messages area */}
          <div className="flex-1 overflow-hidden">
            <div className="message-list">
              {leftSectionState.messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center justify-center h-full text-center p-4"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Messages will appear here during the demo
                  </p>
                </motion.div>
              )}

              {leftSectionState.messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MessageBubble
                    message={msg.content}
                    isOwnMessage={msg.sender === "user"}
                    timestamp={msg.timestamp}
                    isRead={msg.sender === "user"}
                  />
                </motion.div>
              ))}

              {/* Typing indicator */}
              {leftSectionState.isTyping && (
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

          {/* Input area */}
          <div className="border-t border-border/50">
            <InputBox
              onSend={handleSendMessage}
              placeholder="Type a message..."
              disabled={leftSectionState.isTyping}
              variant="message"
            />
          </div>
        </div>
      </PhoneFrame>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
          User Phone
        </div>
      </motion.div>

      {/* Call state indicator */}
      {leftSectionState.callState !== "idle" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
        >
          <div className="text-center text-white">
            <div className="text-2xl mb-2">📞</div>
            <div className="text-lg font-medium capitalize">
              {leftSectionState.callState}
            </div>
            {leftSectionState.callState === "ringing" && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-sm mt-2 opacity-75"
              >
                Incoming call...
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

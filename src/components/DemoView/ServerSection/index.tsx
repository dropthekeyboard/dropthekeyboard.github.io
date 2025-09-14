import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { MessageScreen } from "@/components/shared/MessageScreen";
import { CallScreen } from "@/components/shared/CallScreen";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScenario } from "@/hooks/useScenario";
import type { Message } from "@/contexts/scenario";

export function ServerSection() {
  const { active: { server } } = useScenario();

  // Collect all messages from server's messageBox
  const allMessages: Message[] = Object.values(server?.messageBox || {}).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages
    .filter(msg => msg.type === "text");

  const voiceMessages: Message[] = allMessages
    .filter(msg => msg.type === "voice");

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("right-section", "relative overflow-hidden")}
    >
      <PhoneFrame>
        {server?.state === "call" ? (
          <CallScreen
            contactName="Service Provider"
            ownerName={server?.name || "Service Provider"}
            contactNumber="+1 (800) 555-0199"
            callDuration={0}
            voiceMessages={voiceMessages}
          />
        ) : (
          <MessageScreen
            messages={textMessages}
            isTyping={false}
            ownerName={server?.name || "Service Provider"}
            contactName="Service Provider"
            contactStatus="Available"
          />
        )}
      </PhoneFrame>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
          Service Provider
        </div>
      </motion.div>

      {/* Service provider status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded"
      >
        {allMessages.length > 0 ? "Online" : "Available"}
      </motion.div>
    </motion.div>
  );
}

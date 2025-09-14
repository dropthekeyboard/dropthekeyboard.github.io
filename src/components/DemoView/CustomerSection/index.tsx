import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { MessageScreen } from "@/components/shared/MessageScreen";
import { CallScreen } from "@/components/shared/CallScreen";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScenario } from "@/hooks/useScenario";
import type { Message } from "@/contexts/scenario";
import { IncomingCallOverlay } from "./IncomingCallOverlay";

export function CustomerSection() {
  const { state: { customer }, active: { agent } } = useScenario();

  // Collect all messages from customer's messageBox
  const allMessages = Object.values(customer.messageBox).flat();

  // Separate messages by type
  const textMessages: Message[] = allMessages
    .filter(msg => msg.type === "text");

  const voiceMessages: Message[] = allMessages
    .filter(msg => msg.type === "voice");

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("left-section", "relative overflow-hidden")}
    >
      <PhoneFrame>
        {customer.state === "call" ? (
          <CallScreen
            contactName={agent?.name}
            ownerName={customer.name}
            contactNumber="+1 (555) 123-4567"
            callDuration={0}
            voiceMessages={voiceMessages}
          />
        ) : (
          <MessageScreen
            messages={textMessages}
            isTyping={false}
            ownerName={customer.name}
            contactName={agent?.name}
            contactStatus="Online"
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
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
          User Phone
        </div>
      </motion.div>

      {/* Call state indicator */}
      <IncomingCallOverlay state={customer.state} />
    </motion.div>
  );
}

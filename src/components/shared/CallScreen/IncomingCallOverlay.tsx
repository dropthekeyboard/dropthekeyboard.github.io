import { motion } from "framer-motion";
import type { PhoneState } from "@/contexts/scenario";

interface IncomingCallOverlayProps {
  state: PhoneState;
}

export function IncomingCallOverlay({ state }: IncomingCallOverlayProps) {
  if (state === "message") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
    >
      <div className="text-center text-white">
        <div className="text-2xl mb-2">📞</div>
        <div className="text-lg font-medium capitalize">
          {state}
        </div>
        {state === "ring" && (
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
  );
}
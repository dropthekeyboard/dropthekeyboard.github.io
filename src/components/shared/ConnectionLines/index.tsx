import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useScenarioStore } from "@/stores/scenarioStore";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";

interface ConnectionLinesProps {
  className?: string;
  showLabels?: boolean;
}

export function ConnectionLines({
  className,
  showLabels = false,
}: ConnectionLinesProps) {
  const { centerSectionState } = useScenarioStore();

  const leftActive = centerSectionState.connectionLeft;
  const rightActive = centerSectionState.connectionRight;

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Left connection line */}
      <AnimatePresence>
        {leftActive && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-0 top-1/2 w-1/2 h-0.5 origin-left"
            style={{ transform: "translateY(-50%)" }}
          >
            {/* Base line */}
            <div className="w-full h-full bg-gradient-to-r from-primary/60 to-primary rounded-full relative overflow-hidden">
              {/* Animated flow particles */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Data packets */}
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 w-2 h-2 bg-primary rounded-full shadow-lg"
                  style={{ transform: "translateY(-50%)" }}
                  animate={{
                    x: [0, "calc(100% + 8px)"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Connection node at center */}
            <motion.div
              className="absolute right-0 top-1/2 w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground shadow-lg"
              style={{ transform: "translate(50%, -50%)" }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0px rgba(59, 130, 246, 0.4)",
                  "0 0 0 8px rgba(59, 130, 246, 0)",
                  "0 0 0 0px rgba(59, 130, 246, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Direction indicator */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-3 h-3 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right connection line */}
      <AnimatePresence>
        {rightActive && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute right-0 top-1/2 w-1/2 h-0.5 origin-right"
            style={{ transform: "translateY(-50%)" }}
          >
            {/* Base line */}
            <div className="w-full h-full bg-gradient-to-l from-green-500/60 to-green-500 rounded-full relative overflow-hidden">
              {/* Animated flow particles */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["100%", "-100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Data packets */}
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 right-0 w-2 h-2 bg-green-500 rounded-full shadow-lg"
                  style={{ transform: "translateY(-50%)" }}
                  animate={{
                    x: [0, "calc(-100% - 8px)"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Connection node at center */}
            <motion.div
              className="absolute left-0 top-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"
              style={{ transform: "translate(-50%, -50%)" }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0px rgba(34, 197, 94, 0.4)",
                  "0 0 0 8px rgba(34, 197, 94, 0)",
                  "0 0 0 0px rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Direction indicator */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{
                  x: [0, -4, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowLeft className="w-3 h-3 text-green-500" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central energy hub */}
      <AnimatePresence>
        {(leftActive || rightActive) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {/* Energy burst effect */}
            <motion.div
              className="relative w-6 h-6"
              animate={{
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Zap className="w-full h-full text-yellow-500 drop-shadow-lg" />

              {/* Energy rings */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border border-yellow-500/40 rounded-full"
                  animate={{
                    scale: [1, 2.5],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.75,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection labels */}
      {showLabels && (
        <>
          {leftActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-4 top-1/2 transform -translate-y-8 px-2 py-1 bg-primary/20 rounded text-xs text-primary font-medium"
            >
              User → AI Agent
            </motion.div>
          )}
          {rightActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-4 top-1/2 transform -translate-y-8 px-2 py-1 bg-green-500/20 rounded text-xs text-green-600 font-medium"
            >
              AI Agent → Service
            </motion.div>
          )}
        </>
      )}

      {/* Ambient glow effect */}
      {(leftActive || rightActive) && (
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
      )}
    </div>
  );
}

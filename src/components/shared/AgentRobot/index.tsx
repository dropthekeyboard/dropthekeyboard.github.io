import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Brain, Zap, MessageSquare, Phone } from "lucide-react";
import { useScenarioStore } from "@/stores/scenarioStore";

interface AgentRobotProps {
  size?: number;
  className?: string;
  variant?: "idle" | "thinking" | "processing" | "communicating" | "calling";
}

export function AgentRobot({
  size = 60,
  className,
  variant = "idle",
}: AgentRobotProps) {
  const { centerSectionState } = useScenarioStore();

  // Determine variant based on agent state if not explicitly provided
  const currentVariant = centerSectionState.isThinking
    ? "thinking"
    : centerSectionState.progressPercent > 0 &&
        centerSectionState.progressPercent < 100
      ? "processing"
      : centerSectionState.connectionLeft || centerSectionState.connectionRight
        ? "communicating"
        : variant;

  const variants = {
    idle: {
      scale: 1,
      rotate: 0,
      opacity: 0.8,
    },
    thinking: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      opacity: 1,
    },
    processing: {
      scale: 1.1,
      rotate: 360,
      opacity: 1,
    },
    communicating: {
      scale: [1, 1.08, 1],
      opacity: [0.8, 1, 0.8],
    },
    calling: {
      scale: 1.05,
      rotate: [0, 5, -5, 0],
      opacity: 1,
    },
  };

  const iconVariants = {
    idle: { y: 0 },
    thinking: { y: [-2, 0, -2] },
    processing: { rotate: 180 },
    communicating: { scale: [1, 1.2, 1] },
    calling: { scale: [1, 1.1, 1] },
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Main robot container */}
      <motion.div
        className="relative"
        variants={variants}
        animate={currentVariant}
        transition={{
          duration: currentVariant === "processing" ? 2 : 1.5,
          repeat: currentVariant !== "idle" ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{ width: size, height: size }}
      >
        {/* Robot body */}
        <div className="relative w-full h-full">
          {/* Main body circle */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/60 rounded-full border-2 border-primary/50 shadow-lg"
            animate={{
              borderColor:
                currentVariant === "processing"
                  ? ["#3b82f6", "#06b6d4", "#10b981", "#3b82f6"]
                  : "#3b82f6",
            }}
            transition={{
              duration: 2,
              repeat: currentVariant === "processing" ? Infinity : 0,
            }}
          />

          {/* Inner glow */}
          <motion.div
            className="absolute inset-2 bg-primary/10 dark:bg-primary/20 rounded-full"
            animate={{
              scale: currentVariant === "thinking" ? [1, 1.1, 1] : 1,
              opacity:
                currentVariant === "communicating" ? [0.5, 0.8, 0.5] : 0.8,
            }}
            transition={{
              duration: 1.5,
              repeat:
                currentVariant === "thinking" ||
                currentVariant === "communicating"
                  ? Infinity
                  : 0,
            }}
          />

          {/* Main icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVariant}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  variants={iconVariants}
                  animate={currentVariant}
                  transition={{
                    duration: 1,
                    repeat: currentVariant !== "idle" ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {currentVariant === "thinking" && (
                    <Brain className="w-6 h-6 text-primary" />
                  )}
                  {currentVariant === "processing" && (
                    <Zap className="w-6 h-6 text-yellow-500" />
                  )}
                  {currentVariant === "communicating" && (
                    <MessageSquare className="w-6 h-6 text-green-500" />
                  )}
                  {currentVariant === "calling" && (
                    <Phone className="w-6 h-6 text-blue-500" />
                  )}
                  {currentVariant === "idle" && (
                    <Bot className="w-6 h-6 text-primary" />
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Eyes */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{
                opacity: currentVariant === "thinking" ? [1, 0.3, 1] : 1,
                scale: currentVariant === "processing" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat:
                  currentVariant === "thinking" ||
                  currentVariant === "processing"
                    ? Infinity
                    : 0,
              }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{
                opacity: currentVariant === "thinking" ? [1, 0.3, 1] : 1,
                scale: currentVariant === "processing" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat:
                  currentVariant === "thinking" ||
                  currentVariant === "processing"
                    ? Infinity
                    : 0,
                delay: 0.1,
              }}
            />
          </div>

          {/* Activity indicators */}
          {currentVariant === "processing" && (
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/40 rounded-full"
                  style={{
                    top: `${30 + i * 15}%`,
                    left: "15%",
                  }}
                  animate={{
                    x: [0, size * 0.7, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Thinking particles */}
          {currentVariant === "thinking" && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/60 rounded-full"
                  style={{
                    left: `${i * 8 - 8}px`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Energy rings for communication */}
        {(currentVariant === "communicating" ||
          currentVariant === "calling") && (
          <div className="absolute inset-0">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-primary/30 rounded-full"
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Status label */}
      {centerSectionState.currentProcess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground whitespace-nowrap"
        >
          {centerSectionState.currentProcess}
        </motion.div>
      )}
    </div>
  );
}

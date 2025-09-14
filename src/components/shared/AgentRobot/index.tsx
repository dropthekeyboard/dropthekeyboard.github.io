import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface AgentRobotProps {
  size?: number;
  className?: string;
  isThinking?: boolean;
}

export function AgentRobot({
  size = 60,
  className,
  isThinking = false,
}: AgentRobotProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Main robot container */}
      <motion.div
        className="relative"
        animate={{
          rotate: isThinking ? [0, 360] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isThinking ? Infinity : 0,
          ease: "linear",
        }}
        style={{ width: size, height: size }}
        data-testid="agent-robot-container"
      >
        {/* Robot body */}
        <div className="relative w-full h-full" data-testid="robot-body">
          {/* Main body circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/60 rounded-full border-2 border-primary/50 shadow-lg" />

          {/* Inner glow */}
          <div className="absolute inset-2 bg-primary/10 dark:bg-primary/20 rounded-full" />

          {/* Main icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-testid="main-icon"
          >
            <Bot className="w-6 h-6 text-primary" data-testid="bot-icon" />
          </div>

          {/* Simple eyes */}
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
            data-testid="robot-eyes"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

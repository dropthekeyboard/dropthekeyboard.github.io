import { AgentRobot } from "@/components/shared/AgentRobot";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { ConnectionLines } from "@/components/shared/ConnectionLines";
import { useScenarioStore } from "@/stores/scenarioStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, MessageSquare, CheckCircle } from "lucide-react";

export function CenterSection() {
  const { centerSectionState, currentScenario } = useScenarioStore();

  const getStatusColor = () => {
    if (centerSectionState.isThinking) return "text-yellow-500";
    if (
      centerSectionState.progressPercent > 0 &&
      centerSectionState.progressPercent < 100
    )
      return "text-blue-500";
    if (centerSectionState.progressPercent === 100) return "text-green-500";
    return "text-muted-foreground";
  };

  const getStatusIcon = () => {
    if (centerSectionState.isThinking) return Brain;
    if (
      centerSectionState.progressPercent > 0 &&
      centerSectionState.progressPercent < 100
    )
      return Zap;
    if (centerSectionState.progressPercent === 100) return CheckCircle;
    if (centerSectionState.connectionLeft || centerSectionState.connectionRight)
      return MessageSquare;
    return Brain;
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "center-section",
        "relative overflow-hidden flex flex-col items-center justify-center",
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      {/* Connection lines */}
      <AnimatePresence>
        {(centerSectionState.connectionLeft ||
          centerSectionState.connectionRight) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <ConnectionLines showLabels />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Agent display */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Progress circle with robot */}
        <div className="relative">
          <ProgressCircle
            progress={centerSectionState.progressPercent}
            size={160}
            strokeWidth={6}
            showPercentage={centerSectionState.progressPercent > 0}
            color={
              centerSectionState.progressPercent === 100
                ? "success"
                : centerSectionState.progressPercent > 0
                  ? "primary"
                  : "primary"
            }
            className="relative"
          >
            <AgentRobot size={80} />
          </ProgressCircle>

          {/* Status indicator */}
          <motion.div
            animate={{
              scale: centerSectionState.isThinking ? [1, 1.1, 1] : 1,
              opacity: centerSectionState.isThinking ? [1, 0.7, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: centerSectionState.isThinking ? Infinity : 0,
            }}
            className={cn(
              "absolute -bottom-2 -right-2 w-8 h-8",
              "bg-background border-2 border-border rounded-full",
              "flex items-center justify-center",
              getStatusColor(),
            )}
          >
            <StatusIcon className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Current process display */}
        <AnimatePresence mode="wait">
          {centerSectionState.currentProcess && (
            <motion.div
              key={centerSectionState.currentProcess}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-[250px]"
            >
              <div className="px-4 py-2 bg-card border border-border rounded-lg shadow-sm">
                <p className="text-sm font-medium text-foreground mb-1">
                  AI Agent Status
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {centerSectionState.currentProcess}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection status indicators */}
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{
              opacity: centerSectionState.connectionLeft ? 1 : 0.3,
              scale: centerSectionState.connectionLeft ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-1 text-xs"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                centerSectionState.connectionLeft
                  ? "bg-blue-500 animate-pulse"
                  : "bg-muted",
              )}
            />
            <span
              className={cn(
                centerSectionState.connectionLeft
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground",
              )}
            >
              User
            </span>
          </motion.div>

          <div className="w-px h-6 bg-border" />

          <motion.div
            animate={{
              opacity: centerSectionState.connectionRight ? 1 : 0.3,
              scale: centerSectionState.connectionRight ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-1 text-xs"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                centerSectionState.connectionRight
                  ? "bg-green-500 animate-pulse"
                  : "bg-muted",
              )}
            />
            <span
              className={cn(
                centerSectionState.connectionRight
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground",
              )}
            >
              Service
            </span>
          </motion.div>
        </div>
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
          AI Agent
        </div>
      </motion.div>

      {/* Scenario phase indicator */}
      {currentScenario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div
            className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              currentScenario.phase === "A2H" &&
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
              currentScenario.phase === "LiteAgent" &&
                "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
              currentScenario.phase === "A2A" &&
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            )}
          >
            {currentScenario.phase} Mode
          </div>
        </motion.div>
      )}

      {/* Ambient activity indicators */}
      {(centerSectionState.isThinking ||
        centerSectionState.progressPercent > 0) && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                top: "30%",
                left: "20%",
              }}
              animate={{
                x: [0, 200, 0],
                y: [0, Math.sin(i) * 50, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

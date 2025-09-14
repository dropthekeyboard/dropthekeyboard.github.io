import { AgentRobot } from "@/components/shared/AgentRobot";
import type { AgenticStep } from "@/contexts/scenario";
import { useScenario } from "@/hooks/useScenario";
import { cn } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Settings } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface LogicCard {
  id: string;
  step: AgenticStep;
  timestamp: Date;
}

export function AgentSection() {
  const { state, active: { agent }, progress, currentScenario } = useScenario();

  // Agent logic cards state
  const logicCards = useMemo(() => state.steps.map(s => ({
    id: createId(),
    step: s,
    timestamp: new Date(s.action.timestamp)
  }) satisfies LogicCard), [state]);
  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("agentic ::", {logicCards})

  // Processing state based on scenario progress
  const isProcessing = useMemo(() => {
    if (state.steps) {
      const { steps } = state;
      const lastStep = steps[steps.length - 1];
      if(lastStep) {
        return lastStep.action.from === agent?.name;
      }
    }
    return false;
  }, [state, agent]);

  // Add logic card when new step is processed


  // Auto-scroll when new cards are added
  useEffect(() => {
    if (scrollRef.current && logicCards.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logicCards.length]);

  console.info("agent section : ", {state});

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "center-section",
        "relative flex flex-col h-full",
      )}
    >
      {/* Agent Status Header */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {/* Brain icon - bouncing animation */}
        <motion.div
          animate={isProcessing ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0, ease: "easeInOut" }}
        >
          <Brain className="w-8 h-8 text-primary" />
        </motion.div>

        {/* AgentRobot in center */}
        <div className="relative">
          <AgentRobot size={60} isThinking={isProcessing} />
        </div>

        {/* Gearbox icon - rotating animation */}
        <motion.div
          animate={isProcessing ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
        >
          <Settings className="w-8 h-8 text-primary" />
        </motion.div>
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
          AI Agent
        </div>
      </motion.div>

      {/* Agent Logic Cards List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 px-2 max-h-[300px]"
      >
        <AnimatePresence>
          {logicCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  {card.step.type}
                </div>
                <span className="text-xs text-muted-foreground">
                  {card.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-foreground">
                {card.step.type === 'send-message' && (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      {card.step.action.from} → {card.step.action.to}
                    </p>
                    <p className="mt-1">{card.step.action.content}</p>
                  </div>
                )}
                {card.step.type === 'make-call' && (
                  <div>
                    <p className="text-muted-foreground text-xs">Calling</p>
                    <p className="mt-1">{card.step.action.from} → {card.step.action.to}</p>
                  </div>
                )}
                {card.step.type === 'accept-call' && (
                  <div>
                    <p className="text-muted-foreground text-xs">Call Connected</p>
                    <p className="mt-1">{card.step.action.from} ↔ {card.step.action.to}</p>
                  </div>
                )}
                {card.step.type === 'finish-call' && (
                  <div>
                    <p className="text-muted-foreground text-xs">Call Ended</p>
                    <p className="mt-1">{card.step.action.from} ↔ {card.step.action.to}</p>
                  </div>
                )}
                {card.step.type === 'api-call' && (
                  <div>
                    <p className="text-muted-foreground text-xs">API Call</p>
                    <p className="mt-1">{card.step.action.service}: {card.step.action.request}</p>
                  </div>
                )}
                {card.step.type === 'api-response' && (
                  <div>
                    <p className="text-muted-foreground text-xs">API Response</p>
                    <p className="mt-1">{card.step.action.service}: {card.step.action.response}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-2 py-1 bg-muted/50 border border-border rounded text-xs text-muted-foreground">
          Step {progress} / {currentScenario.steps.length}
        </div>
      </motion.div>
    </motion.div>
  );
}

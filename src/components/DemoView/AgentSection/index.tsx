import { AgentRobot } from "@/components/shared/AgentRobot";
import type { AgenticStep } from "@/contexts/scenario";
import { useScenario } from "@/hooks/useScenario";
import { cn } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

interface LogicCard {
  id: string;
  step: AgenticStep;
  timestamp: Date;
}

export function AgentSection() {
  const { state, active: { agent } } = useScenario();

  // Agent logic cards state
  const logicCards = useMemo(() => state.steps.map(s => ({
    id: createId(),
    step: s,
    timestamp: new Date(s.action.timestamp)
  }) satisfies LogicCard), [state]);
  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("agentic ::", {agent})

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


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "center-section",
        "relative flex flex-col h-[60vh] w-[30vw] mx-auto",
      )}
    >
      {/* Agent Status Header - Simplified and more elegant */}
      <div className="flex items-center justify-center mb-6">
        {/* Enhanced AgentRobot with integrated elements */}
        <motion.div
          animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
          transition={{
            duration: 2,
            repeat: isProcessing ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <AgentRobot size={70} isThinking={isProcessing} />
        </motion.div>
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
      >
        <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {agent?.name}
        </div>
      </motion.div>

      {/* Agent Logic Cards List */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto px-3 py-2 min-h-[200px] w-[30vw] custom-scrollbar will-change-scroll",
          "bg-card/30 backdrop-blur-md rounded-lg",
          "shadow-lg shadow-black/10 dark:shadow-black/30",
          "relative before:absolute before:top-0 before:left-0 before:right-0 before:h-8",
          "before:bg-gradient-to-b before:from-card/60 before:via-card/30 before:to-transparent before:pointer-events-none before:z-10"
        )}
      >
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {logicCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  layout: { duration: 0.15 }
                }}
                className="bg-card rounded-lg p-3 shadow-sm will-change-transform"
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
      </div>
    </motion.div>
  );
}

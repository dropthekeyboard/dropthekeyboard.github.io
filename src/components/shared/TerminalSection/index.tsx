import type { AgenticStep, ServerState } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { cn } from '@/lib/utils';
import { createId } from '@paralleldrive/cuid2';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

interface LogicCard {
  id: string;
  step: AgenticStep;
  timestamp: Date;
}

interface TerminalSectionProps {
  entity: ServerState | null;
  label: string;
  labelColor: string;
  sectionClass: string;
  // 새로운 props: 직접 steps를 전달받을 수 있도록
  steps?: AgenticStep[];
  entityName?: string;
}

export function TerminalSection({
  entity,
  label,
  labelColor,
  sectionClass,
  steps: externalSteps,
  entityName,
}: TerminalSectionProps) {
  const { state: scenarioState } = useScenario();

  // 외부에서 steps를 제공하면 그것을 사용, 아니면 scenario에서 가져옴
  const state = useMemo(() =>
    externalSteps ? { steps: externalSteps } : scenarioState,
    [externalSteps, scenarioState]
  );

  // Terminal logic cards state - filter steps related to this AI agent
  const logicCards = useMemo(
    () =>
      state.steps
        .filter(
          (s: AgenticStep) => s.action.from === (entityName || entity?.name) || s.action.to === (entityName || entity?.name)
        )
        .map(
          (s: AgenticStep) =>
            ({
              id: createId(),
              step: s,
              timestamp: new Date(s.action.timestamp),
            }) satisfies LogicCard
        ),
    [state, entity, entityName]
  );

  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        sectionClass,
        'relative flex flex-col h-[60vh] w-[30vw] mx-auto'
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-center mb-6">
        <motion.div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
          <Terminal className="w-6 h-6 text-green-500" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-green-400">AI_AGENT</span>
          </div>
          <Cpu className="w-5 h-5 text-blue-500" />
        </motion.div>
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
      >
        <div
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            labelColor
          )}
        >
          {label}
        </div>
      </motion.div>

      {/* Terminal Window */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-4 py-3 min-h-[200px] w-[30vw] custom-scrollbar will-change-scroll',
          'bg-black/90 backdrop-blur-md rounded-lg border border-green-500/30',
          'shadow-lg shadow-green-500/10',
          'font-mono text-sm'
        )}
      >
        {/* Terminal Header */}
        <div className="text-green-400 mb-4 pb-2 border-b border-green-500/30">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-green-500">$</span>
            <span>ai_agent_session --start</span>
          </div>
          <div className="text-xs text-green-300/70">
            Connected to {entity?.name || 'AI Agent'} | Status: ACTIVE
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {logicCards.map((card) => {
              // 메시지 방향 구분: 발신 vs 수신
              const isOutgoing = card.step.action.from === entity?.name;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: isOutgoing ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isOutgoing ? 20 : -20 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                    layout: { duration: 0.15 },
                  }}
                  className={cn(
                    "flex items-start space-x-2",
                    isOutgoing ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOutgoing && <span className="text-green-500 mt-0.5">$</span>}
                  <div className={cn(
                    "flex-1 max-w-[80%]",
                    isOutgoing ? "order-1" : "order-2"
                  )}>
                    <div className={cn(
                      "flex items-center space-x-2 mb-1",
                      isOutgoing ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded",
                        isOutgoing
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      )}>
                        {isOutgoing ? "OUT" : "IN"} [{card.step.type}]
                      </span>
                      <span className="text-xs text-green-300/70">
                        {card.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {card.step.type === 'send-message' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        isOutgoing
                          ? "bg-blue-500/10 border-blue-500/30 ml-8"
                          : "bg-green-500/10 border-green-500/30 mr-8"
                      )}>
                        <div className={cn(
                          "text-xs mb-1",
                          isOutgoing ? "text-blue-400" : "text-yellow-400"
                        )}>
                          {isOutgoing ? "→" : "←"} {card.step.action.from} {isOutgoing ? "to" : "from"} {card.step.action.to}
                        </div>
                        <div className={cn(
                          "pl-2 border-l",
                          isOutgoing
                            ? "text-blue-300 border-blue-500/30"
                            : "text-green-300 border-green-500/30"
                        )}>
                          {card.step.action.type === 'dtmf' ? (
                            <span className="text-orange-400 font-bold">
                              🔢 DTMF: {card.step.action.content}
                            </span>
                          ) : (
                            <span>{card.step.action.content}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {card.step.type === 'make-call' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        isOutgoing
                          ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
                          : "bg-cyan-500/10 border-cyan-500/30 mr-8"
                      )}>
                        <div className={cn(
                          "text-xs",
                          isOutgoing ? "text-cyan-400" : "text-cyan-400"
                        )}>
                          {isOutgoing ? "📞" : "📞"} {card.step.action.from} {isOutgoing ? "calling" : "receiving call from"} {card.step.action.to}
                        </div>
                        <div className="text-green-300 mt-1">
                          {isOutgoing ? "Initiating voice connection..." : "Incoming call..."}
                        </div>
                      </div>
                    )}

                    {card.step.type === 'accept-call' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        isOutgoing
                          ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
                          : "bg-cyan-500/10 border-cyan-500/30 mr-8"
                      )}>
                        <div className={cn(
                          "text-xs",
                          isOutgoing ? "text-cyan-400" : "text-cyan-400"
                        )}>
                          {isOutgoing ? "✅" : "✅"} Call {isOutgoing ? "accepted by" : "connected with"} {card.step.action.to}
                        </div>
                        <div className="text-green-300 mt-1">
                          Voice connection established ✓
                        </div>
                      </div>
                    )}

                    {card.step.type === 'finish-call' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        isOutgoing
                          ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
                          : "bg-cyan-500/10 border-cyan-500/30 mr-8"
                      )}>
                        <div className={cn(
                          "text-xs",
                          isOutgoing ? "text-cyan-400" : "text-cyan-400"
                        )}>
                          {isOutgoing ? "❌" : "❌"} Call {isOutgoing ? "ended with" : "terminated by"} {card.step.action.to}
                        </div>
                        <div className="text-green-300 mt-1">
                          Voice connection terminated ✓
                        </div>
                      </div>
                    )}

                    {card.step.type === 'api-call' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        "bg-purple-500/10 border-purple-500/30",
                        isOutgoing ? "ml-8" : "mr-8"
                      )}>
                        <div className="text-purple-400 text-xs">
                          🔄 API Call to {card.step.action.service}
                        </div>
                        <div className="text-green-300 mt-1 pl-2 border-l border-purple-500/30">
                          {card.step.action.request}
                        </div>
                      </div>
                    )}

                    {card.step.type === 'api-response' && (
                      <div className={cn(
                        "rounded-lg px-3 py-2 border",
                        "bg-purple-500/10 border-purple-500/30",
                        isOutgoing ? "ml-8" : "mr-8"
                      )}>
                        <div className="text-purple-400 text-xs">
                          📥 API Response from {card.step.action.service}
                        </div>
                        <div className="text-green-300 mt-1 pl-2 border-l border-purple-500/30">
                          {card.step.action.response}
                        </div>
                      </div>
                    )}
                  </div>
                  {isOutgoing && <span className="text-blue-500 mt-0.5 order-2">$</span>}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Terminal Prompt */}
        <div className="mt-4 pt-2 border-t border-green-500/30">
          <div className="flex items-center space-x-2 text-green-400">
            <span className="text-green-500">$</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

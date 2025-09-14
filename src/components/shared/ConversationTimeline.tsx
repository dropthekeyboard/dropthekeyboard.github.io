import { useScenario } from '@/hooks/useScenario';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bot, User, ArrowRight } from 'lucide-react';

export function ConversationTimeline() {
  const { state } = useScenario();

  const messageSteps = state.steps.filter(step => step.type === 'send-message');

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
      {messageSteps.map((step, index) => {
        const isFromAgent = step.action.from.includes('agent');
        const isToAgent = step.action.to.includes('agent');
        const isAgentToAgent = isFromAgent && isToAgent;

        return (
          <motion.div
            key={`${step.action.timestamp}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-start space-x-3 p-3 rounded-lg border",
              isAgentToAgent
                ? "bg-green-500/10 border-green-500/30"
                : "bg-card border-border"
            )}
          >
            {/* 발신자 아이콘 */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              isFromAgent ? "bg-green-500/20" : "bg-blue-500/20"
            )}>
              {isFromAgent ? (
                <Bot className="w-4 h-4 text-green-500" />
              ) : (
                <User className="w-4 h-4 text-blue-500" />
              )}
            </div>

            {/* 메시지 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">
                  {step.action.from}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {step.action.to}
                </span>
                {isAgentToAgent && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-600 rounded-full text-xs font-medium">
                    AI ↔ AI
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">
                {step.action.content}
              </div>
            </div>

            {/* 타임스탬프 */}
            <div className="flex-shrink-0 text-xs text-muted-foreground">
              {new Date(step.action.timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
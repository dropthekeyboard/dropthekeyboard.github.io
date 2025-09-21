import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { StoryPanelProps } from '@/types/storytelling';
import type { AgenticStep } from '@/contexts/scenario';
import { CustomerSection } from '../../DemoView/CustomerSection';
import { AgentSection } from '../../DemoView/AgentSection';
import { ServerSection } from '../../DemoView/ServerSection';

interface DemoPanelProps extends StoryPanelProps {
  demoType?: 'customer' | 'agent' | 'server' | 'full';
}

export function DemoPanel({
  panel,
  isActive,
  progress,
  demoType = 'full',
}: DemoPanelProps) {
  // In storytelling mode, progress is managed by useScrollProgress hook
  // This component just renders the UI based on the current scenario state

  const getStepDescription = (step: AgenticStep): string => {
    switch (step.type) {
      case 'send-message':
        return `${step.action.from} → ${step.action.to}: "${step.action.content}"`;
      case 'make-call':
        return `${step.action.from} calls ${step.action.to}`;
      case 'accept-call':
        return `${step.action.to} answers the call`;
      case 'finish-call':
        return `Call ended between ${step.action.from} and ${step.action.to}`;
      case 'api-call':
        return `API call to ${step.action.service}: ${step.action.request}`;
      case 'api-response':
        return `${step.action.service} responded: ${step.action.response}`;
      default:
        return 'Unknown step';
    }
  };

  const totalSteps = panel.steps?.length ?? 0;
  // Handle initial state when progress is 0 (not yet scrolled)
  const effectiveProgress = progress === 0 && !isActive ? 0 : progress;
  const executedCount = Math.max(
    0,
    Math.floor(effectiveProgress * totalSteps) + 1
  );

  // Single component demo (like the old approach)
  if (demoType !== 'full') {
    return (
      <div className="grid grid-cols-2 h-full min-h-screen w-full">
        {/* 왼쪽: 단일 데모 영역 */}
        <div className="flex items-center justify-center bg-white dark:bg-gray-900 p-8">
          <motion.div
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0.3,
            }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            {demoType === 'customer' && <CustomerSection />}
            {demoType === 'agent' && <AgentSection />}
            {demoType === 'server' && <ServerSection />}
          </motion.div>
        </div>

        {/* 오른쪽: 설명 영역 */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-8">
          <div className="space-y-6 w-full">
            <motion.h2
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
            >
              {panel.title}
            </motion.h2>

            <motion.p
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{ duration: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              {panel.description ||
                'Watch the demonstration unfold step by step'}
            </motion.p>

            {/* Steps display */}
            {panel.steps && panel.steps.length > 0 && (
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Steps:
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {panel.steps.map((step, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-2 rounded text-sm transition-all duration-300',
                        index < executedCount
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {getStepDescription(step)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full 3-pillar demo (like DemoView)
  return (
    <div
      className="h-full min-h-screen w-full relative"
      style={{
        // Fix the demo area when active to prevent scroll
        position: isActive ? 'sticky' : 'static',
        top: isActive ? 0 : 'auto',
        zIndex: isActive ? 100 : 1,
        willChange: 'opacity, transform',
      }}
    >
      <div
        className="h-full p-8"
        style={{
          opacity: isActive ? 1 : 0.3,
          // Keep transitions minimal to reduce flicker
        }}
      >
        {/* Title and description */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {panel.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {panel.description}
          </p>
        </div>

        {/* 3-Pillar Layout identical to DemoView */}
        <div className={cn('flex gap-4 h-full items-center')}>
          <div className="flex-[0_0_30%] flex flex-col">
            <CustomerSection />
          </div>
          <div className="flex-[0_0_30%] flex flex-col">
            <AgentSection />
          </div>
          <div className="flex-[0_0_30%] flex flex-col">
            <ServerSection />
          </div>
        </div>

        {/* Interactive controls and progress info */}
        <div className="mt-6 text-center space-y-4">
          {totalSteps > 0 && (
            <div className="inline-block bg-black/80 text-white px-6 py-3 rounded-lg">
              <div className="text-sm">
                Demo Preview: {executedCount} / {totalSteps}
              </div>
            </div>
          )}

          {!isActive && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Scroll to this section to view the demo preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

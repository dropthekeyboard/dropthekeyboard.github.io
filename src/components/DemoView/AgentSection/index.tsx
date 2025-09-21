import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { useAgentDisplayVariants } from '@/hooks/useAgentDisplayVariants';
import { isRelevantAction } from '@/lib/utils';

export function AgentSection() {
  const {
    state,
    active: { agent },
  } = useScenario();

  // Get display type from context
  const { value: displayType } = useAgentDisplayVariants();

  // Agent 관련 steps만 필터링
  const agentSteps = state.steps.filter((s) => isRelevantAction(s, agent));

  return (
    <div className="flex w-full h-full landscape:pt-16 items-center justify-center scrollbar-hide">
      {displayType.type === 'terminal' ? (
        <TerminalSection
          entity={null}
          label={agent?.name || 'AI Agent'}
          labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
          sectionClass="center-section"
          variant={displayType.variants}
        />
      ) : (
        <ReasoningAgentSection
          entity={null}
          label={agent?.name || 'AI Agent'}
          labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
          sectionClass="center-section"
          steps={agentSteps}
          entityName={agent?.name}
          variant={displayType.variants}
        />
      )}
    </div>
  );
}

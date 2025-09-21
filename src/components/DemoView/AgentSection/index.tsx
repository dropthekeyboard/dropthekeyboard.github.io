import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { useScenario } from '@/hooks/useScenario';
import { isRelevantAction } from '@/lib/utils';

export function AgentSection() {
  const {
    state,
    active: { agent },
  } = useScenario();

  // Agent 관련 steps만 필터링
  const agentSteps = state.steps.filter((s) => isRelevantAction(s, agent));

  // Always use ReasoningAgentSection for AI agent
  return (
    <div className="flex w-full h-full landscape:pt-16 items-center justify-center">
      <ReasoningAgentSection
        entity={null}
        label={agent?.name || 'AI Agent'}
        labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
        sectionClass="center-section"
        steps={agentSteps}
        entityName={agent?.name}
        variant="reasoning"
      />
    </div>
  );
}

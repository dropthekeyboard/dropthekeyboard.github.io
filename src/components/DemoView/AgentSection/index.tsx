import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { isRelevantAction } from '@/lib/utils';

export function AgentSection() {
  const {
    state,
    active: { agent },
  } = useScenario();

  // Agent 관련 steps만 필터링
  const agentSteps = state.steps.filter((s) => isRelevantAction(s, agent));

  return (
    <TerminalSection
      entity={null}
      label={agent?.name||"AI Agent"}
      labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      sectionClass="center-section"
      steps={agentSteps}
      entityName={agent?.name}
    />
  );
}
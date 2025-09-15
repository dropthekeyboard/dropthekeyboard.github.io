import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { isRelevantAction } from '@/lib/utils';

interface AgentSectionProps {
  agentStyle?: 'minimal' | 'formal' | 'hacker';
}

export function AgentSection({ agentStyle = 'hacker' }: AgentSectionProps) {
  const {
    state,
    active: { agent },
  } = useScenario();

  // Agent 관련 steps만 필터링
  const agentSteps = state.steps.filter((s) => isRelevantAction(s, agent));

  // Agent가 동작 중인지 확인 (steps가 있으면 동작 중)
  const isAgentActive = agentSteps.length > 0;

  return (
    <TerminalSection
      entity={null}
      label={agent?.name||"AI Agent"}
      labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      sectionClass="center-section"
      steps={agentSteps}
      entityName={agent?.name}
      isActive={isAgentActive}
      variant={agentStyle}
    />
  );
}
import { TerminalSection } from '@/components/shared/TerminalSection';
import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { useScenario } from '@/hooks/useScenario';
import { isRelevantAction } from '@/lib/utils';

interface AgentSectionProps {
  agentStyle?: 'minimal' | 'formal' | 'hacker' | 'reasoning';
}

export function AgentSection({ agentStyle = 'reasoning' }: AgentSectionProps) {
  const {
    state,
    active: { agent },
  } = useScenario();

  // Agent 관련 steps만 필터링
  const agentSteps = state.steps.filter((s) => isRelevantAction(s, agent));

  // Use ReasoningAgentSection for 'reasoning' variant
  if (agentStyle === 'reasoning') {
    return (
      <ReasoningAgentSection
        entity={null}
        label={agent?.name || 'AI Agent'}
        labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
        sectionClass="center-section"
        steps={agentSteps}
        entityName={agent?.name}
        variant={agentStyle}
      />
    );
  }

  // Use TerminalSection for other variants
  return (
    <TerminalSection
      entity={null}
      label={agent?.name || 'AI Agent'}
      labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      sectionClass="center-section"
      steps={agentSteps}
      entityName={agent?.name}
      variant={agentStyle}
    />
  );
}

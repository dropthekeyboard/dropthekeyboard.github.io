import { PhoneSection } from '@/components/shared/PhoneSection';
import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { useAgentDisplayVariants } from '@/hooks/useAgentDisplayVariants';
import { isRelevantAction } from '@/lib/utils';

export function ServerSection() {
  const {
    state,
    active: { server },
  } = useScenario();

  // Get display type from context
  const { value: displayType } = useAgentDisplayVariants();

  // Server 관련 steps만 필터링 (AI server인 경우에만)
  const serverSteps = server && server.type === 'ai'
    ? state.steps.filter((s) => isRelevantAction(s, server))
    : [];

  if (!server) {
    return null;
  }

  // Human server - use PhoneSection
  if (server.type === 'human') {
    return (
      <div className="flex w-full h-full pt-16 items-center justify-center scrollbar-hide">
        <PhoneSection
          entity={server}
          label={`${server.displayName || server.name}'s Phone`}
          labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
          animationDirection="right"
          contactNumber="+1 (800) 555-0199"
          from={server.name}
          showAdditionalStatus={true}
          location="server"
        />
      </div>
    );
  }

  // AI server - use different components based on display type
  if (server.type === 'ai') {
    return (
      <div className="flex w-full h-full pt-16 items-center justify-center scrollbar-hide">
        {displayType.type === 'terminal' ? (
          <TerminalSection
            entity={server}
            label={server.displayName || server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={displayType.variants as 'minimal' | 'formal' | 'hacker'}
            steps={serverSteps}
            entityName={server.name}
          />
        ) : (
          <ReasoningAgentSection
            entity={server}
            label={server.displayName || server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={displayType.variants}
            steps={serverSteps}
            entityName={server.name}
          />
        )}
      </div>
    );
  }

  return null;
}

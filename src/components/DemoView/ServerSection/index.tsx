import { PhoneSection } from '@/components/shared/PhoneSection';
import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { useAgentDisplayVariants } from '@/hooks/useAgentDisplayVariants';

export function ServerSection() {
  const {
    active: { server },
  } = useScenario();

  // Get display type from context
  const { value: displayType } = useAgentDisplayVariants();

  if (!server) {
    return null;
  }

  // Human server - use PhoneSection
  if (server.type === 'human') {
    return (
      <div className="flex w-full h-full pt-16 items-center justify-center scrollbar-hide">
        <PhoneSection
          entity={server}
          label={server.name}
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
            label={server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={displayType.variants as 'minimal' | 'formal' | 'hacker'}
          />
        ) : (
          <ReasoningAgentSection
            entity={server}
            label={server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={displayType.variants}
          />
        )}
      </div>
    );
  }

  return null;
}

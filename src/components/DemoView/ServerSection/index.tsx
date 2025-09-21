import { PhoneSection } from '@/components/shared/PhoneSection';
import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { TerminalSection } from '@/components/shared/TerminalSection';
import { useScenario } from '@/hooks/useScenario';
import { useReasoningVariantOnly, useOptionalTerminalVariant } from '@/hooks/useAgentDisplayVariants';

export function ServerSection() {
  const {
    active: { server },
  } = useScenario();

  // Get reasoning variant from context
  const { variant: reasoningVariant } = useReasoningVariantOnly();
  const terminalContext = useOptionalTerminalVariant();

  if (!server) {
    return null;
  }

  // Human server - use PhoneSection
  if (server.type === 'human') {
    return (
      <div className="flex w-full h-full pt-16 items-center justify-center">
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

  // AI server - use different components based on terminal variant
  if (server.type === 'ai') {
    const terminalVariant = terminalContext?.variant || 'minimal';
    
    return (
      <div className="flex w-full h-full pt-16 items-center justify-center">
        {terminalVariant === 'minimal' ? (
          <ReasoningAgentSection
            entity={server}
            label={server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={reasoningVariant}
          />
        ) : (
          <TerminalSection
            entity={server}
            label={server.name}
            labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            sectionClass=""
            variant={terminalVariant}
          />
        )}
      </div>
    );
  }

  return null;
}

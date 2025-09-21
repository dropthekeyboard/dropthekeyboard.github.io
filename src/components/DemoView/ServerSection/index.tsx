import { PhoneSection } from '@/components/shared/PhoneSection';
import { ReasoningAgentSection } from '@/components/shared/ReasoningAgentSection';
import { useScenario } from '@/hooks/useScenario';

export function ServerSection() {
  const {
    active: { server },
  } = useScenario();

  if (!server) {
    return null;
  }

  // Human server - use PhoneSection
  if (server.type === 'human') {
    return (
      <div className='flex w-full h-full pt-20 items-center justify-center'>
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

  // AI server - always use ReasoningAgentSection
  if (server.type === 'ai') {
    return (
      <div className='flex w-full h-full pt-20 items-center justify-center'>
        <ReasoningAgentSection
          entity={server}
          label={server.name}
          labelColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
          sectionClass=""
          variant="reasoning"
        />
      </div>
    );
  }

  return null;
}

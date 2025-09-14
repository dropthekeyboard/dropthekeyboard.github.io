import { PhoneSection } from '@/components/shared/PhoneSection';
import { TerminalSection } from '@/components/shared/TerminalSection';
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
      <PhoneSection
        entity={server}
        label="Service Provider"
        labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        animationDirection="right"
        contactName="Service Provider"
        contactNumber="+1 (800) 555-0199"
        contactStatus="Available"
        sectionClass=""
        showAdditionalStatus={true}
      />
    );
  }

  // AI server - use TerminalSection
  if (server.type === 'ai') {
    return (
      <TerminalSection
        entity={server}
        label={server.name}
        labelColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        sectionClass=""
      />
    );
  }

  return null;
}

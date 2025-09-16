import { PhoneSection } from '@/components/shared/PhoneSection';
import { useScenario } from '@/hooks/useScenario';

export function CustomerSection() {
  const {
    state: { customer },
  } = useScenario();

  return (
    <PhoneSection
      entity={customer}
      label="User Phone"
      labelColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
      animationDirection="left"
      contactNumber="+1 (555) 123-4567"
      from={customer?.name || 'Customer'}
    />
  );
}

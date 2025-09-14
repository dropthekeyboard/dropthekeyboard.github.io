import { PhoneSection } from "@/components/shared/PhoneSection";
import { useScenario } from "@/hooks/useScenario";

export function ServerSection() {
  const { active: { server } } = useScenario();

  return (
    <PhoneSection
      entity={server || null}
      label="Service Provider"
      labelColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      animationDirection="right"
      contactName="Service Provider"
      contactNumber="+1 (800) 555-0199"
      contactStatus="Available"
      sectionClass="right-section"
      showAdditionalStatus={true}
    />
  );
}

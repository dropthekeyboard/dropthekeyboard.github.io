import { cn } from '@/lib/utils';
import { AgentSection } from './AgentSection';
import { CustomerSection } from './CustomerSection';
import { ServerSection } from './ServerSection';
import { useScenario } from '@/hooks/useScenario';

interface DemoViewProps {
  className?: string;
  agentStyle?: 'minimal' | 'formal' | 'hacker' | 'reasoning';
}

export function DemoView({ className, agentStyle = 'reasoning' }: DemoViewProps) {
  const {
    active: { server },
  } = useScenario();

  // Determine if server section contains a phone component
  const serverContainsPhone = server?.type === 'human';

  return (
    <div
      id="demoview"
      className={cn(
        'demo-view-layout p-4 h-full items-center justify-center pt-2',
        className
      )}
      style={{ pointerEvents: 'none' }}
    >
      {/* Customer Section */}
      <div className="demo-customer-section">
        <CustomerSection />
      </div>

      {/* Agent Section */}
      <div className="demo-agent-section">
        <AgentSection agentStyle={agentStyle} />
      </div>

      {/* Server Section */}
      <div
        className="demo-server-section"
        data-contains-phone={serverContainsPhone}
      >
        <ServerSection agentStyle={agentStyle} />
      </div>
    </div>
  );
}

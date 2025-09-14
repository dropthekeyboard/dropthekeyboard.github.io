import { cn } from '@/lib/utils';
import { AgentSection } from './AgentSection';
import { CustomerSection } from './CustomerSection';
import { ServerSection } from './ServerSection';

interface DemoViewProps {
  className?: string;
}

export function DemoView({ className }: DemoViewProps) {
  return (
    <div
      id="demoview"
      className={cn('flex gap-4 p-4 h-full items-center', className)}
    >
      <div className="flex-[0_0_30%] flex flex-col">
        <CustomerSection />
      </div>
      <div className="flex-[0_0_30%] flex flex-col">
        <AgentSection />
      </div>
      <div className="flex-[0_0_30%] flex flex-col">
        <ServerSection />
      </div>
    </div>
  );
}

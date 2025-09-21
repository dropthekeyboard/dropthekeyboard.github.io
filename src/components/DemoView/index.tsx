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
      className={cn(
        'h-full items-center justify-center pt-2 grid gap-2',
        'landscape:grid-cols-3 portrait:grid-cols-2 portrait:grid-rows-2',
        className
      )}
      style={{ pointerEvents: 'none' }}
    >
      {/* Customer Section */}
      <div className="landscape:col-auto portrait:col-span-1">
        <CustomerSection />
      </div>

      {/* Agent Section */}
      <div className="landscape:col-auto portrait:col-span-2 portrait:row-start-2 portrait:w-[30vw] portrait:mx-auto">
        <AgentSection />
      </div>

      {/* Server Section */}
      <div className="landscape:col-auto portrait:col-span-1 portrait:col-start-2">
        <ServerSection />
      </div>
    </div>
  );
}

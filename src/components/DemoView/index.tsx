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
        'h-full items-center justify-center pt-2 grid',
        'landscape:grid-cols-[1fr_auto_1fr] portrait:grid-cols-2 portrait:grid-rows-2',
        'scrollbar-hide',
        className
      )}
      style={{ 
        pointerEvents: 'none',
        gap: '5vw'
      }}
    >
      {/* Customer Section */}
      <div className="portrait:col-span-1 pl-[3vw]">
        <CustomerSection />
      </div>

      {/* Agent Section */}
      <div className="landscape:justify-self-center portrait:col-span-2 portrait:row-start-2 portrait:w-[30vw] portrait:mx-auto">
        <AgentSection />
      </div>

      {/* Server Section */}
      <div className="portrait:col-span-1 portrait:col-start-2 pr-[3vw]">
        <ServerSection />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { AgentSection } from "./AgentSection";
import { CustomerSection } from "./CustomerSection";
import { ServerSection } from "./ServerSection";

interface DemoViewProps {
  className?: string;
}

export function DemoView({ className }: DemoViewProps) {
  return (
    <div
      id="demoview"
      className={cn(
        "demo-view",
        "grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full",
        className
      )}
    >
      <div className="flex flex-col">
        <CustomerSection />
      </div>
      <div className="flex flex-col">
        <AgentSection />
      </div>
      <div className="flex flex-col">
        <ServerSection />
      </div>
    </div>
  );
}

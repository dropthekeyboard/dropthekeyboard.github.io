import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, Bot } from 'lucide-react';
import { useScenario } from '@/hooks/useScenario';

export function ScenarioSelector() {
  const { scenarios, currentScenario, setCurrent } = useScenario();

  const handleScenarioSelect = (scenarioId: string) => {
    const index = scenarios.findIndex((s) => s.id === scenarioId);
    if (index !== -1) {
      setCurrent(index);
    }
  };

  return (
    <Select
      value={currentScenario?.id || ''}
      onValueChange={handleScenarioSelect}
    >
      <SelectTrigger
        className={cn(
          'h-9 px-3 justify-between max-w-[30vw]',
          'bg-muted/30 hover:bg-muted/50',
          'border border-border hover:border-primary/50',
          'transition-all duration-200'
        )}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {currentScenario ? (
            <>
              <div className="px-2 py-0.5 rounded text-xs font-medium border bg-primary/10 text-primary border-primary/20 flex-shrink-0">
                A2A
              </div>
              <SelectValue className="truncate" />
            </>
          ) : (
            <span className="text-muted-foreground text-sm truncate">
              Select Scenario
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </SelectTrigger>

      <SelectContent>
        {scenarios.map((scenario) => (
          <SelectItem key={scenario.id} value={scenario.id}>
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{scenario.title}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

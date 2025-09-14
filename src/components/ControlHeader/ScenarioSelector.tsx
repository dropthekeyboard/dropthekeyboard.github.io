import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  Play,
  Clock,
  Phone,
  MessageSquare,
  Bot,
  Building,
} from "lucide-react";
import { useScenario } from "@/hooks/useScenario";
import type { Scenario } from "@/contexts/scenario";

export function ScenarioSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { scenarios, currentScenario, setCurrent } = useScenario();

  const handleScenarioSelect = (_scenario: Scenario, index: number) => {
    setCurrent(index);
    setIsOpen(false);
  };

  const getStepCounts = (scenario: Scenario) => {
    const counts = {
      messages: 0,
      calls: 0,
      actions: 0,
    };

    scenario.steps.forEach((step) => {
      switch (step.type) {
        case 'send-message':
          counts.messages++;
          break;
        case 'make-call':
        case 'accept-call':
        case 'finish-call':
          counts.calls++;
          break;
        case 'api-call':
        case 'api-response':
          counts.actions++;
          break;
      }
    });

    return counts;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-9 px-3 justify-between min-w-[200px]",
            "bg-muted/30 hover:bg-muted/50",
            "border border-border hover:border-primary/50",
            "transition-all duration-200",
          )}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {currentScenario ? (
              <>
                <div className="px-2 py-0.5 rounded text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                  A2A
                </div>
                <span className="truncate text-sm">
                  {currentScenario.title}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">
                Select Scenario
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>Select Demo Scenario</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          <AnimatePresence>
            {scenarios.map((scenario, index) => {
              const counts = getStepCounts(scenario);

              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200",
                      "hover:shadow-md hover:border-primary/50",
                      "group relative overflow-hidden",
                      currentScenario?.id === scenario.id &&
                        "ring-2 ring-primary border-primary",
                    )}
                    onClick={() => handleScenarioSelect(scenario, index)}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="px-2 py-1 rounded text-xs font-medium border flex items-center space-x-1 bg-primary/10 text-primary border-primary/20">
                          <Bot className="w-3 h-3" />
                          <span>A2A</span>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-3 h-3" />
                        </motion.div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {scenario.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {scenario.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{scenario.steps.length} steps</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Building className="w-3 h-3" />
                          <span>{scenario.agents.length} agents</span>
                        </div>
                      </div>

                      {/* Step type breakdown */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          {counts.messages > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{counts.messages}</span>
                            </div>
                          )}
                          {counts.calls > 0 && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{counts.calls}</span>
                            </div>
                          )}
                          {counts.actions > 0 && (
                            <div className="flex items-center space-x-1">
                              <Bot className="w-3 h-3" />
                              <span>{counts.actions}</span>
                            </div>
                          )}
                        </div>

                        {/* Play button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScenarioSelect(scenario, index);
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-center pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{scenarios.length} A2A Scenarios Available</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { useScenarioStore } from "@/stores/scenarioStore";
import { useScenarioPlayer } from "@/hooks/useScenarioPlayer";
import {
  ChevronDown,
  Play,
  Clock,
  Users,
  Phone,
  MessageSquare,
  Bot,
  Building,
} from "lucide-react";

// Import scenario data
import phase1Scenarios from "@/data/scenarios/phase1_scenarios.json";
import phase2Scenarios from "@/data/scenarios/phase2_scenarios.json";
import phase3Scenarios from "@/data/scenarios/phase3_scenarios.json";

const allScenarios = [
  ...phase1Scenarios,
  ...phase2Scenarios,
  ...phase3Scenarios,
];

const phaseColors = {
  A2H: "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800",
  LiteAgent:
    "bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-800",
  A2A: "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800",
};

const phaseIcons = {
  A2H: <Phone className="w-3 h-3" />,
  LiteAgent: <Bot className="w-3 h-3" />,
  A2A: <Users className="w-3 h-3" />,
};

export function ScenarioSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentScenario } = useScenarioStore();
  const { loadAndPlay, isPlaying } = useScenarioPlayer();

  const handleScenarioSelect = (scenario: any) => {
    loadAndPlay(scenario);
    setIsOpen(false);
  };

  const getStepCounts = (scenario: any) => {
    const counts = {
      messages: 0,
      calls: 0,
      actions: 0,
    };

    scenario.steps.forEach((step: any) => {
      switch (step.type) {
        case "message":
        case "sms":
          counts.messages++;
          break;
        case "call":
          counts.calls++;
          break;
        case "system_action":
          counts.actions++;
          break;
      }
    });

    return counts;
  };

  const getDuration = (scenario: any) => {
    const totalDuration = scenario.steps.reduce(
      (acc: number, step: any) =>
        acc + step.timing.delay + step.timing.duration,
      0,
    );
    return Math.round(totalDuration);
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
          disabled={isPlaying}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {currentScenario ? (
              <>
                <div
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium border",
                    phaseColors[
                      currentScenario.phase as keyof typeof phaseColors
                    ],
                  )}
                >
                  {currentScenario.phase}
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
            {allScenarios.map((scenario, index) => {
              const counts = getStepCounts(scenario);
              const duration = getDuration(scenario);

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
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium border flex items-center space-x-1",
                            phaseColors[
                              scenario.phase as keyof typeof phaseColors
                            ],
                          )}
                        >
                          {
                            phaseIcons[
                              scenario.phase as keyof typeof phaseIcons
                            ]
                          }
                          <span>{scenario.phase}</span>
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
                          <span>{duration}s</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Building className="w-3 h-3" />
                          <span>{scenario.steps.length} steps</span>
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
                            handleScenarioSelect(scenario);
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
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>{phase1Scenarios.length} A2H Scenarios</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>{phase2Scenarios.length} Lite Agent</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{phase3Scenarios.length} A2A Scenarios</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

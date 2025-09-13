import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useScenarioPlayer } from "@/hooks/useScenarioPlayer";
import { useScenarioStore } from "@/stores/scenarioStore";
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from "lucide-react";

export function PlayControls() {
  const { currentScenario } = useScenarioStore();
  const {
    isPlaying,
    currentStep,
    totalSteps,
    progress,
    play,
    pause,
    reset,
    jumpToStep,
    canPlay,
    canPause,
    canReset,
    isComplete,
  } = useScenarioPlayer();

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      jumpToStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      jumpToStep(currentStep - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const estimatedTotalTime =
    currentScenario?.steps.reduce(
      (acc, step) => acc + step.timing.delay + step.timing.duration,
      0,
    ) || 0;

  return (
    <div className="flex items-center space-x-2">
      {/* Main play/pause control */}
      <div className="flex items-center space-x-1">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant={isPlaying ? "default" : "outline"}
            onClick={isPlaying ? pause : play}
            disabled={!canPlay && !canPause}
            className={cn(
              "h-8 w-8 p-0",
              isPlaying && "bg-orange-500 hover:bg-orange-600",
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            disabled={!canReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </motion.div>
      </div>

      {/* Step controls */}
      {currentScenario && (
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStepBack}
            disabled={currentStep <= 0 || isPlaying}
            className="h-6 w-6 p-0"
          >
            <SkipBack className="w-3 h-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className="h-6 w-6 p-0"
          >
            <SkipForward className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Progress indicator */}
      {currentScenario && (
        <div className="flex items-center space-x-2 min-w-[120px]">
          <div className="flex-1">
            <Progress
              value={progress}
              className="h-1.5"
              aria-label="Scenario progress"
            />
          </div>

          <div className="text-xs text-muted-foreground font-mono min-w-[60px]">
            <span className="text-foreground">{currentStep + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalSteps}</span>
          </div>
        </div>
      )}

      {/* Time estimate */}
      {currentScenario && (
        <div className="text-xs text-muted-foreground font-mono">
          {formatTime(Math.round(estimatedTotalTime))}
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center">
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
        )}
        {isComplete && !isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        )}
        {!currentScenario && <div className="w-2 h-2 bg-muted rounded-full" />}
      </div>
    </div>
  );
}

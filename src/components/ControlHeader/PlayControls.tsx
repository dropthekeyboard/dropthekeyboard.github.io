import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useScenario } from '@/hooks/useScenario';
import { useScenarioProgress } from '@/hooks/useScenarioProgress';

interface PlayControlsProps {
  /**
   * Interval in milliseconds between each auto step.
   * Defaults to 1500ms.
   */
  interval?: number;
}

/**
 * Play/Pause controls for auto-playing scenario steps.
 * Includes a toggle button and conditionally renders the Player component.
 */
export function PlayControls({ interval = 3000 }: PlayControlsProps) {
  const { reset, currentScenario } = useScenario();
  const { isPlaying, togglePlay, stopAutoPlay, startAutoPlay } =
    useScenarioProgress();

  const handleReset = () => {
    stopAutoPlay(); // Stop auto play when resetting
    // Clear all executed steps and message boxes
    reset(currentScenario);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      togglePlay();
    } else {
      startAutoPlay(interval);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTogglePlay}
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Play
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}

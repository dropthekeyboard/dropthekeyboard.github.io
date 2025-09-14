import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Player } from "./player";
import { useScenarioControl } from "@/hooks/useScenarioControl";

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
export function PlayControls({ interval = 1500 }: PlayControlsProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const { reset } = useScenarioControl();

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false); // Stop playing when resetting
        reset();
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
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
            {isPlaying && <Player interval={interval} />}
        </div>
    );
}
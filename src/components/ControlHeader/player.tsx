import { useScenarioControl } from "@/hooks/useScenarioControl";
import { useEffect, useRef } from "react";



interface PlayerProps {
    /**
     * Interval in milliseconds between each auto step.
     * Defaults to 1500ms. Values below 200ms will be clamped to 200ms
     * to avoid overwhelming the UI.
     */
    interval?: number;
}

/**
 * Auto-plays the current scenario steps at the given interval.
 * Designed to be mounted once (e.g., inside ControlHeader) and has no UI.
 */
export function Player({ interval = 1500 }: PlayerProps) {
    const { progressNext, progress, scenario } = useScenarioControl();

    // Refs to avoid stale closures inside setInterval
    const progressRef = useRef(progress);
    const totalStepsRef = useRef<number>(scenario?.steps?.length ?? 0);

    // Keep refs in sync with latest values
    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    useEffect(() => {
        totalStepsRef.current = scenario?.steps?.length ?? 0;
    }, [scenario?.id, scenario?.steps?.length]);

    // Auto-advance at fixed interval
    useEffect(() => {
        const ms = Math.max(200, interval); // clamp to avoid too-fast loops
        const timer = setInterval(() => {
            if (progressRef.current < totalStepsRef.current) {
                // Trigger next step; useScenarioControl will execute the step
                progressNext();
            }
        }, ms);

        return () => clearInterval(timer);
        // Only depend on speed and progressNext (stable from hook)
    }, [interval, progressNext]);

    return null;
}
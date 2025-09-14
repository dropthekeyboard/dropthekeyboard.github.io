import { useCallback, useEffect, useRef, useState } from 'react';
import { useScenario } from './useScenario';

interface UseScenarioProgressReturnType {
  isPlaying: boolean;
  startAutoPlay: (interval?: number) => void;
  stopAutoPlay: () => void;
  togglePlay: () => void;
}

export function useScenarioProgress(): UseScenarioProgressReturnType {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { progressNext, progress, currentScenario } = useScenario();

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startAutoPlay = useCallback(
    (interval = 1500) => {
      stopAutoPlay();
      setIsPlaying(true);
      timerRef.current = setInterval(
        () => {
          if (progress < currentScenario.steps.length - 1) {
            progressNext();
          } else {
            stopAutoPlay();
          }
        },
        Math.max(200, interval)
      );
    },
    [progress, currentScenario.steps.length, progressNext, stopAutoPlay]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [isPlaying, startAutoPlay, stopAutoPlay]);

  // Clean up on unmount
  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  return { isPlaying, startAutoPlay, stopAutoPlay, togglePlay };
}

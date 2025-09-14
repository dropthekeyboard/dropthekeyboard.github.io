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

      const runStep = () => {
        // 클로저를 통해 최신 상태에 접근
        if (progress < currentScenario.steps.length - 1) {
          progressNext();
        } else {
          stopAutoPlay();
        }
      };

      timerRef.current = setInterval(runStep, Math.max(200, interval));
    },
    [progressNext, stopAutoPlay, progress, currentScenario.steps.length]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [isPlaying, startAutoPlay, stopAutoPlay]);

  // progress가 마지막 스텝에 도달하면 자동으로 정지
  useEffect(() => {
    if (isPlaying && progress >= currentScenario.steps.length - 1) {
      stopAutoPlay();
    }
  }, [progress, currentScenario.steps.length, isPlaying, stopAutoPlay]);

  // Clean up on unmount
  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  return { isPlaying, startAutoPlay, stopAutoPlay, togglePlay };
}

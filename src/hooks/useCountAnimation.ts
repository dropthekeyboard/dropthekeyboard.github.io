import { useEffect, useState } from 'react';

export function useCountAnimation(
  targetValue: number,
  isActive: boolean,
  duration = 1200
) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentValue(0);
      return;
    }

    let animationFrame: number;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const newValue = Math.floor(progress * targetValue);
      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, isActive, duration]);

  return currentValue;
}
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef({ value: from });

  useEffect(() => {
    if (!counterRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(valueRef.current, {
        value: to,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            const currentValue = valueRef.current.value;
            const displayValue =
              decimals > 0
                ? currentValue.toFixed(decimals)
                : Math.round(currentValue).toLocaleString();

            counterRef.current.textContent = `${prefix}${displayValue}${suffix}`;
          }
        },
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }, counterRef);

    return () => ctx.revert();
  }, [from, to, duration, suffix, prefix, decimals]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}
      {from.toLocaleString()}
      {suffix}
    </span>
  );
}

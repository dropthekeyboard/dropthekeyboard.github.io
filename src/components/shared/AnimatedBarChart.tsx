import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface AnimatedBarChartProps {
  data: DataPoint[];
  title?: string;
  maxValue?: number;
  duration?: number;
  stagger?: number;
}

export function AnimatedBarChart({
  data,
  title,
  maxValue = 100,
  duration = 1.5,
  stagger = 0.2,
}: AnimatedBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLSpanElement[]>([]);
  const [displayValues, setDisplayValues] = useState<number[]>(
    data.map(() => 0)
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = gsap.context(() => {
      // Animate bars
      gsap.fromTo(
        barsRef.current,
        {
          scaleY: 0,
          transformOrigin: 'bottom center',
        },
        {
          scaleY: 1,
          duration: duration,
          stagger: stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate numbers
      data.forEach((item, index) => {
        const obj = { value: 0 };
        gsap.to(obj, {
          value: item.value,
          duration: duration + stagger * index,
          ease: 'power2.out',
          onUpdate: function () {
            setDisplayValues((prev) => {
              const newValues = [...prev];
              newValues[index] = Math.round(obj.value);
              return newValues;
            });
          },
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, chartRef);

    return () => ctx.revert();
  }, [data, duration, stagger]);

  return (
    <div ref={chartRef} className="w-full max-w-2xl mx-auto p-6">
      {title && (
        <h3 className="text-xl font-bold text-center mb-6 text-foreground">
          {title}
        </h3>
      )}

      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex-1 flex flex-col items-center gap-2"
          >
            {/* Value Display */}
            <div className="h-8 flex items-center justify-center">
              <span
                ref={(el) => {
                  if (el) numbersRef.current[index] = el;
                }}
                className="text-lg font-bold text-foreground"
              >
                {displayValues[index]}%
              </span>
            </div>

            {/* Bar */}
            <div className="w-full bg-muted rounded-t-md relative flex-1 flex items-end">
              <div
                ref={(el) => {
                  if (el) barsRef.current[index] = el;
                }}
                className="w-full rounded-t-md transition-all duration-300"
                style={{
                  backgroundColor: item.color,
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              />
            </div>

            {/* Label */}
            <div className="text-sm font-medium text-center text-muted-foreground mt-2">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

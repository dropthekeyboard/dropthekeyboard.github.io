import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedBarChart } from '../shared/AnimatedBarChart';
import { AnimatedCounter } from '../shared/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

// Slide 003: A2A 확산 현황 with animated charts
function Slide003() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const chartData = [
    { name: '금융', value: 85, color: '#3b82f6' },
    { name: '통신', value: 65, color: '#10b981' },
    { name: '유통', value: 45, color: '#f59e0b' },
    { name: '의료', value: 25, color: '#ef4444' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats cards animation
      gsap.fromTo(
        statsRef.current?.children || [],
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans"
    >
      <div className="max-w-6xl w-full space-y-12">
        {/* 메인 제목 */}
        <div className="text-center">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight leading-relaxed"
          >
            A2A <span className="text-primary">확산 현황</span>
          </h1>
        </div>

        {/* 업계별 도입 현황 차트 */}
        <div className="w-full">
          <AnimatedBarChart
            data={chartData}
            title="업계별 A2A 도입률"
            maxValue={100}
            duration={1.5}
            stagger={0.3}
          />
        </div>

        {/* 통계 카드들 */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <AnimatedCounter
              from={0}
              to={127}
              duration={2}
              suffix="개"
              className="text-3xl font-bold text-primary block mb-2"
            />
            <p className="text-muted-foreground">도입 완료 기업</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <AnimatedCounter
              from={0}
              to={89}
              duration={2.2}
              suffix="%"
              className="text-3xl font-bold text-primary block mb-2"
            />
            <p className="text-muted-foreground">만족도</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <AnimatedCounter
              from={0}
              to={234}
              duration={2.5}
              suffix="억원"
              className="text-3xl font-bold text-primary block mb-2"
            />
            <p className="text-muted-foreground">비용 절감 효과</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide003;

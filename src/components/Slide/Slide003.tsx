import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Clock, Building2 } from 'lucide-react';
import { SlideHeader } from '@/components/shared/SlideHeader';

gsap.registerPlugin(ScrollTrigger);

// Slide 003: 모두의 AI는 전화/문자에서 시작
function Slide003() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 1,
      icon: Users,
      title: '보편성',
      description: '일반 국민 누구나',
    },
    {
      id: 2,
      icon: Clock,
      title: '시급성',
      description: '찾고 기다릴 필요 없이',
    },
    {
      id: 3,
      icon: Building2,
      title: '확장성',
      description: '작은 동네 상권까지도',
    },
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

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Feature cards animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
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
      className="min-h-screen w-full min-w-[80vw] text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative"
    >
      <div className="max-w-6xl w-full space-y-16 text-center">
        {/* 메인 헤드라인 */}
        <SlideHeader
          title="모두의 AI는 전화/문자에서 시작"
          subtitle="AI시대, 전화/문자는 왜 여전히 필요할까?"
          className="space-y-6"
          titleClassName="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
          subtitleClassName="text-lg sm:text-xl lg:text-2xl font-light"
        />

        {/* 특징 카드들 */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-20"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="border border-white/10 rounded-2xl p-8 lg:p-10 flex flex-col items-center space-y-6 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* 아이콘 */}
                <div className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                  <IconComponent className="w-full h-full text-muted-foreground stroke-1" />
                </div>
                
                {/* 제목 (그라데이션) */}
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-foreground text-lg lg:text-xl font-medium">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Slide003;

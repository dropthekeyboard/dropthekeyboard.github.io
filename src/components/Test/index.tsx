import { useRef, useState, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoView } from '../DemoView';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { ScenarioSelector } from '../ControlHeader/ScenarioSelector';
import { ScrollControls } from '../ControlHeader/ScrollControls';
import { PinningContext, type PinningContextType } from '@/contexts/pinning';
import scenariosData from '@/data/scenarios.json';
import type { Scenario } from '@/contexts/scenario';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPPinningDemo() {
  // 시나리오 데이터 로드 - Object.entries()로 key-value 쌍 활용
  const scenarios = useMemo(() => {
    return Object.entries(scenariosData)
      .map(([scenarioKey, scenario]) => ({
        ...scenario,
        callSessions: [],
        // 시나리오 key를 활용한 추가 메타데이터
        key: scenarioKey,
        // 시나리오 순서 제어 (key에 포함된 숫자 활용)
        order: parseInt(scenarioKey.match(/\d+/)?.[0] || '0'),
      }))
      .sort((a, b) => a.order - b.order) // 순서대로 정렬
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, order, ...scenario } = item;
        return scenario;
      }) as unknown as Scenario[]; // 정렬용 필드 제거
  }, []);

  // 각 시나리오별 ref와 pinning state 관리
  const scenarioRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pinningStates, setPinningStates] = useState<PinningContextType[]>(
    scenarios.map(() => ({
      isPinned: false,
      isEntering: false,
      isLeaving: false,
    }))
  );

  // 각 시나리오별 pinning 설정
  useEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error('GSAP or ScrollTrigger is not loaded');
      return;
    }

    // 기존 ScrollTrigger 정리
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const triggers: ScrollTrigger[] = [];

    scenarios.forEach((scenario, index) => {
      const sectionRef = scenarioRefs.current[index];
      if (!sectionRef) return;

      console.log(`Creating ScrollTrigger for scenario ${index + 1}: ${scenario.title}`);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef,
        start: "top top",
        end: "+=2000", // 2000px 스크롤 후 해제
        pin: true,
        pinSpacing: true, // 공간 유지
        markers: process.env.NODE_ENV === 'development', // 개발 환경에서만 마커 표시
        onEnter: () => {
          console.log(`Pinning started - Scenario ${index + 1} entered viewport`);
          setPinningStates(prev => prev.map((state, i) =>
            i === index ? { isPinned: true, isEntering: true, isLeaving: false } : state
          ));
          // entering 상태를 잠시 후 false로 리셋
          setTimeout(() => {
            setPinningStates(prev => prev.map((state, i) =>
              i === index ? { ...state, isEntering: false } : state
            ));
          }, 100);
        },
        onLeave: () => {
          console.log(`Pinning ended - Scenario ${index + 1} left viewport`);
          setPinningStates(prev => prev.map((state, i) =>
            i === index ? { isPinned: false, isEntering: false, isLeaving: true } : state
          ));
          // leaving 상태를 잠시 후 false로 리셋
          setTimeout(() => {
            setPinningStates(prev => prev.map((state, i) =>
              i === index ? { ...state, isLeaving: false } : state
            ));
          }, 100);
        },
        onEnterBack: () => {
          console.log(`Pinning re-entered - Scenario ${index + 1} scrolling back up`);
          setPinningStates(prev => prev.map((state, i) =>
            i === index ? { isPinned: true, isEntering: true, isLeaving: false } : state
          ));
        },
        onLeaveBack: () => {
          console.log(`Pinning left back - Scenario ${index + 1} scrolling back up`);
          setPinningStates(prev => prev.map((state, i) =>
            i === index ? { isPinned: false, isEntering: false, isLeaving: true } : state
          ));
        },
      });

      triggers.push(trigger);
    });

    console.log(`${triggers.length} ScrollTriggers created`);

    // 클린업 함수
    return () => {
      console.log('Cleaning up all ScrollTriggers');
      triggers.forEach(trigger => trigger.kill());
    };
  }, [scenarios]);

  return (
    <div className="w-full">
      {scenarios.map((scenario, index) => (
        <div key={scenario.id}>
          {/* 시나리오 설명 섹션 (no pinning) */}
          <section className="min-h-screen flex items-center justify-center bg-background w-full py-20">
            <div className="w-full max-w-4xl px-4 text-center">
              <h1 className="text-4xl font-bold mb-6 text-foreground">
                시나리오 {index + 1}: {scenario.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {scenario.description}
              </p>
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  아래로 스크롤하여 시나리오를 체험해보세요
                </p>
              </div>
            </div>
          </section>

          {/* DemoView 섹션 (pinning) */}
          <section
            ref={(el: HTMLDivElement | null) => {
              scenarioRefs.current[index] = el;
            }}
            className="min-h-screen flex items-center justify-center bg-background w-full"
          >
            <div className="w-full max-w-7xl px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  시나리오 체험
                </h2>
                <p className="mb-4 text-muted-foreground">
                  이 섹션이 고정됩니다 - 스크롤로 시나리오를 제어해보세요
                </p>
              </div>

              <div className="w-full">
                <PinningContext.Provider value={pinningStates[index]}>
                  <ScenarioContextProvider>
                    <div className="mb-4">
                      <ScenarioSelector />
                    </div>
                    <ScrollControls enabled={true} threshold={15} />
                    <DemoView />
                  </ScenarioContextProvider>
                </PinningContext.Provider>
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* 마지막 섹션 */}
      <section className="min-h-screen flex items-center justify-center bg-background w-full py-20">
        <div className="w-full max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            모든 시나리오 체험 완료
          </h1>
          <p className="text-lg text-muted-foreground">
            다양한 시나리오를 통해 A2A 데모 시스템을 체험해보셨습니다.
          </p>
        </div>
      </section>
    </div>
  );
}

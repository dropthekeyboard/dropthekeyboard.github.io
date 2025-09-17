import { useRef, useState, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoView } from '../DemoView';
import A2AExpansionAnalysisPage from '../Slide/A2AExpansionAnalysis';
import A2ADigitalLevelSlide from '../Slide/A2ADigitalLevelSlide';
import A2AAppBarrierSlide from '../Slide/A2AAppBarrierSlide';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { ScenarioLoader } from '../ControlHeader/ScenarioLoader';
import { ScrollControls } from '../ControlHeader/ScrollControls';
import { PinningContext, type PinningContextType } from '@/contexts/pinning';
import scenariosData from '@/data/scenarios.json';
import type { Scenario } from '@/contexts/scenario';
import { AnimatedBarChart } from '../shared/AnimatedBarChart';
import { AnimatedCounter } from '../shared/AnimatedCounter';

// Import all slide components
import {
  Slide001, Slide002, Slide003, Slide004, Slide005, Slide006,
  Slide007, Slide008, Slide009, Slide010, Slide011, Slide012,
  Slide013, Slide014, Slide015, Slide016
} from '../Slide';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPPinningDemo() {
  // Define slide components with pinning configuration - memoized to prevent re-renders
  const slideComponents = useMemo(() => [
    { Component: Slide001, pinned: false, title: "A2A 혁신의 시대가 시작됩니다" },
    { Component: Slide002, pinned: false, title: "A2A가 뭔가요?" },
    { Component: Slide003, pinned: true, title: "A2A 확산 현황", hasChart: true },
    { Component: Slide004, pinned: false, title: "A2A 확산이 어려운 구조적 요인" },
    { Component: Slide005, pinned: true, title: "디지털 네이티브 세대의 성장", hasChart: true },
    { Component: Slide006, pinned: false, title: "첫 모바일 앱 출시 시기" },
    { Component: Slide007, pinned: true, title: "앱 사용 현황", hasChart: true },
    { Component: Slide008, pinned: false, title: "생성 AI의 급속한 성장" },
    { Component: Slide009, pinned: false, title: "Agent 기술의 발전" },
    { Component: Slide010, pinned: true, title: "A2A 도입 효과", hasChart: true },
    { Component: Slide011, pinned: false, title: "시니어 라이프 메이트 시나리오" },
    { Component: Slide012, pinned: false, title: "은행 업무 자동화 시나리오" },
    { Component: Slide013, pinned: false, title: "의료 예약 관리 시나리오" },
    { Component: Slide014, pinned: false, title: "A2A 시나리오 종합" },
    { Component: Slide015, pinned: false, title: "모두의 가능 A2A" },
    { Component: Slide016, pinned: true, title: "3단계 로드맵" }
  ], []);

  // 시나리오 ID 목록 생성 - Object.keys()로 모든 시나리오 ID 가져오기
  const scenarioIds = useMemo(() => {
    return Object.keys(scenariosData);
  }, []);

  // 시나리오 데이터 로드 - ID 목록을 활용하여 순차적 배치
  const scenarios = useMemo(() => {
    return scenarioIds
      .map((scenarioId) => {
        const scenarioData = scenariosData[scenarioId as keyof typeof scenariosData];
        return {
          ...scenarioData,
          callSessions: [], // Scenario 인터페이스에 맞게 추가
        } as unknown as Scenario;
      });
  }, [scenarioIds]);

  // 각 시나리오별 ref와 pinning state 관리
  const scenarioRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pinningStates, setPinningStates] = useState<PinningContextType[]>(
    scenarios.map(() => ({
      isPinned: false,
      isEntering: false,
      isLeaving: false,
    }))
  );

  // 각 슬라이드 및 시나리오별 pinning 설정
  useEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error('GSAP or ScrollTrigger is not loaded');
      return;
    }

    // 기존 ScrollTrigger 정리
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const triggers: ScrollTrigger[] = [];

    // Setup pinning for slides
    slideComponents.forEach((slide, index) => {
      if (!slide.pinned) return;

      const sectionRef = slideRefs.current[index];
      if (!sectionRef) return;

      console.log(`Creating ScrollTrigger for slide ${index + 1}: ${slide.title}`);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef,
        start: "top top",
        end: "+=1500", // 1500px 스크롤 후 해제
        pin: true,
        pinSpacing: true,
        markers: process.env.NODE_ENV === 'development',
      });

      triggers.push(trigger);
    });

    // Setup pinning for scenarios
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
  }, [scenarios, slideComponents]);

  // Sample chart data for different slides
  const getChartData = (slideIndex: number) => {
    switch (slideIndex) {
      case 2: // Slide003 - A2A 확산 현황
        return [
          { name: '금융', value: 85, color: '#3b82f6' },
          { name: '통신', value: 65, color: '#10b981' },
          { name: '유통', value: 45, color: '#f59e0b' },
          { name: '의료', value: 25, color: '#ef4444' }
        ];
      case 4: // Slide005 - 디지털 네이티브 세대의 성장
        return [
          { name: '20대', value: 95, color: '#8b5cf6' },
          { name: '30대', value: 88, color: '#06b6d4' },
          { name: '40대', value: 72, color: '#84cc16' },
          { name: '50대+', value: 42, color: '#f97316' }
        ];
      case 6: // Slide007 - 앱 사용 현황
        return [
          { name: '일일 사용자', value: 78, color: '#ec4899' },
          { name: '주간 사용자', value: 92, color: '#6366f1' },
          { name: '월간 사용자', value: 96, color: '#14b8a6' }
        ];
      case 9: // Slide010 - A2A 도입 효과
        return [
          { name: '효율성', value: 89, color: '#059669' },
          { name: '정확성', value: 94, color: '#7c3aed' },
          { name: '비용절감', value: 76, color: '#dc2626' },
          { name: '만족도', value: 91, color: '#ea580c' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-full">
      {/* Render all slide components */}
      {slideComponents.map((slide, index) => {
        const { Component, pinned, title, hasChart } = slide;

        return (
          <section
            key={`slide-${index}`}
            ref={pinned ? (el: HTMLDivElement | null) => { slideRefs.current[index] = el; } : undefined}
            className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-7xl px-4">
              {hasChart && (
                <div className="mb-8">
                  <AnimatedBarChart
                    data={getChartData(index)}
                    title={`${title} - 데이터 차트`}
                    maxValue={100}
                  />
                  <div className="text-center mt-4">
                    <AnimatedCounter
                      from={0}
                      to={index * 10 + 100}
                      duration={2}
                      suffix=" 건"
                      className="text-3xl font-bold text-primary"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      누적 처리 건수
                    </p>
                  </div>
                </div>
              )}
              <Component />
            </div>
          </section>
        );
      })}

      {/* Legacy slides */}
      <section>
        <A2AExpansionAnalysisPage />
      </section>

      <section>
        <A2ADigitalLevelSlide />
      </section>

      <section>
        <A2AAppBarrierSlide />
      </section>

      {/* 기존 시나리오 섹션들 */}
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
                      <ScenarioLoader
                        initialScenarioId={scenario.id}
                        onScenarioLoaded={(id) => console.log(`Scenario ${id} loaded`)}
                        onScenarioError={(error) => console.error(`Scenario load error: ${error}`)}
                      />
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

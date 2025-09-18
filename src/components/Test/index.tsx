import React, { useRef, useMemo, useEffect, type ComponentType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoView } from '../DemoView';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { ScenarioLoader } from '../ControlHeader/ScenarioLoader';
import { ScrollControls } from '../ControlHeader/ScrollControls';
import { PinningProvider, usePinning, useSectionPinning } from '@/contexts/pinning';
import { AnimatedSlide } from '@/components/shared/AnimatedSlide';
import scenariosData from '@/data/scenarios.json';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SlideProps } from '@/types/slide';

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

// 섹션 유형 정의
interface SectionData {
  type: 'slide' | 'scenario' | 'scenario-intro';
  title: string;
  pinned: boolean;
  pinEnd?: string; // 개별 pinning 구간 설정 (예: '+=300vh', '+=1000', '+=5s')
  Component?: ComponentType<object> | ComponentType<SlideProps>;
  id?: string;
  description?: string;
  // AnimatedSlide 속성들
  animationType?: 'fade' | 'slideUp' | 'slideDown' | 'scale';
  animationDelay?: number;
  enableAnimation?: boolean; // 애니메이션 사용 여부
}

// 내부 데모 컴포넌트
function GSAPPinningDemoContent() {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { updateSectionState, initializeSections } = usePinning();

  // Define slide components with pinning configuration - memoized to prevent re-renders
  const slideComponents = useMemo(() => [
    { 
      Component: Slide001, 
      pinned: false, 
      title: "A2A 혁신의 시대가 시작됩니다",
      enableAnimation: true,
      animationType: 'fade' as const,
      animationDelay: 0.3
    },
    { 
      Component: Slide002, 
      pinned: false, 
      title: "A2A가 뭔가요?",
      enableAnimation: true,
      animationType: 'slideUp' as const,
      animationDelay: 0.2
    },
    { 
      Component: Slide003, 
      pinned: true, 
      title: "A2A 확산 현황",
      enableAnimation: true,
      animationType: 'scale' as const,
      animationDelay: 0.4
    },
    {
      Component: Slide004,
      pinned: true,
      title: "A2A 확산이 어려운 구조적 요인",
      enableAnimation: true,
      animationType: 'slideDown' as const,
      animationDelay: 0.1
    },
    { 
      Component: Slide005, 
      pinned: true, 
      title: "디지털 네이티브 세대의 성장",
      enableAnimation: true,
      animationType: 'fade' as const,
      animationDelay: 0.5
    },
    { 
      Component: Slide006, 
      pinned: false, 
      title: "첫 모바일 앱 출시 시기",
      enableAnimation: true,
      animationType: 'slideUp' as const,
      animationDelay: 0.2
    },
    { 
      Component: Slide007, 
      pinned: true, 
      title: "앱 사용 현황",
      enableAnimation: true,
      animationType: 'scale' as const,
      animationDelay: 0.3
    },
    { 
      Component: Slide008, 
      pinned: false, 
      title: "생성 AI의 급속한 성장",
      enableAnimation: true,
      animationType: 'fade' as const,
      animationDelay: 0.4
    },
    { 
      Component: Slide009, 
      pinned: false, 
      title: "Agent 기술의 발전",
      enableAnimation: true,
      animationType: 'slideDown' as const,
      animationDelay: 0.2
    },
    { 
      Component: Slide010, 
      pinned: true, 
      title: "A2A 도입 효과",
      enableAnimation: true,
      animationType: 'scale' as const,
      animationDelay: 0.5
    },
    { 
      Component: Slide011, 
      pinned: false, 
      title: "시니어 라이프 메이트 시나리오",
      enableAnimation: true,
      animationType: 'slideUp' as const,
      animationDelay: 0.3
    },
    { 
      Component: Slide012, 
      pinned: false, 
      title: "은행 업무 자동화 시나리오",
      enableAnimation: true,
      animationType: 'fade' as const,
      animationDelay: 0.2
    },
    { 
      Component: Slide013, 
      pinned: false, 
      title: "의료 예약 관리 시나리오",
      enableAnimation: true,
      animationType: 'slideDown' as const,
      animationDelay: 0.4
    },
    { 
      Component: Slide014, 
      pinned: false, 
      title: "A2A 시나리오 종합",
      enableAnimation: true,
      animationType: 'scale' as const,
      animationDelay: 0.1
    },
    { 
      Component: Slide015, 
      pinned: false, 
      title: "모두의 가능 A2A",
      enableAnimation: true,
      animationType: 'fade' as const,
      animationDelay: 0.3
    },
    { 
      Component: Slide016, 
      pinned: true, 
      title: "3단계 로드맵",
      enableAnimation: true,
      animationType: 'slideUp' as const,
      animationDelay: 0.4
    }
  ], []);

  // 시나리오 데이터 로드 - ID 순서대로 단순 배열로 변환
  type BasicScenario = { id: string; title: string; description?: string };
  const scenarios: BasicScenario[] = useMemo(() => {
    const raw = scenariosData as Record<string, { id: string; title: string; description?: string }>;
    return Object.values(raw).map((s) => ({ id: s.id, title: s.title, description: s.description }));
  }, []);

  // 모든 섹션을 하나의 배열로 통합
  const sections = useMemo<SectionData[]>(() => {
    const slidesSections: SectionData[] = slideComponents.map((slide) => ({
      type: 'slide',
      Component: slide.Component,
      pinned: slide.pinned,
      title: slide.title,
    }));

    // 시나리오마다 2개 섹션: 설명 + 데모뷰
    const scenarioSections: SectionData[] = scenarios.flatMap((scenario) => [
      // 시나리오 설명 섹션 (pinning 없음)
      {
        type: 'scenario-intro' as const,
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        pinEnd: '',
        pinned: false,
      },
      // 시나리오 데모뷰 섹션 (pinning 적용)
      {
        type: 'scenario' as const,
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        pinned: true,
      },
    ]);

    return [...slidesSections, ...scenarioSections];
  }, [slideComponents, scenarios]);

  // 섹션 초기화
  useEffect(() => {
    initializeSections(sections.length);
  }, [sections.length, initializeSections]);

  // 통합된 ScrollTrigger 설정
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const triggers: ScrollTriggerType[] = [];
    const refsSnapshot = [...sectionRefs.current];

    sectionRefs.current.forEach((sectionRef, index) => {
      if (!sectionRef || !sections[index] || !sections[index].pinned) return;

      // 시나리오 섹션은 더 긴 pinning 구간, 슬라이드는 기본값 사용
      const section = sections[index];
      const pinEnd = section.type === 'scenario' ? '+=3000' : '+=2000'; // 슬라이드도 충분한 시간 제공

      const trigger = ScrollTrigger.create({
        trigger: sectionRef,
        start: 'top top',
        end: pinEnd,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: process.env.NODE_ENV === 'development',
        onToggle: (self) => {
          // Clear previous timeout if exists
          if (sectionRef.dataset.timeoutId) {
            window.clearTimeout(parseInt(sectionRef.dataset.timeoutId));
          }

          const isActive = self.isActive; // pinned 활성화 여부
          const direction = self.direction; // 1: down, -1: up

          updateSectionState(index, {
            isPinned: isActive,
            isEntering: isActive && direction !== -1,
            isLeaving: !isActive && direction !== 1,
          });

          // Debounce enter/leave flags reset
          const t = window.setTimeout(() => {
            updateSectionState(index, {
              isEntering: false,
              isLeaving: false,
            });
          }, 250);
          sectionRef.dataset.timeoutId = String(t);
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      refsSnapshot.forEach((ref) => {
        if (ref?.dataset.timeoutId) {
          window.clearTimeout(parseInt(ref.dataset.timeoutId));
        }
      });
    };
  }, [sections, updateSectionState]);

  return (
    <div className="w-full">
      {sections.map((section, index) => {
        // 슬라이드 섹션 렌더링
        if (section.type === 'slide') {
          const { Component, enableAnimation = true, animationType = 'fade', animationDelay = 0.3 } = section;
          return (
            <section
              key={`slide-${index}`}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[index] = el;
              }}
              className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-7xl px-4">
                {enableAnimation ? (
                  <AnimatedSlide 
                    sectionIndex={index} 
                    animationType={animationType} 
                    delay={animationDelay}
                  >
                    {Component && <Component sectionIndex={index} />}
                  </AnimatedSlide>
                ) : (
                  Component && <Component sectionIndex={index} />
                )}
              </div>
            </section>
          );
        }

        // 시나리오 설명 섹션 렌더링 (no pinning)
        if (section.type === 'scenario-intro') {
          const { id, title, description } = section;
          const scenarioIndex = scenarios.findIndex(s => s.id === id);
          return (
            <section
              key={`scenario-intro-${id}-${index}`}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[index] = el;
              }}
              className="min-h-screen flex items-center justify-center bg-background w-full py-20"
            >
              <div className="w-full max-w-4xl px-4 text-center">
                <h1 className="text-4xl font-bold mb-6 text-foreground">
                  시나리오 {scenarioIndex + 1}: {title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    아래로 스크롤하여 시나리오를 체험해보세요
                  </p>
                </div>
              </div>
            </section>
          );
        }

        // 시나리오 데모뷰 섹션 렌더링 (pinning)
        if (section.type === 'scenario') {
          const { id, title } = section;
          return (
            <ScenarioSectionContent
              key={`scenario-demo-${id}-${index}`}
              sectionIndex={index}
              scenarioId={id!}
              title={title}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[index] = el;
              }}
            />
          );
        }

        return null;
      })}

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

// 개별 시나리오 섹션 컴포넌트
interface ScenarioSectionContentProps {
  sectionIndex: number;
  scenarioId: string;
  title: string;
}

const ScenarioSectionContent = React.forwardRef<HTMLDivElement, ScenarioSectionContentProps>(
  ({ sectionIndex, scenarioId, title }, ref) => {
    const { state } = useSectionPinning(sectionIndex);

    return (
      <section
        ref={ref}
        className="h-screen overflow-hidden flex items-center justify-center bg-background w-full"
      >
        <div className="w-full max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              시나리오 체험: {title}
            </h2>
            <p className="mb-4 text-muted-foreground">
              이 섹션이 고정됩니다 - 스크롤로 시나리오를 제어해보세요
            </p>
            <div className="text-sm text-muted-foreground">
              상태: {state.isPinned ? '고정됨' : '해제됨'} | 
              {state.isEntering && ' 진입중'} | 
              {state.isLeaving && ' 퇴장중'}
            </div>
          </div>

          <div className="w-full">
            <ScenarioContextProvider>
              <div className="mb-4">
                <ScenarioLoader
                  initialScenarioId={scenarioId}
                  onScenarioLoaded={(id) => console.log(`Scenario ${id} loaded`)}
                  onScenarioError={(error) => console.error(`Scenario load error: ${error}`)}
                />
              </div>
              <ScrollControls
                enabled={true}
                threshold={30}
                pinnedState={state}
                excludeSelectors={[
                  '.overflow-y-auto',
                  '[class*="scrollbar"]',
                  '.scrollbar-hide',
                  '#demoview',
                  '.message-container',
                  '[class*="voice"]',
                  '.voice-screen'
                ]}
                autoScrollThreshold={50}
              />
              <DemoView />
            </ScenarioContextProvider>
          </div>
        </div>
      </section>
    );
  }
);

ScenarioSectionContent.displayName = 'ScenarioSectionContent';

export function GSAPPinningDemo() {

  return (
    <PinningProvider>
      <GSAPPinningDemoContent />
    </PinningProvider>
  );
}

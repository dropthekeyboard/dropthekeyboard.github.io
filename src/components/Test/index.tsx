import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoView } from '../DemoView';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { ScenarioSelector } from '../ControlHeader/ScenarioSelector';
import { ScrollControls } from '../ControlHeader/ScrollControls';
import { PinningContext, type PinningContextType } from '@/contexts/pinning';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPPinningDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const [pinningState, setPinningState] = useState<PinningContextType>({
    isPinned: false,
    isEntering: false,
    isLeaving: false,
  });

  useEffect(() => {
    if (!section2Ref.current) {
      console.warn('Section 2 ref is not available');
      return;
    }

    // GSAP가 로드되었는지 확인
    if (!gsap || !ScrollTrigger) {
      console.error('GSAP or ScrollTrigger is not loaded');
      return;
    }

    // 기존 ScrollTrigger 정리
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    console.log('Creating ScrollTrigger for section 2');

    // Section 2에 Pinning 적용
    const trigger = ScrollTrigger.create({
      trigger: section2Ref.current,
      start: "top top",
      end: "+=2000", // 2000px 스크롤 후 해제
      pin: true,
      pinSpacing: true, // 공간 유지
      markers: process.env.NODE_ENV === 'development', // 개발 환경에서만 마커 표시
      onEnter: () => {
        console.log('Pinning started - Section 2 entered viewport');
        setPinningState({
          isPinned: true,
          isEntering: true,
          isLeaving: false,
        });
        // entering 상태를 잠시 후 false로 리셋
        setTimeout(() => {
          setPinningState(prev => ({ ...prev, isEntering: false }));
        }, 100);
      },
      onLeave: () => {
        console.log('Pinning ended - Section 2 left viewport');
        setPinningState({
          isPinned: false,
          isEntering: false,
          isLeaving: true,
        });
        // leaving 상태를 잠시 후 false로 리셋
        setTimeout(() => {
          setPinningState(prev => ({ ...prev, isLeaving: false }));
        }, 100);
      },
      onEnterBack: () => {
        console.log('Pinning re-entered - scrolling back up');
        setPinningState({
          isPinned: true,
          isEntering: true,
          isLeaving: false,
        });
      },
      onLeaveBack: () => {
        console.log('Pinning left back - scrolling back up');
        setPinningState({
          isPinned: false,
          isEntering: false,
          isLeaving: true,
        });
      },
    });

    console.log('ScrollTrigger created successfully', trigger);

    // 클린업 함수
    return () => {
      console.log('Cleaning up ScrollTrigger');
      trigger.kill();
    };
  }, []); // 빈 dependency array로 컴포넌트 마운트 시 한 번만 실행

  return (
    <PinningContext.Provider value={pinningState}>
      <div ref={containerRef} className="w-full items-center justify-center">
        {/* Section 1 */}
        <section className="min-h-screen flex items-center justify-center bg-background w-full">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Section 1</h1>
            <p className="text-muted-foreground">스크롤을 내려보세요</p>
          </div>
        </section>

        {/* Section 2 - Pinning */}
        <section
          ref={section2Ref}
          className="min-h-screen flex items-center justify-center bg-background w-full"
        >
          <div className="w-full max-w-7xl px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground">Section 2 (Pinning)</h1>
              <p className="mb-4 text-muted-foreground">이 섹션이 고정됩니다 - 스크롤로 시나리오를 제어해보세요</p>
            </div>

            <div className="w-full">
              <ScenarioContextProvider>
                <ScrollControls enabled={true} threshold={15} />
                <ScenarioSelector />
                <DemoView />
              </ScenarioContextProvider>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="min-h-screen flex items-center justify-center bg-background w-full">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Section 3</h1>
            <p className="text-muted-foreground">Pinning이 해제됩니다</p>
          </div>
        </section>
      </div>
    </PinningContext.Provider>
  );
}

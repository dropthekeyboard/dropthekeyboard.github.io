# Slide 컴포넌트 시스템 완전 분석 가이드

## 📋 목차

1. [전체 아키텍처 개요](#1-전체-아키텍처-개요)
2. [핵심 컴포넌트 심화 분석](#2-핵심-컴포넌트-심화-분석)
3. [GSAP 애니메이션 시스템](#3-gsap-애니메이션-시스템)
4. [Pinning Context 연동](#4-pinning-context-연동)
5. [모바일 최적화 전략](#5-모바일-최적화-전략)
6. [개별 슬라이드 분석](#6-개별-슬라이드-분석)
7. [성능 최적화 기법](#7-성능-최적화-기법)
8. [개발 가이드라인](#8-개발-가이드라인)

---

## 1. 전체 아키텍처 개요

### 1.1 컴포넌트 구조

```
src/components/Slide/
├── GSAPSlidesPage.tsx        # 메인 페이지 컨테이너
├── SlideGSAPSection.tsx      # 개별 슬라이드 래퍼 (GSAP 연동)
├── ImageSlide.tsx            # 이미지 전용 슬라이드
├── Slide001.tsx - Slide017.tsx  # 개별 슬라이드 컴포넌트
└── index.ts                  # 내보내기 통합
```

### 1.2 기술 스택 통합

- **GSAP 3.13.0**: 고성능 애니메이션 및 ScrollTrigger
- **@gsap/react 2.1.2**: React 전용 GSAP 훅 (`useGSAP`)
- **PinningContext**: 전역 pin 상태 관리
- **TailwindCSS**: 유틸리티 퍼스트 스타일링
- **TypeScript**: 강력한 타입 안전성

### 1.3 주요 특징

- **18개 슬라이드**: Slide001 ~ Slide017 + ImageSlides
- **스크롤 기반 애니메이션**: ScrollTrigger 활용
- **Pinning 시스템**: 섹션별 고정 효과
- **모바일 최적화**: 터치 제스처 및 성능 최적화
- **컨텍스트 연동**: 전역 상태와 개별 슬라이드 연결

---

## 2. 핵심 컴포넌트 심화 분석

### 2.1 GSAPSlidesPage.tsx

#### 역할 및 책임

- 18개 슬라이드의 최상위 컨테이너
- PinningProvider로 전역 상태 관리
- 모바일 터치 제스처 처리
- ScrollTrigger 글로벌 설정

#### 주요 기능

```tsx
// 모바일 터치 제스처
const handleTouchStart = useCallback(
  (e: TouchEvent) => {
    if (!isMobile) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  },
  [isMobile]
);

// 스와이프 기반 네비게이션
const navigateToSlide = useCallback((slideIndex: number) => {
  const slideElement = document.querySelector(
    `[data-slide-index="${slideIndex}"]`
  );
  if (slideElement) {
    slideElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}, []);
```

#### ScrollTrigger 글로벌 관리

```tsx
useLayoutEffect(() => {
  // 글로벌 기본값 설정
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    scroller: window,
    markers: false,
  });

  // 성능 최적화 설정
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 150,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  });
}, []);
```

### 2.2 SlideGSAPSection.tsx

#### 핵심 역할

- 개별 슬라이드의 GSAP 애니메이션 래퍼
- ScrollTrigger 기반 애니메이션 제어
- PinningContext와의 상태 동기화
- 모바일 성능 최적화

#### 애니메이션 바리언트 시스템

```tsx
export type AnimationVariant =
  | 'fadeUp'
  | 'scaleIn'
  | 'rotateIn'
  | 'slideLeft'
  | 'slideRight'
  | 'bounceIn'
  | 'none';

const initialMap: Record<AnimationVariant, gsap.TweenVars> = {
  fadeUp: { y: 60, opacity: 0 },
  scaleIn: { scale: 0.8, opacity: 0 },
  rotateIn: { rotation: -180, opacity: 0 },
  slideLeft: { x: -120, opacity: 0 },
  slideRight: { x: 120, opacity: 0 },
  bounceIn: { y: -30, opacity: 0 },
  none: {},
};
```

#### 모바일 최적화 로직

```tsx
const mobileOptimizations = useMemo(() => {
  if (!isMobile) return { duration, scrub, refreshPriority: -1 };

  return {
    duration: Math.max(duration * 0.6, 0.2), // 빠른 애니메이션
    scrub: typeof scrub === 'boolean' ? scrub : Math.min(scrub * 1.2, 2),
    refreshPriority: -100, // 높은 우선순위
    fastScrollEnd: 0.3,
  };
}, [duration, scrub, isMobile]);
```

#### Pinning 통합

```tsx
const st: ScrollTrigger.Vars = {
  trigger: containerElement,
  start: pin ? 'top top' : start, // pin 시 정확한 시작점
  end: pin ? end || `+=${pinDistance}` : end,
  pin,
  pinSpacing,
  // PinningContext 연동
  onToggle: (self) => {
    updateSectionState?.(sectionIndex, {
      isPinned: self.isActive,
      isEntering: self.direction === 1,
      isLeaving: self.direction === -1,
    });
  },
};
```

### 2.3 ImageSlide.tsx

#### 특징

- 이미지 전용 최적화된 슬라이드
- `object-contain` 으로 비율 유지
- 전체 화면 immersive 경험

```tsx
const ImageSlide: React.FC<ImageSlideProps> = ({ imageUrl }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src={imageUrl}
        alt="Immersive Slide"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
```

---

## 3. GSAP 애니메이션 시스템

### 3.1 useGSAP 훅 활용

```tsx
useGSAP(() => {
  // React Strict Mode 안전성
  const containerElement = containerRef.current;
  if (!containerElement) return;

  // 기존 트리거 정리
  const existingTriggers = ScrollTrigger.getAll().filter(
    trigger => trigger.trigger === containerElement
  );
  existingTriggers.forEach(trigger => trigger.kill());

  // 타임라인 생성
  const tl = gsap.timeline({
    scrollTrigger: scrollTriggerConfig,
    overwrite: "auto",
    immediateRender: false
  });

  return tl; // 자동 정리
}, {
  scope: containerRef,
  dependencies: [variant, duration, delay, ...]
});
```

### 3.2 애니메이션 타겟 탐지

```tsx
// 우선순위: [data-anim] > container
const target = container?.querySelector('[data-anim]') || container;

if (target && document.contains(target)) {
  gsap.set(target, tweenVarsFrom);
  tl.to(target, {
    ...tweenVarsTo,
    stagger: stagger ? { amount: stagger } : undefined,
  });
}
```

### 3.3 성능 최적화 전략

#### GPU 가속 활용

```tsx
// 3D 변환으로 GPU 레이어 생성
force3D: true,
transformOrigin: "center center",
will_change: "transform, opacity"
```

#### 콜백 제한

```tsx
ScrollTrigger.config({
  limitCallbacks: true,
  syncInterval: 150, // 콜백 주기 제한
  autoRefreshEvents: 'resize', // 필수 이벤트만
});
```

---

## 4. Pinning Context 연동

### 4.1 상태 구조

```tsx
interface SectionState {
  isPinned: boolean;
  isEntering: boolean;
  isLeaving: boolean;
}

interface PinningState {
  sections: Record<number, SectionState>;
}
```

### 4.2 useSectionPinning 훅

```tsx
// Slide005.tsx 예시
const { state } = useSectionPinning(sectionIndex);
const isPinned = state.isPinned;

// 차트 애니메이션 트리거
<div
  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
  style={{ width: `${isPinned ? displayWidth : 0}%` }}
/>;
```

### 4.3 상태 업데이트 플로우

```
SlideGSAPSection ScrollTrigger onToggle
      ↓
PinningContext updateSectionState
      ↓
useSectionPinning 훅으로 상태 구독
      ↓
개별 슬라이드 컴포넌트 리렌더링
      ↓
애니메이션/차트 업데이트
```

---

## 5. 모바일 최적화 전략

### 5.1 터치 제스처 처리

```tsx
// 스와이프 감지 기준
const minSwipeDistance = 50; // 최소 거리
const maxSwipeTime = 500; // 최대 시간
const maxVerticalDistance = 100; // 수직 허용 범위

// 유효한 수평 스와이프 검증
if (
  Math.abs(deltaX) > minSwipeDistance &&
  Math.abs(deltaY) < maxVerticalDistance &&
  deltaTime < maxSwipeTime
) {
  navigateToSlide(newIndex);
}
```

### 5.2 성능 최적화

#### 애니메이션 속도 조정

```tsx
duration: Math.max(duration * 0.6, 0.2),  // 40% 빠르게
ease: isMobile ? "power1.out" : ease       // 간단한 easing
```

#### 터치 이벤트 최적화

```tsx
touchAction: 'pan-y',                    // 세로 스크롤만 허용
WebkitOverflowScrolling: 'touch',        // iOS 네이티브 스크롤
overscrollBehavior: 'contain'            // 바운스 제한
```

### 5.3 메모리 관리

```tsx
// 디바운싱된 스크롤 추적
let scrollTimeout: NodeJS.Timeout;
const throttledScrollHandler = () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(handleScroll, 100);
};
```

---

## 6. 개별 슬라이드 분석

### 6.1 슬라이드 분류

#### A. 컨텐츠 전용 슬라이드

- **Slide001**: 비디오 백그라운드 + 오버레이 텍스트
- **Slide002**: 풀스크린 이미지 + 그라데이션 오버레이
- **Slide007**: 텍스트 중심 메시지 슬라이드
- **Slide008**: 정보 카드 레이아웃

#### B. 인터랙티브 슬라이드

- **Slide003**: GSAP 기반 카드 애니메이션
- **Slide005**: Pinning 연동 차트 애니메이션
- **ImageSlides**: 동적 이미지 로딩

#### C. 하이브리드 슬라이드

- **Slide017**: 컴포넌트 박스 그리드 시스템

### 6.2 상세 분석

#### Slide001 - 비디오 슬라이드

```tsx
// 전체 화면 비디오 배경
<video className="absolute inset-0 w-full h-full object-cover z-0"
       autoPlay controls loop muted playsInline>
  <source src="/video_cut_020_100.mp4" type="video/mp4" />
</video>

// 오버레이 텍스트 (z-index 계층)
<div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
  <div className="text-center text-white">
    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Slide 001</h1>
  </div>
</div>
```

#### Slide003 - GSAP 애니메이션 슬라이드

```tsx
// 독립적인 GSAP 컨텍스트 생성
const ctx = gsap.context(() => {
  // 제목 애니메이션
  gsap.fromTo(
    titleRef.current,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
  );

  // 카드 순차 애니메이션
  gsap.fromTo(
    cardsRef.current?.children || [],
    { y: 80, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, stagger: 0.2, ease: 'back.out(1.7)' }
  );
}, containerRef);
```

#### Slide005 - Pinning 연동 차트

```tsx
function Slide005({ sectionIndex = 0 }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  const isPinned = state.isPinned;

  // 핀 상태에 따른 차트 애니메이션
  return (
    <div
      style={{ width: `${isPinned ? displayWidth : 0}%` }}
      className="transition-all duration-1200 ease-out"
    />
  );
}
```

#### Slide008 - 정보 카드 레이아웃

```tsx
// 데이터 기반 렌더링
const page8Data = {
  title: '기존 A2A 시도에서 드러난 제약',
  duplexBox: { title: 'Google Duplex (2018년)' },
  flowBox: {
    title: '앱 기반 콜의 구조적 한계',
    steps: [
      /* 플로우 단계 배열 */
    ],
  },
};

// 카드 기반 레이아웃
<Card className="bg-card border-border p-6">
  <CardContent>{/* 컨텐츠 */}</CardContent>
</Card>;
```

---

## 7. 성능 최적화 기법

### 7.1 GSAP 최적화

#### 컨텍스트 관리

```tsx
// useGSAP 자동 정리 활용
useGSAP(
  () => {
    // 애니메이션 로직
    return timeline; // 자동으로 kill() 호출됨
  },
  { scope: containerRef }
);
```

#### 중복 방지

```tsx
// 기존 트리거 정리
const existingTriggers = ScrollTrigger.getAll().filter(
  (trigger) => trigger.trigger === containerElement
);
existingTriggers.forEach((trigger) => trigger.kill());
```

### 7.2 React 최적화

#### useMemo 활용

```tsx
const mobileOptimizations = useMemo(
  () => ({
    duration: isMobile ? duration * 0.6 : duration,
    scrub: isMobile ? Math.min(scrub * 1.2, 2) : scrub,
  }),
  [duration, scrub, isMobile]
);
```

#### useCallback 메모이제이션

```tsx
const navigateToSlide = useCallback(
  (slideIndex: number) => {
    // 네비게이션 로직
  },
  [totalSlides]
);
```

### 7.3 메모리 관리

#### 이벤트 리스너 정리

```tsx
useEffect(() => {
  const cleanup = () => {
    clearTimeout(scrollTimeout);
    window.removeEventListener('resize', onResize);
  };
  return cleanup;
}, []);
```

#### 조건부 렌더링

```tsx
{
  isMobile && (
    <MobileSlideIndicator
      currentSlide={currentSlideIndex}
      totalSlides={totalSlides}
    />
  );
}
```

---

## 8. 개발 가이드라인

### 8.1 새 슬라이드 추가

#### 1. 컴포넌트 생성

```tsx
// SlideXXX.tsx
function SlideXXX() {
  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background">
      {/* 슬라이드 내용 */}
    </div>
  );
}

export default SlideXXX;
```

#### 2. index.ts 업데이트

```tsx
export { default as SlideXXX } from './SlideXXX';

export const allSlides = [
  // 기존 슬라이드들...
  'SlideXXX',
] as const;
```

#### 3. GSAPSlidesPage에 추가

```tsx
<SlideGSAPSection sectionIndex={N} variant="fadeUp" data-slide-index={N}>
  <SlideXXX />
</SlideGSAPSection>
```

### 8.2 애니메이션 패턴

#### 기본 페이드 애니메이션

```tsx
<SlideGSAPSection variant="fadeUp" duration={1}>
  <YourSlide />
</SlideGSAPSection>
```

#### Pinning 활용

```tsx
<SlideGSAPSection pin pinDistance={1500} scrub={0.8} variant="scaleIn">
  <InteractiveSlide />
</SlideGSAPSection>
```

#### 컨텍스트 연동

```tsx
function YourSlide({ sectionIndex }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);

  return (
    <div className={state.isPinned ? 'active' : 'inactive'}>
      {/* 핀 상태 기반 렌더링 */}
    </div>
  );
}
```

### 8.3 모바일 고려사항

#### 터치 친화적 디자인

```tsx
// 터치 타겟 크기 확보 (최소 44px)
className = 'min-h-[44px] min-w-[44px]';

// 터치 피드백 제공
className = 'active:scale-95 transition-transform';
```

#### 성능 최적화

```tsx
// 애니메이션 간소화
const duration = isMobile ? 0.3 : 0.8;
const ease = isMobile ? 'power1.out' : 'back.out(1.7)';
```

### 8.4 디버깅 가이드

#### ScrollTrigger 마커 활성화

```tsx
ScrollTrigger.defaults({ markers: true }); // 개발 시에만
```

#### 상태 로깅

```tsx
onToggle: (self) => {
  console.log('Section', sectionIndex, 'isPinned:', self.isActive);
};
```

#### 성능 모니터링

```tsx
// GSAP 성능 정보
console.log(gsap.globalTimeline.getChildren());
```

---

## 9. 트러블슈팅

### 9.1 일반적인 문제

#### ScrollTrigger 중복 생성

**증상**: 애니메이션이 여러 번 실행됨
**해결**: 기존 트리거 kill() 후 새로 생성

#### 모바일에서 부드럽지 않은 스크롤

**증상**: 터치 스크롤이 끊김
**해결**: `touchAction: 'pan-y'` 및 `overscrollBehavior: 'contain'` 적용

#### Pinning 상태 동기화 실패

**증상**: 차트/애니메이션이 핀 상태와 맞지 않음  
**해결**: `useSectionPinning(sectionIndex)` 올바른 인덱스 전달 확인

### 9.2 성능 문제

#### 메모리 누수

**증상**: 장시간 사용 시 성능 저하
**해결**: useGSAP 컨텍스트 및 이벤트 리스너 정리

#### 레이아웃 시프트

**증상**: 슬라이드 전환 시 깜빡임
**해결**: `min-h-screen` 및 적절한 컨테이너 크기 설정

---

## 10. 향후 개선 사항

### 10.1 성능 개선

- Web Workers 활용한 백그라운드 처리
- 이미지 레이지 로딩 구현
- Virtual scrolling 적용

### 10.2 접근성 개선

- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 고대비 모드 지원

### 10.3 UX 개선

- 스와이프 피드백 강화
- 로딩 인디케이터 추가
- 에러 바운더리 구현

---

이 문서는 Slide 컴포넌트 시스템의 완전한 분석을 제공하며, 개발자들이 시스템을 이해하고 확장하는 데 필요한 모든 정보를 담고 있습니다. 지속적인 업데이트를 통해 최신 상태를 유지해 주세요.

# GSAPScrollContext Hook 사용 가이드

## 개요

SlideGSAPSection 컴포넌트가 직접 GSAPScrollContext Provider 역할을 하여 GSAP ScrollTrigger의 실시간 상태 정보를 자식 컴포넌트에 제공합니다.

## 기본 사용법

### 1. SlideGSAPSection으로 감싸기

```tsx
import SlideGSAPSection from '@/components/Slide/SlideGSAPSection';

function MySlide() {
  return (
    <SlideGSAPSection pin={true} scrub={0.8} sectionIndex={0}>
      {/* 여기서 useGSAPScroll 훅 사용 가능 */}
      <ScrollProgressIndicator />
      <MyAnimatedComponent />
    </SlideGSAPSection>
  );
}
```

### 2. useGSAPScroll 훅 사용

```tsx
import { useGSAPScroll } from '@/hooks/useGSAPScroll';

function ScrollProgressIndicator() {
  const {
    // 원본 GSAP 데이터
    progress,           // 0-1 범위
    direction,          // 1: 아래, -1: 위, 0: 정지
    velocity,           // 스크롤 속도
    isActive,           // ScrollTrigger 활성 상태
    isPinned,           // 핀 상태
    isEntering,         // 진입 중
    isLeaving,          // 떠나는 중

    // 편의 계산값들
    scrollAmount,       // 0-100 백분율
    isScrollingDown,    // 아래로 스크롤 중
    isScrollingUp,      // 위로 스크롤 중
    scrollSpeed,        // 스크롤 속도 (절댓값)
    isRapidScroll,      // 빠른 스크롤 여부
    scrollDirection,    // 'up' | 'down' | 'stationary'
    animationSpeed,     // 'slow' | 'normal' | 'fast'

    // 진행도 관련
    isAtStart,          // 시작 지점 (0-1%)
    isAtEnd,            // 끝 지점 (99-100%)
    isInMiddle,         // 중간 지점
  } = useGSAPScroll();

  return (
    <div className="progress-indicator">
      <div className="progress-bar" style={{ width: `${scrollAmount}%` }} />
      <span>{scrollAmount}% - {scrollDirection}</span>
      {isRapidScroll && <span className="rapid">빠른 스크롤!</span>}
    </div>
  );
}
```

### 3. 옵셔널 사용 (useOptionalGSAPScroll)

SlideGSAPSection 바깥에서도 안전하게 사용할 수 있습니다:

```tsx
import { useOptionalGSAPScroll } from '@/hooks/useGSAPScroll';

function OptionalComponent() {
  const gsapData = useOptionalGSAPScroll();

  if (!gsapData) {
    // SlideGSAPSection 바깥에 있음
    return <div>GSAP 데이터 없음</div>;
  }

  // SlideGSAPSection 안에 있음
  return (
    <div>진행도: {gsapData.scrollAmount}%</div>
  );
}
```

## 실제 사용 예시

### 스크롤 진행도 기반 애니메이션

```tsx
function AnimatedElement() {
  const { progress, scrollDirection, animationSpeed } = useGSAPScroll();

  const style = {
    transform: `scale(${0.8 + progress * 0.4})`,
    opacity: progress,
    transition: animationSpeed === 'fast' ? 'none' : 'all 0.3s ease',
  };

  return (
    <div
      style={style}
      className={`element ${scrollDirection === 'down' ? 'scrolling-down' : 'scrolling-up'}`}
    >
      진행도 기반 애니메이션
    </div>
  );
}
```

### 조건부 컴포넌트 렌더링

```tsx
function ConditionalContent() {
  const {
    isAtStart,
    isInMiddle,
    isAtEnd,
    isPinned,
    scrollAmount
  } = useGSAPScroll();

  if (!isPinned) {
    return <div>섹션이 고정되지 않음</div>;
  }

  if (isAtStart) {
    return <StartContent />;
  }

  if (isAtEnd) {
    return <EndContent />;
  }

  if (isInMiddle) {
    return (
      <MiddleContent progress={scrollAmount}>
        중간 단계: {scrollAmount}%
      </MiddleContent>
    );
  }

  return null;
}
```

### 스크롤 속도에 따른 효과

```tsx
function SpeedBasedEffect() {
  const { scrollSpeed, isRapidScroll, animationSpeed } = useGSAPScroll();

  const particleCount = isRapidScroll ? 50 : 10;
  const animationDuration = animationSpeed === 'fast' ? 100 : 500;

  return (
    <div className="effect-container">
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle
          key={i}
          speed={scrollSpeed}
          duration={animationDuration}
        />
      ))}
    </div>
  );
}
```

## ScrollControls와의 통합

ScrollControls는 자동으로 GSAP 데이터를 활용합니다:

```tsx
import { ScrollControls } from '@/components/ControlHeader/ScrollControls';

function MySlide() {
  return (
    <SlideGSAPSection pin={true} scrub={0.8}>
      {/* ScrollControls가 자동으로 GSAP 데이터 활용 */}
      <ScrollControls
        threshold={30}        // 기본 threshold
        useGSAPData={true}    // GSAP 데이터 사용 (기본값)
      />
      <MyContent />
    </SlideGSAPSection>
  );
}
```

ScrollControls의 동적 기능:
- **동적 threshold**: 빠른 스크롤 시 threshold를 50% 감소
- **향상된 로깅**: 스크롤 진행도와 속도 정보 포함
- **fallback 지원**: GSAP 데이터가 없으면 기존 pinnedState 사용

## 타입 정의

```typescript
interface GSAPScrollState {
  // 원본 GSAP 데이터
  progress: number;        // 0-1 범위
  direction: number;       // 1: down, -1: up, 0: stopped
  velocity: number;        // 스크롤 속도
  isActive: boolean;       // ScrollTrigger 활성 상태
  start: number;          // 시작 위치
  end: number;            // 종료 위치

  // Pinning 상태
  isPinned: boolean;       // 핀 상태
  isEntering: boolean;     // 진입 상태
  isLeaving: boolean;      // 떠나는 상태

  // 계산된 편의 값들
  percentage: number;      // progress * 100
  isScrollingDown: boolean;
  isScrollingUp: boolean;
  isRapidScroll: boolean;

  lastUpdate: number;      // 마지막 업데이트 시간
}

// useGSAPScroll이 반환하는 확장된 타입
interface ExtendedGSAPScrollState extends GSAPScrollState {
  scrollAmount: number;        // 0-100 백분율
  scrollSpeed: number;         // 속도 절댓값
  scrollDirection: 'up' | 'down' | 'stationary';
  animationSpeed: 'slow' | 'normal' | 'fast';
  isAtStart: boolean;
  isAtEnd: boolean;
  isInMiddle: boolean;
  // ... 기타 편의 속성들
}
```

## 주의사항

1. **Context 스코프**: `useGSAPScroll`은 반드시 `SlideGSAPSection` 내부에서 사용해야 합니다.
2. **성능**: 스크롤 이벤트가 많이 발생하므로 무거운 계산은 `useMemo`로 최적화하세요.
3. **호환성**: 기존 `useSectionPinning` 훅과 병행 사용 가능합니다.

## 마이그레이션 가이드

기존 코드에서 새로운 훅으로 마이그레이션:

```tsx
// 기존 방식
const { state } = useSectionPinning(sectionIndex);
const { isPinned, isEntering, isLeaving } = state;

// 새로운 방식 (더 많은 정보 제공)
const {
  isPinned,
  isEntering,
  isLeaving,
  progress,
  scrollAmount,
  scrollDirection
} = useGSAPScroll();
```

이제 더 풍부한 GSAP ScrollTrigger 정보를 활용해 인터랙티브한 스크롤 애니메이션을 만들 수 있습니다! 🚀
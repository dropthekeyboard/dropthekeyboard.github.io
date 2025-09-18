# Pinning Context 시스템 분석

## 개요
이 프로젝트는 GSAP ScrollTrigger와 React Context를 결합하여 복잡한 스크롤 기반 인터랙션을 관리하는 시스템을 구현하고 있습니다.

## 아키텍처 구조

### 1. Pinning Context (`/src/contexts/pinning.tsx`)

#### 핵심 타입 정의
```typescript
// 개별 섹션의 Pinning 상태
export interface SectionPinningState {
  isPinned: boolean;    // 현재 고정 상태 여부
  isEntering: boolean;  // 진입 중 상태
  isLeaving: boolean;   // 퇴장 중 상태
}

// 전체 Pinning 관리 Context
export interface PinningContextType {
  states: SectionPinningState[];
  updateSectionState: (index: number, state: Partial<SectionPinningState>) => void;
  getSectionState: (index: number) => SectionPinningState;
  initializeSections: (count: number) => void;
}
```

#### 주요 Hook들
- `usePinning()`: 전체 pinning context에 접근
- `useSectionPinning(sectionIndex)`: 특정 섹션의 상태 관리

### 2. Test 컴포넌트 (`/src/components/Test/index.tsx`)

#### 섹션 구성
Test 컴포넌트는 다음과 같은 섹션들을 관리합니다:

1. **Slide 섹션들**: Slide001 ~ Slide016
2. **Scenario 소개 섹션들**: 각 시나리오별 설명 페이지
3. **Scenario 데모 섹션들**: 실제 인터랙티브 데모

#### Pinning 설정
```typescript
const slideComponents = [
  { Component: Slide001, pinned: false },  // 일반 슬라이드
  { Component: Slide003, pinned: true },   // 고정 슬라이드
  { Component: Slide005, pinned: true },   // 고정 슬라이드 (애니메이션 대상)
  // ...
];
```

#### GSAP ScrollTrigger 통합
```typescript
useEffect(() => {
  sectionRefs.current.forEach((sectionRef, index) => {
    if (!sectionRef || !sections[index] || !sections[index].pinned) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef,
      start: 'top top',
      end: section.type === 'scenario' ? '+=3000' : '+=1000',
      pin: true,
      onToggle: (self) => {
        updateSectionState(index, {
          isPinned: self.isActive,
          isEntering: self.isActive && self.direction !== -1,
          isLeaving: !self.isActive && self.direction !== 1,
        });
      },
    });
  });
}, [sections, updateSectionState]);
```

## 상태 전달 흐름

### 1. 초기화 단계
1. `PinningProvider`가 최상위에서 Context 제공
2. `initializeSections(count)`로 모든 섹션 상태 초기화
3. 각 섹션이 DOM에 마운트되면 ref 등록

### 2. 스크롤 이벤트 처리
1. 사용자가 스크롤 → GSAP ScrollTrigger 감지
2. `onToggle` 콜백에서 `updateSectionState` 호출
3. Context 상태 업데이트
4. 해당 섹션을 구독하는 컴포넌트들 리렌더링

### 3. 컴포넌트에서 상태 사용
```typescript
// Slide 컴포넌트에서
function Slide005({ sectionIndex }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  
  // state.isPinned가 true가 되면 애니메이션 실행
  return (
    <AnimatedBar isActive={state.isPinned} />
  );
}
```

## 핵심 특징

### 1. 섹션 타입별 차별화
- **Slide 섹션**: 짧은 pinning 구간 (`+=1000`)
- **Scenario 섹션**: 긴 pinning 구간 (`+=3000`)
- **Scenario-intro 섹션**: pinning 없음

### 2. 상태 디바운싱
```typescript
// 250ms 후 진입/퇴장 플래그 초기화
const t = window.setTimeout(() => {
  updateSectionState(index, {
    isEntering: false,
    isLeaving: false,
  });
}, 250);
```

### 3. 개발 모드 디버깅
```typescript
markers: process.env.NODE_ENV === 'development'
```

## 사용 패턴

### Slide 컴포넌트에서 애니메이션 적용
```typescript
// 1. SlideProps 타입 정의
export interface SlideProps {
  sectionIndex: number;
}

// 2. 컴포넌트에서 pinning 상태 구독
function AnimatedSlide({ sectionIndex }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  
  // 3. isPinned 상태에 따라 애니메이션 트리거
  return (
    <AnimatedComponent isActive={state.isPinned} />
  );
}
```

### Scenario 컴포넌트에서 인터랙션 제어
```typescript
// ScrollControls에 pinnedState 전달
<ScrollControls
  enabled={true}
  pinnedState={state}
  excludeSelectors={['.overflow-y-auto']}
/>
```

## 확장 가능성

이 시스템은 다음과 같은 확장이 가능합니다:

1. **커스텀 pinning 구간**: `pinEnd` 속성으로 섹션별 개별 설정
2. **애니메이션 체이닝**: `isEntering`, `isLeaving` 상태로 정밀한 타이밍 제어
3. **조건부 pinning**: 동적으로 pinning 활성화/비활성화
4. **중첩 섹션**: 섹션 내부의 하위 섹션 pinning

이 구조를 통해 복잡한 스크롤 기반 인터랙션을 선언적이고 유지보수 가능한 방식으로 관리할 수 있습니다.
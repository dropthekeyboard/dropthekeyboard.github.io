# GSAP ScrollTrigger 코드 개선 지침

## 우선순위별 개선 계획

### Phase 1: 타입 안전성 및 메모리 누수 해결 (Critical)

#### 1.1 타입캐스팅 제거

```typescript
// ❌ 현재 코드
window.clearTimeout(parseInt(ref.dataset.timeoutId));

// ✅ 개선 코드
const timeoutId = ref.dataset.timeoutId;
if (timeoutId && !isNaN(Number(timeoutId))) {
  window.clearTimeout(Number(timeoutId));
}
```

#### 1.2 Timeout 관리 개선

```typescript
// ❌ 현재: DOM dataset 사용
sectionRef.dataset.timeoutId = String(t);

// ✅ 개선: React ref 또는 Map 사용
const timeoutRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

// Cleanup 시
const existingTimeout = timeoutRefs.current.get(index);
if (existingTimeout) {
  clearTimeout(existingTimeout);
}
timeoutRefs.current.set(index, setTimeout(...));
```

#### 1.3 IntersectionObserver 의존성 수정

```typescript
// ❌ 현재
useEffect(() => {
  // observer 로직
}, [sectionRefs, sectionsLength]);

// ✅ 개선
useEffect(() => {
  // observer 로직
}, [sectionsLength]); // sectionRefs 제거
```

### Phase 2: 성능 최적화 (High)

#### 2.1 Progress 계산 최적화

```typescript
// ❌ 현재: 매번 findIndex 실행
sections.findIndex((s) => s.isActive);

// ✅ 개선: 상태로 관리
const [activeIndex, setActiveIndex] = useState(0);
// updateProgressNodes에서 activeIndex 업데이트
```

#### 2.2 ScrollTrigger 설정 통합

```typescript
// 현재: 개별 timeout으로 debounce
// ✅ 개선: 공통 debounce 함수 사용
const debouncedUpdateState = useMemo(
  () =>
    debounce((updates: Array<{ index: number; state: any }>) => {
      updates.forEach(({ index, state }) => updateSectionState(index, state));
    }, 250),
  [updateSectionState]
);
```

### Phase 3: 코드 구조 개선 (Medium)

#### 3.1 Custom Hook 분리

```typescript
// ScrollTrigger 로직을 별도 hook으로 분리
function useScrollTriggers(
  sectionRefs: RefObject<HTMLDivElement[]>,
  sections: SectionData[],
  updateSectionState: Function
) {
  // ScrollTrigger 설정 및 cleanup 로직
}
```

#### 3.2 타입 정의 강화

```typescript
interface TimeoutManager {
  set(key: number, timeout: NodeJS.Timeout): void;
  clear(key: number): void;
  clearAll(): void;
}

interface SectionState {
  isPinned: boolean;
  isEntering: boolean;
  isLeaving: boolean;
}
```

## 구현 체크리스트

### 필수 사항

- [ ] 모든 `parseInt()` 사용처 제거
- [ ] DOM dataset 대신 React 상태 사용
- [ ] IntersectionObserver 의존성 수정
- [ ] timeout cleanup 보장

### 권장 사항

- [ ] Progress 계산 최적화
- [ ] debounce 함수 도입
- [ ] Custom hook 분리
- [ ] 에러 바운더리 추가

### 테스트 포인트

- [ ] 빠른 스크롤 시 메모리 누수 확인
- [ ] 컴포넌트 언마운트 시 cleanup 확인
- [ ] TypeScript strict 모드에서 컴파일 확인
- [ ] 개발자 도구에서 timeout 누적 확인

## 코딩 가이드라인

1. **타입캐스팅 금지**: `as`, `any`, `parseInt()` 등 사용 금지
2. **명시적 타입 가드**: 타입 체크 후 안전한 변환만 사용
3. **리소스 cleanup**: 모든 subscription, timeout, observer 정리
4. **단일 책임**: 각 hook과 함수는 하나의 역할만 담당
5. **에러 처리**: 예상 가능한 실패 상황 대비

## 우선순위 권고

**1주차**: Phase 1 (Critical) 완료
**2주차**: Phase 2 (High) 완료  
**3주차**: Phase 3 (Medium) 및 테스트

이런 단계적 접근으로 안정성을 확보하면서 점진적 개선이 가능합니다.

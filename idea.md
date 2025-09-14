# Phone 시나리오 정의 및 상태 관리 개선

## 작업의 목적

데모 애플리케이션의 아키텍처를 개선하여 확장성과 유지보수성을 높이는 것을 목표로 합니다.

- **상태 관리 중앙화**: 여러 `Phone` 기기의 상태와 행동을 관리하는 `phoneStore`를 도입하여 UI 컴포넌트와 상태 로직을 분리합니다.
- **시나리오 추상화**: 기존의 UI 섹션 기반 시나리오를 명시적인 `Action` 기반으로 재정의하여 시나리오의 가독성과 재사용성을 높입니다.
- **예측 가능한 상태 관리**: Reducer 패턴을 도입하여 복잡한 상태 변경을 더욱 명확하고 안전하게 관리합니다.
- **⭐ (신규) 시나리오 직관성 향상**: `call.start`와 `call.end` 액션 사이의 모든 `message`를 자동으로 `voice` 타입으로 처리하여, 시나리오 작성자가 타입을 명시하지 않아도 되도록 개선합니다.

## 현재의 상태 / 문제점

- **강한 결합**: `scenarioStore`가 UI의 3개 섹션 상태를 직접 관리하여, 시나리오 로직과 UI 구조가 강하게 결합되어 있습니다.
- **불명확한 시나리오 정의**: 시나리오 단계가 UI 위치를 기준으로 정의되어 있어, 실제 어떤 행동이 일어나는지 직관적으로 파악하기 어렵습니다.
- **확장성 한계**: 현재 구조는 3개의 고정된 섹션을 전제로 하므로, 4개 이상의 기기가 상호작용하는 시나리오를 구현하기가 매우 복잡합니다.
- **장황한 시나리오**: 통화 중 메시지와 일반 채팅 메시지를 시나리오에서 명시적으로 구분해야 하는 번거로움이 있습니다.

## 변경 이후의 상태 / 해결 판정 기준

- **`phoneStore` 도입 완료**: Reducer 패턴을 사용하여 여러 `Phone`의 상태를 관리하는 `phoneStore.ts`가 생성됩니다.
- **Action 기반 시나리오 적용 완료**: `ScenarioStep` 타입이 `action` 필드를 포함하도록 변경되며, 모든 시나리오(`.json`) 파일이 새로운 구조로 업데이트됩니다.
- **`useScenarioPlayer` 역할 변경 완료**: 시나리오 플레이어는 `phoneStore`의 `dispatch` 함수를 호출하여 Action을 전달하는 역할만 수행합니다.
- **⭐ 메시지 타입 자동 할당 완료**: 시나리오 플레이어가 통화 상태를 내부적으로 추적하여, `call.start`와 `call.end` 사이의 `message` 액션을 `voice` 타입으로 자동 처리합니다.
- **기능 정상 동작**: 리팩토링 이후 모든 시나리오가 정상 재생되며, 통화 중에는 `VoiceBubble`이, 일반 채팅 중에는 `MessageBubble`이 올바르게 표시됩니다.

## 수정이 필요한 코드 및 수정부분의 코드 스니핏

### 1\. `types/index.ts` 수정

- **설명**: `Message` 타입에 `text`와 `voice`를 구분할 수 있는 `subType` 필드를 추가합니다. 시나리오 `action` 정의는 그대로 유지하여 작성 편의성을 높입니다.

<!-- end list -->

```typescript
// src/types/index.ts

export interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  subType: "text" | "voice"; // 메시지 타입 구분
  timestamp: number;
}

export type ScenarioAction =
  | {
      type: "message";
      from: string;
      to: string;
      content: string;
      animation?: AnimationConfig;
    }
  | { type: "call.start"; from: string; to: string }
  | { type: "call.end"; target: string }
  | { type: "system.process"; content: string; animation?: AnimationConfig };

export interface ScenarioStep {
  id: string;
  action: ScenarioAction;
  timing: {
    delay: number;
    duration: number;
  };
}
```

### 2\. `phoneStore.ts` 수정

- **설명**: `RECEIVE_MESSAGE` 액션이 `subType`을 받을 수 있도록 수정합니다.

<!-- end list -->

```typescript
// src/stores/phoneStore.ts

export type PhoneAction = {
  type: "RECEIVE_MESSAGE";
  toId: string;
  content: string;
  sender: "user" | "agent";
  subType: "text" | "voice";
};
// ... other actions

const phoneReducer = (state: PhoneStore, action: PhoneAction) => {
  switch (action.type) {
    case "RECEIVE_MESSAGE": {
      const toPhone = state.phones.get(action.toId);
      if (toPhone) {
        toPhone.messages.push({
          id: `msg-${Date.now()}`,
          content: action.content,
          sender: action.sender,
          subType: action.subType, // subType 저장
          timestamp: Date.now(),
        });
      }
      break;
    }
    // ...
  }
};
```

### 3\. `useScenarioPlayer.ts` 핵심 로직 수정

- **설명**: 통화 상태를 추적하는 내부 상태(`isCallActive`)를 추가하고, `message` 액션 처리 시 이 상태에 따라 `subType`을 결정하여 `dispatch`합니다.

<!-- end list -->

```typescript
// src/hooks/useScenarioPlayer.ts
import { usePhoneStore } from "@/stores/phoneStore";
// ...

export function useScenarioPlayer() {
  const { dispatch } = usePhoneStore();
  const { updateCenterSection } = useScenarioStore();

  // 통화 상태를 추적하기 위한 ref
  const isCallActive = useRef(false);

  // ...

  const executeStep = useCallback(
    async (step: ScenarioStep) => {
      const { action } = step;

      switch (action.type) {
        case "message":
          dispatch({
            type: "RECEIVE_MESSAGE",
            toId: action.to,
            content: action.content,
            sender: "agent", // 예시
            // 통화 중이면 'voice', 아니면 'text'로 자동 할당
            subType: isCallActive.current ? "voice" : "text",
          });
          break;

        case "call.start":
          isCallActive.current = true; // 통화 시작 상태로 변경
          dispatch({
            type: "START_CALL",
            fromId: action.from,
            toId: action.to,
          });
          break;

        case "call.end":
          isCallActive.current = false; // 통화 종료 상태로 변경
          dispatch({ type: "END_CALL", phoneId: action.target });
          break;

        // ...
      }
    },
    [dispatch, updateCenterSection]
  );

  // reset 함수에 isCallActive 상태 초기화 추가
  const reset = useCallback(
    () => {
      isCallActive.current = false;
      // ... (기존 리셋 로직)
    },
    [
      /* ... */
    ]
  );

  return {
    /* ... */
  };
}
```

### 4\. 시나리오 JSON 예시 (더 간결해진 형태)

- **설명**: 이제 `message` 액션은 통화 중인지 여부에 관계없이 동일한 형태로 작성할 수 있습니다.

<!-- end list -->

```json
{
  "steps": [
    // ...
    {
      "id": "3",
      "action": {
        "type": "call.start",
        "from": "ai_agent",
        "to": "service_provider"
      },
      "timing": { "delay": 1, "duration": 3 }
    },
    {
      "id": "4",
      "action": {
        "type": "message",
        "from": "service_provider",
        "to": "ai_agent",
        "content": "안녕하세요, 무엇을 도와드릴까요?"
      },
      "timing": { "delay": 2, "duration": 3 }
    },
    {
      "id": "5",
      "action": {
        "type": "message",
        "from": "ai_agent",
        "to": "service_provider",
        "content": "네, 예약 관련 문의드립니다."
      },
      "timing": { "delay": 1, "duration": 3 }
    },
    {
      "id": "6",
      "action": { "type": "call.end", "target": "service_provider" },
      "timing": { "delay": 2, "duration": 1 }
    }
    // ...
  ]
}
```

## 재사용 가능한 연관 코드

- **`src/stores/phoneStore.ts`**: 신규 생성 및 Reducer 로직 강화
- **`src/hooks/useScenarioPlayer.ts`**: 통화 상태 추적 로직 추가
- **`src/components/shared/CallScreen/index.tsx`**: `phoneStore`의 `messages` 배열에서 `subType: 'voice'`인 메시지만 필터링하여 `VoiceBubbleOverlay`에 전달하도록 수정
- **`src/components/shared/MessageScreen/index.tsx`**: `phoneStore`의 `messages` 배열에서 `subType: 'text'`인 메시지만 필터링하여 `MessageBubble`로 렌더링하도록 수정

## Test Code 추가 및 수정 필요 부분에 대한 가이드

### 1\. `useScenarioPlayer` 테스트 케이스 추가

- `call.start` 이후 `message` 액션이 `voice` 타입으로 `dispatch`되는지 검증하는 테스트를 추가합니다.
- `call.end` 이후 `message` 액션이 다시 `text` 타입으로 `dispatch`되는지 검증하는 테스트를 추가합니다.

### 2\. UI 컴포넌트 필터링 로직 테스트

- `CallScreen`과 `MessageScreen`이 `messages` 배열을 `subType`에 따라 올바르게 필터링하여 렌더링하는지 확인하는 단위 테스트를 추가합니다.

# N Screen 최적화를 위한 View Layout 설계 (DemoView)

- DemoView를 Landscape과 Portrait의 두가지를 지원
- DemoView은 현재 3가지 Section으로 구성
- Customer Section
  - 사용자의 시나리오를 시각화하는 곳으로 항상 PhoneSection으로 고정
- Agent Section
  - AI Agent의 시나리오 시각화하는 곳으로 설정에 따라 TerminalSection / ReasoningAgentSection이 올 수 있음
- Server Section
  - Service의 공급자, 사람 혹은 AI Agent로 설정에 따라 TerminalSection / ReasoningAgentSection / PhoneSection 모두 올 수 있음

## Landscape의 Layout

- 현재의 3 col layout 유지
- PhoneSection은 항상 35wv를 고정 값으로 가진다. / 9:16 혹은 IPhone의 Aspect Ration를 Enforce
- TerminalSection / ReasoningAgentSection은 25wv로 고정 / 4:6 Aspect Ratio 강제
- 전체 Container에서 CustomerSection 좌측 Margin과 ServerSection의 우측 마진이 같게 유지
- 따라서 전체적으로 항상 가운데 정렬되어 있는 느낌

## Portrait의 Layout

- 2 Col / 1 Col Layout
- 상단 2 Col은 Customer Section / Server Section이 각 40wv씩 차지 / 9:16 혹은 IPhone의 Aspect Ration를 Enforce
- 하단 1 col은 Agent Section이 40wv를 차지하도록 / 4:6 Aspect Ratio 강제

## PhoneSection / TerminalSection / ReasoningAgentSection의 하위 요소 관리

- 위 최외각 Width 기준에 따라 하위 요소가 깨지지 않도록

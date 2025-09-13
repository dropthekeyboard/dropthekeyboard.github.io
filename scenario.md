# SPA 개발 제안

## 개요

- A2A 시나리오 시각적 애니메이션을 통해 데모하기 위한 SPA 제작
- User - AI Agent - Service 제공자간의 메시지 교환이 순차적으로 이루어지는 과정을 자연스럽게 보여줌
- 전체 화면에 White / Black Theme 지원
  - DemoView: 화면은 Demo가 이루어지는 16:9 화면 영역
  - ControlHeader: 그리고 그 밖에 대화 시나리오 및 화면 녹화를 시작할 수 있는 Recording 버튼
- DemoView
  - 실제 폰화면으로 구성된 데모로 재사용 가능한 몇 가지 UI 요소가 필요함
  - 화면은 수평(horizontal) 3개의 Section으로 나뉘며
    - left : 사용자 전화 화면 (사용자 <-> AI Agent)
    - center : AI Agent (Robot Icon, Progress circle)
    - right: 서비스 공급자 전화 화면 (AI Agent <-> 서비스 공급자)
  - Phone 전면 화면 모습 (베젤, 채팅 앱이 열려 있는 모습) 아이폰 유사 디자인 (상단 안테나 Level / Battery bar 표시)
  - Message Bubble (메시지 작성중 `...`의 animation) Whatsapp과 비슷한 모양
  - AI Agent (AI Agent가 중간에 작용함을 시각적으로 표시할 수 있는 progress rotation 등 표시)
  - 메시지 입력 박스 및 전송 버튼 (메시지 입력할 때 한글자씩 추가되는 animation)
- ControlHeader
  - 16:9의 화면 영역 밖에 구성
  - 누르면 Animation이 시작되며 DemoView의 모든 동작이 30fps h264 mp4로 기록됨
  - 시나리오 편집 창
    - 숨길 수 있는 Text Input이 있으며
    - 시나리오는 JSON으로 정의되어 있으며 사전 정의된 시나리오는 Load Scenario를 통해 사전 정의를 load할 수 있음 (아니면 plantuml seq diagram 도 좋을 것 같음)
    - Custom scenario 대응을 위해 Text Input은 편집 가능하며 Recording Button을 누르는 시점에 해당 Input Text의 정의를 기준으로 애니메이션이 시작됨

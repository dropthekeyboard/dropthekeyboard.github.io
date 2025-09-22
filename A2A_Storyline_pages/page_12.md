## **React 컴포넌트 구현 가이드: 보편적 접근성 슬라이드**

### 1\. 🖼️ 이미지 상세 분석

해당 슬라이드는 '보편적 접근성'이라는 주제를 동심원 다이어그램으로 시각화하여 표현하고 있습니다.

- **전체 레이아웃**: 어두운 차콜 색상의 배경 위에 콘텐츠가 중앙에 집중된 깔끔한 레이아웃입니다.
- **제목**: 좌측 상단에 "가치 3. 보편적 접근성"이라는 제목이 흰색 텍스트로 표시되어 있습니다.
- **중앙 다이어그램**:
  - **동심원**: 중앙에는 겹쳐진 원들이 있습니다. 가장 바깥쪽 원은 파란색-보라색 그라데이션 테두리를 가지고 있으며, 내부 원들은 더 어두운 색상으로 채워져 계층 구조를 나타냅니다.
  - **라벨**: 다이어그램의 오른쪽에는 각 원의 범위를 설명하는 3개의 보라색 라벨('휴대폰 보유자', '스마트폰 사용자', '특정 앱 사용자')이 배치되어 있습니다.
- **하단 텍스트**: 다이어그램 아래에는 이 슬라이드의 핵심 메시지를 전달하는 설명 문구가 있으며, 특정 키워드가 굵게 강조되어 있습니다.

### 2\. 🎨 주요 색상 정보 (Color Palette)

디자인에 사용된 주요 색상의 HEX 코드 목록입니다.

| 요소                | 색상          | HEX 코드 (추정치)    |
| :------------------ | :------------ | :------------------- |
| **전체 배경**       | 다크 그레이   | `#282828`            |
| **텍스트 (기본)**   | 화이트        | `#FFFFFF`            |
| **그라데이션 시작** | 브라이트 블루 | `#24C6DC`            |
| **그라데이션 종료** | 딥 퍼플       | `#514A9D`            |
| **내부 원**         | 다크 퍼플     | `#413C7A`, `#2F2B5B` |
| **라벨 배경**       | 브라이트 퍼플 | `#A951F9`            |

### 3\. ✍️ 문구 전체 (Text Content)

- **제목**: `가치 3. 보편적 접근성`
- **라벨 (위에서부터)**: `휴대폰 보유자`, `스마트폰 사용자`, `특정 앱 사용자`
- **하단 설명**: `전화/문자는 휴대폰만 있으면, 추가 앱 설치나 복잡한 세팅 없이 즉시 사용 가능`

### 4\. 💻 React 컴포넌트 구현 가이드 (Code Snippets)

UI를 여러 개의 독립적인 컴포넌트로 나누어 구현하는 것이 효율적입니다. 아래는 `styled-components` 라이브러리를 사용한 예시 코드입니다.

#### **가. 전체 페이지 컴포넌트 (`AccessibilityPage.js`)**

모든 UI 요소를 감싸고 전체적인 레이아웃과 배경색을 지정합니다.

```jsx
import React from 'react';
import styled from 'styled-components';
import AccessibilityDiagram from './AccessibilityDiagram';

const PageContainer = styled.div`
  background-color: #282828;
  color: #ffffff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  font-family: sans-serif;
`;

const Header = styled.h1`
  width: 100%;
  max-width: 900px;
  font-size: 1.75rem;
  font-weight: 300;
  margin-bottom: 1.5rem;

  span {
    font-weight: 700;
  }
`;

const Description = styled.p`
  width: 100%;
  max-width: 900px;
  font-size: 1.1rem;
  margin-top: 2rem;
  color: #e0e0e0;

  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

function AccessibilityPage() {
  return (
    <PageContainer>
      <Header>
        가치 3. <span>보편적 접근성</span>
      </Header>

      <AccessibilityDiagram />

      <Description>
        전화/문자는 <strong>휴대폰만 있으면</strong>, 추가 앱 설치나 복잡한 세팅
        없이 <strong>즉시 사용 가능</strong>
      </Description>
    </PageContainer>
  );
}

export default AccessibilityPage;
```

#### **나. 중앙 다이어그램 컴포넌트 (`AccessibilityDiagram.js`)**

동심원과 라벨을 포함하는 가장 핵심적인 시각 요소입니다. CSS의 `position` 속성을 사용하여 요소들을 겹쳐서 배치합니다.

```jsx
import React from 'react';
import styled from 'styled-components';

// 다이어그램 전체를 감싸는 컨테이너. 내부 요소들의 위치 기준이 됨 (position: relative)
const DiagramContainer = styled.div`
  position: relative;
  width: 550px;
  height: 350px;
  display: flex;
  align-items: center;
`;

// 원들의 공통 스타일. props로 크기, 배경색, 테두리를 다르게 설정
const CircleBase = styled.div`
  position: absolute;
  left: 175px; // 컨테이너 가로 중앙
  top: 50%; // 컨테이너 세로 중앙
  transform: translate(-50%, -50%); // 요소 자체의 중심으로 위치 보정
  border-radius: 50%;

  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.bg || 'transparent'};
  border: ${(props) => props.border || 'none'};
`;

// 그라데이션 테두리를 가진 가장 바깥쪽 원
const GradientCircle = styled(CircleBase)`
  border: 25px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #24c6dc, #514a9d);
`;

// 오른쪽에 위치할 라벨
const InfoLabel = styled.span`
  background-color: #a951f9;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;

  position: absolute;
  left: 350px;

  // top 속성으로 각 라벨의 세로 위치를 지정
  top: ${(props) => props.top};
`;

function AccessibilityDiagram() {
  return (
    <DiagramContainer>
      {/* 원 (바깥쪽부터 순서대로 렌더링) */}
      <GradientCircle size={300} />
      <CircleBase size={220} bg="#413C7A" />
      <CircleBase size={140} bg="#2F2B5B" />

      {/* 라벨 */}
      <InfoLabel top="25%">휴대폰 보유자</InfoLabel>
      <InfoLabel top="45%">스마트폰 사용자</InfoLabel>
      <InfoLabel top="65%">특정 앱 사용자</InfoLabel>
    </DiagramContainer>
  );
}

export default AccessibilityDiagram;
```

**💡 신입 개발자를 위한 Tip:** `position: absolute`를 사용하는 요소는 부모 요소 중 `position`이 `static`(기본값)이 아닌 가장 가까운 요소를 기준으로 위치합니다. 그래서 부모인 `DiagramContainer`에 `position: relative`를 주어 기준점으로 삼는 것이 매우 중요합니다.

## 🖼️ 이미지 상세 분석

해당 이미지는 '신뢰성 확보'라는 가치를 시각적으로 설명하는 프레젠테이션 슬라이드 형식입니다. 주요 구성 요소는 다음과 같습니다.

- **전체 레이아웃**: 어두운 회색 계열의 배경에 콘텐츠가 중앙에 배치된 구조입니다.
- **헤더**: 좌측 상단에 "가치 2. 신뢰성 확보"라는 제목 텍스트가 있습니다.
- **중앙 콘텐츠 영역**:
  - **배경**: 살짝 밝은 회색의 둥근 모서리 사각형 박스가 있습니다.
  - **스마트폰 목업**: 좌측에는 '홍길동 AI Agent'로부터 전화가 오는 아이폰 화면 목업 이미지가 있습니다.
  - **정보 배너**: 우측에는 파란색에서 보라색으로 이어지는 그라데이션 배경의 둥근 배너가 있으며, "SK텔레콤에서 인증한 AI Agent 전화입니다"라는 텍스트가 있습니다.
- **하단 설명 영역**: 중앙 콘텐츠 영역 아래에 두 줄의 설명 텍스트가 있습니다. 특정 키워드('SKT 인증 Agent 발신', '신뢰 기반')는 굵은 글씨로 강조되어 있습니다.

---

## 🎨 주요 색상 정보

디자인에 사용된 주요 색상의 HEX 코드는 다음과 같습니다.

| 요소                  | 색상          | HEX 코드  |
| :-------------------- | :------------ | :-------- |
| **전체 배경**         | 다크 그레이   | `#282828` |
| **콘텐츠 배경**       | 미디엄 그레이 | `#424242` |
| **텍스트 (기본)**     | 화이트        | `#FFFFFF` |
| **그라데이션 (시작)** | 스카이 블루   | `#2AF598` |
| **그라데이션 (종료)** | 비비드 퍼플   | `#009EFD` |

_(참고: 실제 색상은 이미지에서 추출한 근사치이며, 필요에 따라 조정할 수 있습니다.)_

---

## ✍️ 사용된 문구

- **헤더**: `가치 2. 신뢰성 확보`
- **정보 배너**: `SK텔레콤에서 인증한 AI Agent 전화입니다`
- **하단 설명 1**: `당사 전화번호 자산과 가입자 인증 체계를 기반으로,`
- **하단 설명 2**: `‘SKT 인증 Agent 발신’ 같은 라벨을 부착해 업주가 안심할 수 있는 신뢰 기반 제공 가능`

---

## 💻 React 컴포넌트 구현 가이드

전체 UI를 여러 개의 작은 컴포넌트로 나누어 구현하면 관리가 용이합니다. 아래는 `styled-components`를 사용한 예시입니다.

### 1\. 전체 페이지 구조 (`TrustPage.js`)

가장 바깥쪽 레이아웃을 담당하는 컴포넌트입니다.

```jsx
import React from 'react';
import styled from 'styled-components';

// 이미지에서 추출한 컴포넌트들
import Header from './Header';
import ContentBox from './ContentBox';
import Description from './Description';

const PageContainer = styled.div`
  background-color: #282828;
  color: #ffffff;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
`;

function TrustPage() {
  return (
    <PageContainer>
      <Header />
      <ContentBox />
      <Description />
    </PageContainer>
  );
}

export default TrustPage;
```

### 2\. 헤더 컴포넌트 (`Header.js`)

좌측 상단의 제목을 표시합니다.

```jsx
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 900px; /* 콘텐츠 최대 너비에 맞춤 */
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 300;

  span {
    font-weight: 700;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>
        가치 2. <span>신뢰성 확보</span>
      </Title>
    </HeaderContainer>
  );
}

export default Header;
```

### 3\. 중앙 콘텐츠 컴포넌트 (`ContentBox.js`)

스마트폰 목업과 정보 배너를 담는 회색 박스입니다.

```jsx
import React from 'react';
import styled from 'styled-components';
// 이미지 파일을 src 폴더 등에 위치시켜야 합니다.
import phoneMockup from './path/to/page_011_phone.png';

const Box = styled.div`
  background-color: #424242;
  border-radius: 20px;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 900px;
`;

const PhoneImage = styled.img`
  height: 250px;
  width: auto;
`;

const InfoBanner = styled.div`
  background: linear-gradient(90deg, #009efd, #2af598);
  padding: 20px 30px;
  border-radius: 15px;
  font-size: 22px;
  font-weight: 700;
  color: white;
  flex-grow: 1;
  text-align: center;
`;

function ContentBox() {
  return (
    <Box>
      <PhoneImage src={phoneMockup} alt="AI Agent Call" />
      <InfoBanner>SK텔레콤에서 인증한 AI Agent 전화입니다</InfoBanner>
    </Box>
  );
}

export default ContentBox;
```

**※ 참고**: `phoneMockup` 이미지(`page_011_phone.png`)는 원본 이미지에서 따로 잘라내어 사용해야 합니다.

### 4\. 하단 설명 컴포넌트 (`Description.js`)

하단의 설명 텍스트를 담당합니다.

```jsx
import React from 'react';
import styled from 'styled-components';

const DescriptionContainer = styled.div`
  width: 100%;
  max-width: 900px; /* 콘텐츠 최대 너비에 맞춤 */
  margin-top: 30px;
  text-align: left;
`;

const Text = styled.p`
  font-size: 16px;
  color: #e0e0e0;
  line-height: 1.6;
  margin: 5px 0;

  &.main-text {
    font-size: 18px;
    color: #ffffff;
  }

  strong {
    font-weight: 700;
  }
`;

function Description() {
  return (
    <DescriptionContainer>
      <Text>당사 전화번호 자산과 가입자 인증 체계를 기반으로,</Text>
      <Text className="main-text">
        ‘<strong>SKT 인증 Agent 발신</strong>’ 같은 라벨을 부착해 업주가 안심할
        수 있는 <strong>신뢰 기반</strong> 제공 가능
      </Text>
    </DescriptionContainer>
  );
}

export default Description;
```

이 가이드를 바탕으로 각 컴포넌트 파일을 생성하고 코드를 작성하면 이미지와 동일한 결과물을 React로 구현할 수 있습니다. 폰트나 세부적인 간격은 CSS를 통해 미세 조정이 필요할 수 있습니다.

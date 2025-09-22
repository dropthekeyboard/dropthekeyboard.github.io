## 🎨 페이지 디자인 상세 묘사

이 슬라이드는 '앱 사용자'와 '앱 비사용자' 모두에게 '전화/문자'가 왜 필수적인 커뮤니케이션 채널인지를 시각적인 흐름을 통해 명확하게 보여줍니다.

- **전체적인 레이아웃 및 흐름:**
  - **3단 구조:** 슬라이드는 크게 **[왼쪽: 앱 사용자] - [중앙: 연결 채널] - [오른쪽: 앱 비사용자]** 의 3단 구조로 정보를 배치하여 양쪽 고객 그룹을 전화/문자가 어떻게 연결하는지 직관적으로 보여줍니다.
  - **시각적 흐름:** 왼쪽과 오른쪽의 고객군에서 중앙의 '전화/문자' 아이콘으로 점선이 연결되어, 이 채널이 양쪽의 니즈를 모두 보완하는 '다리(Bridge)' 역할을 한다는 점을 시각적으로 강조합니다.
  - **중앙 집중 메시지:** 화면 중앙에는 "앱이 놓치는 영역을 보완하는 가장 보편적인 커뮤니케이션 채널"이라는 핵심 메시지를 크게 배치하여 슬라이드의 주제를 명확히 합니다.

- **타이포그래피 및 색상:**
  - **헤드라인 강조:** 상단 헤드라인("모바일 앱의 범람에도 불구하고 전화/문자는 여전히 필수적")에서 핵심 키워드인 **"전화/문자는 여전히 필수적"** 부분만 더 밝은 흰색과 굵은 폰트로 처리하여 중요도를 높였습니다.
  - **일관된 다크 모드:** 이전 슬라이드와 동일한 깊은 차콜 그레이 배경과 흰색/회색 텍스트를 사용하여 통일성을 유지합니다.
  - **정보 박스:** 각 고객군의 세부 내용은 둥근 사각형의 정보 박스(Pill) 안에 제목(굵은 흰색)과 부가 설명(옅은 회색)으로 구분하여 가독성을 높였습니다.

- **아이콘 및 이미지:**
  - **실제 예시와 일러스트:** 왼쪽에는 실제 모바일 앱 스크린샷을 넣어 '앱 사용자'의 맥락을 보여주고, 오른쪽에는 노년층 일러스트를 사용하여 '앱이 익숙하지 않은 고객'을 시각적으로 표현했습니다.
  - **중앙 아이콘:** 중앙에는 이전 슬라이드와 일관된 **보라색-파란색 그라데이션**이 적용된 전화기 아이콘을 배치하여 시선을 집중시키고 브랜드의 시각적 아이덴티티를 강화합니다.

- **핵심 시각 요소:**
  - **점선 연결:** '전화', '문자' 텍스트 박스와 중앙 아이콘을 연결하는 점선은 데이터나 커뮤니케이션의 흐름을 상징하며, 정적인 디자인에 동적인 느낌을 부여합니다.

---

## 💻 React 구현을 위한 상세 명세서

이 슬라이드는 재사용 가능한 컴포넌트(정보 박스)와 CSS Flexbox 또는 Grid를 활용한 레이아웃 구현이 핵심입니다.

### 1\. 컴포넌트 구조 (Hierarchy)

```
- CommunicationFlowSection (전체 섹션 컨테이너)
  - SectionTitle (상단 헤드라인)
  - FlowContainer (3단 레이아웃 전체를 감싸는 컨테이너)
    - CustomerColumn (왼쪽 컬럼: 앱 사용자)
      - Image (앱 스크린샷)
      - InfoPill (실시간 요청)
      - InfoPill (개인화된 요청)
    - BridgeColumn (중앙 컬럼: 연결고리)
      - BridgeLabel (전화)
      - BridgeIcon (전화기 아이콘)
      - BridgeLabel (문자)
      - BridgeText (중앙 핵심 메시지)
    - CustomerColumn (오른쪽 컬럼: 앱 비사용자)
      - Image (노년층 일러스트)
      - InfoPill (디지털 취약계층)
      - InfoPill (신뢰 기반 거래)
```

### 2\. 데이터 구조 (Data Structure)

각 컬럼의 내용은 데이터 객체로 분리하여 관리하면 코드가 간결해집니다.

**`flowData.js`**

```javascript
export const flowData = {
  appUsers: {
    title: '앱을 사용하는 고객도',
    image: '/images/app-screenshot.png', // 이미지 경로
    pills: [
      {
        id: 'app1',
        title: '실시간 요청',
        subtitle: '예약/변경/결제오류/장애 등',
      },
      {
        id: 'app2',
        title: '개인화된 요청',
        subtitle: '좌석 위치 지정/특정 메뉴 확인 등',
      },
    ],
  },
  nonAppUsers: {
    title: '앱이 익숙하지 않은 고객도',
    image: '/images/elderly-illustration.png', // 이미지 경로
    pills: [
      { id: 'nonapp1', title: '디지털 취약계층', subtitle: '고령/중장년층' },
      { id: 'nonapp2', title: '신뢰 기반 거래', subtitle: '단골 가게 연락 등' },
    ],
  },
};
```

### 3\. 컴포넌트 명세 (Component Specs)

#### A. `CommunicationFlowSection.jsx`

- **역할**: 전체 레이아웃을 구성하고, 정적인 `BridgeColumn`과 데이터 기반의 `CustomerColumn`을 렌더링합니다.
- **Props**: 없음
- **구현**:

  ```jsx
  import React from 'react';
  import { flowData } from './flowData';
  import CustomerColumn from './CustomerColumn';
  import BridgeColumn from './BridgeColumn';
  // ... SectionTitle 컴포넌트 import

  const CommunicationFlowSection = () => {
    return (
      <section className="flow-section">
        {/* SectionTitle 구현 */}
        <div className="flow-container">
          <CustomerColumn data={flowData.appUsers} />
          <BridgeColumn />
          <CustomerColumn data={flowData.nonAppUsers} />
        </div>
      </section>
    );
  };

  export default CommunicationFlowSection;
  ```

#### B. `CustomerColumn.jsx`

- **역할**: 이미지, 컬럼 제목, 여러 개의 `InfoPill`을 렌더링하는 재사용 가능한 컴포넌트입니다.
- **Props**:
  - `data` (object): `flowData`에 정의된 `appUsers` 또는 `nonAppUsers` 객체
- **구현**:

  ```jsx
  import React from 'react';
  import InfoPill from './InfoPill';

  const CustomerColumn = ({ data }) => {
    const { title, image, pills } = data;
    return (
      <div className="customer-column">
        <img src={image} alt={title} className="column-image" />
        <h3 className="column-title">{title}</h3>
        <div className="pills-container">
          {pills.map((pill) => (
            <InfoPill
              key={pill.id}
              title={pill.title}
              subtitle={pill.subtitle}
            />
          ))}
        </div>
      </div>
    );
  };

  export default CustomerColumn;
  ```

#### C. `InfoPill.jsx`

- **역할**: 제목과 부제목을 가진 정보 박스를 렌더링합니다.
- **Props**:
  - `title` (string): 정보 박스의 제목
  - `subtitle` (string): 정보 박스의 부제목
- **구현**:

  ```jsx
  import React from 'react';

  const InfoPill = ({ title, subtitle }) => {
    return (
      <div className="info-pill">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
    );
  };

  export default InfoPill;
  ```

### 4\. 스타일링 가이드 (Styling Guide)

**`FlowSection.css`**

```css
.flow-section {
  background-color: #212121;
  color: #ffffff;
  padding: 80px 20px;
  font-family: 'Pretendard', sans-serif;
}

.flow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px; /* 컬럼 사이 간격 */
  margin-top: 60px;
}

.customer-column {
  flex: 1; /* 컬럼 너비 비율 */
  max-width: 350px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
}

.column-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.column-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.pills-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* InfoPill 스타일 */
.info-pill {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 15px;
  text-align: left;
}

.info-pill h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.info-pill p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

/* 중앙 BridgeColumn 스타일 (생략) - Flexbox, 아이콘, 점선 스타일링 필요 */
.bridge-column {
  flex: 0 0 200px; /* 중앙 컬럼 너비 고정 */
  text-align: center;
  position: relative;
}

/* 점선은 ::before, ::after 가상 요소를 사용하거나 SVG로 구현 가능 */
```

### 5\. 에셋 (Assets)

- 왼쪽의 앱 스크린샷 이미지와 오른쪽의 노년층 일러스트 이미지를 각각 PNG 또는 WebP 형식으로 준비해야 합니다.
- 중앙의 그라데이션 전화기 아이콘은 SVG(Scalable Vector Graphics)로 준비하여 색상 및 크기 변경이 용이하도록 하는 것이 가장 좋습니다.

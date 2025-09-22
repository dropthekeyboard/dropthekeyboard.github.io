
## 🎨 페이지 디자인 상세 묘사

해당 페이지는 현대적이고 세련된 다크 모드(Dark Mode) UI를 기반으로, 서비스의 핵심 가치를 세 가지 포인트로 명확하게 전달하고 있습니다.

- **전체 레이아웃 및 색상:**
  - **배경**: 깊은 차콜 그레이 색상(`#212121` 근사치)을 사용하여 전체적으로 차분하고 고급스러운 분위기를 연출합니다. 중앙에서 바깥으로 은은하게 퍼지는 방사형 그라데이션 효과가 더해져 입체감을 줍니다.
  - **구성**: 상단에 메인 헤드라인과 서브 헤드라인이 배치되고, 그 아래에 3개의 주요 특징을 나타내는 카드가 수평으로 정렬된 안정적인 중앙 정렬 구조입니다.
  - **카드**: 배경보다 미세하게 밝은 반투명한 회색(`rgba(255, 255, 255, 0.05)` 근사치)을 사용했으며, 둥근 모서리(rounded corners)를 적용하여 부드러운 느낌을 줍니다.

- **타이포그래피 (폰트):**
  - **메인 헤드라인 ("모두의 AI는 전화/문자에서 시작"):** 크고 굵은(Bold) 흰색 폰트를 사용하여 가장 먼저 눈에 띄도록 강조했습니다. 가독성이 좋은 현대적인 고딕 계열 폰트(Sans-serif)로 보입니다.
  - **서브 헤드라인 ("AI시대, 전화/문자는 왜 여전히 필요할까?"):** 메인 헤드라인보다 작고 얇은 두께의 흰색 폰트로, 핵심 질문을 던지며 흥미를 유발합니다.
  - **카드 제목 ("보편성", "시급성", "확장성"):** 이 페이지의 핵심 시각적 요소로, **보라색에서 하늘색으로 이어지는 선형 그라데이션(Linear Gradient)** 색상을 적용하여 주목도를 높였습니다.
  - **카드 설명 ("일반 국민 누구나" 등):** 간결하고 명확한 흰색 폰트를 사용하여 각 카드의 의미를 쉽게 이해할 수 있도록 돕습니다.

- **아이콘:**
  - 각 카드의 중심에는 핵심 가치를 시각적으로 표현하는 **선(line) 스타일 아이콘**이 배치되어 있습니다.
  - **보편성**: 여러 사람의 모습을 통해 '누구나' 사용할 수 있음을 나타냅니다.
  - **시급성**: 속도감을 나타내는 선이 그려진 시계 아이콘으로 '기다릴 필요 없음'을 상징합니다.
  - **확장성**: 작은 가게 두 곳의 모습을 통해 '소상공인'까지 서비스가 확장될 수 있음을 보여줍니다.
  - 아이콘은 옅은 회색을 사용하여 텍스트를 방해하지 않으면서도 명확하게 의미를 전달합니다.

---

## 💻 React 구현을 위한 상세 명세서

이 섹션을 React 컴포넌트로 구현하기 위한 기술 명세서입니다. 재사용성과 유지보수성을 고려하여 컴포넌트를 분리하는 것을 목표로 합니다.

### 1\. 컴포넌트 구조 (Hierarchy)

```
- FeatureSection (전체 섹션 컨테이너)
  - SectionHeader (헤드라인, 서브 헤드라인 포함)
  - FeatureCardList (카드들을 감싸는 컨테이너)
    - FeatureCard (개별 카드, 3회 반복)
      - Icon
      - CardTitle
      - CardDescription
```

### 2\. 데이터 구조 (Data Structure)

컴포넌트에 전달될 데이터는 배열 형태로 관리하는 것이 효율적입니다.

**`featuresData.js`**

```javascript
export const features = [
  {
    id: 1,
    icon: 'IconUniversality', // SVG 컴포넌트 이름 또는 파일 경로
    title: '보편성',
    description: '일반 국민 누구나',
  },
  {
    id: 2,
    icon: 'IconUrgency',
    title: '시급성',
    description: '찾고 기다릴 필요 없이',
  },
  {
    id: 3,
    icon: 'IconScalability',
    title: '확장성',
    description: '작은 동네 상권까지도',
  },
];
```

### 3\. 컴포넌트 명세 (Component Specs)

#### A. `FeatureSection.jsx`

- **역할**: 전체 섹션을 렌더링하고, `features` 데이터를 하위 컴포넌트로 전달합니다.
- **Props**: 없음
- **State**: 없음
- **구현**:

  ```jsx
  import React from 'react';
  import { features } from './featuresData';
  import SectionHeader from './SectionHeader';
  import FeatureCardList from './FeatureCardList';

  const FeatureSection = () => {
    return (
      <section className="feature-section">
        <SectionHeader
          title="모두의 AI는 전화/문자에서 시작"
          subtitle="AI시대, 전화/문자는 왜 여전히 필요할까?"
        />
        <FeatureCardList features={features} />
      </section>
    );
  };

  export default FeatureSection;
  ```

#### B. `FeatureCardList.jsx`

- **역할**: `features` 배열을 받아 `map()` 함수를 통해 여러 개의 `FeatureCard`를 렌더링합니다.
- **Props**:
  - `features` (array): feature 객체들의 배열
- **구현**:

  ```jsx
  import React from 'react';
  import FeatureCard from './FeatureCard';

  const FeatureCardList = ({ features }) => {
    return (
      <div className="card-list">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    );
  };

  export default FeatureCardList;
  ```

#### C. `FeatureCard.jsx`

- **역할**: 아이콘, 제목, 설명을 받아 개별 카드를 렌더링합니다.
- **Props**:
  - `icon` (string or component): 아이콘 컴포넌트 또는 이미지 경로
  - `title` (string): 카드 제목 (예: "보편성")
  - `description` (string): 카드 설명 (예: "일반 국민 누구나")

### 4\. 스타일링 가이드 (Styling Guide)

**CSS-in-JS (e.g., Styled-components) 또는 Tailwind CSS 사용을 권장합니다.** 아래는 CSS 기준의 가이드입니다.

**`FeatureSection.css`**

```css
.feature-section {
  background: radial-gradient(circle, #333, #212121);
  color: #ffffff;
  padding: 80px 20px;
  text-align: center;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif; /* 예시 폰트 */
}

/* ... SectionHeader 스타일 ... */

.card-list {
  display: flex;
  justify-content: center;
  gap: 30px; /* 카드 사이 간격 */
  margin-top: 60px;
  flex-wrap: wrap; /* 모바일 반응형 대응 */
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px;
  width: 300px; /* 카드 너비 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/* 카드 호버 효과 (선택사항) */
.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-card .icon {
  width: 80px;
  height: 80px;
  color: #cccccc; /* 아이콘 색상 */
}

.feature-card .title {
  font-size: 24px;
  font-weight: bold;
  /* 그라데이션 텍스트 구현 */
  background: linear-gradient(90deg, #a076f9, #6495ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.feature-card .description {
  font-size: 16px;
  color: #e0e0e0;
}
```

### 5\. 접근성 (Accessibility)

- 아이콘은 시각적인 요소이므로, `<img>` 태그를 사용할 경우 의미 있는 `alt` 텍스트를 제공하거나, SVG를 사용하고 `role="img"`와 `<title>` 요소를 추가하여 스크린 리더 사용자를 지원해야 합니다.
- 헤드라인은 `<h2>`, 서브 헤드라인은 `<h3>` 또는 `<p>` 등 시맨틱 HTML 태그를 사용하여 문서 구조를 명확히 합니다.

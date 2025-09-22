### \#\# 1. 데이터 구조 (page5Data.js)

컴포넌트에 필요한 모든 텍스트와 데이터를 하나의 객체로 통합하여 관리합니다.

```javascript
export const page5Data = {
  // 헤더와 서브헤더 텍스트
  header: {
    title: 'A2A 확산이 어려운 구조적 요인',
    // 하이라이트 처리를 위해 서브헤더를 배열로 분리
    subtitle: [
      { text: '모두를 위한 A2A 구현에는 일상 속 절대 다수를 차지하는 영세 ' },
      { text: '소상공인', highlight: true },
      { text: '의 참여가 필수적이지만, ' },
      { text: '낮은 디지털화 수준', highlight: true },
      { text: '으로 현실적 제약이 큰 상황' },
    ],
  },
  // 왼쪽 수평 막대 차트 데이터
  barChartData: [
    {
      id: 'smallBiz',
      label: '소상공인 사업체 수',
      subLabel: '동네슈퍼, 카페, 미용실, 세탁소 등',
      valueText: '약 500만 개',
      percentage: 100,
    },
    {
      id: 'largeBiz',
      label: '대기업 사업체 수',
      subLabel: '프랜차이즈, 유통 F&B 등',
      valueText: '약 3,300 개',
      percentage: 5,
    },
  ],
  // 오른쪽 수직 실린더 차트 데이터
  cylinderChartData: [
    {
      id: 'digitalAdoption',
      percentage: 17.5,
      yearLabel: "'24년",
      mainLabel: '소상공인 디지털 도입률*',
    },
    {
      id: 'catchTable',
      percentage: 2.7,
      yearLabel: "'25년",
      mainLabel: '국내 음식점 중 캐치테이블 가입률',
    },
  ],
  // 각주(Footnote) 텍스트
  footnotes: {
    left: '*2023년 소상공인 실태조사 기준',
    right: '*키오스크, 사전예약, 웨이팅보드 등',
  },
};
```

---

### \#\# 2. 컴포넌트 구현 (DataVisSection.jsx)

위 데이터 객체를 가져와 전체 섹션을 렌더링하는 최종 컴포넌트입니다. `HorizontalBarChart`와 `CylinderChart` 컴포넌트는 재사용성을 위해 별도 파일로 분리하는 것을 권장하지만, 여기서는 설명을 위해 하나의 파일에 모두 포함된 형태로 보여드릴 수도 있습니다. (아래는 분리된 구조 기준)

```jsx
import React from 'react';
import { page5Data } from './page5Data';
import HorizontalBarChart from './HorizontalBarChart';
import CylinderChart from './CylinderChart';
import './DataVisSection.css';

const DataVisSection = () => {
  // 데이터 구조 분해 할당
  const { header, barChartData, cylinderChartData, footnotes } = page5Data;

  return (
    <section className="data-vis-section">
      {/* 헤더 및 서브헤더 렌더링 */}
      <header className="section-header">
        <h1>{header.title}</h1>
        <p className="subtitle">
          {header.subtitle.map((part, index) =>
            part.highlight ? (
              <span key={index} className="highlight-text">
                {part.text}
              </span>
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}
        </p>
      </header>

      {/* 차트 그리드 렌더링 */}
      <div className="chart-grid">
        <div className="left-column">
          {barChartData.map((data) => (
            <HorizontalBarChart key={data.id} {...data} />
          ))}
          <p className="footnote">{footnotes.left}</p>
        </div>
        <div className="right-column">
          {cylinderChartData.map((data) => (
            <CylinderChart key={data.id} {...data} />
          ))}
          <p className="footnote">{footnotes.right}</p>
        </div>
      </div>
    </section>
  );
};

export default DataVisSection;
```

---

### \#\# 3. 전체 스타일링 (DataVisSection.css)

헤더, 차트, 각주 등 모든 요소에 대한 CSS 코드 전체입니다.

```css
/* 전체 섹션 스타일 */
.data-vis-section {
  background-color: #212121;
  color: #ffffff;
  padding: 80px 40px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  text-align: center;
}

/* 헤더 스타일 */
.section-header {
  max-width: 800px;
  margin: 0 auto 60px auto;
}

.section-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
}

.section-header .subtitle {
  font-size: 18px;
  color: #e0e0e0;
  line-height: 1.6;
}

/* 하이라이트 텍스트 스타일 */
.highlight-text {
  color: #c3b1e1; /* 연보라색 계열 */
  font-weight: 500;
}

/* 차트 그리드 레이아웃 */
.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: flex-start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.right-column {
  flex-direction: row;
  justify-content: space-around;
  gap: 20px;
}

/* 수평 막대 차트 (HorizontalBarChart) */
.bar-chart-container {
  text-align: left;
}

.bar-chart-container .labels {
  margin-bottom: 8px;
}

.bar-chart-container .main-label {
  font-weight: bold;
  font-size: 16px;
  margin-right: 8px;
}

.bar-chart-container .sub-label {
  font-size: 14px;
  color: #a0a0a0;
}

.bar-track {
  width: 100%;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(90deg, #6495ed, #a076f9);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
}

/* 수직 실린더 차트 (CylinderChart) */
.cylinder-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.cylinder-chart-container .percentage-label {
  font-size: 24px;
  font-weight: bold;
}

.cylinder-track {
  width: 60px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.cylinder-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, #a076f9, #6495ed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
}

.cylinder-chart-container .year-label {
  font-size: 14px;
}

.cylinder-chart-container .main-label {
  font-size: 16px;
  font-weight: bold;
  word-break: keep-all; /* 단어 단위 줄바꿈 */
  line-height: 1.4;
}

/* 각주(Footnote) 스타일 */
.footnote {
  font-size: 12px;
  color: #a0a0a0;
  text-align: left;
  margin-top: 20px;
  width: 100%;
}

.right-column .footnote {
  text-align: center; /* 오른쪽 컬럼 각주는 중앙 정렬로 보이므로 수정 */
  grid-column: 1 / -1; /* 두 차트 아래에 걸치도록 설정 */
}
```

### \#\# 1. 디자인 상세 분석

이 슬라이드는 '성공률 보완'이라는 가치를 **[고객 요청] → [AI 처리] → [소상공인 미응답] → [문자 Follow-up]** 이라는 구체적인 시나리오를 통해 보여주는 흐름도(Flow Diagram)입니다.

- **레이아웃**: 상단에 제목과 부제목이 있고, 그 아래에 전체 시나리오가 아이콘, 화살표, 스마트폰 목업(Mockup)을 통해 왼쪽에서 오른쪽으로 전개됩니다.
- **스마트폰 목업**: 이 슬라이드의 핵심 시각 요소입니다. 아이폰 형태의 목업 2개가 사용되었으며, 각 목업은 시나리오의 특정 단계(최초 요청, Follow-up 문자)를 보여주는 SMS 화면을 담고 있습니다.
- **아이콘 및 화살표**: '고객', '소상공인' 아이콘으로 역할을 명시하고, 색상과 아이콘이 포함된 화살표(녹색 전화, 빨간 부재중 전화)로 각 단계의 상호작용과 상태(성공, 실패)를 직관적으로 표현합니다.
- **타이포그래피**:
  - 제목("가치 1. 성공률 보완")은 크고 굵게 처리되어 있습니다.
  - 부제목의 핵심 내용인 **"전국망을 보유한 통신사만의 차별적 역량"** 부분은 굵은 글씨(bold)로 강조되어 있습니다.
  - 각 흐름 단계 위에는 해당 단계의 내용을 설명하는 제목이 붙어 있습니다.

---

### \#\# 2. 전체 구현 명세서

#### 2.1. 데이터 구조 (page10Data.js)

슬라이드의 모든 텍스트, 아이콘 경로, 스마트폰 화면 내용을 체계적으로 관리합니다.

```javascript
export const page10Data = {
  header: {
    title: '가치 1. 성공률 보완',
    subtitle: [
      {
        text: '착신 실패 시 문자로 자동 전환되는 Failover는 Task성공률을 높일 수 있는 ',
        highlight: false,
      },
      { text: '전국망을 보유한 통신사만의 차별적 역량', highlight: true },
    ],
  },
  // 전체 흐름을 배열로 관리
  flow: [
    { type: 'persona', icon: '/images/customer-icon.png', label: '고객' },
    { type: 'arrow' },
    {
      type: 'phone',
      title: '전화/문자로 AI Agent에게 요청',
      content: {
        type: 'sms',
        messages: [
          {
            from: 'customer',
            text: '이번주 화요일 7시에 5명 삼겹살집 예약해줘',
          },
        ],
      },
    },
    {
      type: 'labeledArrow',
      icon: '/images/green-phone-icon.png',
      label: 'AI Agent가\n업주에게 전화',
    },
    { type: 'persona', icon: '/images/worker-icon.png', label: '소상공인' },
    {
      type: 'labeledArrow',
      icon: '/images/red-missed-call-icon.png',
      label: '현장 응대로\n전화 미응답',
    },
    {
      type: 'phone',
      title: '문자로 통화 요약 및 Follow-up 수행',
      content: {
        type: 'sms',
        messages: [
          {
            from: 'system',
            text: '사장님, 오후 3시 30분에 예약 관련 전화가 왔어요.\n받지 못하셔서 문자로 요약해드려요.',
          },
          {
            from: 'system',
            text: '• 고객 요청: 오늘 9월 23일(화) 저녁 7시, 5명 예약 가능 여부',
          },
          {
            from: 'system',
            text: '1. 예, 예약 확정합니다\n2. 아니오, 불가능합니다\n3. 다른 시간 제안하기',
          },
          { from: 'owner', text: '3. 8시' },
        ],
      },
    },
  ],
};
```

#### 2.2. 컴포넌트 구현 (SuccessRateSection.jsx)

데이터를 기반으로 전체 흐름도를 동적으로 렌더링하는 메인 컴포넌트입니다.

```jsx
import React from 'react';
import { page10Data } from './page10Data';
import './SuccessRateSection.css';

// 재사용을 위한 PhoneMockup 컴포넌트 (내부 또는 별도 파일로 생성)
const PhoneMockup = ({ title, content }) => (
  <div className="phone-container">
    <p className="phone-title">{title}</p>
    <div className="phone-mockup">
      <div className="phone-screen">
        {content.messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SuccessRateSection = () => {
  const { header, flow } = page10Data;

  return (
    <section className="success-rate-section">
      <header className="section-header">
        <h1>{header.title}</h1>
        <p>
          {header.subtitle.map((part, index) =>
            part.highlight ? (
              <strong key={index} className="highlight-text">
                {part.text}
              </strong>
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}
        </p>
      </header>

      <div className="flow-diagram">
        {flow.map((item, index) => {
          switch (item.type) {
            case 'persona':
              return (
                <div key={index} className="persona">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="persona-icon"
                  />
                  <span className="persona-label">{item.label}</span>
                </div>
              );
            case 'arrow':
              return (
                <div key={index} className="arrow">
                  →
                </div>
              );
            case 'labeledArrow':
              return (
                <div key={index} className="labeled-arrow">
                  <span>{item.label}</span>
                  <img src={item.icon} alt="" />
                  <div className="arrow-line"></div>
                </div>
              );
            case 'phone':
              return (
                <PhoneMockup
                  key={index}
                  title={item.title}
                  content={item.content}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
};

export default SuccessRateSection;
```

#### 2.3. 전체 스타일링 (SuccessRateSection.css)

모든 시각적 요소를 구현하는 CSS 코드 전체입니다.

```css
/* 전체 섹션 스타일 */
.success-rate-section {
  background-color: #212121;
  color: #ffffff;
  padding: 80px 40px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}

.section-header {
  text-align: left;
  max-width: 1200px;
  margin: 0 auto 50px auto;
}
.section-header h1 {
  font-size: 36px;
  margin-bottom: 10px;
}
.section-header p {
  font-size: 18px;
  color: #e0e0e0;
}
.highlight-text {
  font-weight: 700;
  color: #ffffff;
}

/* 흐름도(Flow Diagram) */
.flow-diagram {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

/* 역할(Persona) */
.persona {
  text-align: center;
}
.persona-icon {
  width: 80px;
  height: 80px;
}
.persona-label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

/* 화살표 */
.arrow {
  font-size: 36px;
  color: #888;
}
.labeled-arrow {
  text-align: center;
  position: relative;
  padding: 0 20px;
}
.labeled-arrow span {
  white-space: pre-wrap;
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 10px;
  display: block;
}
.labeled-arrow img {
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1;
  background: #212121;
  padding: 5px;
  border-radius: 50%;
}
.labeled-arrow .arrow-line {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #888;
  z-index: 0;
}
.labeled-arrow .arrow-line::after {
  content: '▶';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

/* 스마트폰 목업 */
.phone-container {
  text-align: center;
}
.phone-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}
.phone-mockup {
  width: 280px;
  height: 570px;
  background: #111;
  border-radius: 40px;
  border: 10px solid #444;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.phone-screen {
  background: #000;
  height: 100%;
  border-radius: 30px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #000;
  overflow-y: auto;
}

/* 메시지 버블 */
.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}
.message-bubble.customer {
  background-color: #f0f0f0;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}
.message-bubble.system {
  background-color: #f0f0f0;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}
.message-bubble.owner {
  background-color: #007aff;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}
```

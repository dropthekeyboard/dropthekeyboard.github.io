import React from "react";

export default function MicroSMEBarrierCard() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [animationProgress, setAnimationProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  // 팔레트 및 스타일 상수
  const palette = {
    bg: '#121212',
    card: '#1C1C1C',
    ink: '#F3F4F6',
    sub: '#C7CBD1',
    edge: '#2A2A2A',
    g1: '#00D1FF',
    g2: '#7C4DFF',
    g3: '#FF4D9A'
  };

  // 데이터 타입 정의
  interface BarData {
    label: string;
    valueText: string;
    fillRatio: number;
  }

  interface CylinderData {
    percent: number;
    label: string;
    note?: string;
  }

  // 데이터
  const bars: BarData[] = [
    { label: "동네 식당, 카페, 미용실, 세탁소 등\n소상공인 사업체 수", valueText: "약 500만 개", fillRatio: 0.92 },
    { label: "프랜차이즈, 유통 F&B 등\n대기업 사업체 수", valueText: "약 3,300 개", fillRatio: 0.18 }
  ];

  const cylinders: CylinderData[] = [
    { percent: 17.5, label: "'24년 소상공인 디지털 도입률*", note: "* 키오스크, AI 전화챗봇 등 도입률" },
    { percent: 2.7, label: "'25년 국내 음식점 중 캐치테이블 가입률" }
  ];

  // 유틸리티 함수
  const lerp = (start: number, end: number, t: number): number => start + (end - start) * t;
  const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

  // 애니메이션 루프
  React.useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimationProgress(1);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const duration = 1200;
      const progress = clamp(elapsed / duration, 0, 1);
      const easedProgress = easeInOutCubic(progress);
      
      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  // Intersection Observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // 그라데이션 바 컴포넌트
  const GradientBar = ({ bar, index, progress }: { bar: BarData; index: number; progress: number }) => {
    const currentWidth = lerp(0, bar.fillRatio * 100, progress);
    const shineOffset = (Date.now() / 4000) % 1;
    
    return (
      <div style={{
        marginBottom: index === 0 ? '40px' : '0'
      }}>
        <div style={{
          fontSize: '14px',
          color: palette.sub,
          marginBottom: '16px',
          lineHeight: '1.4',
          whiteSpace: 'pre-line'
        }}>
          {bar.label}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* 바 컨테이너 */}
          <div style={{
            flex: 1,
            height: '40px',
            backgroundColor: palette.edge,
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* 메인 그라데이션 바 */}
            <div style={{
              width: `${currentWidth}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${palette.g1}, ${palette.g2}, ${palette.g3})`,
              borderRadius: '20px',
              position: 'relative',
              transition: 'width 0.1s ease-out'
            }}>
              {/* 글로스 하이라이트 */}
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '8px',
                right: '8px',
                height: '6px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '3px'
              }} />
              
              {/* 샤인 스윕 */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: `${(shineOffset * 120) - 20}%`,
                width: '20%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.1s ease-out'
              }} />
            </div>
          </div>
          
          {/* 값 표시 칩 */}
          <div style={{
            backgroundColor: palette.card,
            border: `1px solid ${palette.edge}`,
            borderRadius: '20px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: '600',
            color: palette.ink,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '120px',
            textAlign: 'center'
          }}>
            {bar.valueText}
          </div>
        </div>
      </div>
    );
  };

  // 실린더 미터 컴포넌트
  const CylinderMeter = ({ cylinder, progress }: { cylinder: CylinderData; progress: number }) => {
    const currentHeight = lerp(0, cylinder.percent, progress);
    const waveOffset = Math.sin(Date.now() / 2500) * 2;
    const glintOffset = (Date.now() / 6000) % 1;
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '120px', // 실린더 컨테이너 너비 통일
        minHeight: '300px' // 전체 컨테이너 높이 통일
      }}>
        {/* 퍼센트 값 - 고정 높이로 정렬 */}
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: palette.ink,
          textAlign: 'center',
          height: '28px', // 고정 높이로 정렬
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {currentHeight.toFixed(1)}%
        </div>
        
        {/* 실린더 - 높이는 유지하고 너비만 축소 */}
        <div style={{
          position: 'relative',
          width: '40px',
          height: '150px'
        }}>
          {/* 실린더 배경 */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${palette.edge}, ${palette.card})`,
            borderRadius: '20px',
            border: `2px solid ${palette.edge}`,
            overflow: 'hidden'
          }}>
            {/* 채움 그라데이션 */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              height: `${currentHeight}%`,
              background: `linear-gradient(180deg, ${palette.g2}, ${palette.g1})`,
              borderRadius: '18px',
              transition: 'height 0.1s ease-out'
            }}>
              {/* 수면 파동 */}
              <div style={{
                position: 'absolute',
                top: `${waveOffset}px`,
                left: '15%',
                right: '15%',
                height: '4px',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px'
              }} />
            </div>
            
            {/* 글린트 스윕 */}
            <div style={{
              position: 'absolute',
              top: `${(1 - glintOffset) * 100}%`,
              left: '25%',
              width: '50%',
              height: '30px',
              background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.15), transparent)',
              transform: 'skewY(-15deg)',
              transition: 'top 0.1s ease-out'
            }} />
          </div>
          
          {/* 상단 타원 */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '15%',
            right: '15%',
            height: '6px',
            background: `linear-gradient(135deg, ${palette.edge}, ${palette.card})`,
            borderRadius: '50%',
            border: `1px solid ${palette.edge}`
          }} />
        </div>
        
        {/* 라벨 - 고정 높이로 정렬 */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: palette.sub,
          lineHeight: '1.3',
          width: '120px', // 라벨 너비 통일
          height: '60px', // 고정 높이로 정렬
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cylinder.label}
        </div>
        
        {/* 각주 - 고정 높이로 정렬 */}
        <div style={{
          fontSize: '11px',
          color: palette.sub,
          opacity: 0.7,
          textAlign: 'center',
          width: '120px', // 각주 너비 통일
          height: '24px', // 고정 높이로 정렬
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cylinder.note || ''}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      backgroundColor: palette.bg,
      color: palette.ink,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '80px 40px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 헤드라인 영역 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            margin: '0 0 32px 0',
            color: palette.ink,
            lineHeight: '1.2'
          }}>
            소상공인이 가진 구조적 한계
          </h1>
          <div style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: palette.sub,
            lineHeight: '1.5',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              모두를 위한 A2A 구현에는 일상 속 절대 다수를 차지하는 영세 소상공인의 참여가 필수적이지만,
            </p>
            <p style={{ margin: '0' }}>
              낮은 디지털화 수준으로 현실적 제약이 큰 상황
            </p>
          </div>
        </div>

        {/* 좌우 카드 컨테이너 - 동일 사이즈로 flex 균등 분배 */}
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'stretch',
          flexWrap: 'wrap'
        }}>
          {/* 좌측 바 카드 */}
          <div style={{
            flex: '1',
            minWidth: '450px',
            minHeight: '400px',
            backgroundColor: palette.card,
            border: `1px solid ${palette.edge}`,
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {bars.map((bar, index) => (
              <GradientBar key={index} bar={bar} index={index} progress={animationProgress} />
            ))}
            <div style={{
              marginTop: '32px',
              fontSize: '12px',
              color: palette.sub,
              opacity: 0.7
            }}>
              * 2023년 생활밀착업종 기준
            </div>
          </div>

          {/* 우측 실린더 카드 */}
          <div style={{
            flex: '1',
            minWidth: '450px',
            minHeight: '400px',
            backgroundColor: palette.card,
            border: `1px solid ${palette.edge}`,
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap'
          }}>
            {cylinders.map((cylinder, index) => (
              <CylinderMeter key={index} cylinder={cylinder} progress={animationProgress} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent } from '@/components/ui/card';
import { useSectionPinning } from '@/contexts/pinning';
import { CylinderBar } from '@/components/shared/CylinderBar';
import { SlideHeader } from '@/components/shared/SlideHeader';
import type { SlideProps } from '@/types/slide';

// 데이터 구조 정의
const page5Data = {
  header: {
    title: 'A2A 확산이 어려운 구조적 요인',
    subtitle: [
      { text: '모두를 위한 A2A 구현에는 일상 속 절대 다수를 차지하는 영세 ', highlight: false },
      { text: '소상공인', highlight: true },
      { text: '의 참여가 필수적이지만, ', highlight: false },
      { text: '낮은 디지털화 수준', highlight: true },
      { text: '으로 현실적 제약이 큰 상황', highlight: false },
    ],
  },
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
      percentage: 6.6,
    },
  ],
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
  footnotes: {
    left: '*2023년 소상공인 실태조사 기준',
    right: '*키오스크, 사전예약, 웨이팅보드 등',
  },
};

// Slide 005: A2A 확산이 어려운 구조적 요인
function Slide005({ sectionIndex = 0 }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  const isPinned = state.isPinned;

  const { header, barChartData, cylinderChartData, footnotes } = page5Data;

  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-8 lg:space-y-12">
        {/* 상단 헤더 */}
        <SlideHeader
          title={header.title}
          subtitle={header.subtitle.map((part, index) =>
            part.highlight ? (
              <span key={index} className="font-bold text-primary">
                {part.text}
              </span>
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}
          className="text-center max-w-4xl mx-auto"
        />

        {/* 2단 차트 레이아웃 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-start">
          {/* 왼쪽: 수평 막대 차트 - 사업체 수 비교 */}
          <Card className="bg-card border-border p-4 sm:p-6 lg:p-8">
            <CardContent className="p-0 space-y-4 lg:space-y-6">
              <h3 className="text-base lg:text-xl font-bold text-center text-foreground">
                사업체 수 비교
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                {barChartData.map((data, index) => {
                  // 최소 너비 보장을 위한 계산 (로그 스케일 개념 적용)
                  const minWidth = 15; // 최소 15% 너비 보장
                  const maxWidth = 100;
                  let displayWidth;
                  
                  if (data.percentage === 100) {
                    displayWidth = maxWidth;
                  } else {
                    // 작은 값도 보이도록 로그 스케일 변형 적용
                    displayWidth = Math.max(minWidth, Math.log10(data.percentage + 1) * 20);
                  }
                  
                  return (
                    <div key={data.id} className="space-y-2 lg:space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm lg:text-lg font-semibold text-foreground">{data.label}</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">{data.subLabel}</p>
                        </div>
                      </div>
                      
                      {/* 막대와 범례를 함께 표시하는 플렉스 컨테이너 */}
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="flex-1 h-8 lg:h-10 xl:h-12 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1200 ease-out"
                            style={{ width: `${isPinned ? displayWidth : 0}%` }}
                          />
                        </div>
                        
                        {/* 범례를 막대 우측으로 이동 */}
                        <div className="flex-shrink-0 min-w-0 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm lg:text-base xl:text-lg font-bold text-foreground whitespace-nowrap">
                              {data.valueText}
                            </span>
                            {index === 0 && (
                              <span className="text-xs text-primary font-medium">기준 (100%)</span>
                            )}
                            {index === 1 && (
                              <span className="text-xs text-muted-foreground">실제 비율: 0.07%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  {footnotes.left}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  ※ 차트는 가시성을 위해 조정됨 (실제 대기업 비율: 0.07%)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 오른쪽: 수직 실린더 차트 - 디지털화 수준 */}
          <Card className="bg-card border-border p-4 sm:p-6 lg:p-8">
            <CardContent className="p-0 space-y-4 lg:space-y-6">
              <h3 className="text-base lg:text-xl font-bold text-center text-foreground">
                디지털화 수준
              </h3>
              
              <div className="flex justify-center gap-6 lg:gap-8 xl:gap-12">
                {cylinderChartData.map((data) => (
                  <CylinderBar
                    key={data.id}
                    value={data.percentage}
                    label={data.mainLabel}
                    subLabel={data.yearLabel}
                    unit="%"
                    isActive={isPinned}
                    height={160}
                    className="flex-1"
                  />
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                {footnotes.right}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Slide005;

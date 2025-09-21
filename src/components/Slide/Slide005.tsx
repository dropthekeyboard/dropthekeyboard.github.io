import { Card, CardContent } from '@/components/ui/card';
import { useSectionPinning } from '@/contexts/pinning';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import type { SlideProps } from '@/types/slide';

// Slide 005: 하지만, 소상공인의 경우 디지털화 수준이 낮아
function Slide005({ sectionIndex = 0 }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  const isPinned = state.isPinned;

  // 소수점을 위한 애니메이션 (10배해서 정수로 애니메이션 후 /10)
  const animatedPOS = useCountAnimation(117, isPinned, 1500); // 11.7 * 10 = 117
  const animatedReservation = useCountAnimation(14, isPinned, 1500); // 1.4 * 10 = 14

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full space-y-12">
        {/* 상단 헤더 */}
        <header className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            하지만, 소상공인의 경우{' '}
            <span className="text-primary">디지털화 수준이 낮아</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            곧바로 Agent ↔ Agent 모델로 전환하기에는{' '}
            <span className="font-bold text-foreground">현실적 제약</span>이 큼
          </p>
        </header>

        {/* 데이터 시각화 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0">
            <div className="flex flex-row items-end justify-center gap-24 py-12">
              {/* 첫 번째 바 차트: POS 기기 보유율 */}
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg absolute bottom-0 transition-all duration-1200"
                    style={{
                      height: `${isPinned ? (animatedPOS / 10) * 2 : 0}px`,
                    }}
                  />
                  <div
                    className="w-20 bg-muted rounded-lg border-2 border-border"
                    style={{ height: '200px' }}
                  />
                  <span
                    className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-foreground"
                    style={{
                      opacity: isPinned ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out',
                    }}
                  >
                    {(animatedPOS / 10).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-6 text-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    '21년기준 전통시장
                  </div>
                  <div className="font-bold text-foreground text-lg">
                    Pos 기기 보유율
                  </div>
                </div>
              </div>

              {/* 두 번째 바 차트: 예약 시스템 도입률 */}
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg absolute bottom-0 transition-all duration-1200"
                    style={{
                      height: `${isPinned ? (animatedReservation / 10) * 2 : 0}px`,
                    }}
                  />
                  <div
                    className="w-20 bg-muted rounded-lg border-2 border-border"
                    style={{ height: '200px' }}
                  />
                  <span
                    className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-foreground"
                    style={{
                      opacity: isPinned ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out',
                    }}
                  >
                    {(animatedReservation / 10).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-6 text-center space-y-2">
                  <div className="text-sm text-muted-foreground">'24년기준</div>
                  <div className="font-bold text-foreground text-lg">
                    예약 시스템 (카카오테이블) 도입률
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Slide005;

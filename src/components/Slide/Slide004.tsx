import { Card, CardContent } from "@/components/ui/card";
import { useSectionPinning } from "@/contexts/pinning";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import type { SlideProps } from "@/types/slide";

// Slide 004: A2A 확산이 어려운 구조적 요인
function Slide004({ sectionIndex = 0 }: SlideProps) {
  const { state } = useSectionPinning(sectionIndex);
  const isPinned = state.isPinned;

  // 숫자 애니메이션을 위한 hooks
  const animatedSmallBusiness = useCountAnimation(500, isPinned, 1500);
  const animatedLargeBusiness = useCountAnimation(33, isPinned, 1500);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 헤더 */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            A2A 확산이 어려운 <span className="text-primary">구조적 요인</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            소비자가 일상적으로 이용하는 서비스의 절대다수를 차지하는 <span className="font-bold text-foreground">영세 소상공인</span>
          </p>
        </header>

        {/* 데이터 시각화 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0">
            <div className="space-y-12">
              {/* Log Scale을 사용한 비교 차트 */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <p className="text-lg font-semibold text-foreground mb-2">사업체 수 비교 (Log Scale)</p>
                  <p className="text-sm text-muted-foreground">실제 데이터의 비율을 유지하면서 시각적 비교가 가능하도록 표시</p>
                </div>

                {/* 소상공인 바 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground">동네식당, 카페, 미용실, 세탁소 등</p>
                      <p className="text-base text-muted-foreground">소상공인 사업체 수</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground" style={{
                        opacity: isPinned ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}>
                        약 {animatedSmallBusiness}만 개
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1200"
                      style={{ width: isPinned ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                {/* 대기업 바 - 로그 스케일 기반 너비 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground">프렌차이즈, 유통 F&B 등</p>
                      <p className="text-base text-muted-foreground">대기업 사업체 수</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground" style={{
                        opacity: isPinned ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}>
                        약 {animatedLargeBusiness}백 개
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1200"
                      style={{
                        width: isPinned ? `${(Math.log10(3300) / Math.log10(5000000)) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right" style={{
                    opacity: isPinned ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out'
                  }}>
                    비율: 약 0.066% (1/1,515)
                  </div>
                </div>
              </div>
            </div>

            {/* 출처 */}
            <div className="mt-8 text-right">
              <p className="text-sm text-muted-foreground">*2023 년 생활밀착업종통계기준</p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            생활 전반에서 제대로 작동하는 <span className="font-bold text-primary">'모두의 A2A'</span> 를 실현하기 위해서는
          </p>
          <p className="text-xl font-bold text-foreground">
            <span className="text-primary">영세 업주의 참여</span>를 통한 <span className="text-primary">업종별 비식별 거래 데이터 확보</span>가 필수적
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide004;
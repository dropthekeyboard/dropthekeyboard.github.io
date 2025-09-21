import { Card } from '@/components/ui/card';

// Slide 013: 가치 2. 성공률 보완
function Slide013() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            가치 2. 성공률 보완
          </h1>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <Card className="bg-card border-border p-8">
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-4">
              <div className="text-6xl">📱💬</div>
              <p className="text-muted-foreground text-lg">
                음성 통화 + 문자 Failover 시연
              </p>
              <p className="text-sm text-muted-foreground">
                (실시간 데모 영상)
              </p>
            </div>
          </div>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground leading-relaxed">
            착신 실패 시 문자로 자동 전환되는 Failover 는 향후 통화 오약까지
            확장 가능해,
          </p>
          <p className="text-xl font-bold text-foreground leading-relaxed">
            예약 / 주문 같은 실제 Task 성공률을 높일 수 있는{' '}
            <span className="text-primary">전국망을 보유한 통신사</span>만의
            차별적 역량
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide013;

import { Card } from '@/components/ui/card';

// Slide 016: 3단계 로드맵 - Phase 1, 2, 3
function Slide016() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-7xl w-full">
        {/* 3단계 로드맵 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-96">
          {/* Phase 1 */}
          <Card className="bg-card border-border p-6 flex flex-col">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-muted-foreground">
                Phase 1
              </h3>
              <h2 className="text-xl font-bold text-foreground leading-relaxed">
                전화 / 문자 기반
                <br />
                A2H
              </h2>
            </div>
            <div className="flex-1 bg-muted/50 rounded-lg mt-6 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl">📞💬</div>
                <p className="text-sm text-muted-foreground">신뢰성 구축</p>
              </div>
            </div>
          </Card>

          {/* Phase 2 */}
          <Card className="bg-card border-border p-6 flex flex-col">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-muted-foreground">
                Phase 2
              </h3>
              <h2 className="text-xl font-bold text-foreground leading-relaxed">
                앱 기반 Agent 로<br />
                준자동화
              </h2>
            </div>
            <div className="flex-1 bg-muted/50 rounded-lg mt-6 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl">📱🤖</div>
                <p className="text-sm text-muted-foreground">기능 확장</p>
              </div>
            </div>
          </Card>

          {/* Phase 3 */}
          <Card className="bg-card border-border p-6 flex flex-col">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-muted-foreground">
                Phase 3
              </h3>
              <h2 className="text-xl font-bold text-foreground leading-relaxed">
                A2A 로 완전 자동화
              </h2>
            </div>
            <div className="flex-1 bg-muted/50 rounded-lg mt-6 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl">🤖↔️🤖</div>
                <p className="text-sm text-muted-foreground">완전 자동화</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Slide016;

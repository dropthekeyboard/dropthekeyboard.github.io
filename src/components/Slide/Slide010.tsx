import { Card, CardContent } from '@/components/ui/card';

// Slide 010: 한계 2. 낮은 Task 성공률
function Slide010() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            한계 2. 낮은 Task <br />
            성공률
          </h1>
        </header>

        {/* 프로세스 플로우 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-8">
              {/* Google Assistant 아이콘 */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* 화살표 */}
              <div className="text-muted-foreground text-2xl">→</div>

              {/* 스팸 오인 */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl">
                  <span role="img" aria-label="confused person">
                    🤷‍♂️
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  스팸 오인
                </p>
              </div>

              {/* 화살표 */}
              <div className="text-muted-foreground text-2xl">→</div>

              {/* 전화 미응답 */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl text-destructive">📞❌</div>
                <p className="text-lg font-semibold text-foreground">
                  전화 미응답
                </p>
              </div>

              {/* 화살표 */}
              <div className="text-muted-foreground text-2xl">→</div>

              {/* Task 수행 실패 */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl text-destructive">⚠️</div>
                <p className="text-lg font-semibold text-destructive">
                  Task 수행 실패
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground">
            업주가 스팸으로 오해하거나 현장 상황으로 콜에 즉시 응대하지 못하면
          </p>
          <p className="text-2xl font-bold text-foreground">
            <span className="text-destructive">Task 성공률이 급격히 저하</span>
            되는 구조적 한계 존재
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide010;

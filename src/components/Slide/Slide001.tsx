import { Card, CardContent } from "@/components/ui/card";

// Slide 001: 어깝없이 찾는 그의 목소리 ㅋㅋ 하정우수석 어렸어요?
function Slide001() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        {/* 상단 헤더 */}
        <header className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold text-yellow-400 tracking-tight">
              어깝없이 찾는 그의 목소리 ㅋㅋ
            </h1>
            <h2 className="text-3xl sm:text-5xl font-bold">
              <span className="text-pink-500">하정우수석</span>{" "}
              <span className="text-cyan-400">어렸어요?</span>
            </h2>
          </div>
        </header>

        {/* 메인 콘텐츠 카드 */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-96 h-96 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="space-y-2 text-center">
                  <div className="text-6xl">🎤</div>
                  <p className="text-muted-foreground">영상 콘텐츠 영역</p>
                  <p className="text-sm text-muted-foreground">
                    (KTV 뉴스 클립)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 출처 */}
        <footer className="text-center">
          <p className="text-sm text-muted-foreground">출처: ktv</p>
        </footer>
      </div>
    </div>
  );
}

export default Slide001;
import { Card } from '@/components/ui/card';

// Slide 008: 기존 A2A 시도에서 드러난 제약
function Slide008() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            기존 A2A 시도에서 드러난 제약
          </h1>
        </header>

        {/* 부제목 */}
        <div className="text-left">
          <p className="text-xl text-muted-foreground">
            A2H 의 대표 서비스인 구글 Duplex(2018 년 )
          </p>
        </div>

        {/* 비디오 영역 */}
        <Card className="bg-card border-border p-8">
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎥</div>
              <p className="text-muted-foreground text-lg">
                Google Duplex 데모 영상
              </p>
              <p className="text-sm text-muted-foreground">
                (2018년 AI 음성 통화 시연 영상)
              </p>
            </div>
          </div>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground">
            처음 공개 당시 사람처럼 자연스러운 대화로 큰 반향을 일으켰지만,
          </p>
          <p className="text-2xl font-bold text-foreground">
            7 년이 지난 지금까지{' '}
            <span className="text-destructive">대중적 확산은 부재</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide008;

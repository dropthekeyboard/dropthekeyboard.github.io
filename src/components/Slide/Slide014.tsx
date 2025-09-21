import { Card } from '@/components/ui/card';

// Slide 014: 가치 3. 보편적 접근성
function Slide014() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            가치 3. 보편적 접근성
          </h1>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <Card className="bg-card border-border p-8">
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-4">
              <div className="text-6xl">📞📱✨</div>
              <p className="text-muted-foreground text-lg">
                보편적 접근성 데모
              </p>
              <p className="text-sm text-muted-foreground">
                (전화/문자 기반 A2A 시연)
              </p>
            </div>
          </div>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground leading-relaxed">
            전화 / 문자는 모든 소상공인이 이미 쓰고 있는 채널이므로,
          </p>
          <p className="text-2xl font-bold text-foreground leading-relaxed">
            추가 앱 설치나 복잡한 세팅 없이{' '}
            <span className="text-primary">즉시 사용 가능</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide014;

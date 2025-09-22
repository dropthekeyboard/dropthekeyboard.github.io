import { Card } from '@/components/ui/card';

// Slide 014: 가치 3. 보편적 접근성
function Slide014() {
  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            가치 3. 보편적 접근성
          </h1>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <Card className="bg-card border-border p-8">
          <img
            src="/A2A_Storyline_pages/page_014.png"
            alt="보편적 접근성 데모"
            className="h-full w-full object-cover rounded-lg"
          />
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

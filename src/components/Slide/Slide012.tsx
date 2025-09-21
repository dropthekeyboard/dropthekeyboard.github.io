import { Card, CardContent } from '@/components/ui/card';

// Slide 012: 통신 고유 채널인 전화 / 문자를 활용한 해법 - 가치 1. 신뢰성 확보
function Slide012() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <header className="text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            통신 고유 채널인 전화 / 문자를 활용한
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            해법
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-primary">
            가치 1. 신뢰성 확보
          </h3>
        </header>

        {/* 메인 콘텐츠 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0 flex items-center gap-8">
            {/* 스마트폰 이미지 영역 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-56 bg-muted rounded-3xl border-4 border-border flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-border rounded-full"></div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="text-xs text-muted-foreground text-center">
                    홍길동 AI
                    <br />
                    Agent
                  </div>
                  <div className="flex space-x-4 mt-8">
                    <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-white text-xl">
                      ✕
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                      📞
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-border rounded-full"></div>
              </div>
            </div>

            {/* 메시지 */}
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6 rounded-2xl max-w-2xl">
                <p className="text-xl font-bold">
                  SK 텔레콤에서 인증한 AI Agent
                  <br />
                  전화입니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground">
            당사 전화번호 자산과 가입자 인증 체계를 기반으로,
          </p>
          <p className="text-xl font-bold text-foreground">
            <span className="text-primary">'SKT 인증 Agent 발신'</span> 같은
            라벨을 부착해 업주가 안심할 수 있는{' '}
            <span className="text-primary">신뢰 기반</span> 제공 가능
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide012;

import { Card, CardContent } from '@/components/ui/card';

// Slide 009: 한계 1. 신뢰도 이슈
function Slide009() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목과 사례 카드 */}
        <div className="flex items-start justify-between gap-8">
          {/* 제목 */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              한계 1. 신뢰도 이슈
            </h1>
          </div>

          {/* 사례 카드 */}
          <Card className="bg-blue-500 border-none text-white p-4 flex-shrink-0">
            <CardContent className="p-0 text-center">
              <p className="text-lg font-bold">사례</p>
            </CardContent>
          </Card>
        </div>

        {/* 대화 시뮬레이션 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0 space-y-6">
            {/* Google Assistant 메시지 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-muted text-foreground px-6 py-3 rounded-2xl max-w-md">
                <p className="text-lg">
                  Hello, I'm the Google Assistant from ...
                </p>
              </div>
            </div>

            {/* 사용자 응답 */}
            <div className="flex items-center justify-end gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl max-w-md">
                <p className="text-lg font-bold">스팸 전화 아니야 ?</p>
              </div>
              <div className="text-4xl">
                <span role="img" aria-label="confused person">
                  🤷‍♂️
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 설명 */}
        <footer className="text-left space-y-4">
          <p className="text-xl text-muted-foreground">
            업주는 발신자가 고객인지 Agent 인지 구분하지 못해{' '}
            <span className="font-bold text-destructive">거부감</span>이 생기고,
          </p>
          <p className="text-xl text-muted-foreground">
            사전 고지 시{' '}
            <span className="font-bold text-destructive">스팸</span>으로
            오인되는 이슈 탈레마 발생
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide009;

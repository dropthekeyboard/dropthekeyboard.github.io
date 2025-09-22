import { Card } from '@/components/ui/card';

// Slide 008: 기존 A2A 시도에서 드러난 제약
function Slide008() {
  // page_8.md에서 정의된 데이터 구조
  const page8Data = {
    title: '기존 A2A 시도에서 드러난 제약',
    duplexBox: {
      title: 'A2A의 대표 사례였던 구글 Duplex (2018년)',
      altText: 'Google Duplex A2A 통화 시연 영상',
    },
    flowBox: {
      title: '앱 기반 콜의 구조적 한계: 응답 실패 시 Task 중단',
      steps: [
        {
          id: 1,
          type: 'icon',
          emoji: '📱',
          label: '앱 기반 콜 미응답',
        },
        { id: 2, type: 'arrow' },
        { id: 3, type: 'icon', emoji: '👨‍💼', label: '' },
        { id: 4, type: 'arrow' },
        { id: 5, type: 'icon', emoji: '📞', label: '' },
        { id: 6, type: 'arrow' },
        { id: 7, type: 'text', text: 'Task 수행 실패' },
        { id: 8, type: 'arrow' },
        { id: 9, type: 'icon', emoji: '⚠️', label: '' },
      ],
    },
    conclusionText: [
      {
        text: '사람처럼 자연스러운 대화로 주목을 받았지만, 스팸 오인 및 즉시 응대 한계로 인해 ',
        highlight: false,
      },
      { text: 'Task 성공률이 낮아', highlight: true },
      { text: ' 대중적 확산으로 이어지지 못함', highlight: false },
    ],
  };

  const Arrow = () => (
    <div className="text-2xl text-muted-foreground">→</div>
  );

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col p-8 font-sans">
      <div className="max-w-7xl w-full space-y-10">
        {/* 메인 제목 */}
        <header className="text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            {page8Data.title}
          </h1>
        </header>

        {/* 콘텐츠 래퍼 - 좌우 2단 레이아웃 */}
        <div className="flex items-start gap-6">
          {/* 좌측 박스 - Duplex 비디오 영역 */}
          <div className="flex-[3] space-y-3">
            <p className="text-base text-muted-foreground">
              {page8Data.duplexBox.title}
            </p>
            <Card className="bg-card border-dashed border-2 border-border p-8">
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎥</div>
                  <span className="text-muted-foreground text-sm italic">
                    {page8Data.duplexBox.altText}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* 우측 박스 - 플로우 차트 */}
          <div className="flex-[7] space-y-3">
            <p className="text-base text-muted-foreground">
              {page8Data.flowBox.title}
            </p>
            <Card className="bg-card/50 border-border p-8">
              <div className="w-full h-48 flex justify-around items-center">
                {page8Data.flowBox.steps.map((step) => {
                  if (step.type === 'icon') {
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2 text-center">
                        <div className="text-4xl">{step.emoji}</div>
                        {step.label && (
                          <span className="text-xs text-muted-foreground max-w-16">
                            {step.label}
                          </span>
                        )}
                      </div>
                    );
                  }
                  if (step.type === 'arrow') {
                    return <Arrow key={step.id} />;
                  }
                  if (step.type === 'text') {
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <span className="text-base font-bold text-foreground">
                          {step.text}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* 하단 결론 텍스트 */}
        <footer className="text-left">
          <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
            {page8Data.conclusionText.map((part, index) =>
              part.highlight ? (
                <strong key={index} className="text-primary font-bold">
                  {part.text}
                </strong>
              ) : (
                <span key={index}>{part.text}</span>
              )
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Slide008;

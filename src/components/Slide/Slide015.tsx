// Slide 015: 누구나 바로 쓸 수 있는 채널에서 시작하는 모두의 가능 A2A
function Slide015() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 설명 */}
        <div className="text-center space-y-6">
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            초기에는 전화 / 문자 기반 A2H 로 신뢰와 수요를 형성하고,
          </p>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            앱 기반 Agent 운영으로 확장해 완전한 A2A 자동화로 이어지는 단계적 로드맵을 통해
          </p>
        </div>

        {/* 메인 제목 */}
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-relaxed">
            누구나 바로 쓸 수 있는 채널에서 시작하는{" "}
            <span className="text-cyan-400">모두의</span>
          </h1>
          <h2 className="text-5xl sm:text-7xl font-bold leading-relaxed">
            <span className="text-foreground">가능</span>
            <span className="text-cyan-400">A2A</span>
          </h2>
        </div>

        {/* 우측 하단 */}
        <div className="text-right">
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            전략 실현
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slide015;
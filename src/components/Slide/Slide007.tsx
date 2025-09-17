// Slide 007: 따라서, 앱 기반 확산에 앞서 소상공인이 현재의 방식을 크게 바꾸지 않으면서도 자발적으로 AI Agent 의 필요성을 느끼도록 만드는 단계가 선행되어야 함
function Slide007() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-10">
        {/* 상단 설명 */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-medium text-muted-foreground leading-relaxed">
            따라서, 앱 기반 확산에 앞서 소상공인이 현재의 방식을 크게 바꾸지 않으면서도
          </p>
        </div>

        {/* 메인 제목 */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold leading-relaxed">
            <span className="text-cyan-400">자발적으로</span>{" "}
            <span className="text-cyan-400">AI Agent</span>{" "}
            <span className="text-foreground">의</span>{" "}
            <span className="text-cyan-400">필요성</span>
            <span className="text-muted-foreground text-2xl sm:text-3xl block mt-4">
              을 느끼도록 만드는 단계가 선행되어야 함
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Slide007;
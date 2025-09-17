// Slide 011: 앱 이전에, 이미 모두가 사용하고 있는 전화 / 문자에서 시작한다면?
function Slide011() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-10">
        {/* 메인 질문 */}
        <div className="text-center space-y-6">
          <p className="text-3xl sm:text-4xl font-medium text-muted-foreground">
            앱 이전에,
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-relaxed">
            이미 모두가 사용하고 있는{" "}
            <span className="text-cyan-400">전화 / 문자</span>{" "}
            <span className="text-3xl sm:text-4xl text-muted-foreground block mt-4">
              에서
            </span>
          </h1>
          <p className="text-3xl sm:text-4xl font-medium text-muted-foreground">
            시작한다면 ?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slide011;
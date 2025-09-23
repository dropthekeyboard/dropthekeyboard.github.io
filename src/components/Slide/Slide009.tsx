// Slide 009: 질문 슬라이드 - 전화/문자에서 시작한다면?
function Slide009() {
  // page_9.md에서 정의된 데이터 구조
  const page9Data = {
    line1: '앱 이전에,',
    line2: [
      { text: '이미 모두가 사용하는', highlight: false },
      { text: '전화/문자', highlight: true },
      { text: '에서', highlight: false },
    ],
    line3: '시작한다면?',
  };

  const { line1, line2, line3 } = page9Data;

  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background text-foreground flex items-center justify-center font-sans overflow-hidden">
      {/* 텍스트 전체를 감싸는 컨테이너 */}
      <div className="flex flex-col items-center gap-3">
        {/* 첫 번째 라인 */}
        <p className="text-xl lg:text-2xl text-foreground font-medium">
          {line1}
        </p>

        {/* 두 번째 라인 (혼합 스타일) */}
        <div className="flex items-center gap-4">
          {line2.map((part, index) => (
            <span
              key={index}
              className={
                part.highlight
                  ? 'text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'
                  : 'text-2xl lg:text-3xl font-normal text-muted-foreground'
              }
            >
              {part.text}
            </span>
          ))}
        </div>

        {/* 세 번째 라인 */}
        <p className="text-2xl lg:text-3xl text-foreground font-medium">
          {line3}
        </p>
      </div>
    </div>
  );
}

export default Slide009;

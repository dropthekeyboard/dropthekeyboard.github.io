
const Page08 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold mb-10">기존 A2A 시도에서 드러난 제약</h1>

      <div className="flex justify-around w-full max-w-6xl">
        {/* Left Box */}
        <div className="bg-card p-6 rounded-lg w-1/2 mr-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">A2A의 대표사례였던 구글 Duplex (2018년)</h2>
          {/* Placeholder for Google Duplex logo */}
          <div className="flex-grow w-full bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">#google #duplex</p>
          </div>
        </div>

        {/* Right Box */}
        <div className="bg-card p-6 rounded-lg w-1/2 ml-4">
          <h2 className="text-2xl font-bold mb-4">앱기반 반응의 구조적 한계: 응답 실패시 Task 중단</h2>
          <div className="flex items-center justify-around h-full">
            {/* Placeholder for Google Assistant logo */}
            <div className="w-16 h-16 bg-primary rounded-full"></div>
            <p className="text-2xl">→</p>
            <div className="text-center">
                <p>앱기반 미응답</p>
                {/* Placeholder for phone call icon */}
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mt-2"></div>
            </div>
            <p className="text-2xl">→</p>
            <div className="text-center">
                <p>Task 수행 실패</p>
                {/* Placeholder for warning icon */}
                <div className="w-16 h-16 bg-destructive rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xl mt-10 max-w-4xl text-center text-muted-foreground">
        사람처럼 자연스러운 대화로 주목을 받았지만, 스팸 오인 및 즉시 응대 한계로 인해 Task 성공률이 낮아 대중적 확산으로 이어지지 못함
      </p>
    </div>
  );
};

export default Page08;

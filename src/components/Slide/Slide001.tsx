// Slide 001: 어깝없이 찾는 그의 목소리 ㅋㅋ 하정우수석 어렸어요?
function Slide001() {
  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background text-foreground font-sans relative overflow-hidden">
      {/* 전체 화면 비디오 - 가장 아래 레이어 */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        controls
        loop
        muted
        playsInline
        preload="metadata"
        style={{ display: 'block' }}
      >
        <source src="/video_cut_020_100.mp4" type="video/mp4" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>

      {/* 비디오 위에 오버레이 텍스트 - 중간 레이어 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Slide 001
          </h1>
          <p className="text-xl md:text-2xl opacity-90 drop-shadow">
            메시지
          </p>
          <p className="text-lg md:text-xl opacity-75 drop-shadow mt-2">
            메시지2
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slide001;

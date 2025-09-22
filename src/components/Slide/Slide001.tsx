// Slide 001: 어깝없이 찾는 그의 목소리 ㅋㅋ 하정우수석 어렸어요?
function Slide001() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans relative">
      {/* 전체 화면 비디오 */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        controls
        loop
        muted
        playsInline
      >
        <source src="/video_cut_020_100.mp4" type="video/mp4" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>
    </div>
  );
}

export default Slide001;

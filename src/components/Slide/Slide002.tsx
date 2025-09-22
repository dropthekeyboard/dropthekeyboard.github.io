// Slide 002: 회장님 영상 ? 사진 ?
function Slide002() {
  return (
    <div className="h-screen w-full min-w-[80vw] bg-background text-foreground font-sans relative">
      {/* 메인 이미지 - 전체 화면 */}
      <div className="relative w-full h-screen">
        <img
          src="/tm_vs_jit.jpg"
          alt="TM vs JIT"
          className="w-full h-full min-w-full min-h-full object-cover"
        />

        {/* 위쪽 Shadow Overlay */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

        {/* 아래쪽 Shadow Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}

export default Slide002;

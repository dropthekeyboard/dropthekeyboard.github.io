// Slide 002: 회장님 영상 ? 사진 ?
function Slide002() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full">
        {/* 메인 이미지 */}
        <div className="w-full flex items-center justify-center">
          <img
            src="/tm_vs_jit.jpg"
            alt="TM vs JIT"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Slide002;
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSlide } from "../shared/AnimatedSlide";

// Slide 001: 어깝없이 찾는 그의 목소리 ㅋㅋ 하정우수석 어렸어요?
function Slide001() {
  return (
    <AnimatedSlide animationType="fade" delay={0.3}>
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        {/* 메인 콘텐츠 카드 */}
        <Card className="bg-card border-border relative overflow-hidden">
          <CardContent className="p-0 relative">
            {/* 비디오 배경 */}
            <div className="relative w-full min-h-[700px] bg-black rounded-lg overflow-hidden">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                controls
                loop
                playsInline
              >
                <source src="/video_cut_020_100.mp4" type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
              </video>
            </div>
          </CardContent>
        </Card>

        {/* 하단 출처 - 최소화 */}
        <footer className="text-center">
          <p className="text-xs text-muted-foreground/60">KTV 뉴스 클립</p>
        </footer>
      </div>
      </div>
    </AnimatedSlide>
  );
}

export default Slide001;
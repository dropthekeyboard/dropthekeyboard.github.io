import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Slide 006: 초기 A2A를 앱 기반으로 시작할 경우
function Slide006() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full space-y-12">
        {/* 상단 헤더 */}
        <header className="text-center space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-relaxed">
            초기 A2A 를 <span className="text-primary">앱 기반으로 시작할 경우</span>, 전화번호만으로 예약을 관리해온 영세 소상공인은
          </h1>
          <p className="text-lg text-muted-foreground">
            앱 설치, 메뉴 등록, 예약 시스템 세팅 등 <span className="font-bold text-primary">초기 진입 장벽</span>에 막혀 온보딩이 지연될 가능성이 큼
          </p>
        </header>

        {/* 메시지 카드 */}
        <Card className="bg-card border-border p-8">
          <CardContent className="p-0 flex items-center justify-center">
            {/* 아이콘 (건설 노동자) */}
            <span className="mr-8 text-8xl">
              <span role="img" aria-label="worker">👷‍♂️</span>
            </span>
            {/* 메시지 */}
            <div className="flex-1">
              <div className={cn(
                "inline-block px-8 py-6 rounded-2xl text-xl font-bold",
                "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              )}>
                '지금도 전화로 충분한데 굳이 복잡한 절차를 해야 하나?'
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Slide006;
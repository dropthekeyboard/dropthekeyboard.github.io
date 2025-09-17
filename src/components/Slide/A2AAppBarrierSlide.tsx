import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function A2AAppBarrierSlide() {
  return (
    <div className="min-h-screen w-full bg-black text-gray-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        {/* 상단 헤더 */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            <span className="text-gray-300">초기 A2A를</span> <span className="text-white">앱 기반으로 시작할 경우</span>
            <span className="block text-lg font-normal text-gray-400 mt-2">
              전화번호만으로 예약을 관리해온 영세 소상공인은
            </span>
          </h1>
          <p className="text-md sm:text-lg text-gray-400">
            앱 설치, 메뉴 등록, 예약 시스템 세팅 등 <span className="text-white font-bold">초기 진입 장벽</span>에 막혀 온보딩이 지연될 가능성이 큼
          </p>
        </header>

        {/* 메시지 카드 */}
        <Card className="bg-[#2C2C2E] border-none p-8 rounded-2xl w-full flex items-center justify-center">
          <CardContent className="p-0 flex items-center justify-center">
            {/* 아이콘 (건설 노동자) */}
            <span className="mr-6 text-6xl">
              <span role="img" aria-label="worker">👷‍♂️</span>
            </span>
            {/* 메시지 */}
            <div className="flex-1">
              <div className={cn(
                "inline-block px-8 py-4 rounded-xl text-2xl font-bold",
                "bg-gradient-to-r from-[#3A8BFF] to-[#A23AFF] text-white shadow-lg"
              )}>
                ‘지금도 전화로 충분한데 굳이 복잡한 절차를 해야 하나?’
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default A2AAppBarrierSlide;

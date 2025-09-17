import { Card, CardContent } from "@/components/ui/card";

// 이미지 슬라이드 컴포넌트 (A2AExpansionAnalysis.tsx 스타일, shadcn/ui + theme)
function A2ADigitalLevelSlide() {
  return (
    <div className="min-h-screen w-full bg-black text-gray-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        {/* 상단 헤더 */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            하지만, 소상공인의 경우 <span className="text-[#A23AFF]">디지털화 수준이 낮아</span>
          </h1>
          <p className="text-md sm:text-lg text-gray-400">
            곧바로 Agent ↔ Agent 모델로 전환하기에는 <strong className="text-white">현실적 제약</strong>이 큼
          </p>
        </header>

        {/* 데이터 시각화 카드 */}
        <Card className="bg-[#1C1C1E] border-none p-6 sm:p-10 rounded-2xl w-full">
          <CardContent className="p-0">
            <div className="flex flex-row items-end justify-center gap-16 py-12">
              {/* 첫 번째 바 차트: POS 기기 보유율 */}
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  {/* 실제 값 바 (파란색-보라색) */}
                  <div className="w-16 bg-gradient-to-r from-[#3A8BFF] to-[#A23AFF] rounded-t-lg absolute bottom-0" style={{ height: '40px' }} />
                  {/* 배경 바 (회색) */}
                  <div className="w-16 bg-gradient-to-b from-gray-300 to-gray-700 rounded-lg" style={{ height: '160px' }} />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl font-bold text-white">11.7%</span>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-400">'21년 기준 전통시장</div>
                  <div className="font-semibold text-white">POS 기기 보유율</div>
                </div>
              </div>
              {/* 두 번째 바 차트: 예약 시스템 도입률 */}
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  {/* 실제 값 바 (파란색-보라색) */}
                  <div className="w-16 bg-gradient-to-r from-[#3A8BFF] to-[#A23AFF] rounded-t-lg absolute bottom-0" style={{ height: '5px' }} />
                  {/* 배경 바 (회색) */}
                  <div className="w-16 bg-gradient-to-b from-gray-300 to-gray-700 rounded-lg" style={{ height: '160px' }} />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl font-bold text-white">1.4%</span>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-400">'24년 기준</div>
                  <div className="font-semibold text-white">예약 시스템(카카오테이블) 도입률</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default A2ADigitalLevelSlide;

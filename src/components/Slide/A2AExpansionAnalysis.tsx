
import { Card, CardContent } from "@/components/ui/card";

// 페이지를 구성하는 메인 컴포넌트
function A2AExpansionAnalysisPage() {
  return (
    // 전체 페이지 컨테이너: 다크 모드 배경 및 중앙 정렬
    <div className="min-h-screen w-full bg-black text-gray-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        
        {/* 1. 상단 헤더 */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            A2A 확산이 어려운 구조적 요인
          </h1>
          <p className="text-md sm:text-lg text-gray-400">
            소비자가 일상적으로 이용하는 서비스의 절대다수를 차지하는{' '}
            <strong className="text-white">영세 소상공인</strong>
          </p>
        </header>

        {/* 2. 데이터 시각화 카드 */}
        <Card className="bg-[#1C1C1E] border-none p-6 sm:p-10 rounded-2xl w-full">
          <CardContent className="p-0">
            <div className="space-y-8">
              
              {/* 첫 번째 바 차트: 소상공인 사업체 수 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-48 text-left sm:text-right flex-shrink-0">
                  <p className="text-sm text-gray-400">동네식당, 카페, 미용실, 세탁소 등</p>
                  <p className="font-semibold text-white">소상공인 사업체 수</p>
                </div>
                <div className="flex-1">
                  <div className="h-10 bg-gradient-to-r from-[#3A8BFF] to-[#A23AFF] rounded-lg w-full"></div>
                </div>
                <div className="w-full sm:w-32 text-left sm:text-left font-bold text-xl text-white">
                  약 500만 개
                </div>
              </div>

              {/* 두 번째 바 차트: 대기업 사업체 수 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-48 text-left sm:text-right flex-shrink-0">
                  <p className="text-sm text-gray-400">프랜차이즈, 유통 R&D 등</p>
                  <p className="font-semibold text-white">대기업 사업체 수</p>
                </div>
                <div className="flex-1">
                  {/* 대기업 바는 소상공인 바와의 시각적 비율을 맞추기 위해 너비를 약 15%로 설정 */}
                  <div className="h-10 bg-gradient-to-r from-[#3A8BFF] to-[#A23AFF] rounded-lg" style={{ width: '15%' }}></div>
                </div>
                <div className="w-full sm:w-32 text-left sm:text-left font-bold text-xl text-white">
                  약 3,300 개
                </div>
              </div>
            </div>
          </CardContent>

          {/* 카드 내 주석 */}
          <footer className="text-right text-gray-500 text-xs mt-8">
            *2023년 생활밀착업종 기준
          </footer>
        </Card>

        {/* 3. 하단 결론 텍스트 */}
        <footer className="text-center text-lg leading-relaxed max-w-3xl mx-auto">
          <p>생활 전반에서 제대로 작동하는 ‘모두의 A2A’를 실현하기 위해서는</p>
          <p>
            <strong className="text-white">영세 업주의 참여</strong>를 통한{' '}
            <strong className="text-white">업종별·비식별 거래 데이터 확보</strong>가 필수적
          </p>
        </footer>
        
      </div>
    </div>
  );
};

export default A2AExpansionAnalysisPage;
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SlideHeader } from '@/components/shared/SlideHeader';

// 데이터 구조 정의 (명세서 기반)
const page6Data = {
  header: {
    title: 'A2A를 앱 기반으로 시작할 경우,',
    subtitle: '전화번호만으로 예약을 관리해온 소상공인은 초기 진입 장벽에 막혀 온보딩이 지연될 가능성이 큼',
  },
  // 각 행의 데이터를 배열로 관리
  painPoints: [
    {
      id: 'row1',
      icon: '👷‍♂️', // 소상공인 아이콘
      elements: [
        {
          type: 'bubble',
          text: '지금도 전화로 충분한데 굳이 복잡한 절차를 해야 하나?',
        },
      ],
    },
    {
      id: 'row2', 
      icon: '🤦‍♂️', // 좌절하는 인물 아이콘
      elements: [
        { type: 'pill', text: '앱설치', color: '#00BFFF' },
        { type: 'pill', text: '메뉴 등록', color: '#6A5ACD' },
        { type: 'pill', text: '예약 시스템', color: '#9F2BFE' },
      ],
    },
  ],
  conclusion: '온보딩 지연',
};

// Slide 006: 초기 A2A를 앱 기반으로 시작할 경우
function Slide006() {
  const { header, painPoints, conclusion } = page6Data;
  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-8 lg:space-y-12">
        {/* 상단 헤더 */}
        <SlideHeader
          title={header.title}
          subtitle={header.subtitle}
          className="text-left max-w-5xl"
          titleClassName="text-lg sm:text-xl lg:text-2xl font-semibold"
          subtitleClassName="text-sm lg:text-base"
        />

        {/* 메인 컨테이너 - 둥근 모서리의 큰 박스 */}
        <Card className="bg-card/30 border-border/50 backdrop-blur-sm relative overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-8 lg:p-16">
            {/* X자 장식선 배경 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 w-[150%] h-0.5 bg-muted/30 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-[150%] h-0.5 bg-muted/30 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
              </div>
            </div>

            {/* 2행 구조 */}
            <div className="relative z-10 space-y-10 lg:space-y-16">
              {painPoints.map((row) => (
                <div key={row.id} className="flex items-center justify-center gap-6 lg:gap-12">
                  {/* 인물 아이콘 */}
                  <div className="flex-shrink-0">
                    <span className="text-7xl lg:text-9xl" role="img" aria-label="person">
                      {row.icon}
                    </span>
                  </div>

                  {/* 요소들 (말풍선 또는 태그들) */}
                  <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
                    {row.elements.map((element, index) => {
                      if (element.type === 'bubble') {
                        return (
                          <div key={index} className="relative">
                            {/* 말풍선 */}
                            <div
                              className={cn(
                                'px-5 lg:px-8 py-4 lg:py-6 rounded-2xl text-base lg:text-xl font-semibold text-white shadow-2xl',
                                'bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500/20'
                              )}
                            >
                              {element.text}
                            </div>
                            {/* 말풍선 꼬리 - 더 정교하게 */}
                            <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2">
                              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-purple-600"></div>
                            </div>
                          </div>
                        );
                      }
                      if (element.type === 'pill') {
                        return (
                          <div
                            key={index}
                            className="px-5 lg:px-8 py-3 lg:py-4 rounded-2xl text-sm lg:text-xl font-semibold text-white shadow-xl border border-white/10"
                            style={{ backgroundColor: 'color' in element ? element.color : '#6A5ACD' }}
                          >
                            {element.text}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}

              {/* 결론 텍스트 */}
              <div className="flex justify-center pt-6 lg:pt-10">
                <div className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  {conclusion}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Slide006;

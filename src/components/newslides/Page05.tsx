import { AnimatedHorizontalBar } from '@/components/ui/animated-horizontal-bar';
import { AnimatedBar } from '@/components/ui/animated-bar';

const Page05 = () => {
  // Assuming the component becomes active and animations start.
  const isActive = true;

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">A2A 확산이 어려운 구조적 요인</h1>
        <p className="text-xl mt-4 max-w-3xl text-muted-foreground">
          모두를 위한 A2A 구현에는 일상속 절대다수를 차지하는 영세 소상공인의
          참여가 필수적이지만, 낮은 디지털화 수준으로 현실적 제약이 큰 상황
        </p>
      </div>

      <div className="flex justify-around w-full max-w-6xl">
        {/* Left Section - Horizontal Bars */}
        <div className="w-1/2 pr-8">
          <AnimatedHorizontalBar
            label="소상공인 사업체 수"
            subLabel="동네상점,카페,미용실,세탁소 등"
            value={5000000}
            maxValue={5000000}
            unit="개"
            isActive={isActive}
            className="mb-8"
          />
          <AnimatedHorizontalBar
            label="대기업 사업체 수"
            subLabel="프랜차이즈,유통,F&B 등"
            value={3300}
            maxValue={5000000}
            unit="개"
            isActive={isActive}
          />
          <p className="text-sm text-muted-foreground mt-4">
            *2023년 소상공인 실태조사 기준
          </p>
        </div>

        {/* Right Section - Vertical Bars */}
        <div className="w-1/2 pl-8 flex justify-around items-end">
          <div className="text-center">
            <AnimatedBar
              label="소상공인 디지털 도입률"
              subLabel="'24년"
              value={17.5}
              maxValue={100}
              isActive={isActive}
            />
            <p className="text-sm text-muted-foreground mt-4">
              *키오스크, 서빙로봇 등 도입률
            </p>
          </div>
          <div className="text-center">
            <AnimatedBar
              label="국내 음식점 중 캐치테이블 가입률"
              subLabel="'25년"
              value={2.7}
              maxValue={100}
              isActive={isActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page05;

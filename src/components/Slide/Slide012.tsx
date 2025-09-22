
import { SlideHeader } from '@/components/shared/SlideHeader';

// 개별 라벨 컴포넌트
const ChartLabel = ({
  position,
  line,
  text,
}: {
  position: string;
  line: string;
  text: string;
}) => (
  <div className={`absolute pointer-events-none ${position}`}>
    {/* Dot */}
    <div className="w-2.5 h-2.5 bg-white rounded-full border border-black/20 absolute -translate-x-1/2 -translate-y-1/2" />
    {/* Line and Label */}
    <div className="absolute -translate-y-1/2 flex items-center pl-2.5">
      <div className={`h-[1.5px] bg-white/70 ${line}`} />
      <div className="ml-2 px-3.5 py-2 border border-purple-400/70 bg-neutral-900/85 rounded-lg text-sm font-medium whitespace-nowrap backdrop-blur-sm shadow-lg">
        {text}
      </div>
    </div>
  </div>
);

// 메인 슬라이드 컴포넌트
export default function Slide012() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-5 box-border overflow-hidden">
      <SlideHeader
        title="가치 3. 보편적 접근성"
        className="text-center mb-16"
        titleClassName="text-2xl sm:text-3xl font-semibold"
      />

      {/* 도넛 차트 */}
      <div className="relative w-[400px] h-[400px] flex justify-center items-center sm:scale-100 scale-[0.65] xs:scale-[0.8]">
        {/* 링 구조 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center w-[400px] h-[400px] bg-gradient-to-br from-[#00AEEF] to-[#4E82FF] [animation:subtleGlow_5s_ease-in-out_infinite]">
          <div className="rounded-full flex justify-center items-center w-[340px] h-[340px] bg-background">
            <div className="rounded-full flex justify-center items-center w-[280px] h-[280px] bg-gradient-to-br from-[#4E82FF] to-[#A765FF]">
              <div className="rounded-full flex justify-center items-center w-[220px] h-[220px] bg-background">
                <div className="rounded-full flex justify-center items-center w-[160px] h-[160px] bg-[#A765FF]">
                  <div className="w-20 h-20 rounded-full bg-background" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 라벨 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <ChartLabel
            position="top-[90px] left-[355px]"
            line="w-16"
            text="휴대폰 보유자"
          />
          <ChartLabel
            position="top-[200px] left-[325px]"
            line="w-12"
            text="스마트폰 사용자"
          />
          <ChartLabel
            position="top-[260px] left-[255px]"
            line="w-9"
            text="특정 앱 사용자"
          />
        </div>
      </div>

      <p className="text-lg sm:text-xl text-center mt-10 sm:mt-16 leading-relaxed max-w-xl text-gray-200">
        전화/문자는 <strong className="font-bold text-white">휴대폰만 있으면,</strong> 추가 앱 설치나 복잡한 세팅 없이{' '}
        <strong className="font-bold text-white">즉시 사용 가능</strong>
      </p>
    </div>
  );
}
import { motion } from 'framer-motion';
import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MinimalIncomingCall } from '@/components/shared/CallScreen/MinimalIncomingCall';
import { TrustBanner } from '@/components/shared/TrustBanner';
import { SlideHeader } from '@/components/shared/SlideHeader';
import sktLogo from '@/assets/skt_logo.jpg';

// Slide 011: 가치 2. 신뢰성 확보
function Slide011() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-5 box-border overflow-hidden">
      <SlideHeader
        title="가치 2. 신뢰성 확보"
        className="text-left mb-12 self-start"
        titleClassName="text-2xl sm:text-3xl font-semibold"
      />

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-6xl">
        {/* 메인 콘텐츠 */}
        <div className="bg-muted/40 backdrop-blur-sm p-6 lg:p-8 rounded-3xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

            {/* 스마트폰 섹션 - 크기 조정 */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 1.0 }}
              animate={{ opacity: 1, x: 0, scale: 1.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[9/16] w-56"
            >
              <PhoneFrame>
                {/* PhoneFrame에 최적화된 미니멀 전화 화면 */}
                <MinimalIncomingCall callerName="홍길동 AI Agent" />
              </PhoneFrame>
            </motion.div>

            {/* 신뢰성 배너 */}
            <div className="flex-1 max-w-2xl">
              <TrustBanner
                message="SK텔레콤에서 인증한 AI Agent 전화입니다"
                logo={sktLogo}
              />
            </div>
          </div>
        </div>

        {/* 하단 설명 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-left space-y-4 max-w-4xl w-full"
        >
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            당사 정보범죄 자산과 가입자 인증 체계를 기반으로
          </p>
          <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed">
            <span className="text-cyan-400 font-bold">'SKT 인증 Agent 발신'</span> 칼러라벨을 부착해 업무가 안심할 수 있는 <span className="text-cyan-400 font-bold">신뢰 기반</span> 체공 가능
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Slide011;

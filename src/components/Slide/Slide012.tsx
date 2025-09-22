import { motion } from 'framer-motion';
import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MinimalIncomingCall } from '@/components/shared/CallScreen/MinimalIncomingCall';
import { TrustBanner } from '@/components/shared/TrustBanner';
import sktLogo from '@/assets/skt_logo.jpg';

// Slide 012: 통신 고유 채널인 전화 / 문자를 활용한 해법 - 가치 1. 신뢰성 확보
function Slide012() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 제목 */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            통신 고유 채널인 전화 / 문자를 활용한
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            해법
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-primary">
            가치 1. 신뢰성 확보
          </h3>
        </motion.header>

        {/* 메인 콘텐츠 */}
        <div className="bg-muted/40 backdrop-blur-sm p-6 lg:p-8 rounded-3xl">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

            {/* 스마트폰 섹션 - 1.3배 크기 */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 1.0 }}
              animate={{ opacity: 1, x: 0, scale: 1.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[9/16] w-64"
            >
              <PhoneFrame>
                {/* PhoneFrame에 최적화된 미니멀 전화 화면 */}
                <MinimalIncomingCall callerName="홍길동 AI Agent" />
              </PhoneFrame>
            </motion.div>

            {/* 신뢰성 배너 */}
            <div className="flex-1 max-w-2xl">
              <TrustBanner
                message="SK 텔레콤에서 인증한 AI Agent 전화입니다"
                logo={sktLogo}
              />
            </div>
          </div>
        </div>

        {/* 하단 설명 */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-left space-y-4"
        >
          <p className="text-xl text-muted-foreground">
            당사 전화번호 자산과 가입자 인증 체계를 기반으로,
          </p>
          <p className="text-xl font-bold text-foreground">
            <span className="text-primary">'SKT 인증 Agent 발신'</span> 같은
            라벨을 부착해 업주가 안심할 수 있는{' '}
            <span className="text-primary">신뢰 기반</span> 제공 가능
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default Slide012;

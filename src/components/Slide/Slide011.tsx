import { motion } from 'framer-motion';
import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MinimalIncomingCall } from '@/components/shared/CallScreen/MinimalIncomingCall';
import { TrustBanner } from '@/components/shared/TrustBanner';
import sktLogo from '@/assets/skt_logo.jpg';

// Slide 011: 앱 이전에, 이미 모두가 사용하고 있는 전화 / 문자에서 시작한다면?
function Slide011() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* 상단 질문 */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <p className="text-3xl sm:text-4xl font-medium text-muted-foreground">
            앱 이전에,
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-relaxed">
            이미 모두가 사용하고 있는{' '}
            <span className="text-cyan-400">전화 / 문자</span>{' '}
            <span className="text-3xl sm:text-4xl text-muted-foreground block mt-4">
              에서
            </span>
          </h1>
          <p className="text-3xl sm:text-4xl font-medium text-muted-foreground">
            시작한다면 ?
          </p>
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
      </div>
    </div>
  );
}

export default Slide011;

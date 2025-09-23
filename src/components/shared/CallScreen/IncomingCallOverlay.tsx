import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import logo from '@/assets/skt_logo.jpg';
import type { PhoneState, HumanState } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';

interface IncomingCallOverlayProps {
  state: PhoneState;
  callerName?: string;
  callerEntity?: HumanState | null;
  ownerName?: string; // 현재 폰의 소유자 (옵셔널로 유지)
}

// 액션 버튼 컴포넌트
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor?: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  bgColor, 
  textColor = 'text-white', 
  onClick 
}) => (
  <motion.div 
    className="flex flex-col items-center space-y-2"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.button
      onClick={onClick}
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform transform active:scale-90 ${bgColor}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.button>
    <span className={`text-xs ${textColor}`}>{label}</span>
  </motion.div>
);

export function IncomingCallOverlay({
  state,
  callerName = 'Service Provider',
  callerEntity,
  ownerName,
}: IncomingCallOverlayProps) {
  const { isDark } = useTheme();
  const { state: scenarioState } = useScenario();
  
  if (state === 'message') {
    return null;
  }

  // ring 상태에서만 발신/수신 구분 체크
  if (state !== 'ring') {
    return null;
  }

  // ownerName이 없으면 기존 동작 유지 (수신으로 처리)
  if (!ownerName) {
    const isRinging = state === 'ring';
    const displayName = callerEntity?.displayName || callerEntity?.name || callerName;

    return (
      <AnimatePresence>
        {isRinging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 z-[100] rounded-3xl overflow-hidden",
              isDark ? "bg-black" : "bg-white"
            )}
          >
            {/* 진동 효과를 위한 컨테이너 */}
            <motion.div
              animate={
                isRinging
                  ? {
                      x: [0, -1, 1, -1, 1, 0],
                      y: [0, 1, -1, 1, -1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: isRinging ? Infinity : 0,
                repeatType: 'loop',
              }}
              className="relative h-full w-full flex flex-col"
            >
              {/* iPhone 스타일 전화 수신 화면 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={cn(
                  "w-full h-full flex flex-col justify-center items-center p-8 font-sans",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                {/* 발신자 정보 */}
                <motion.div 
                  className="text-center flex-1 flex flex-col justify-center"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.img 
                    src={logo} 
                    alt={displayName} 
                    className={cn(
                      "w-24 h-24 rounded-full mx-auto mb-4 border-2 object-contain backdrop-blur-sm",
                      isDark 
                        ? "border-white/50 bg-white/10" 
                        : "border-gray-300/50 bg-gray-100/50"
                    )}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.h1 
                    className="text-4xl font-light tracking-wide"
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {displayName}
                  </motion.h1>
                  <motion.p 
                    className={cn(
                      "text-lg mt-2",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    iPhone
                  </motion.p>
                </motion.div>

                {/* 하단 액션 버튼 영역 */}
                <motion.div 
                  className="w-full flex flex-col items-center space-y-12"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* 미리 알림 / 메시지 버튼 */}
                  <div className="w-full flex justify-between px-4">
                    <motion.div 
                      className="flex flex-col items-center space-y-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Clock className="h-6 w-6" />
                      </div>
                      <span className="text-xs">Remind Me</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col items-center space-y-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <span className="text-xs">Message</span>
                    </motion.div>
                  </div>
                  
                  {/* 거절 / 수락 버튼 */}
                  <div className="w-full flex justify-between px-4">
                    <ActionButton 
                      label="Decline"
                      bgColor="bg-red-500"
                      icon={
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={2}
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                            transform="rotate(135 12 12)" 
                          />
                        </motion.svg>
                      }
                    />
                    
                    <ActionButton 
                      label="Accept"
                      bgColor="bg-green-500"
                      icon={
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={2}
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 3, -3, 0]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                          />
                        </motion.svg>
                      }
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 현재 활성 call session에서 from과 owner 비교
  const activeCallSession = scenarioState.callSessions?.find(
    (session) =>
      session.participants.some((p: string) => p === ownerName) &&
      session.endTime === null
  );

  // from이 owner와 다르면 수신, 같으면 발신
  const isIncoming = activeCallSession && 
    activeCallSession.participants.includes(ownerName) &&
    activeCallSession.callerName !== ownerName;

  // 수신 통화가 아니면 렌더링하지 않음
  if (!isIncoming) {
    return null;
  }

  const isRinging = state === 'ring';
  
  // caller entity의 displayName 또는 name을 우선 사용
  const displayName = callerEntity?.displayName || callerEntity?.name || callerName;

  return (
    <AnimatePresence>
      {isRinging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 z-[100] rounded-3xl overflow-hidden",
            isDark ? "bg-black" : "bg-white"
          )}
        >
          {/* 진동 효과를 위한 컨테이너 */}
          <motion.div
            animate={
              isRinging
                ? {
                    x: [0, -1, 1, -1, 1, 0],
                    y: [0, 1, -1, 1, -1, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              repeat: isRinging ? Infinity : 0,
              repeatType: 'loop',
            }}
            className="relative h-full w-full flex flex-col"
          >
            {/* iPhone 스타일 전화 수신 화면 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                "w-full h-full flex flex-col justify-center items-center p-8 font-sans",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              {/* 발신자 정보 */}
              <motion.div 
                className="text-center flex-1 flex flex-col justify-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.img 
                  src={logo} 
                  alt={displayName} 
                  className={cn(
                    "w-24 h-24 rounded-full mx-auto mb-4 border-2 object-contain backdrop-blur-sm",
                    isDark 
                      ? "border-white/50 bg-white/10" 
                      : "border-gray-300/50 bg-gray-100/50"
                  )}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.h1 
                  className="text-4xl font-light tracking-wide"
                  animate={{ opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {displayName}
                </motion.h1>
                <motion.p 
                  className={cn(
                    "text-lg mt-2",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  iPhone
                </motion.p>
              </motion.div>

              {/* 하단 액션 버튼 영역 */}
              <motion.div 
                className="w-full flex flex-col items-center space-y-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* 미리 알림 / 메시지 버튼 */}
                <div className="w-full flex justify-between px-4">
                  <motion.div 
                    className="flex flex-col items-center space-y-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <span className="text-xs">Remind Me</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center space-y-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="text-xs">Message</span>
                  </motion.div>
                </div>
                
                {/* 거절 / 수락 버튼 */}
                <div className="w-full flex justify-between px-4">
                  <ActionButton 
                    label="Decline"
                    bgColor="bg-red-500"
                    icon={
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                          transform="rotate(135 12 12)" 
                        />
                      </motion.svg>
                    }
                  />
                  
                  <ActionButton 
                    label="Accept"
                    bgColor="bg-green-500"
                    icon={
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 3, -3, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                        />
                      </motion.svg>
                    }
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

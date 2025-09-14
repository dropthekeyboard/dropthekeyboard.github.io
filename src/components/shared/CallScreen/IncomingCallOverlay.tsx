import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User } from 'lucide-react';
import type { PhoneState } from '@/contexts/scenario';

interface IncomingCallOverlayProps {
  state: PhoneState;
}

export function IncomingCallOverlay({ state }: IncomingCallOverlayProps) {
  if (state === 'message') {
    return null;
  }

  const isRinging = state === 'ring';

  return (
    <AnimatePresence>
      {isRinging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50"
        >
          {/* 배경 블러 효과 */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(8px)' }}
            className="absolute inset-0 bg-black/60"
          />

          {/* 진동 효과를 위한 컨테이너 */}
          <motion.div
            animate={
              isRinging
                ? {
                    x: [0, -2, 2, -1, 1, 0],
                    y: [0, 1, -1, 1, -1, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              repeat: isRinging ? Infinity : 0,
              repeatType: 'loop',
            }}
            className="relative h-full flex items-center justify-center"
          >
            {/* 메인 전화 인터페이스 */}
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* 프로필 영역 */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                >
                  Incoming Call
                </motion.h2>

                <motion.p className="text-gray-600 dark:text-gray-400 text-sm">
                  Service Provider
                </motion.p>
              </motion.div>

              {/* 전화벨 애니메이션 */}
              <motion.div className="flex justify-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  <Phone className="w-12 h-12 text-green-500" />

                  {/* 링 효과 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    className="absolute inset-0 border-2 border-green-400 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    className="absolute inset-0 border border-green-300 rounded-full"
                  />
                </motion.div>
              </motion.div>

              {/* 액션 버튼들 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center space-x-8"
              >
                {/* 거절 버튼 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </motion.button>

                {/* 수락 버튼 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <Phone className="w-8 h-8 text-white" />
                </motion.button>
              </motion.div>

              {/* 상태 텍스트 */}
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-center mt-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Slide to answer
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

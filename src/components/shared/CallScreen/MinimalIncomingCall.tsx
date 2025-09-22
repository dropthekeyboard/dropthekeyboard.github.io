import { motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';
import sktLogo from '@/assets/skt_logo.jpg';

interface MinimalIncomingCallProps {
  callerName?: string;
}

export function MinimalIncomingCall({
  callerName = 'Contact'
}: MinimalIncomingCallProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col justify-between p-6">

      {/* 상단 영역 - 발신자 정보 */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm opacity-70"
        >
          수신 전화
        </motion.p>

        {/* 아바타 - SKT 로고 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
            <img
              src={sktLogo}
              alt="SK텔레콤"
              className="w-full h-full object-cover bg-white"
            />
          </div>

          {/* 링 애니메이션 */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 border-2 border-white/30 rounded-full"
          />
        </motion.div>

        {/* 발신자 이름 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-light mb-1">{callerName}</h2>
          <p className="text-sm text-white/60">모바일</p>
        </motion.div>
      </div>

      {/* 하단 버튼 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center items-center space-x-16 pb-4"
      >
        {/* 거절 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            boxShadow: [
              '0 4px 20px rgba(239, 68, 68, 0.3)',
              '0 8px 30px rgba(239, 68, 68, 0.4)',
              '0 4px 20px rgba(239, 68, 68, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PhoneOff className="w-8 h-8 text-white" />
        </motion.button>

        {/* 수락 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            boxShadow: [
              '0 4px 20px rgba(34, 197, 94, 0.3)',
              '0 8px 30px rgba(34, 197, 94, 0.4)',
              '0 4px 20px rgba(34, 197, 94, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Phone className="w-8 h-8 text-white" />
        </motion.button>
      </motion.div>

      {/* 추가 액션 버튼들 - 상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 right-4 flex justify-between"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <span className="text-sm">💬</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <span className="text-sm">🔕</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
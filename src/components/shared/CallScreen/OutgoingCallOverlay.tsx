import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import logo from '@/assets/skt_logo.jpg';
import type { Entity } from '@/contexts/scenario';

interface OutgoingCallOverlayProps {
  calleeEntity: Entity;
}

// 액션 버튼 컴포넌트
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  bgColor = 'bg-gray-700/80', 
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.button>
    <span className={`text-xs ${textColor}`}>{label}</span>
  </motion.div>
);

export function OutgoingCallOverlay({
  calleeEntity,
}: OutgoingCallOverlayProps) {
  const { isDark } = useTheme();

  // calleeEntity에서 display name 추출
  const displayName = calleeEntity?.displayName || calleeEntity?.name || 'Contact';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "absolute inset-0 z-[100] rounded-3xl overflow-hidden",
          isDark ? "bg-gray-800" : "bg-gray-900"
        )}
      >
        {/* iPhone 스타일 발신 화면 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="text-white w-full h-full flex flex-col justify-between items-center p-8 font-sans"
        >
          {/* 발신자 정보 */}
          <motion.div 
            className="text-center mt-16"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.p
              className="text-lg text-gray-400 mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Calling...
            </motion.p>
            
            {/* 아바타 이미지 */}
            <motion.img 
              src={logo} 
              alt={displayName} 
              className="w-32 h-32 rounded-full mx-auto mb-6 border-2 border-white/30 object-contain backdrop-blur-sm bg-white/10"
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.h1 
              className="text-4xl font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {displayName}
            </motion.h1>
          </motion.div>

          {/* 하단 액션 버튼 영역 */}
          <motion.div 
            className="w-full grid grid-cols-3 gap-x-4 gap-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ActionButton 
              label="Speaker"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              }
            />
            
            <ActionButton 
              label="FaceTime"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
            />
            
            <ActionButton 
              label="Mute"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
            />
            
            <ActionButton 
              label="Add"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
            />
            
            <ActionButton 
              label="End"
              bgColor="bg-red-500"
              icon={
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0] 
                  }}
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
              label="Keypad"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
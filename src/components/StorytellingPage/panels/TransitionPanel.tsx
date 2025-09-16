import { motion } from 'framer-motion';
import type { StoryPanelProps } from '@/types/storytelling';

export function TransitionPanel({
  panel,
  isActive,
  progress,
}: StoryPanelProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-screen w-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
      <div className="text-center text-white space-y-6">
        <motion.div
          animate={{
            rotate: isActive ? 360 : 0,
            scale: isActive ? 1 : 0.8,
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: isActive ? Infinity : 0,
              ease: 'linear',
            },
            scale: { duration: 0.6 },
          }}
          className="mx-auto w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isActive ? 1 : 0.3,
            y: isActive ? 0 : 20,
          }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-semibold"
        >
          {panel.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.9 : 0.3 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg"
        >
          {panel.description ||
            'Processing the next phase of the demonstration...'}
        </motion.p>

        <motion.div
          className="w-64 mx-auto bg-white/30 rounded-full h-1 mt-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0.3 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div
            className="bg-white h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </motion.div>
      </div>
    </div>
  );
}

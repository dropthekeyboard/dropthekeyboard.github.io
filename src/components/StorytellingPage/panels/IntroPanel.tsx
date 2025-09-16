import { motion } from 'framer-motion';
import type { StoryPanelProps } from '@/types/storytelling';

export function IntroPanel({ panel, isActive, progress }: StoryPanelProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="text-center space-y-6 max-w-2xl px-8">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: isActive ? 1 : 0.3,
            y: isActive ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-gray-800 dark:text-gray-100"
        >
          {panel.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          {panel.description ||
            'Experience the power of Agent-to-Agent communication'}
        </motion.p>

        <motion.div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0.3 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Scroll down to begin the story...
        </motion.div>
      </div>
    </div>
  );
}

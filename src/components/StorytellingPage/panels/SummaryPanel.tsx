import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { StoryPanelProps } from '@/types/storytelling';

export function SummaryPanel({ panel, isActive, progress }: StoryPanelProps) {
  const completionPoints = [
    'Customer initiated contact with AI system',
    'AI Agent processed the request intelligently',
    'Server responded with accurate information',
    'Seamless Agent-to-Agent communication achieved',
  ];

  return (
    <div className="flex items-center justify-center h-full min-h-screen w-full bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      <div className="text-center space-y-8 max-w-3xl px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: isActive ? 1 : 0.8,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-20 h-20 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: isActive ? 1 : 0.3,
            y: isActive ? 0 : 30,
          }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 dark:text-gray-100"
        >
          {panel.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          {panel.description ||
            'The A2A demonstration has been completed successfully!'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isActive ? 1 : 0.3,
            y: isActive ? 0 : 20,
          }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            What we accomplished:
          </h3>
          <div className="grid gap-3">
            {completionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity:
                    isActive && progress > index / completionPoints.length
                      ? 1
                      : 0.3,
                  x: isActive ? 0 : -20,
                }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400"
        >
          <span className="text-lg">Ready to explore more scenarios?</span>
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bot, Brain, Settings } from 'lucide-react';

interface AgentRobotProps {
  size?: number;
  className?: string;
  isThinking?: boolean;
}

export function AgentRobot({
  size = 60,
  className,
  isThinking = false,
}: AgentRobotProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Main robot container with integrated elements */}
      <motion.div
        className="relative"
        animate={
          isThinking
            ? {
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: isThinking ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{ width: size, height: size }}
        data-testid="agent-robot-container"
      >
        {/* Robot body */}
        <div className="relative w-full h-full" data-testid="robot-body">
          {/* Main body circle with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/60 rounded-full border-2 border-primary/50 shadow-lg" />

          {/* Inner glow */}
          <div className="absolute inset-2 bg-primary/10 dark:bg-primary/20 rounded-full" />

          {/* Main icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-testid="main-icon"
          >
            <Bot className="w-6 h-6 text-primary" data-testid="bot-icon" />
          </div>

          {/* Integrated brain icon - top */}
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            animate={
              isThinking
                ? {
                    y: [0, -2, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: isThinking ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-full p-1 border border-primary/30 shadow-sm">
              <Brain className="w-3 h-3 text-primary" />
            </div>
          </motion.div>

          {/* Integrated settings icon - bottom */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            animate={
              isThinking
                ? {
                    rotate: [0, 180, 360],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: isThinking ? Infinity : 0,
              ease: 'linear',
            }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-full p-1 border border-primary/30 shadow-sm">
              <Settings className="w-3 h-3 text-primary" />
            </div>
          </motion.div>

          {/* Simple eyes */}
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
            data-testid="robot-eyes"
          >
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={
                isThinking
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: isThinking ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={
                isThinking
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                delay: 0.2,
                repeat: isThinking ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bot, Monitor, Settings } from 'lucide-react';
import { useState } from 'react';
import { PlayControls } from './PlayControls';
import { RecordingControls } from './RecordingControls';
import { ScenarioSelector } from './ScenarioSelector.tsx';
import { ThemeToggle } from './ThemeToggle';
import { ViewModeToggle } from './ViewModeToggle';

interface ControlHeaderProps {
  onThemeToggle: () => void;
  onAgentStyleChange?: (
    style: 'minimal' | 'formal' | 'hacker' | 'reasoning'
  ) => void;
  onViewModeChange?: (mode: 'demo' | 'storytelling') => void;
  currentViewMode?: 'demo' | 'storytelling';
  playbackInterval?: number; // Auto-play interval in milliseconds
  className?: string;
}

export function ControlHeader({
  onThemeToggle,
  onAgentStyleChange,
  onViewModeChange,
  currentViewMode = 'demo',
  playbackInterval = 3000, // Default 3 seconds
  className,
}: ControlHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [agentStyle, setAgentStyle] = useState<
    'minimal' | 'formal' | 'hacker' | 'reasoning'
  >('hacker');
  const [autoPlayInterval, setAutoPlayInterval] = useState(playbackInterval);

  const handleAgentStyleChange = (
    style: 'minimal' | 'formal' | 'hacker' | 'reasoning'
  ) => {
    setAgentStyle(style);
    onAgentStyleChange?.(style);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full bg-background/95 backdrop-blur-sm border-b border-border',
        'sticky top-0 z-50',
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex flex-col space-y-3 py-2">
          {/* Row 1: Logo & Title on left, Settings & Theme on right */}
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <div className="relative">
                  <Bot className="w-6 h-6 text-primary" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">
                    A2A Demo Studio
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Agent-to-Agent Communication Demo
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  'p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors',
                  'border border-border hover:border-primary/50'
                )}
              >
                <Settings className="w-4 h-4" />
              </motion.button>

              <ViewModeToggle
                currentMode={currentViewMode}
                onToggle={onViewModeChange}
              />
              <ThemeToggle onToggle={onThemeToggle} />
            </div>
          </div>

          {/* Row 2: Main controls centered */}
          <div className="flex justify-center">
            <Card className="flex flex-row items-center p-1 bg-card/50">
              <ScenarioSelector />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <PlayControls interval={autoPlayInterval} />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <RecordingControls />
            </Card>
          </div>
        </div>

        {/* Expandable advanced controls */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {isExpanded && (
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="pt-3 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="p-3">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Scenario Editor
                  </h3>
                </Card>

                <Card className="p-3">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    Recording Settings
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <span className="text-foreground">1080p 30fps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="text-foreground">MP4 (H.264)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aspect Ratio:</span>
                      <span className="text-foreground">16:9</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-3">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    ⏱️ Auto-play Interval
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Interval:</span>
                      <span className="text-foreground font-mono">
                        {(autoPlayInterval / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={autoPlayInterval}
                      onChange={(e) =>
                        setAutoPlayInterval(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1s</span>
                      <span>5s</span>
                      <span>10s</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-3">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    🎨 Agent Terminal Style
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => handleAgentStyleChange('minimal')}
                        className={cn(
                          'px-2 py-1 text-xs rounded border transition-colors',
                          agentStyle === 'minimal'
                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                        )}
                      >
                        Minimal
                      </button>
                      <button
                        onClick={() => handleAgentStyleChange('formal')}
                        className={cn(
                          'px-2 py-1 text-xs rounded border transition-colors',
                          agentStyle === 'formal'
                            ? 'border-slate-500 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                            : 'border-slate-500/30 bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                        )}
                      >
                        Formal
                      </button>
                      <button
                        onClick={() => handleAgentStyleChange('hacker')}
                        className={cn(
                          'px-2 py-1 text-xs rounded border transition-colors',
                          agentStyle === 'hacker'
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                            : 'border-green-500/30 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                        )}
                      >
                        Hacker
                      </button>
                      <button
                        onClick={() => handleAgentStyleChange('reasoning')}
                        className={cn(
                          'px-2 py-1 text-xs rounded border transition-colors',
                          agentStyle === 'reasoning'
                            ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                            : 'border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                        )}
                      >
                        Reasoning
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Current:{' '}
                      <span className="text-foreground font-mono capitalize">
                        {agentStyle}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Performance indicators */}
              <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>System Ready</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>MediaRecorder API</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Framer Motion</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}

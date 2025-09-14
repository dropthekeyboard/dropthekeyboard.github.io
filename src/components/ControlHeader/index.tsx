import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecordingControls } from "./RecordingControls";
import { ThemeToggle } from "./ThemeToggle";
import { ScenarioSelector } from "./ScenarioSelector.tsx";
import { PlayControls } from "./PlayControls";
import { Settings, Monitor, Smartphone, Bot } from "lucide-react";

interface ControlHeaderProps {
  onThemeToggle: () => void;
  className?: string;
}

export function ControlHeader({
  onThemeToggle,
  className,
}: ControlHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full bg-background/95 backdrop-blur-sm border-b border-border",
        "sticky top-0 z-50",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo & Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Bot className="w-8 h-8 text-primary" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">
                  A2A Demo Studio
                </h1>
                <p className="text-xs text-muted-foreground">
                  Agent-to-Agent Communication Demo
                </p>
              </div>
            </motion.div>

            {/* Phase indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>→</span>
                <Bot className="w-4 h-4 text-primary" />
                <span>→</span>
                <Monitor className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Center section - Main controls */}
          <div className="flex items-center space-x-2">
            <Card className="flex items-center p-1 bg-card/50">
              <ScenarioSelector />
              <Separator orientation="vertical" className="mx-2 h-8" />
              <PlayControls />
              <Separator orientation="vertical" className="mx-2 h-8" />
              <RecordingControls />
            </Card>
          </div>

          {/* Right section - Settings & Theme */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors",
                "border border-border hover:border-primary/50",
              )}
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            <ThemeToggle onToggle={onThemeToggle} />
          </div>
        </div>

        {/* Expandable advanced controls */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {isExpanded && (
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="pt-4 border-t border-border mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Scenario Editor
                  </h3>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    Recording Settings
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
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
              </div>

              {/* Performance indicators */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-muted-foreground">
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

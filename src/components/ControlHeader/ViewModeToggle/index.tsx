import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Monitor, Scroll } from 'lucide-react';

interface ViewModeToggleProps {
  currentMode?: 'demo' | 'storytelling';
  onToggle?: (mode: 'demo' | 'storytelling') => void;
  className?: string;
}

export function ViewModeToggle({
  currentMode = 'demo',
  onToggle,
  className,
}: ViewModeToggleProps) {
  const isStorytellingMode = currentMode === 'storytelling';

  const handleToggle = () => {
    const newMode = isStorytellingMode ? 'demo' : 'storytelling';
    onToggle?.(newMode);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex items-center space-x-2 p-2 rounded-md',
        'bg-muted/30 border border-border hover:border-primary/50',
        'transition-all duration-200',
        className
      )}
    >
      <Monitor
        className={cn(
          'w-4 h-4 transition-colors duration-200',
          !isStorytellingMode ? 'text-blue-500' : 'text-muted-foreground'
        )}
      />

      <Switch
        checked={isStorytellingMode}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary"
        aria-label="Toggle between Demo and Storytelling view"
      />

      <Scroll
        className={cn(
          'w-4 h-4 transition-colors duration-200',
          isStorytellingMode ? 'text-purple-500' : 'text-muted-foreground'
        )}
      />
    </motion.div>
  );
}

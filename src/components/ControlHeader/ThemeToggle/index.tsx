import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ onToggle, className }: ThemeToggleProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center space-x-2 p-2 rounded-md",
        "bg-muted/30 border border-border hover:border-primary/50",
        "transition-all duration-200",
        className,
      )}
    >
      <Sun
        className={cn(
          "w-4 h-4 transition-colors duration-200",
          isDark ? "text-muted-foreground" : "text-yellow-500",
        )}
      />

      <Switch
        checked={isDark}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
        aria-label="Toggle dark mode"
      />

      <Moon
        className={cn(
          "w-4 h-4 transition-colors duration-200",
          isDark ? "text-blue-400" : "text-muted-foreground",
        )}
      />
    </motion.div>
  );
}

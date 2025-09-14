import { cn } from "@/lib/utils";
import { Battery, Signal } from "lucide-react";

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className }: StatusBarProps) {

  // Choose the appropriate state based on variant

  // Get current time
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-2 text-black dark:text-white text-sm font-medium bg-transparent",
        "relative z-10",
        className,
      )}
    >
      {/* Left side - Time */}
      <div className="flex-1">
        <span className="font-semibold">{currentTime}</span>
      </div>

      {/* Center - Dynamic Island area (empty for content) */}
      <div className="flex-1 flex justify-center">
        <div className="w-16 h-6"></div>
      </div>

      {/* Right side - Status icons */}
      <div className="flex-1 flex items-center justify-end space-x-1">
        {/* Signal strength */}
        <div className="flex items-center">
          <Signal
            className={cn("w-4 h-4 text-black dark:text-white"
            )}
          />
        </div>

        {/* Battery */}
        <div className="flex items-center">
          <Battery
            className={cn(
              "w-4 h-4 text-black dark:text-white")}
          />
          <span
            className={cn("text-xs ml-0.5 font-medium text-black dark:text-white")}
          >
            {100}%
          </span>
        </div>
      </div>
    </div>
  );
}

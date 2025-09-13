import { cn } from "@/lib/utils";
import { Battery, Signal, Wifi } from "lucide-react";
import { useScenarioStore } from "@/stores/scenarioStore";

interface StatusBarProps {
  variant?: "user" | "service";
  className?: string;
}

export function StatusBar({ variant = "user", className }: StatusBarProps) {
  const { leftSectionState, rightSectionState } = useScenarioStore();

  // Choose the appropriate state based on variant
  const phoneState = variant === "user" ? leftSectionState : rightSectionState;

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
        <div className="w-24 h-6"></div>
      </div>

      {/* Right side - Status icons */}
      <div className="flex-1 flex items-center justify-end space-x-1">
        {/* Signal strength */}
        <div className="flex items-center">
          <Signal
            className={cn(
              "w-4 h-4",
              phoneState.signalStrength >= 3
                ? "text-black dark:text-white"
                : phoneState.signalStrength >= 2
                  ? "text-yellow-500"
                  : "text-red-500",
            )}
          />
          <div className="flex items-end ml-0.5 space-x-0.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  bar === 1 && "h-1",
                  bar === 2 && "h-1.5",
                  bar === 3 && "h-2",
                  bar === 4 && "h-2.5",
                  phoneState.signalStrength >= bar
                    ? "bg-black dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-600",
                )}
              />
            ))}
          </div>
        </div>

        {/* WiFi */}
        <Wifi className="w-4 h-4 text-black dark:text-white" />

        {/* Battery */}
        <div className="flex items-center">
          <Battery
            className={cn(
              "w-4 h-4",
              phoneState.batteryLevel > 20
                ? "text-black dark:text-white"
                : "text-red-500",
            )}
          />
          <span
            className={cn(
              "text-xs ml-0.5 font-medium",
              phoneState.batteryLevel > 20
                ? "text-black dark:text-white"
                : "text-red-500",
            )}
          >
            {phoneState.batteryLevel}%
          </span>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatusBar } from "@/components/shared/StatusBar";
import { useEffect, useRef } from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({
  children,
  className,
}: PhoneFrameProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when children change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[20vw] aspect-[9/19.5]"
      >
        {/* iPhone-style outer bezel */}
        <div className={cn(
          "relative w-full h-full rounded-[2.5rem] shadow-2xl shadow-gray-900/50 p-2",
          "bg-gradient-to-br from-gray-800 to-gray-900"
        )}>
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-full z-20"></div>

          {/* Screen */}
          <div className="w-full h-full bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden flex flex-col relative">
            {/* Status Bar */}
            <div className="relative z-10">
              <StatusBar/>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-hidden relative">
              {/* Screen protector effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/10 pointer-events-none"></div>

              {/* Content */}
              <div
                ref={scrollRef}
                className="w-full h-full overflow-y-auto"
              >
                {children}
              </div>
            </div>

            {/* Home indicator (for iPhone X+ style) */}
            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute -left-1 top-16 w-1 h-8 bg-gray-700 rounded-l-md"></div>
          <div className="absolute -left-1 top-28 w-1 h-12 bg-gray-700 rounded-l-md"></div>
          <div className="absolute -left-1 top-44 w-1 h-12 bg-gray-700 rounded-l-md"></div>
          <div className="absolute -right-1 top-20 w-1 h-16 bg-gray-700 rounded-r-md"></div>
        </div>

        {/* Screen reflection effect */}
        <div className="absolute inset-2 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
      </motion.div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface NumpadProps {
  pressedKey?: number | null;
  onKeyPress?: (key: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Numpad({
  pressedKey,
  onKeyPress,
  className,
  size = 'md',
}: NumpadProps) {
  const { resolvedTheme } = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'max-w-[140px] gap-1',
      button: 'py-2 text-sm',
    },
    md: {
      container: 'max-w-[180px] gap-2',
      button: 'py-4 text-lg',
    },
    lg: {
      container: 'max-w-[220px] gap-3',
      button: 'py-6 text-xl',
    },
  };

  // Theme-based styling - enhanced pressed state visibility
  const themeStyles = {
    light: {
      keypadColor: 'text-gray-700',
      keypadBorder: 'border-white/40',
      keypadBg: 'bg-white/30 backdrop-blur-lg',
      keypadHover: 'hover:bg-white/50 hover:border-white/60 hover:shadow-lg',
      dtmfBg: 'bg-green-200/80 backdrop-blur-xl',
      dtmfText: 'text-green-800 font-bold',
      dtmfBorder: 'border-green-300/80',
      dtmfShadow: 'shadow-green-200/50',
    },
    dark: {
      keypadColor: 'text-gray-200',
      keypadBorder: 'border-white/20',
      keypadBg: 'bg-white/10 backdrop-blur-lg',
      keypadHover: 'hover:bg-white/20 hover:border-white/30 hover:shadow-lg',
      dtmfBg: 'bg-green-400/30 backdrop-blur-xl',
      dtmfText: 'text-green-300 font-bold',
      dtmfBorder: 'border-green-400/60',
      dtmfShadow: 'shadow-green-400/30',
    },
  };

  const currentTheme = themeStyles[resolvedTheme];
  const currentSize = sizeConfig[size];

  const handleKeyPress = (key: string) => {
    onKeyPress?.(key);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div
      className={cn(
        'grid grid-cols-3 px-8 mx-auto',
        currentSize.container,
        className
      )}
    >
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className={cn(
            'flex items-center justify-center font-medium transition-all duration-500 rounded-2xl border shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            currentSize.button,
            currentTheme.keypadBg,
            pressedKey === key
              ? `${currentTheme.dtmfText} scale-115 ${currentTheme.dtmfBg} ${currentTheme.dtmfBorder} shadow-2xl ${currentTheme.dtmfShadow} ring-2 ring-green-300/50 animate-pulse`
              : `${currentTheme.keypadColor} ${currentTheme.keypadBorder} ${currentTheme.keypadHover} hover:scale-105 active:scale-95`
          )}
          aria-label={`Key ${key}`}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

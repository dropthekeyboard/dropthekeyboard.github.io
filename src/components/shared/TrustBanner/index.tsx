import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrustBannerProps {
  message: string;
  logo?: string;
  gradientColors?: [string, string];
  className?: string;
}

export function TrustBanner({
  message,
  logo,
  gradientColors = ['#009EFD', '#2AF598'],
  className
}: TrustBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        'flex items-center gap-4 p-6 rounded-2xl',
        'backdrop-blur-md border border-white/20',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`
      }}
    >
      {logo && (
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          src={logo}
          alt="SK텔레콤"
          className="w-10 h-10 object-contain"
        />
      )}
      <span className="text-white font-bold text-lg lg:text-xl">
        {message}
      </span>
    </motion.div>
  );
}
import { useContext, useEffect, useRef } from 'react';
import { PinningContext } from '@/contexts/pinning';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedSlideProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slideUp' | 'slideDown' | 'scale';
  delay?: number;
}

export function AnimatedSlide({ 
  children, 
  animationType = 'fade',
  delay = 0 
}: AnimatedSlideProps) {
  const { isEntering } = useContext(PinningContext);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const animations = {
      fade: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideUp: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } },
      slideDown: { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0 } },
      scale: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } }
    };

    const anim = animations[animationType];
    gsap.fromTo(ref.current, anim.from, {
      ...anim.to,
      duration: 0.8,
      delay,
      ease: 'power2.out',
      onComplete: () => {
        hasAnimated.current = true;
      }
    });
  }, [animationType, delay]);

  // Pinning 상태 변화에 따른 추가 애니메이션
  useEffect(() => {
    if (isEntering && ref.current && hasAnimated.current) {
      gsap.to(ref.current, {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }, [isEntering]);

  return (
    <div ref={ref} className={cn('transition-all')}>
      {children}
    </div>
  );
}
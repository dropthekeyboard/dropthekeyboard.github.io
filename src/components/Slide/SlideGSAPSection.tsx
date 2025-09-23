import React, { useMemo, useRef, useContext } from "react";
import type { PropsWithChildren } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinningContext } from "@/contexts/pinning";

// Ensure plugin registration once in module scope
// Idempotent registration (safe to call multiple times)
gsap.registerPlugin(useGSAP, ScrollTrigger);

// GSAP animation interface with targets property
interface GSAPAnimationWithTargets extends gsap.core.Animation {
  targets: Element[];
}

// Type guard to check if animation has targets
function hasTargets(animation: gsap.core.Animation | null | undefined): animation is GSAPAnimationWithTargets {
  return animation !== null && animation !== undefined && 'targets' in animation && Array.isArray((animation as GSAPAnimationWithTargets).targets);
}

type Easing =
  | "power1.in" | "power1.out" | "power1.inOut"
  | "power2.in" | "power2.out" | "power2.inOut"
  | "power3.in" | "power3.out" | "power3.inOut"
  | "power4.in" | "power4.out" | "power4.inOut"
  | "back.in(1.7)" | "back.out(1.7)" | "back.inOut(1.7)"
  | "elastic.out(1, 0.3)" | "bounce.out" | string;

export type AnimationVariant =
  | "fadeUp"
  | "scaleIn"
  | "rotateIn"
  | "slideLeft"
  | "slideRight"
  | "bounceIn"
  | "none";

export type SlideGSAPSectionProps = PropsWithChildren<{
  className?: string;
  // Animation
  variant?: AnimationVariant;
  duration?: number;
  delay?: number;
  ease?: Easing;
  stagger?: number | undefined;
  // ScrollTrigger basics
  start?: string; // e.g. "top 80%"
  end?: string;   // e.g. "bottom 20%"
  scrub?: boolean | number;
  once?: boolean; // play once
  // Pinning
  pin?: boolean;
  pinSpacing?: boolean;
  pinDistance?: number | string; // when pin is true and end not provided, use "+=<distance>"
  // Context integration
  sectionIndex?: number; // for PinningContext integration
}>;

const initialMap: Record<AnimationVariant, gsap.TweenVars> = {
  fadeUp: { y: 60, opacity: 0 },
  scaleIn: { scale: 0.8, opacity: 0 },
  rotateIn: { rotation: -180, opacity: 0 },
  slideLeft: { x: -120, opacity: 0 },
  slideRight: { x: 120, opacity: 0 },
  bounceIn: { y: -30, opacity: 0 },
  none: {},
};

const targetMap: Record<AnimationVariant, gsap.TweenVars> = {
  fadeUp: { y: 0, opacity: 1 },
  scaleIn: { scale: 1, opacity: 1 },
  rotateIn: { rotation: 0, opacity: 1 },
  slideLeft: { x: 0, opacity: 1 },
  slideRight: { x: 0, opacity: 1 },
  bounceIn: { y: 0, opacity: 1, ease: "bounce.out" },
  none: {},
};

export default function SlideGSAPSection({
  children,
  className,
  variant = "fadeUp",
  duration = 1,
  delay = 0,
  ease = "power2.out",
  stagger,
  start = "top 80%",
  end = "bottom 20%",
  scrub,
  once = false,
  pin = false,
  pinSpacing = true,
  pinDistance,
  sectionIndex,
}: SlideGSAPSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance optimization: detect mobile devices
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  }, []);

  // Optimize animation settings for mobile
  const optimizedDuration = useMemo(() => {
    return isMobile ? Math.max(duration * 0.7, 0.3) : duration;
  }, [duration, isMobile]);

  const optimizedScrub = useMemo(() => {
    if (scrub === undefined) return undefined;
    if (typeof scrub === 'boolean') return scrub;
    return isMobile ? Math.min(scrub * 1.5, 3) : scrub;
  }, [scrub, isMobile]);

  // Get PinningContext functions - use useContext directly to avoid conditional hook calls
  const pinningContext = useContext(PinningContext);
  const updateSectionState = pinningContext?.updateSectionState;

  useGSAP(() => {
    if (variant === "none") return;

    // React Strict Mode safe cleanup and validation
    const containerElement = containerRef.current;
    if (!containerElement) {
      console.warn('SlideGSAPSection: containerRef.current is null, cannot create animation');
      return;
    }

    // Ensure ScrollTrigger is refreshed and cleaned up properly
    const existingTriggers = ScrollTrigger.getAll().filter(
      trigger => trigger.trigger === containerElement
    );
    if (existingTriggers.length > 0) {
      console.warn(`SlideGSAPSection: Found ${existingTriggers.length} existing triggers for this container, cleaning up...`);
      existingTriggers.forEach(trigger => trigger.kill());
    }

    const tweenVarsFrom = initialMap[variant];
    const tweenVarsTo = {
      ...targetMap[variant],
      duration: optimizedDuration,
      delay: isMobile ? delay * 0.5 : delay,
      ease
    } as gsap.TweenVars;

    const st: ScrollTrigger.Vars = {
      trigger: containerElement,
      // Pinning 시에는 섹션의 top이 뷰포트 top에 닿을 때 시작하도록 조정
      // (너무 이른 시작을 방지하고 섹션 진입 시점에 고정되도록)
      start: pin ? "top top" : start,
      end: pin ? (end || (pinDistance ? "+=" + pinDistance : "+=1500")) : end,
      toggleActions: once ? "play none none none" : "play none none reverse",
      ...(optimizedScrub !== undefined ? { scrub: optimizedScrub } : {}),
      ...(pin ? {
        pin,
        pinSpacing,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true
      } : {}),
      // Enhanced ScrollTrigger configuration for smooth animations
      invalidateOnRefresh: true,
      refreshPriority: sectionIndex != null ? -sectionIndex : -1,
      // Add onToggle callback for PinningContext integration - 안전성 강화
      ...(updateSectionState != null && sectionIndex != null ? {
        onToggle: (self) => {
          try {
            const isActive = self.isActive;
            const direction = self.direction; // 1: forward, -1: backward

            updateSectionState(sectionIndex, {
              isPinned: pin ? isActive : false,
              isEntering: isActive && direction !== -1,
              isLeaving: !isActive && direction !== 1,
            });
          } catch (error) {
            console.warn('SlideGSAPSection onToggle error:', error);
          }
        }
      } : {}),
      // Add onRefresh callback to handle layout changes - 안전성 강화
      onRefresh: (self) => {
        try {
          if (hasTargets(self.animation)) {
            self.animation.invalidate();
          }
        } catch (error) {
          console.warn('SlideGSAPSection onRefresh error:', error);
        }
      },
      // Add onUpdate callback for smooth scrub animations with validation - 안전성 강화
      ...(optimizedScrub !== undefined ? {
        onUpdate: (self) => {
          try {
            if (hasTargets(self.animation) && self.progress !== undefined) {
              self.animation.progress(self.progress);
            }
          } catch (error) {
            console.warn('SlideGSAPSection onUpdate error:', error);
          }
        }
      } : {}),
      // Mobile optimization: reduce callbacks
      ...(isMobile ? {
        callbackScope: containerElement,
        fastScrollEnd: 0.5
      } : {})
    };

    const tl = gsap.timeline({
      scrollTrigger: st,
      paused: false,
      // Add timeline configuration for smooth interruption handling
      overwrite: "auto",
      immediateRender: false
    });

    // Use scoped selector to find single animation target with validation
    const container = containerRef.current;
    const target = container?.querySelector("[data-anim]");

    if (target && document.contains(target)) {
      // Enhanced animation configuration for smoother transitions
      tl.fromTo(target, tweenVarsFrom, {
        ...tweenVarsTo,
        // Remove stagger for single target
        // Add overwrite protection for smooth direction changes
        overwrite: "auto",
        // Improve performance with will-change hints
        force3D: true
        // Remove onInterrupt - useGSAP handles cleanup automatically
      });
    } else if (container && document.contains(container)) {
      // Fallback to animating the container itself (only if it exists and is in DOM)
      tl.fromTo(container, tweenVarsFrom, {
        ...tweenVarsTo,
        overwrite: "auto",
        force3D: true
        // Remove onInterrupt - useGSAP handles cleanup automatically
      });
    } else {
      // If no valid targets found, kill the timeline to prevent warnings
      tl.kill();
      return null;
    }

    // Return timeline for potential external control
    return tl;

    // No manual cleanup needed - useGSAP handles it automatically via gsap.context()
  }, {
    scope: containerRef,
    dependencies: [variant, optimizedDuration, delay, ease, stagger, start, end, optimizedScrub, once, pin, pinSpacing, pinDistance, sectionIndex, updateSectionState, isMobile]
  });

  const pinStyle = useMemo(() => ({
    minHeight: pin ? "100vh" : undefined,
  }) as React.CSSProperties, [pin]);

  return (
    <section ref={containerRef} className={className} style={pinStyle}>
      <div data-anim className="relative w-full h-full">
        {children}
      </div>
    </section>
  );
}

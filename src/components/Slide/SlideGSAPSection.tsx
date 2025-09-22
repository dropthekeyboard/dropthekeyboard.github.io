import React, { useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure plugin registration once in module scope
// Idempotent registration (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

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
}: SlideGSAPSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const tweenVarsFrom = initialMap[variant];
    const tweenVarsTo = { ...targetMap[variant], duration, delay, ease } as gsap.TweenVars;

    const st: ScrollTrigger.Vars = {
      trigger: el,
      start,
      end: pin ? (end || (pinDistance ? "+=" + pinDistance : "+=1500")) : end,
      toggleActions: once ? "play none none none" : "play none none reverse",
      ...(scrub !== undefined ? { scrub } : {}),
      ...(pin ? { pin, pinSpacing } : {}),
    };

    const tl = gsap.timeline({ scrollTrigger: st });

    if (variant !== "none") {
      const targets = el.querySelectorAll("[data-anim]");
      if (targets.length > 0) {
        tl.fromTo(targets, tweenVarsFrom, { ...tweenVarsTo, stagger });
      } else {
        tl.fromTo(el, tweenVarsFrom, tweenVarsTo);
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerRef });

  const pinStyle = useMemo(() => ({
    minHeight: pin ? "100vh" : undefined,
  }) as React.CSSProperties, [pin]);

  return (
    <section ref={containerRef} className={className} style={pinStyle}>
      <div data-anim>
        {children}
      </div>
    </section>
  );
}

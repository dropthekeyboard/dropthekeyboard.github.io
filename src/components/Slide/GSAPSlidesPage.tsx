// no default React import needed with React 17+ JSX transform
import { ScenarioSection } from "@/components/Test/ScenarioSection";
import { PinningProvider } from "@/contexts/pinning";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import {
  ImageSlide,
  Slide001,
  Slide002,
  Slide003,
  Slide005, Slide007,
  Slide008, Slide009, Slide011, Slide012, Slide013, Slide017,
  SlideGSAPSection
} from ".";

export default function GSAPSlidesPage() {
  // Touch gesture state
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  // Total number of slides
  const totalSlides = 18; // 0-17 (18 slides total)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsSwipeActive(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    // Swipe detection criteria
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;
    const maxVerticalDistance = 100;

    // Check if it's a valid horizontal swipe
    if (Math.abs(deltaX) > minSwipeDistance &&
        Math.abs(deltaY) < maxVerticalDistance &&
        deltaTime < maxSwipeTime) {

      if (deltaX > 0) {
        // Swipe right - go to previous slide
        navigateToSlide(Math.max(0, currentSlideIndex - 1));
      } else {
        // Swipe left - go to next slide
        navigateToSlide(Math.min(totalSlides - 1, currentSlideIndex + 1));
      }
    }

    touchStartRef.current = null;
    setIsSwipeActive(false);
  }, [isMobile, currentSlideIndex, totalSlides]);

  // Navigate to specific slide
  const navigateToSlide = useCallback((slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;

    const slideElement = document.querySelector(`[data-slide-index="${slideIndex}"]`);
    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setCurrentSlideIndex(slideIndex);
    }
  }, [totalSlides]);

  // Add touch event listeners and scroll tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    // Touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Scroll tracking for current slide indicator
    const handleScroll = () => {
      const slides = container.querySelectorAll('[data-slide-index]');
      const viewportHeight = window.innerHeight;

      let closestSlideIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = Math.abs(slideCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlideIndex = index;
        }
      });

      setCurrentSlideIndex(closestSlideIndex);
    };

    // Throttled scroll handler for performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [handleTouchStart, handleTouchEnd, isMobile]);

  // Global ScrollTrigger management
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Set up global ScrollTrigger defaults for better performance
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
      scroller: window,
      markers: false
    });

    // Configure ScrollTrigger for smooth scrolling
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });

    return () => {
      // Clean up on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle dynamic content refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refresh = () => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    // Debounced refresh function
    let refreshTimeout: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(refresh, 150);
    };

    // Listen for events that might affect layout
    const onResize = () => debouncedRefresh();
    const onLoad = () => refresh();
    const onOrientationChange = () => {
      // Delay refresh for orientation change
      setTimeout(refresh, 500);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('load', onLoad);
    window.addEventListener('orientationchange', onOrientationChange);

    // Initial refresh after component mount
    refresh();

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);

  return (
    <PinningProvider>
      <div
        ref={containerRef}
        className="overflow-x-hidden"
        style={{ touchAction: isMobile ? 'pan-y' : 'auto' }}
      >
        {/* Mobile Navigation Indicator */}
        {isMobile && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 transition-all duration-200 ${
            isSwipeActive ? 'scale-110 bg-black/30' : 'scale-100'
          }`}>
            <div className="flex space-x-1">
              {Array.from({ length: totalSlides }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentSlideIndex ? 'bg-white scale-125' : 'bg-white/40'
                  } ${isSwipeActive ? 'animate-pulse' : ''}`}
                />
              ))}
            </div>
            {/* Swipe Guide */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs whitespace-nowrap">
              ← 스와이프하여 탐색 →
            </div>
          </div>
        )}

        {/* All Slides with different animations */}
        <SlideGSAPSection
          sectionIndex={0}
          className="min-h-screen"
          variant="scaleIn"
          ease="back.out(1.7)"
          data-slide-index={0}
        >
          <Slide001 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={1} pin pinDistance={2000} scrub={0.8} className="min-h-screen" variant="slideLeft" data-slide-index={1}>
          <Slide002 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={2} pin pinDistance={1600} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="rotateIn" data-slide-index={2}>
          <Slide003 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={3} pin pinDistance={1700} scrub={1.2} className="min-h-screen flex items-center justify-center" variant="fadeUp" data-slide-index={3}>
          <ImageSlide imageUrl="/assets/slide/slide4_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={4} pin pinDistance={1600} scrub={1.2} className="min-h-screen flex items-center justify-center" variant="scaleIn" data-slide-index={4}>
          <Slide005 sectionIndex={4} />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={5} pin pinDistance={1400} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="slideRight" data-slide-index={5}>
          <ImageSlide imageUrl="/assets/slide/slide6_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={6} pin pinDistance={1400} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="bounceIn" data-slide-index={6}>
          <Slide007 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={7} className="min-h-screen flex items-center justify-center" variant="fadeUp" data-slide-index={7}>
          <Slide008 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={8} className="min-h-screen flex items-center justify-center" variant="slideLeft" data-slide-index={8}>
          <Slide009 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={9} className="min-h-screen flex items-center justify-center" variant="scaleIn" ease="back.out(1.7)" data-slide-index={9}>
          <ImageSlide imageUrl="/assets/slide/slide10_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={10} className="min-h-screen flex items-center justify-center" variant="rotateIn" data-slide-index={10}>
          <Slide011 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={11} className="min-h-screen flex items-center justify-center" variant="slideRight" data-slide-index={11}>
          <Slide012 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={12} className="min-h-screen flex items-center justify-center" variant="bounceIn" data-slide-index={12}>
          <Slide013 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={13} pin pinDistance={1000} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="scaleIn" data-slide-index={13}>
          <ImageSlide imageUrl="/assets/slide/slide14_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={14} className="min-h-screen flex items-center justify-center" variant="scaleIn" data-slide-index={14}>
          <ScenarioSection
            sectionIndex={14}
            scenarioId="use_case_1_restaurant_reservation"
            title="식당 예약 시나리오"
            agentStyle="reasoning"
          />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={15} className="min-h-screen flex items-center justify-center" variant="scaleIn" data-slide-index={15}>
          <ScenarioSection
            sectionIndex={15}
            scenarioId="use_case_2_senior_life_mate"
            title="시니어 라이프 메이트 (Use Case 2)"
            agentStyle="reasoning"
          />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={16} pin pinDistance={1000} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="scaleIn" data-slide-index={16}>
          <ImageSlide imageUrl="/assets/slide/slide16_image.png" />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={17} className="min-h-screen flex items-center justify-center" variant="rotateIn" data-slide-index={17}>
          <Slide017 />
        </SlideGSAPSection>
      </div>
    </PinningProvider>
  );
}

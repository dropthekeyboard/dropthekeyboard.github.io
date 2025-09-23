// no default React import needed with React 17+ JSX transform
import { ScenarioSection } from "@/components/Test/ScenarioSection";
import { PinningProvider } from "@/contexts/pinning";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";
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
      <div className="overflow-x-hidden">
        {/* All Slides with different animations */}
        <SlideGSAPSection sectionIndex={0} className="min-h-screen " variant="scaleIn" ease="back.out(1.7)">
          <Slide001 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={1} pin pinDistance={2000} scrub={0.8} className="min-h-screen" variant="slideLeft">
          <Slide002 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={2} pin pinDistance={1600} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="rotateIn">
          <Slide003 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={3} pin pinDistance={1700} scrub={1.2} className="min-h-screen flex items-center justify-center" variant="fadeUp">
          <ImageSlide imageUrl="/assets/slide/slide4_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={4} pin pinDistance={1600} scrub={1.2} className="min-h-screen flex items-center justify-center" variant="scaleIn">
          <Slide005 sectionIndex={4} />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={5} pin pinDistance={1400} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="slideRight">
          <ImageSlide imageUrl="/assets/slide/slide6_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={6} pin pinDistance={1400} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="bounceIn">
          <Slide007 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={7} className="min-h-screen flex items-center justify-center" variant="fadeUp">
          <Slide008 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={8} className="min-h-screen flex items-center justify-center" variant="slideLeft">
          <Slide009 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={9} className="min-h-screen flex items-center justify-center" variant="scaleIn" ease="back.out(1.7)">
          <ImageSlide imageUrl="/assets/slide/slide10_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={10} className="min-h-screen flex items-center justify-center" variant="rotateIn">
          <Slide011 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={11} className="min-h-screen flex items-center justify-center" variant="slideRight">
          <Slide012 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={12} className="min-h-screen flex items-center justify-center" variant="bounceIn">
          <Slide013 />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={13} pin pinDistance={1000} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="scaleIn">
          <ImageSlide imageUrl="/assets/slide/slide14_image.png" />
        </SlideGSAPSection>

        <SlideGSAPSection sectionIndex={14} className="min-h-screen flex items-center justify-center" variant="scaleIn">
          <ScenarioSection
            sectionIndex={14}
            scenarioId="use_case_1_restaurant_reservation"
            title="식당 예약 시나리오"
            agentStyle="reasoning"
          />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={15} className="min-h-screen flex items-center justify-center" variant="scaleIn">
          <ScenarioSection
            sectionIndex={15}
            scenarioId="use_case_2_senior_life_mate"
            title="시니어 라이프 메이트 (Use Case 2)"
            agentStyle="reasoning"
          />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={16} pin pinDistance={1000} scrub={0.8} className="min-h-screen flex items-center justify-center" variant="scaleIn">
          <ImageSlide imageUrl="/assets/slide/slide16_image.png" />
        </SlideGSAPSection>
        <SlideGSAPSection sectionIndex={17} className="min-h-screen flex items-center justify-center" variant="rotateIn">
          <Slide017 />
        </SlideGSAPSection>
      </div>
    </PinningProvider>
  );
}

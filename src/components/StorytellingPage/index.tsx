
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll, motion, useTransform } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const StorytellingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinningRef = useRef<HTMLDivElement>(null);

  // Pinning 섹션의 스크롤 진행률 추적
  const { scrollYProgress: pinningScrollProgress } = useScroll({
    target: pinningRef,
    offset: ["start end", "end start"]
  });

  const pinningProgress = useTransform(pinningScrollProgress, [0, 1], [0, 100]);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.rainbow-section');

    sections.forEach((section, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // 각 section마다 다른 애니메이션 효과 적용
      switch (index) {
        case 0: // Red - fade in from bottom
          tl.fromTo(section.querySelector('.content'),
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
          );
          break;
        case 1: // Orange - scale up
          tl.fromTo(section.querySelector('.content'),
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }
          );
          break;
        case 2: // Yellow - rotate in
          tl.fromTo(section.querySelector('.content'),
            { rotation: -180, opacity: 0 },
            { rotation: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
          );
          break;
        case 3: // Green - slide from left
          tl.fromTo(section.querySelector('.content'),
            { x: -200, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
          );
          break;
        case 4: // Blue - slide from right
          tl.fromTo(section.querySelector('.content'),
            { x: 200, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
          );
          break;
        case 5: // Indigo - bounce effect
          tl.fromTo(section.querySelector('.content'),
            { y: -50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.5,
              ease: "bounce.out",
              yoyo: true,
              repeat: 1,
              repeatDelay: 0.3
            }
          );
          break;
        case 6: // Violet - color morphing effect
          tl.fromTo(section.querySelector('.content'),
            { scale: 0.8, opacity: 0, filter: "hue-rotate(0deg)" },
            {
              scale: 1,
              opacity: 1,
              filter: "hue-rotate(360deg)",
              duration: 2,
              ease: "power2.inOut"
            }
          );
          break;
        case 7: // Pink - pinning effect (새로 추가)
          // Pinning은 별도 처리
          break;
      }
    });

    // Pinning 예시 섹션
    const pinningSection = document.querySelector('.pinning-section');
    if (pinningSection) {
      // 섹션이 고정되는 동안 내부 요소들이 애니메이션
      gsap.timeline({
        scrollTrigger: {
          trigger: pinningSection,
          start: "top top",
          end: "+=2000", // 고정되는 스크롤 거리
          pin: true, // 요소 고정
          scrub: 1,
          pinSpacing: true
          // onUpdate 콜백 제거 - Framer Motion useScroll 사용
        }
      })
      .fromTo(pinningSection.querySelector('.pinning-content'),
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 }
      )
      .to(pinningSection.querySelector('.pinning-text'),
        { y: -100, duration: 1 }, "-=0.5"
      )
      .to(pinningSection.querySelector('.pinning-box'),
        { rotation: 360, scale: 1.5, duration: 1 }, "-=0.5"
      )
      .to(pinningSection.querySelector('.pinning-bg'),
        { scale: 1.2, opacity: 0.3, duration: 1 }, "-=1"
      );
    }

    // 추가적인 parallax 효과
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  const rainbowSections = [
    { color: 'bg-red-500', name: 'Red', effect: 'Fade In' },
    { color: 'bg-orange-500', name: 'Orange', effect: 'Scale Up' },
    { color: 'bg-yellow-500', name: 'Yellow', effect: 'Rotate In' },
    { color: 'bg-green-500', name: 'Green', effect: 'Slide Left' },
    { color: 'bg-blue-500', name: 'Blue', effect: 'Slide Right' },
    { color: 'bg-indigo-500', name: 'Indigo', effect: 'Bounce' },
    { color: 'bg-violet-500', name: 'Violet', effect: 'Color Morph' },
    { color: 'bg-pink-500', name: 'Pink', effect: 'Pinning' }
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Parallax 배경 */}
      <div className="parallax-bg fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-20 -z-10" />

      {/* 메인 컨텐츠 */}
      <div className="min-h-screen">
        {rainbowSections.map((section, index) => (
          <section
            key={index}
            className={`rainbow-section ${section.color} min-h-screen flex items-center justify-center relative overflow-hidden`}
          >
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-pulse" />
              <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/30 animate-bounce" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/25 animate-ping" />
            </div>

            {/* 메인 컨텐츠 */}
            <div className="content text-center text-white z-10 max-w-2xl mx-auto px-8">
              <h2 className="text-6xl font-bold mb-4 drop-shadow-lg">
                {section.name}
              </h2>
              <p className="text-2xl mb-8 opacity-90">
                GSAP Effect: {section.effect}
              </p>
              <div className="text-lg opacity-75">
                <p>Scroll down to see more animations!</p>
                <p className="mt-2">Section {index + 1} of {rainbowSections.length}</p>
              </div>
            </div>

            {/* 장식 요소 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Pinning 예시 섹션 */}
      <section ref={pinningRef} className="pinning-section bg-pink-500 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Pinning 배경 */}
        <div className="pinning-bg absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 opacity-50" />

        {/* 고정되는 콘텐츠 컨테이너 */}
        <div className="pinning-content relative z-10 text-center text-white max-w-4xl mx-auto px-8">
          <h2 className="pinning-text text-6xl font-bold mb-8 drop-shadow-lg">
            GSAP Pinning Effect
          </h2>

          {/* 회전하는 박스 */}
          <div className="pinning-box w-32 h-32 bg-white/20 rounded-lg mx-auto mb-8 flex items-center justify-center">
            <div className="text-4xl">📌</div>
          </div>

          <p className="text-2xl mb-4 opacity-90">
            이 섹션이 스크롤되는 동안 고정됩니다!
          </p>
          <p className="text-lg opacity-75">
            내부 요소들이 애니메이션되는 것을 확인하세요
          </p>

          {/* Framer Motion으로 진행률 표시 */}
          <div className="mt-8">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-white h-2 rounded-full origin-left"
                style={{
                  width: pinningProgress
                }}
              />
            </div>
            <p className="text-sm mt-2 opacity-75">스크롤 진행률 (Framer Motion)</p>
          </div>
        </div>

        {/* 장식 요소들 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/20 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/15 rounded-full animate-ping" />
      </section>

      {/* 스크롤 인디케이터 */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex flex-col space-y-2">
          {rainbowSections.map((section, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${section.color} opacity-50 cursor-pointer transition-opacity hover:opacity-100`}
              onClick={() => {
                const element = document.querySelector(`.rainbow-section:nth-child(${index + 1})`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorytellingPage;
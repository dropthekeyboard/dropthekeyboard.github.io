import { useEffect, useState } from "react";
// JSX runtime auto-import; no explicit React import needed
import { SlideGSAPSection } from ".";

const AccessibilitySlide = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slide-bg flex flex-col items-center justify-center p-8 text-slide-text font-sans">
      {/* Title */}
      <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-slide-text">
          가치 3. 보편적 접근성
        </h1>
      </div>

      {/* Main diagram container */}
      <div className="relative flex items-center justify-center mb-16">
        {/* Concentric rings */}
        <div className="relative w-96 h-96 md:w-[28rem] md:h-[28rem]">
          {/* Outer ring - Mobile phone holders */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              background: `conic-gradient(from 0deg, 
                hsl(var(--ring-start)) 0%, 
                hsl(var(--ring-middle)) 50%, 
                hsl(var(--ring-end)) 75%, 
                hsl(var(--ring-start)) 100%)`,
              mask: 'radial-gradient(circle, transparent 75%, black 80%, black 100%)',
              WebkitMask: 'radial-gradient(circle, transparent 75%, black 80%, black 100%)'
            }}
          />
          
          {/* Middle ring - Smartphone users */}
          <div 
            className={`absolute inset-8 rounded-full transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              background: `conic-gradient(from 45deg, 
                hsl(var(--ring-middle)) 0%, 
                hsl(var(--ring-end)) 60%, 
                hsl(var(--ring-start)) 100%)`,
              mask: 'radial-gradient(circle, transparent 60%, black 70%, black 100%)',
              WebkitMask: 'radial-gradient(circle, transparent 60%, black 70%, black 100%)'
            }}
          />
          
          {/* Inner ring - Specific app users */}
          <div 
            className={`absolute inset-16 rounded-full transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              background: `conic-gradient(from 90deg, 
                hsl(var(--ring-end)) 0%, 
                hsl(var(--ring-middle)) 70%, 
                hsl(var(--ring-start)) 100%)`,
              mask: 'radial-gradient(circle, transparent 50%, black 60%, black 100%)',
              WebkitMask: 'radial-gradient(circle, transparent 50%, black 60%, black 100%)'
            }}
          />

          {/* Center circle */}
          <div 
            className={`absolute inset-28 rounded-full bg-slide-bg transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        </div>

        {/* Labels */}
        {/* 휴대폰 보유자 - Top right */}
        <div 
          className={`absolute top-12 right-[-120px] md:right-[-140px] transition-all duration-1000 delay-1300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <div className="bg-label-bg text-label-text px-4 py-2 rounded-lg font-medium text-sm md:text-base relative">
            휴대폰 보유자
            <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-label-bg"></div>
          </div>
        </div>

        {/* 스마트폰 사용자 - Right */}
        <div 
          className={`absolute right-[-160px] md:right-[-180px] top-1/2 transform -translate-y-1/2 transition-all duration-1000 delay-1500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <div className="bg-label-bg text-label-text px-4 py-2 rounded-lg font-medium text-sm md:text-base relative">
            스마트폰 사용자
            <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-label-bg"></div>
          </div>
        </div>

        {/* 특정 앱 사용자 - Center */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 delay-1700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="text-center">
            <div className="text-slide-text font-medium text-sm md:text-base leading-tight">
              특정 앱<br />사용자
            </div>
          </div>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          {/* Line to 휴대폰 보유자 */}
          <line 
            x1="320" y1="80" x2="350" y2="50" 
            stroke="hsl(var(--ring-end))" 
            strokeWidth="2" 
            className={`transition-all duration-1000 delay-1400 ${
              isVisible ? 'opacity-60' : 'opacity-0'
            }`}
          />
          
          {/* Line to 스마트폰 사용자 */}
          <line 
            x1="320" y1="200" x2="370" y2="200" 
            stroke="hsl(var(--ring-end))" 
            strokeWidth="2" 
            className={`transition-all duration-1000 delay-1600 ${
              isVisible ? 'opacity-60' : 'opacity-0'
            }`}
          />
        </svg>
      </div>

      {/* Bottom text */}
      <div className={`max-w-4xl text-center transition-all duration-1000 delay-1900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <p className="text-lg md:text-xl text-slide-text-muted leading-relaxed">
          전화/문자는 <span className="text-slide-text font-semibold">휴대폰만 있으면</span>, 
          추가 앱 설치나 복잡한 세팅 없이 <span className="text-label-bg font-semibold">즉시 사용 가능</span>
        </p>
      </div>

      {/* Example GSAP Slides */}
      <div className="min-h-screen space-y-24">
        <SlideGSAPSection className="bg-blue-600 min-h-screen flex items-center justify-center" variant="fadeUp">
          <h2 className="text-white text-5xl font-bold">Fade Up</h2>
        </SlideGSAPSection>

        <SlideGSAPSection className="bg-green-600 min-h-screen flex items-center justify-center" variant="scaleIn" ease="back.out(1.7)">
          <h2 className="text-white text-5xl font-bold">Scale In</h2>
        </SlideGSAPSection>

        <SlideGSAPSection className="bg-pink-600 min-h-screen flex items-center justify-center" variant="none" pin pinDistance={1500} scrub={1}>
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Pinned Section</h2>
            <p className="text-xl opacity-90">스크롤 되는 동안 고정됩니다.</p>
          </div>
        </SlideGSAPSection>
      </div>
    </div>
  );
};

export default AccessibilitySlide;
import { useEffect, useState } from 'react';

// 동심원 다이어그램 컴포넌트
function AccessibilityDiagram() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full max-w-3xl h-80 md:h-96 flex items-center justify-center mx-auto">
      {/* 메인 다이어그램 컨테이너 */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* 가장 바깥 링 - 휴대폰 보유자 (그라데이션 링, padding 기반 컷아웃) */}
        <div
          className={`absolute inset-0 rounded-full p-3 md:p-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            background: 'linear-gradient(45deg, #24C6DC, #514A9D)',
            boxShadow: '0 0 28px rgba(81,74,157,0.35)'
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: '#282828' }}
          />
        </div>

        {/* 중간 링 - 스마트폰 사용자 (보라 톤 링, border 기반) */}
        <div
          className={`absolute inset-6 rounded-full bg-transparent transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } border-[14px] md:border-[16px] border-[#413C7A] shadow-[0_0_20px_rgba(65,60,122,0.3)]`}
        />

        {/* 가장 안쪽 원 - 특정 앱 사용자 (가장 어두운 퍼플) */}
        <div
          className={`absolute inset-16 rounded-full transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ backgroundColor: '#2F2B5B' }}
        />

        {/* 라벨들 - 시계 2시 방향으로 선형 배치 (연결선 없이 버블만) */}
        {/* 휴대폰 보유자 - 가장 바깥쪽 (바깥 링과 색상 매칭, 그라데이션 라벨) */}
        <div 
          className={`absolute transition-all duration-1000 delay-1100 ${
            isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-2'
          }`}
          style={{
            top: '16%',
            right: '-20%',
            transform: 'translateY(-50%)'
          }}
        >
          <div
            className="px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white shadow-sm"
            style={{
              background: 'linear-gradient(45deg, #24C6DC, #514A9D)'
            }}
          >
            휴대폰 보유자
          </div>
        </div>

        {/* 스마트폰 사용자 - 중간 (중간 링과 색상 매칭) */}
        <div 
          className={`absolute transition-all duration-1000 delay-1300 ${
            isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-2'
          }`}
          style={{
            top: '34%',
            right: '-22%',
            transform: 'translateY(-50%)'
          }}
        >
          <div
            className="px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white"
            style={{ backgroundColor: '#413C7A' }}
          >
            스마트폰 사용자
          </div>
        </div>

        {/* 특정 앱 사용자 - 중앙 */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 delay-1500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="text-center">
            <div className="text-white font-medium text-sm md:text-base leading-tight">
              특정 앱<br />사용자
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 012: 보편적 접근성 - 동심원 다이어그램
function Slide012() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className="min-h-screen w-full text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans"
      style={{ backgroundColor: '#282828' }}
    >
      <div className="max-w-6xl w-full space-y-8 md:space-y-16">
        {/* 상단 제목 */}
        <div 
          className={`text-left px-4 md:px-0 transition-all duration-1000 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight">
            가치 3. <span className="font-bold">보편적 접근성</span>
          </h1>
        </div>

        {/* 메인 다이어그램 */}
        <div className="flex items-center justify-center px-4 md:px-0">
          <AccessibilityDiagram />
        </div>

        {/* 하단 설명 */}
        <div 
          className={`text-center px-4 md:px-0 transition-all duration-1000 delay-1700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            전화/문자는 <strong className="text-white font-semibold">휴대폰만 있으면</strong>, 
            추가 앱 설치나 복잡한 세팅 없이{' '}
            <strong style={{ color: '#A951F9' }} className="font-semibold">즉시 사용 가능</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slide012;

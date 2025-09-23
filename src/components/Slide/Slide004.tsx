import { useRef } from 'react';
import { Phone } from 'lucide-react';

// Info Pill Component - 재사용 가능한 정보 박스
function InfoPill({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white/8 border border-white/10 rounded-xl p-4 text-left">
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-300">{subtitle}</p>
    </div>
  );
}

// Customer Column Component - 앱 사용자/비사용자 컬럼
function CustomerColumn({
  data,
  className = '',
}: {
  data: {
    title: string;
    image: string;
    pills: Array<{ id: string; title: string; subtitle: string }>;
  };
  className?: string;
}) {
  return (
    <div className={`flex-1 max-w-sm space-y-6 ${className}`}>
      {/* 이미지 */}
      <div className="w-full h-56  border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            // 이미지 로드 실패시 아이콘으로 대체
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="flex flex-col items-center text-gray-400">
                  <div class="w-16 h-16 mb-2">${data.title.includes('앱을') ? '<svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h10v16H7V4z"/></svg>' : '<svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}</div>
                  <span class="text-sm">${data.title}</span>
                </div>
              `;
            }
          }}
        />
      </div>

      {/* 컬럼 제목 */}
      <h3 className="text-xl font-bold text-white text-center">{data.title}</h3>

      {/* Info Pills */}
      <div className="space-y-4">
        {data.pills.map((pill) => (
          <InfoPill key={pill.id} title={pill.title} subtitle={pill.subtitle} />
        ))}
      </div>
    </div>
  );
}

// Bridge Column Component - 중앙 연결 브릿지
function BridgeColumn() {
  return (
    <div className="flex-shrink-0 w-64 flex flex-col items-center space-y-8">
      {/* 전화 레이블 */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400 hidden lg:block"></div>
        <span className="text-lg font-semibold text-purple-300">전화</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400 hidden lg:block"></div>
      </div>

      {/* 중앙 전화기 아이콘 */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          <Phone className="w-12 h-12 text-white" />
        </div>
        
        {/* 점선 연결 효과 - 데스크톱에서만 표시 */}
        <div className="absolute -left-16 top-1/2 w-16 h-px border-t-2 border-dashed border-purple-400/60 hidden lg:block"></div>
        <div className="absolute -right-16 top-1/2 w-16 h-px border-t-2 border-dashed border-purple-400/60 hidden lg:block"></div>
        
        {/* 모바일용 세로 점선 */}
        <div className="absolute top-28 left-1/2 w-px h-16 border-l-2 border-dashed border-purple-400/60 lg:hidden"></div>
        <div className="absolute -top-16 left-1/2 w-px h-16 border-l-2 border-dashed border-purple-400/60 lg:hidden"></div>
      </div>

      {/* 문자 레이블 */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-blue-400 hidden lg:block"></div>
        <span className="text-lg font-semibold text-blue-300">문자</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-blue-400 hidden lg:block"></div>
      </div>

      {/* 중앙 핵심 메시지 */}
      <div className="text-center space-y-2 max-w-xs">
        <p className="text-lg font-bold text-white leading-tight">
          앱이 놓치는 영역을 보완하는
        </p>
        <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          가장 보편적인 커뮤니케이션 채널
        </p>
      </div>
    </div>
  );
}

// Slide 004: 모바일 앱의 범람에도 불구하고 전화/문자는 여전히 필수적
function Slide004() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const flowContainerRef = useRef<HTMLDivElement>(null);

  // 데이터 정의
  const appUsersData = {
    title: '앱을 사용하는 고객도',
    image: '/assets/slide/app_screen.png',
    pills: [
      {
        id: 'app1',
        title: '실시간 요청',
        subtitle: '예약/변경/결제오류/장애 등',
      },
      {
        id: 'app2',
        title: '개인화된 요청',
        subtitle: '좌석 위치 지정/특정 메뉴 확인 등',
      },
    ],
  };

  const nonAppUsersData = {
    title: '앱이 익숙하지 않은 고객도',
    image: '/assets/slide/seniors.png',
    pills: [
      {
        id: 'nonapp1',
        title: '디지털 취약계층',
        subtitle: '고령/중장년층',
      },
      {
        id: 'nonapp2',
        title: '신뢰 기반 거래',
        subtitle: '단골 가게 연락 등',
      },
    ],
  };


  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full min-w-[80vw] text-foreground flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative"
    >
      <div className="max-w-7xl w-full space-y-16">
        {/* 상단 헤드라인 */}
        <div className="text-center space-y-4">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading"
          >
            모바일 앱의 범람에도 불구하고{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              전화/문자는 여전히 필수적
            </span>
          </h1>
        </div>

        {/* 3단 플로우 컨테이너 */}
        <div
          ref={flowContainerRef}
          className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12"
        >
          {/* 왼쪽: 앱 사용자 */}
          <CustomerColumn data={appUsersData} />

          {/* 중앙: 연결 브릿지 */}
          <BridgeColumn />

          {/* 오른쪽: 앱 비사용자 */}
          <CustomerColumn data={nonAppUsersData} />
        </div>
      </div>
    </div>
  );
}

export default Slide004;

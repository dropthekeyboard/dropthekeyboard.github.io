import { PhoneFrame } from '@/components/shared/PhoneFrame';

const Page14 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="grid grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Phase 1 */}
        <div className="bg-card p-6 rounded-lg flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-4">Phase 1</h2>
          <h3 className="text-xl mb-4">전화/문자 기반 A2H</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            망 레벨에서 AI Agent가 동작하는 구조로 가장 범용적인 A2A 초기 모델
            구현
          </p>
          {/* Diagram */}
          <div className="flex flex-col items-center space-y-2">
            <p>고객</p>
            <p>↓ 전화/문자</p>
            <p>Agent 서버 (ACP)</p>
            <p>↓ 전화/문자</p>
            <p>소상공인</p>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="bg-card p-6 rounded-lg flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-4">Phase 2</h2>
          <h3 className="text-xl mb-4">앱 기반 Agent로 준자동화</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            기존 사용중인 앱과의 연동을 통해 A2H와 A2A 사이의 교두보 마련
          </p>
          {/* Diagram */}
          <div className="flex items-center justify-center">
            {/* Placeholder for logos */}
            <div className="flex flex-col space-y-2 mr-4">
              <div className="w-12 h-6 bg-primary rounded"></div>
              <div className="w-12 h-6 bg-green-500 rounded"></div>
              <div className="w-12 h-6 bg-yellow-500 rounded"></div>
            </div>
            <PhoneFrame>
              <div className="bg-background h-full"></div>
            </PhoneFrame>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="bg-card p-6 rounded-lg flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-4">Phase 3</h2>
          <h3 className="text-xl mb-4">A2A로 완전 자동화</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Agent가 직접 상호작용으로 예약, 주문, 조율 end-to-end 자동 처리
          </p>
          {/* Diagram */}
          <div className="flex flex-col items-center space-y-2">
            <p>고객</p>
            <p>↓</p>
            <p>Agent</p>
            <p>↓ API</p>
            <p>소상공인 시스템</p>
          </div>
        </div>
      </div>

      <p className="text-2xl mt-10 max-w-5xl text-center font-bold">
        누구나 바로 이용할 수 있는 채널에서 출발하는 통신사 중심의 모두의 A2A
        생태계 구축
      </p>
    </div>
  );
};

export default Page14;

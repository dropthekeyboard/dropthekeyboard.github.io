// 각 컴포넌트의 데이터를 담은 배열입니다.
const componentsData = [
  {
    label: 'Component 1',
    title: '통신망 Gateway',
    description: '통신사 고유 인프라(인증/과금/QoS)로 신뢰성 확보',
  },
  {
    label: 'Component 2',
    title: '모델',
    description: 'A.X, Global SOTA 등 모델 포트폴리오 다각화로 고성능/저비용 구조 구현',
  },
  {
    label: 'Component 3',
    title: 'CPaaS*',
    description: '고객 요청을 자연스러운 대화 기반 실행 가능한 프로세스로 변환',
  },
  {
    label: 'Component 4',
    title: 'A2A 생태계',
    description: '로컬/글로벌 파트너 협력으로 고객 일상 전반을 커버하는 서비스 생태계 조성',
  },
];

// 개별 컴포넌트 박스를 렌더링하는 재사용 가능한 컴포넌트입니다.
const ComponentBox = ({ label, title, description }: { label: string; title: string; description: string }) => (
  <div className="bg-card rounded-xl p-7 flex flex-col justify-between min-h-[220px] border border-border shadow-lg transition-transform hover:scale-105 duration-300">
    <div>
      <p className="text-base text-muted-foreground mb-6">{label}</p>
      <h2 className="text-5xl font-bold bg-gradient-to-r from-[#AE90F4] to-[#86B3EF] text-transparent bg-clip-text leading-tight">
        {title}
      </h2>
    </div>
    <p className="text-base text-muted-foreground mt-4 leading-relaxed">{description}</p>
  </div>
);

// 메인 애플리케이션 컴포넌트입니다.
export default function Slide017() {
  return (
    <div className="min-h-screen w-full min-w-[80vw] bg-background flex items-center justify-center p-6 sm:p-10 font-sans text-foreground">
      <div className="w-full max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">핵심 구성요소</h1>
        </header>
        
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {componentsData.map((component) => (
              <ComponentBox
                key={component.label}
                label={component.label}
                title={component.title}
                description={component.description}
              />
            ))}
          </div>
        </main>

        <footer className="mt-6">
          <p className="text-sm text-muted-foreground">* Communication Platform as a Service</p>
        </footer>
      </div>
    </div>
  );
}

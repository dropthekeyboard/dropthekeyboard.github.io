import sktLogo from '@/assets/skt_logo.jpg';

const Page01 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center text-center p-10 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full filter blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-7xl font-extrabold tracking-tight">A2A Demo</h1>
        <p className="text-3xl mt-4 text-muted-foreground">모두의 AI, '전화/문자'에서 시작</p>
      </div>

      <img src={sktLogo} alt="SK Telecom Logo" className="absolute bottom-10 w-24" />
    </div>
  );
};

export default Page01;

const Page02 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center text-center p-10 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-muted-foreground mb-8">
          들어가며
        </h2>
        <p className="text-6xl font-bold">
          AI는 <span className="text-primary">A</span>gent{' '}
          <span className="text-primary">t</span>o{' '}
          <span className="text-primary">A</span>nything
        </p>
        <p className="text-2xl mt-6 text-muted-foreground">
          모든 것이 AI로 연결되는 A2A 시대의 서막
        </p>
      </div>
    </div>
  );
};

export default Page02;

const Page12 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold">가치 3. 보편적 접근성</h1>
      </div>

      <div className="relative flex items-center justify-center w-96 h-96">
        {/* Concentric Circles */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary opacity-50"></div>
        <div className="absolute w-2/3 h-2/3 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 opacity-60"></div>
        <div className="absolute w-1/3 h-1/3 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-70"></div>

        {/* Labels */}
        <div className="absolute top-1/4 right-0 transform translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md">
          <p>휴대폰 보유자 = 사용가능</p>
        </div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 bg-primary/80 text-primary-foreground px-3 py-1 rounded-md">
          <p>스마트폰 사용자</p>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/60 text-primary-foreground px-3 py-1 rounded-md">
          <p>특정 앱 사용자</p>
        </div>
      </div>

      <p className="text-2xl mt-16 max-w-4xl text-center">
        전화/문자는{' '}
        <span className="text-primary font-bold">휴대폰만 있으면</span>, 추가 앱
        설치나 복잡한 세팅 없이 즉시 사용 가능
      </p>
    </div>
  );
};

export default Page12;

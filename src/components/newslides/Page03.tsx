
const Page03 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold">모두의 AI는 '전화/문자'에서 시작</h1>
        <p className="text-2xl mt-4 text-muted-foreground">AI시대, 전화/문자는 왜 여전히 필요할까?</p>
      </div>
      <div className="flex justify-around w-full max-w-4xl mt-10">
        <div className="bg-card p-6 rounded-lg text-center w-1/3 mx-2">
          <h2 className="text-3xl font-bold text-primary">보편성</h2>
          {/* Placeholder for icon */}
          <div className="w-24 h-24 bg-muted mx-auto my-4 rounded-md"></div>
          <p className="text-xl">일반국민 누구나</p>
        </div>
        <div className="bg-card p-6 rounded-lg text-center w-1/3 mx-2">
          <h2 className="text-3xl font-bold text-primary">시급성</h2>
          {/* Placeholder for icon */}
          <div className="w-24 h-24 bg-muted mx-auto my-4 rounded-md"></div>
          <p className="text-xl">찾고기다릴 필요 없이</p>
        </div>
        <div className="bg-card p-6 rounded-lg text-center w-1/3 mx-2">
          <h2 className="text-3xl font-bold text-primary">확장성</h2>
          {/* Placeholder for icon */}
          <div className="w-24 h-24 bg-muted mx-auto my-4 rounded-md"></div>
          <p className="text-xl">작은 동네 상권까지도</p>
        </div>
      </div>
    </div>
  );
};

export default Page03;

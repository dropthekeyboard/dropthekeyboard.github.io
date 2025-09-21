const Page06 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">A2A를 앱 기반으로 시작할 경우,</h1>
        <p className="text-xl mt-4 max-w-3xl text-muted-foreground">
          전화번호만으로 예약을 관리해온 소상공인은 초기 진입 장벽에 막혀
          온보딩이 지연될 가능성이 큼
        </p>
      </div>

      <div className="bg-card p-8 rounded-lg w-full max-w-4xl flex flex-col items-center">
        {/* Top Character and Speech Bubble */}
        <div className="flex items-center mb-8">
          {/* Placeholder for worker character */}
          <div className="w-24 h-24 bg-muted rounded-full mr-8"></div>
          <div className="bg-primary text-primary-foreground p-4 rounded-lg relative">
            <p className="text-lg">
              지금도 전화로 충분한데 굳이 복잡한 절차를 해야 하나?
            </p>
            <div className="absolute left-0 top-1/2 -translate-x-4 w-4 h-4 bg-primary transform rotate-45"></div>
          </div>
        </div>

        {/* Bottom Character and Process Steps */}
        <div className="flex items-center">
          {/* Placeholder for stressed character */}
          <div className="w-24 h-24 bg-muted rounded-full mr-8"></div>
          <div className="flex space-x-4">
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-lg">
              앱설치
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-lg">
              메뉴 등록
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-lg">
              예약 시스템
            </div>
          </div>
        </div>

        <p className="mt-8 text-2xl font-bold">온보딩 지연</p>
      </div>
    </div>
  );
};

export default Page06;

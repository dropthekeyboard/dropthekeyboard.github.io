const Page04 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10 relative">
      <h1 className="text-4xl font-bold mb-16">
        모바일앱의 범람에도 불구하고,{' '}
        <span className="text-primary">전화/문자</span>는 여전히 필수적
      </h1>

      <div className="flex items-center justify-between w-full max-w-6xl">
        {/* Left Section */}
        <div className="flex flex-col items-center text-center">
          {/* Placeholder for phone app image */}
          <div className="w-48 h-80 bg-muted rounded-lg mb-4 border-2 border-border"></div>
          <p className="text-xl font-bold mb-4">앱을 사용하는 고객</p>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-lg">실시간 요청</p>
            <p className="text-sm text-muted-foreground">
              예약/변경/결제오류/장애
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg mt-2">
            <p className="text-lg">개인화된 요청</p>
            <p className="text-sm text-muted-foreground">
              좌석 위치 지정/알러지 등
            </p>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center mx-8">
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            {/* Phone Icon Placeholder */}
            <svg
              className="w-24 h-24 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
          </div>
          <div className="w-96 border-t-4 border-dotted border-primary"></div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center text-center">
          {/* Placeholder for elderly couple icon */}
          <div className="w-48 h-48 bg-muted rounded-full mb-4 border-2 border-border"></div>
          <p className="text-xl font-bold mb-4">앱이 익숙하지않은 고객</p>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-lg">디지털 취약계층</p>
            <p className="text-sm text-muted-foreground">고령/중장년층</p>
          </div>
          <div className="bg-card p-4 rounded-lg mt-2">
            <p className="text-lg">신뢰 기반 거래</p>
            <p className="text-sm text-muted-foreground">단골 가게 연락 등</p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg mt-16 text-center">
        <p className="text-2xl font-bold">
          전화/문자는 앱이 놓치는 영역을 보완해 접근성을 보장하는 핵심 채널
        </p>
      </div>
    </div>
  );
};

export default Page04;

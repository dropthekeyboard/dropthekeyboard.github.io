import React from 'react';
import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { Phone, PhoneOff } from 'lucide-react';

const Page11 = () => {
  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">가치 2. 신뢰성 확보</h1>
      </div>

      <div className="bg-card p-8 rounded-lg w-full max-w-5xl flex items-center justify-center">
        {/* Phone with Incoming Call */}
        <div className="w-1/3">
          <PhoneFrame>
            <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between p-8">
              <div className="text-center">
                <h2 className="text-3xl font-semibold">홍길동 AI Agent</h2>
                <p className="text-muted-foreground mt-2">calling...</p>
              </div>
              <div className="w-full flex justify-around">
                <button className="bg-destructive text-destructive-foreground p-4 rounded-full">
                  <PhoneOff size={32} />
                </button>
                <button className="bg-green-500 text-white p-4 rounded-full">
                  <Phone size={32} />
                </button>
              </div>
            </div>
          </PhoneFrame>
        </div>

        {/* Speech Bubble */}
        <div className="w-2/3 ml-8">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg relative">
            <p className="text-3xl font-bold text-center text-primary-foreground">SK텔레콤에서 인증한 AI Agent 전화입니다</p>
          </div>
        </div>
      </div>

      <p className="text-xl mt-10 max-w-4xl text-center text-muted-foreground">
        당사 전화번호자산과 가입자 인증 체계를 기반으로, 'SKT 인증 Agent 발신' 같은 라벨을 부착해 업주가 안심할 수 있는 신뢰 기반 제공 기능
      </p>
    </div>
  );
};

export default Page11;

import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageScreen } from '@/components/shared/MessageScreen';
import type { Message } from '@/contexts/scenario';

const Page10 = () => {
  const messages1: Message[] = [
    { from: 'SK텔레콤 AI Agent', to: 'user', content: '이번주 화요일 7시에 5명 양식당 예약해줘', timestamp: 1, senderType: 'customer', type: 'text' },
  ];

  const messages2: Message[] = [
    { from: 'SK텔레콤 AI Agent', to: 'user', content: '사장님, 오후 3시 30분에 예약 문의가 와서요. 임시로 예약 잡아드렸는데, 혹시 못 받으시면 알려주세요.', timestamp: 1, senderType: 'agent', type: 'text' },
    { from: 'SK텔레콤 AI Agent', to: 'user', content: '* 고객 요청: 오늘 오후 7시, 4명 예약 가능 여부\n 1. 네, 예약 확정합니다.\n 2. 아니오, 예약 변경합니다.\n 3. 아니오, 예약 취소합니다.', timestamp: 2, senderType: 'agent', type: 'text' },
  ];

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-10">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">가치 1. 성공률 보완</h1>
        <p className="text-xl mt-4 max-w-3xl text-muted-foreground">
          착신실패시 문자 자동전환되는 Failover는 Task성공률을 높일 수 있는 전국망을 보유한 통신사만의 차별적 역량
        </p>
      </div>

      <div className="bg-card p-8 rounded-lg w-full max-w-7xl flex items-center justify-around">
        {/* Customer */}
        <div className="flex flex-col items-center">
          {/* Placeholder for customer icon */}
          <div className="w-24 h-24 bg-primary rounded-full mb-2"></div>
          <p className="text-xl">고객</p>
        </div>

        <p className="text-4xl">→</p>

        {/* Phone 1 */}
        <div className="text-center">
          <p className="text-lg font-bold mb-2">전화/문자로 AI Agent에게 요청</p>
          <PhoneFrame>
            <MessageScreen messages={messages1} ownerName="user" contactName="SK텔레콤 AI Agent" />
          </PhoneFrame>
        </div>

        <p className="text-4xl">→</p>

        {/* AI Agent to Owner */}
        <div className="flex flex-col items-center text-center">
            <p>AIAgent가 업주에게 전화</p>
            {/* Placeholder for call icon */}
            <div className="w-16 h-16 bg-green-500 rounded-full my-2"></div>
            <p>소상공인</p>
        </div>

        <p className="text-4xl">→</p>

        {/* Phone 2 */}
        <div className="text-center">
          <p className="text-lg font-bold mb-2">문자로 통화요약 및 Follow-up 수행</p>
          <PhoneFrame>
            <MessageScreen messages={messages2} ownerName="user" contactName="SK텔레콤 AI Agent" />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
};

export default Page10;

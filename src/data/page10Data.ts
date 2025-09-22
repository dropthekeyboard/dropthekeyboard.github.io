import type { Page10Data } from '@/types/page10';

export const page10Data: Page10Data = {
  header: {
    title: '가치 1. 성공률 보완',
    subtitle: [
      {
        text: '착신 실패 시 문자로 자동 전환되는 Failover는 Task성공률을 높일 수 있는 ',
        highlight: false,
      },
      { 
        text: '전국망을 보유한 통신사만의 차별적 역량', 
        highlight: true 
      },
    ],
  },
  flow: [
    {
      type: 'persona',
      id: 'customer',
      icon: '👤',
      label: '고객',
    },
    {
      type: 'arrow',
      id: 'arrow1',
      direction: 'right',
    },
    {
      type: 'phone',
      id: 'customer-request',
      title: '전화/문자로 AI Agent에게 요청',
      content: {
        type: 'sms',
        messages: [
          {
            from: 'customer',
            text: '이번주 화요일 7시에 5명 삼겹살집 예약해줘',
            timestamp: '15:30',
          },
        ],
      },
    },
    {
      type: 'labeledArrow',
      id: 'ai-call',
      icon: '📞',
      label: 'AI Agent가\n업주에게 전화',
      status: 'success',
    },
    {
      type: 'persona',
      id: 'owner',
      icon: '👨‍💼',
      label: '소상공인',
    },
    {
      type: 'labeledArrow',
      id: 'missed-call',
      icon: '📵',
      label: '현장 응대로\n전화 미응답',
      status: 'failed',
    },
    {
      type: 'phone',
      id: 'followup-sms',
      title: '문자로 통화 요약 및 Follow-up 수행',
      content: {
        type: 'sms',
        messages: [
          {
            from: 'system',
            text: '사장님, 오후 3시 30분에 예약 관련 전화가 왔어요.\n받지 못하셔서 문자로 요약해드려요.',
            timestamp: '15:35',
          },
          {
            from: 'system',
            text: '• 고객 요청: 오늘 9월 23일(화) 저녁 7시, 5명 예약 가능 여부',
            timestamp: '15:35',
          },
          {
            from: 'system',
            text: '1. 예, 예약 확정합니다\n2. 아니오, 불가능합니다\n3. 다른 시간 제안하기',
            timestamp: '15:35',
          },
          {
            from: 'owner',
            text: '3. 8시',
            timestamp: '15:37',
          },
        ],
      },
    },
  ],
};
import { cn } from '@/lib/utils';
import { page10Data } from '@/data/page10Data';
import { SMSPhoneView } from '@/components/shared/SMSPhoneView';
import { PersonaIcon } from '@/components/shared/PersonaIcon';
import { ArrowConnector } from '@/components/shared/ArrowConnector';
import { LabeledArrow } from '@/components/shared/LabeledArrow';

// Slide 010: 가치 1. 성공률 보완
function Slide010() {
  const { header } = page10Data;

  return (
    <div className={cn(
      'min-h-screen w-full bg-gray-900 text-white flex flex-col p-8 lg:p-16'
    )}>
      <div className="max-w-7xl w-full mx-auto space-y-16">
        {/* Header Section */}
        <header className="text-left space-y-6 px-4 lg:px-0">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            {header.title}
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 max-w-5xl leading-relaxed">
            {header.subtitle.map((part, index) => (
              part.highlight ? (
                <strong key={index} className="text-white font-bold">
                  {part.text}
                </strong>
              ) : (
                <span key={index}>{part.text}</span>
              )
            ))}
          </p>
        </header>

        {/* Flow Diagram - Horizontal Layout */}
        <div className="w-full overflow-x-auto pb-8">
          <div className="flex items-center justify-center min-w-max mx-auto">
            <div className="flex items-center gap-6 lg:gap-8">
              {/* 1. Customer Persona */}
              <div className="flex flex-col items-center min-h-[600px] justify-center">
                <PersonaIcon
                  icon="👤"
                  label="고객"
                  className="flex-shrink-0"
                />
              </div>

              {/* 2. Arrow */}
              <div className="flex items-center min-h-[600px]">
                <ArrowConnector className="flex-shrink-0" />
              </div>

              {/* 3. Customer Request Phone */}
              <div className="flex flex-col items-center min-h-[600px] justify-center">
                <SMSPhoneView
                  title="전화/문자로 AI Agent에게 요청"
                  content={{
                    type: 'sms',
                    messages: [
                      {
                        from: 'customer',
                        text: '이번주 화요일 7시에 5명 삼겹살집 예약해줘',
                        timestamp: '15:30',
                      },
                    ],
                  }}
                  className="flex-shrink-0"
                />
              </div>

              {/* 4. AI Call Success */}
              <div className="flex items-center min-h-[600px]">
                <LabeledArrow
                  icon="📞"
                  label="AI Agent가\n업주에게 전화"
                  status="success"
                  className="flex-shrink-0"
                />
              </div>

              {/* 5. Owner Persona */}
              <div className="flex flex-col items-center min-h-[600px] justify-center">
                <PersonaIcon
                  icon="👨‍💼"
                  label="소상공인"
                  className="flex-shrink-0"
                />
              </div>

              {/* 6. Missed Call */}
              <div className="flex items-center min-h-[600px]">
                <LabeledArrow
                  icon="📵"
                  label="현장 응대로\n전화 미응답"
                  status="failed"
                  className="flex-shrink-0"
                />
              </div>

              {/* 7. Follow-up SMS Phone */}
              <div className="flex flex-col items-center min-h-[600px] justify-center">
                <SMSPhoneView
                  title="문자로 통화 요약 및 Follow-up 수행"
                  content={{
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
                  }}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide010;

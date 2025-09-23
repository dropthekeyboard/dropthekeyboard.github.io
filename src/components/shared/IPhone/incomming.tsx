import React from 'react';

// Props 타입 정의
interface IncomingCallProps {
  callerName: string;
  avatarUrl?: string; // 아바타는 선택적으로 표시
}

// 아이콘 버튼을 위한 공통 컴포넌트
interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    textColor?: string;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, bgColor, textColor = 'text-white', onClick }) => (
    <div className="flex flex-col items-center space-y-2">
        <button 
            onClick={onClick}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform transform active:scale-90 ${bgColor}`}
        >
            {icon}
        </button>
        <span className={`text-xs ${textColor}`}>{label}</span>
    </div>
);


// 수신 전화 화면 메인 컴포넌트
export const IncomingCallScreen: React.FC<IncomingCallProps> = ({ callerName, avatarUrl }) => {
  return (
    <div className="bg-black text-white w-full max-w-sm mx-auto h-[85vh] rounded-3xl shadow-lg flex flex-col justify-between items-center p-8 font-sans">
      {/* 발신자 정보 */}
      <div className="text-center mt-16">
        {avatarUrl && (
            <img src={avatarUrl} alt={callerName} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/50" />
        )}
        <h1 className="text-4xl font-light tracking-wide">{callerName}</h1>
        <p className="text-lg text-gray-400 mt-2">iPhone</p>
      </div>

      {/* 하단 액션 버튼 영역 */}
      <div className="w-full flex flex-col items-center space-y-16">
        {/* 미리 알림 / 메시지 버튼 */}
        <div className="w-full flex justify-between px-4">
           <div className="flex flex-col items-center space-y-1">
               <div className="w-8 h-8 flex items-center justify-center">
                    {/* Remind Me Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
               </div>
               <span className="text-xs">Remind Me</span>
           </div>
           <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 flex items-center justify-center">
                    {/* Message Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
               <span className="text-xs">Message</span>
           </div>
        </div>
        
        {/* 거절 / 수락 버튼 */}
        <div className="w-full flex justify-between px-4">
            <ActionButton 
                label="Decline"
                bgColor="bg-red-500"
                icon={
                    // Decline Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" transform="rotate(135 12 12)" />
                    </svg>
                }
            />
            <ActionButton 
                label="Accept"
                bgColor="bg-green-500"
                icon={
                    // Accept Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                }
            />
        </div>
      </div>

    </div>
  );
};



import React from 'react';

// Props 타입 정의
interface ChatHeaderProps {
  userName: string;
  avatarUrl: string;
}

interface BubbleTailProps {
  isSender: boolean;
}

interface MusicContent {
  albumArt: string;
  title: string;
  artist: string;
}

interface MusicShareProps {
  content: MusicContent;
}

interface MessageBubbleProps {
  text?: string;
  isSender: boolean;
  status?: string;
  type?: 'music' | 'text';
  content?: MusicContent;
}


// 상단 헤더 컴포넌트
export const ChatHeader: React.FC<ChatHeaderProps> = ({ userName, avatarUrl }) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md">
    {/* 뒤로가기 버튼 */}
    <div className="w-8">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>

    {/* 사용자 정보 */}
    <div className="flex flex-col items-center cursor-pointer">
      <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full" />
      <div className="flex items-center mt-1">
        <p className="font-semibold text-base">{userName}</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    {/* 영상 통화 버튼 */}
     <div className="w-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    </div>
  </div>
);


// 말풍선 모양을 위한 SVG 컴포넌트
export const BubbleTail: React.FC<BubbleTailProps> = ({ isSender }) => (
  <svg
    className={`absolute bottom-0 w-2 h-2 ${isSender ? 'right-0 -mr-1 text-blue-500' : 'left-0 -ml-1 text-gray-200'}`}
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d={isSender ? "M0 8 C4 8 8 4 8 0 Z" : "M8 8 C4 8 0 4 0 0 Z"}
    />
  </svg>
);


// 음악 공유 컴포넌트
const MusicShare: React.FC<MusicShareProps> = ({ content }) => (
  <div className="flex items-center bg-black/50 backdrop-blur-md p-3 rounded-lg w-64">
    <img src={content.albumArt} alt={content.title} className="w-12 h-12 rounded-md mr-3" />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate text-white">{content.title}</p>
      <p className="text-xs text-gray-200 truncate">{content.artist}</p>
      <p className="text-xs text-gray-300 mt-1">#Music</p>
    </div>
    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3l14 9-14 9V3z" />
      </svg>
    </div>
  </div>
);


// 메시지 버블 컴포넌트
export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isSender, type, content }) => {
  const bubbleClasses = isSender
    ? 'bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-gray-200 text-black rounded-r-2xl rounded-tl-2xl';

  return (
    <div className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className="relative max-w-xs md:max-w-md">
        <div className={`px-4 py-2 ${bubbleClasses} ${type === 'music' ? 'p-0 bg-transparent' : ''}`}>
          {type === 'music' && content ? (
            <MusicShare content={content} />
          ) : (
            <p className="text-base" style={{ wordBreak: 'break-word' }}>{text}</p>
          )}
        </div>
        {/* <BubbleTail isSender={isSender} /> */}
      </div>
    </div>
  );
};

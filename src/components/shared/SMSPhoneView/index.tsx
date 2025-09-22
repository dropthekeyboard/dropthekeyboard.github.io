import { PhoneFrame } from '@/components/shared/PhoneFrame';
import { MessageBubble } from '@/components/shared/MessageBubble';
import { cn } from '@/lib/utils';
import type { PhoneContent } from '@/types/page10';

interface SMSPhoneViewProps {
  title: string;
  content: PhoneContent;
  className?: string;
}

export function SMSPhoneView({ title, content, className }: SMSPhoneViewProps) {
  return (
    <div className={cn('flex flex-col items-center space-y-6', className)}>
      {/* Phone title */}
      <h3 className="text-sm font-semibold text-white text-center max-w-[240px] leading-relaxed">
        {title}
      </h3>
      
      {/* Phone mockup - Smaller size */}
      <div className="w-[240px] h-[480px]">
        <PhoneFrame>
          <div className="flex flex-col h-full bg-white dark:bg-gray-950">
            {/* Messages app header */}
            <div className="flex items-center justify-center py-3 border-b border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                메시지
              </h4>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {content.messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message.text}
                  isOwnMessage={message.from === 'owner'}
                  senderType={message.from === 'system' ? 'agent' : 'user'}
                  timestamp={message.timestamp ? Date.now() : undefined}
                  entity={{
                    type: 'human',
                    name: message.from === 'customer' ? '고객' : 
                          message.from === 'owner' ? '사장님' : 'AI Agent',
                    displayName: message.from === 'customer' ? '고객' : 
                                message.from === 'owner' ? '사장님' : 'AI Agent',
                  }}
                />
              ))}
            </div>
            
            {/* Message input area (disabled/preview) */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2">
                  <span className="text-gray-500 text-xs">메시지</span>
                </div>
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">↑</span>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  MessageSquare,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Server,
  Database,
  Zap
} from 'lucide-react';
import type { AgenticStep } from '@/contexts/scenario';

interface LogicCardData {
  id: string;
  step: AgenticStep;
  timestamp: Date;
}

// Step 타입별 아이콘과 색상 설정
const getStepIconConfig = (stepType: AgenticStep['type'], variant: 'minimal' | 'formal' | 'hacker') => {
  const configs = {
    'send-message': {
      icon: MessageSquare,
      minimal: { color: 'text-blue-600', bg: 'bg-blue-50' },
      formal: { color: 'text-blue-700', bg: 'bg-blue-100' },
      hacker: { color: 'text-blue-400', bg: 'bg-blue-500/20' }
    },
    'make-call': {
      icon: Phone,
      minimal: { color: 'text-green-600', bg: 'bg-green-50' },
      formal: { color: 'text-green-700', bg: 'bg-green-100' },
      hacker: { color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
    },
    'accept-call': {
      icon: CheckCircle,
      minimal: { color: 'text-green-600', bg: 'bg-green-50' },
      formal: { color: 'text-green-700', bg: 'bg-green-100' },
      hacker: { color: 'text-green-400', bg: 'bg-green-500/10' }
    },
    'finish-call': {
      icon: XCircle,
      minimal: { color: 'text-red-600', bg: 'bg-red-50' },
      formal: { color: 'text-red-700', bg: 'bg-red-100' },
      hacker: { color: 'text-red-400', bg: 'bg-red-500/10' }
    },
    'api-call': {
      icon: Server,
      minimal: { color: 'text-purple-600', bg: 'bg-purple-50' },
      formal: { color: 'text-purple-700', bg: 'bg-purple-100' },
      hacker: { color: 'text-purple-400', bg: 'bg-purple-500/10' }
    },
    'api-response': {
      icon: Database,
      minimal: { color: 'text-purple-600', bg: 'bg-purple-50' },
      formal: { color: 'text-purple-700', bg: 'bg-purple-100' },
      hacker: { color: 'text-purple-400', bg: 'bg-purple-500/10' }
    }
  };

  const config = configs[stepType] || {
    icon: Zap,
    minimal: { color: 'text-gray-600', bg: 'bg-gray-50' },
    formal: { color: 'text-gray-700', bg: 'bg-gray-100' },
    hacker: { color: 'text-gray-400', bg: 'bg-gray-500/10' }
  };

  return {
    icon: config.icon,
    ...config[variant]
  };
};

const logicCardVariants = cva('', {
  variants: {
    variant: {
      minimal: '',
      formal: '',
      hacker: '',
    },
  },
  defaultVariants: {
    variant: 'hacker',
  },
});

interface LogicCardProps extends VariantProps<typeof logicCardVariants> {
  card: LogicCardData;
  entityName?: string;
  isNew?: boolean; // 새로운 메시지인지 여부
  index?: number; // 카드의 인덱스 (애니메이션 지연 계산용)
}

export function LogicCard({ card, entityName, variant = 'hacker', isNew = false, index = 0 }: LogicCardProps) {
  // 메시지 방향 구분: 발신 vs 수신
  const isOutgoing = card.step.action.from === entityName;

  // 각 step 타입별 content 추출 헬퍼 함수
  const getStepContent = (step: AgenticStep): string => {
    switch (step.type) {
      case 'send-message':
        return step.action.content || 'No content';
      case 'make-call':
      case 'accept-call':
      case 'finish-call':
        return step.action.reason || `${step.type} action`;
      case 'api-call':
        return step.action.request || 'No request';
      case 'api-response':
        return step.action.response || 'No response';
      default:
        return 'Unknown action';
    }
  };

  const getMinimalContent = () => {
    const config = getStepIconConfig(card.step.type, 'minimal');
    const IconComponent = config.icon;

    return (
      <div className={cn(
        "flex items-center space-x-2 p-2 rounded-lg border",
        config.bg,
        "border-gray-200"
      )}>
        <IconComponent className={cn("w-4 h-4", config.color)} />
        <div className={cn("text-sm", config.color)}>
          {getStepContent(card.step)}
        </div>
      </div>
    );
  };

  const getFormalContent = () => {
    const config = getStepIconConfig(card.step.type, 'formal');
    const IconComponent = config.icon;

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded font-medium text-xs",
            isOutgoing
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              : "bg-slate-100 dark:bg-slate-800/30 text-slate-800 dark:text-slate-200"
          )}>
            <IconComponent className="w-3 h-3" />
            <span>{isOutgoing ? "OUT" : "IN"}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {card.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className={cn(
          "text-sm pl-3 border-l-2",
          isOutgoing
            ? "border-blue-300 text-blue-900 dark:text-blue-100"
            : "border-slate-300 text-slate-900 dark:text-slate-100"
        )}>
          {getStepContent(card.step)}
        </div>
      </div>
    );
  };

  const getHackerContent = () => {
    const config = getStepIconConfig(card.step.type, 'hacker');
    const IconComponent = config.icon;

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2 mb-1">
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded text-xs",
            isOutgoing
              ? "bg-blue-500/20 text-blue-400"
              : "bg-green-500/20 text-green-400"
          )}>
            <IconComponent className="w-3 h-3" />
            <span>{isOutgoing ? "OUT" : "IN"}</span>
          </div>
          <span className="text-xs text-green-300/70">
            {card.timestamp.toLocaleTimeString()}
          </span>
        </div>

        {/* 기존 hacker 스타일의 상세 내용들 유지 */}
        {card.step.type === 'send-message' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            isOutgoing
              ? "bg-blue-500/10 border-blue-500/30 ml-8"
              : "bg-green-500/10 border-green-500/30 mr-8"
          )}>
            <div className={cn(
              "text-xs mb-1 flex items-center space-x-1",
              isOutgoing ? "text-blue-400" : "text-yellow-400"
            )}>
              {isOutgoing ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
              <span>{card.step.action.from} {isOutgoing ? "to" : "from"} {card.step.action.to}</span>
            </div>
            <div className={cn(
              "pl-2 border-l",
              isOutgoing
                ? "text-blue-300 border-blue-500/30"
                : "text-green-300 border-green-500/30"
            )}>
              {card.step.action.type === 'dtmf' ? (
                <span className="text-orange-400 font-bold">
                  🔢 DTMF: {card.step.action.content}
                </span>
              ) : (
                <span>{getStepContent(card.step)}</span>
              )}
            </div>
          </div>
        )}

        {card.step.type === 'make-call' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            isOutgoing
              ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
              : "bg-cyan-500/10 border-cyan-500/30 mr-8"
          )}>
            <div className={cn(
              "text-xs flex items-center space-x-1",
              isOutgoing ? "text-cyan-400" : "text-cyan-400"
            )}>
              <Phone className="w-3 h-3" />
              <span>{card.step.action.from} {isOutgoing ? "calling" : "receiving call from"} {card.step.action.to}</span>
            </div>
            <div className="text-green-300 mt-1">
              {isOutgoing ? "Initiating voice connection..." : "Incoming call..."}
            </div>
          </div>
        )}

        {card.step.type === 'accept-call' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            isOutgoing
              ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
              : "bg-cyan-500/10 border-cyan-500/30 mr-8"
          )}>
            <div className={cn(
              "text-xs flex items-center space-x-1",
              isOutgoing ? "text-cyan-400" : "text-cyan-400"
            )}>
              <CheckCircle className="w-3 h-3" />
              <span>Call {isOutgoing ? "accepted by" : "connected with"} {card.step.action.to}</span>
            </div>
            <div className="text-green-300 mt-1">
              Voice connection established ✓
            </div>
          </div>
        )}

        {card.step.type === 'finish-call' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            isOutgoing
              ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
              : "bg-cyan-500/10 border-cyan-500/30 mr-8"
          )}>
            <div className={cn(
              "text-xs flex items-center space-x-1",
              isOutgoing ? "text-cyan-400" : "text-cyan-400"
            )}>
              <XCircle className="w-3 h-3" />
              <span>Call {isOutgoing ? "ended with" : "terminated by"} {card.step.action.to}</span>
            </div>
            <div className="text-green-300 mt-1">
              Voice connection terminated ✓
            </div>
          </div>
        )}

        {card.step.type === 'api-call' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            "bg-purple-500/10 border-purple-500/30",
            isOutgoing ? "ml-8" : "mr-8"
          )}>
            <div className="text-purple-400 text-xs flex items-center space-x-1">
              <Server className="w-3 h-3" />
              <span>API Call to {card.step.action.service}</span>
            </div>
            <div className="text-green-300 mt-1 pl-2 border-l border-purple-500/30">
              {card.step.action.request}
            </div>
          </div>
        )}

        {card.step.type === 'api-response' && (
          <div className={cn(
            "rounded-lg px-3 py-2 border",
            "bg-purple-500/10 border-purple-500/30",
            isOutgoing ? "ml-8" : "mr-8"
          )}>
            <div className="text-purple-400 text-xs flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>API Response from {card.step.action.service}</span>
            </div>
            <div className="text-green-300 mt-1 pl-2 border-l border-purple-500/30">
              {card.step.action.response}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 10, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: isNew ? 0.6 : 0, // 더 긴 duration으로 부드러움 증가
        ease: [0.25, 0.46, 0.45, 0.94], // 더 부드러운 cubic-bezier easing
        delay: isNew ? index * 0.08 : 0, // 약간 더 빠른 stagger로 자연스러움
        scale: {
          duration: isNew ? 0.4 : 0,
          ease: [0.34, 1.56, 0.64, 1], // bounce 효과로 더 생동감 있게
        }
      }}
      className={cn(
        logicCardVariants({ variant }),
        "flex items-start space-x-2",
        isOutgoing ? "justify-end" : "justify-start"
      )}
    >
      {!isOutgoing && <span className={cn(
        "text-green-500 mt-0.5",
        variant === 'minimal' ? "text-blue-600" : variant === 'formal' ? "text-slate-600" : "text-green-500"
      )}>$</span>}
      <div className={cn(
        "flex-1 max-w-[80%]",
        isOutgoing ? "order-1" : "order-2"
      )}>
        {variant === 'minimal' && getMinimalContent()}
        {variant === 'formal' && getFormalContent()}
        {variant === 'hacker' && getHackerContent()}
      </div>
      {isOutgoing && <span className={cn(
        "text-blue-500 mt-0.5 order-2",
        variant === 'minimal' ? "text-blue-600" : variant === 'formal' ? "text-slate-600" : "text-blue-500"
      )}>$</span>}
    </motion.div>
  );
}
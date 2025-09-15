import type { AgenticStep, ServerState } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { LogicCard } from '@/components/shared/LogicCard';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

interface LogicCard {
  id: string;
  step: AgenticStep;
  timestamp: Date;
}

interface TerminalSectionProps {
  entity: ServerState | null;
  label: string;
  labelColor: string;
  sectionClass: string;
  // 새로운 props: 직접 steps를 전달받을 수 있도록
  steps?: AgenticStep[];
  entityName?: string;
  isActive?: boolean;
  variant?: 'minimal' | 'formal' | 'hacker';
}

export function TerminalSection({
  entity,
  label,
  labelColor,
  sectionClass,
  steps: externalSteps,
  entityName,
  isActive: externalIsActive = false,
  variant = 'minimal',
}: TerminalSectionProps) {
  const { state: scenarioState } = useScenario();

  // 외부에서 steps를 제공하면 그것을 사용, 아니면 scenario에서 가져옴
  const state = useMemo(() =>
    externalSteps ? { steps: externalSteps } : scenarioState,
    [externalSteps, scenarioState]
  );

  // Terminal logic cards state - filter steps related to this AI agent
  const logicCards = useMemo(
    () =>
      state.steps
        .filter(
          (s: AgenticStep) => s.action.from === (entityName || entity?.name) || s.action.to === (entityName || entity?.name)
        )
        .map(
          (s: AgenticStep) =>
            ({
              id: `${s.action.timestamp}-${s.type}-${s.action.from}-${s.action.to}`, // 고유한 id 생성
              step: s,
              timestamp: new Date(s.action.timestamp),
            }) satisfies LogicCard
        ),
    [state, entity, entityName]
  );

  // AI Agent의 동작 상태를 내부에서 계산
  const isActive = useMemo(() => {
    // 외부에서 isActive가 명시적으로 설정된 경우 우선 사용
    if (externalIsActive !== false) return externalIsActive;

    // 내부에서 계산: 관련 steps가 있고 가장 최근 step이 2초 이내인 경우만 활성
    if (logicCards.length > 0) {
      const latestStep = logicCards[logicCards.length - 1];
      const timeSinceLatest = Date.now() - latestStep.timestamp.getTime();
      // 2초 이내의 step만 애니메이션 활성화 (Agent Action 진행 중으로 간주)
      return timeSinceLatest < 2000;
    }

    return false;
  }, [logicCards, externalIsActive]);

  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const lastTimestampRef = useRef<number>(0);

  // 새로운 카드가 추가되었는지 확인 (timestamp 기반)
  const hasNewCards = logicCards.length > 0 && logicCards[logicCards.length - 1].timestamp.getTime() > lastTimestampRef.current;

  // 카드 개수 업데이트
  useEffect(() => {
    if (logicCards.length > 0) {
      lastTimestampRef.current = logicCards[logicCards.length - 1].timestamp.getTime();
    }
  }, [logicCards]);

  // Auto-scroll when new cards are added
  useEffect(() => {
    if (logicCards.length > 0) {
      // DOM 업데이트와 애니메이션이 완료된 후에 scroll 실행
      const scrollToBottom = () => {
        if (lastCardRef.current) {
          // scrollIntoView를 사용해서 더 부드러운 스크롤
          lastCardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        } else if (scrollRef.current) {
          // fallback: 부드러운 scrollTop 애니메이션
          const targetScrollTop = scrollRef.current.scrollHeight;
          const startScrollTop = scrollRef.current.scrollTop;
          const distance = targetScrollTop - startScrollTop;

          if (distance > 0) {
            // 부드러운 애니메이션 함수
            const duration = 300; // ms
            const startTime = Date.now();

            const animateScroll = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // 더 부드러운 cubic ease-out 함수 적용
              const easeOutCubic = (t: number): number => {
                return 1 - Math.pow(1 - t, 3);
              };

              const easeProgress = easeOutCubic(progress);

              if (scrollRef.current) {
                scrollRef.current.scrollTop = startScrollTop + (distance * easeProgress);
              }

              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              }
            };

            requestAnimationFrame(animateScroll);
          }
        }
      };

      // LogicCard 애니메이션 완료 후 scroll 실행
      setTimeout(scrollToBottom, 200);
    }
  }, [logicCards.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        sectionClass,
        'relative flex flex-col h-[60vh] w-[30vw] mx-auto'
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-center mb-6">
        <motion.div className={cn(
          "flex items-center space-x-3 rounded-lg px-4 py-2 border",
          variant === 'minimal'
            ? "bg-white/95 dark:bg-gray-50/95 backdrop-blur-sm border-gray-200/50 dark:border-gray-300/50"
            : variant === 'formal'
            ? "bg-muted/90 backdrop-blur-sm border-border/60 shadow-sm"
            : "bg-card/80 backdrop-blur-sm border-border"
        )}>
          <Terminal className={cn(
            "w-6 h-6",
            variant === 'minimal'
              ? "text-blue-600"
              : variant === 'formal'
              ? "text-blue-600"
              : "text-green-500"
          )} />
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              variant === 'minimal'
                ? "bg-blue-600"
                : variant === 'formal'
                ? "bg-blue-600"
                : "bg-green-500"
            )} />
            <span className={cn(
              "text-sm font-mono",
              variant === 'minimal'
                ? "text-blue-700"
                : variant === 'formal'
                ? "text-blue-700"
                : "text-green-400"
            )}>AI_AGENT</span>
          </div>
          <Cpu className={cn(
            "w-5 h-5",
            variant === 'minimal'
              ? "text-slate-600"
              : variant === 'formal'
              ? "text-slate-600"
              : "text-blue-500"
          )} />
        </motion.div>
      </div>

      {/* Section label */}
      <SectionLabel
        label={label}
        labelColor={labelColor}
        position="top-high"
        animation="fade"
        delay={0.2}
      />

      {/* Terminal Window */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-4 py-3 min-h-[200px] w-[30vw] custom-scrollbar will-change-scroll',
          'rounded-lg',
          'shadow-lg',
          'font-mono text-sm',
          'scroll-smooth', // 부드러운 스크롤을 위한 CSS 클래스
          variant === 'minimal'
            ? 'bg-white/95 dark:bg-gray-50/95 backdrop-blur-md shadow-blue-500/10 border border-gray-200/50 dark:border-gray-300/50'
            : variant === 'formal'
            ? 'bg-slate-100/95 dark:bg-slate-800/95 backdrop-blur-md shadow-slate-500/20 border-2 border-slate-300/60 dark:border-slate-600/60'
            : 'bg-black/90 backdrop-blur-md shadow-green-500/10 border border-green-500/30',
          isActive ? (
            variant === 'minimal'
              ? 'neon-border-active-minimal'
              : variant === 'formal'
              ? 'neon-border-active-formal'
              : 'neon-border-active-hacker'
          ) : ''
        )}
      >
        {/* Terminal Header */}
        <div className={cn(
          "mb-4 pb-2 border-b",
          variant === 'minimal'
            ? "text-blue-700 dark:text-blue-300 border-blue-500/30"
            : variant === 'formal'
            ? "text-slate-700 dark:text-slate-300 border-slate-400/40"
            : "text-green-400 border-green-500/30"
        )}>
          <div className="flex items-center space-x-2 mb-1">
            <span className={cn(
              variant === 'minimal'
                ? "text-blue-600"
                : variant === 'formal'
                ? "text-slate-600 dark:text-slate-400"
                : "text-green-500"
            )}>$</span>
            <span>ai_agent_session --start</span>
          </div>
          <div className={cn(
            "text-xs",
            variant === 'minimal'
              ? "text-blue-600/70 dark:text-blue-400/70"
              : variant === 'formal'
              ? "text-slate-500 dark:text-slate-400"
              : "text-green-300/70"
          )}>
            Connected to {entity?.name || 'AI Agent'} | Status: ACTIVE
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {logicCards.map((card, index) => (
              <div
                key={card.id}
                ref={index === logicCards.length - 1 ? lastCardRef : null}
              >
                <LogicCard
                  card={card}
                  entityName={entity?.name || entityName}
                  variant={variant}
                  isNew={index === logicCards.length - 1 && hasNewCards} // 마지막 카드만 새로운 것으로 처리
                  index={index}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Terminal Prompt */}
        <div className={cn(
          "mt-4 pt-2 border-t",
          variant === 'minimal'
            ? "border-blue-500/30"
            : variant === 'formal'
            ? "border-slate-400/40"
            : "border-green-500/30"
        )}>
          <div className={cn(
            "flex items-center space-x-2",
            variant === 'minimal'
              ? "text-blue-700 dark:text-blue-300"
              : variant === 'formal'
              ? "text-slate-700 dark:text-slate-300"
              : "text-green-400"
          )}>
            <span className={cn(
              variant === 'minimal'
                ? "text-blue-600"
                : variant === 'formal'
                ? "text-slate-600 dark:text-slate-400"
                : "text-green-500"
            )}>$</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

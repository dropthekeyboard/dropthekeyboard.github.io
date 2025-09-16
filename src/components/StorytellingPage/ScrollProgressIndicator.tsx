import { cn } from '@/lib/utils';
import type { ScrollProgressIndicatorProps } from '@/types/storytelling';

export function ScrollProgressIndicator({
  panels,
  currentPanelId,
  previewStepIndex,
  previewTotalSteps,
  scrollProgress,
}: ScrollProgressIndicatorProps) {
  // Smooth progress based on actual scroll position (0-1)
  const overallProgress = Math.min(Math.max(scrollProgress, 0), 1);
  const currentPanel = panels.find((panel) => panel.id === currentPanelId);
  const currentPanelIndex = currentPanel ? panels.indexOf(currentPanel) : 0;
  const totalPanels = panels.length;

  const hasSteps = previewTotalSteps > 0;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-20">
      {/* 세로 진행률 바 */}
      <div className="w-1 h-80 bg-gray-300 dark:bg-gray-600 rounded-full relative">
        <div
          className="w-full bg-primary rounded-full transition-all duration-200"
          style={{ height: `${overallProgress * 100}%` }}
          aria-valuenow={Math.round(overallProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Story progress"
        />

        {/* 패널 마커들 */}
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className={cn(
              'absolute w-3 h-3 rounded-full border-2 border-white -left-1 transition-all duration-200',
              currentPanelId === panel.id
                ? 'bg-primary scale-125 shadow-lg'
                : index < currentPanelIndex
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
            )}
            style={{ top: `${(index / Math.max(totalPanels - 1, 1)) * 100}%` }}
            title={panel.title}
          />
        ))}
      </div>

      {/* 현재 패널의 미리보기 스텝 표시 */}
      {hasSteps && currentPanel && (
        <div
          className="absolute left-4 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
          style={{ top: `${overallProgress * 100}%` }}
          aria-live="polite"
        >
          <div className="font-medium">{currentPanel.title}</div>
          <div className="opacity-80">
            Step {previewStepIndex + 1} / {previewTotalSteps}
          </div>
        </div>
      )}

      {/* 현재 패널의 스텝 마커 (세로로 작은 점들) */}
      {hasSteps && currentPanel && (
        <div
          className="absolute left-0 w-1"
          style={{
            top: `${(currentPanelIndex / Math.max(totalPanels - 1, 1)) * 100 - 5}%`,
            height: '10%',
          }}
        >
          {Array.from({ length: previewTotalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'absolute w-2 h-2 rounded-full border border-white -left-0.5 transition-all duration-200',
                index <= previewStepIndex
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              )}
              style={{
                top: `${(index / Math.max(previewTotalSteps - 1, 1)) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

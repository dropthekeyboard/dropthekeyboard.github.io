import type {
  PanelContainerProps,
  StoryPanelProps,
} from '@/types/storytelling';

export function PanelContainer({
  panel,
  isActive,
  progress,
  agentStyle,
  style,
}: PanelContainerProps) {
  const PanelComponent = panel.component;

  return (
    <div
      className="w-full h-full flex items-center justify-center transition-all duration-300"
      style={style}
      data-panel-id={panel.id}
      data-panel-type={panel.type}
    >
      <PanelComponent
        panel={panel}
        isActive={isActive}
        progress={progress}
        agentStyle={agentStyle}
        {...(panel.extraProps as Partial<StoryPanelProps>)}
      />
    </div>
  );
}

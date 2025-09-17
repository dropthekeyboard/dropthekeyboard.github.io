import React from 'react';
import { useScenario } from '@/hooks/useScenario';

interface ScenarioLoaderProps {
  /**
   * Initial scenario ID to load automatically
   */
  initialScenarioId?: string;
  /**
   * Callback triggered when scenario changes
   */
  onScenarioChange?: (scenarioId: string) => void;
  /**
   * Callback triggered when scenario is successfully loaded
   */
  onScenarioLoaded?: (scenarioId: string) => void;
  /**
   * Callback triggered when scenario loading fails
   */
  onScenarioError?: (error: string) => void;
}

/**
 * Headless version of ScenarioSelector that handles scenario loading logic
 * without any UI components. Automatically loads initial scenario and provides
 * callbacks for scenario state changes.
 */
export function ScenarioLoader({
  initialScenarioId,
  onScenarioChange,
  onScenarioLoaded,
  onScenarioError
}: ScenarioLoaderProps) {
  const { scenarios, currentScenario, setCurrent } = useScenario();

  // 초기 시나리오 설정
  React.useEffect(() => {
    if (initialScenarioId && scenarios.length > 0) {
      const index = scenarios.findIndex((s) => s.id === initialScenarioId);
      if (index !== -1) {
        // 현재 시나리오와 다른 경우에만 설정
        if (currentScenario?.id !== initialScenarioId) {
          setCurrent(index);
          console.log(`ScenarioLoader: Loading initial scenario ${initialScenarioId}`);
          onScenarioLoaded?.(initialScenarioId);
        }
      } else {
        const errorMsg = `ScenarioLoader: Initial scenario ${initialScenarioId} not found`;
        console.error(errorMsg);
        onScenarioError?.(errorMsg);
      }
    }
  }, [initialScenarioId, scenarios, currentScenario?.id, setCurrent, onScenarioLoaded, onScenarioError]);

  // 시나리오 변경 감지 및 콜백 호출
  React.useEffect(() => {
    if (currentScenario?.id) {
      console.log(`ScenarioLoader: Scenario changed to ${currentScenario.id}`);
      onScenarioChange?.(currentScenario.id);
    }
  }, [currentScenario?.id, onScenarioChange]);

  // 시나리오 데이터 로드 상태 로깅
  React.useEffect(() => {
    console.log(`ScenarioLoader: ${scenarios.length} scenarios available:`, 
      scenarios.map(s => s.id).join(', '));
  }, [scenarios]);

  // Headless - UI 없이 로직만 처리
  return null;
}
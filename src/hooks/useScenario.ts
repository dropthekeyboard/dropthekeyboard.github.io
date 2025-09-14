import { useContext } from 'react';
import { ScenarioContext } from '@/contexts/scenario';
import type { ScenarioContextType } from '@/contexts/scenario';

/**
 * Custom hook to access scenario context
 * @returns The scenario context value
 * @throws Error if used outside of ScenarioContextProvider
 */
export function useScenario(): ScenarioContextType {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error(
      'useScenario must be used within a ScenarioContextProvider'
    );
  }
  return context;
}

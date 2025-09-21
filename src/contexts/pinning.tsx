/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// 개별 섹션의 Pinning 상태
export interface SectionPinningState {
  isPinned: boolean;
  isEntering: boolean;
  isLeaving: boolean;
}

// 전체 Pinning 관리 Context
export interface PinningContextType {
  states: SectionPinningState[];
  updateSectionState: (
    index: number,
    state: Partial<SectionPinningState>
  ) => void;
  getSectionState: (index: number) => SectionPinningState;
  initializeSections: (count: number) => void;
}

const defaultState: SectionPinningState = {
  isPinned: false,
  isEntering: false,
  isLeaving: false,
};

export const PinningContext = createContext<PinningContextType>({
  states: [],
  updateSectionState: () => {},
  getSectionState: () => defaultState,
  initializeSections: () => {},
});

// Hook for easier access to pinning context
export function usePinning() {
  const context = useContext(PinningContext);
  if (!context) {
    throw new Error('usePinning must be used within a PinningProvider');
  }
  return context;
}

// Hook for accessing specific section's pinning state
export function useSectionPinning(sectionIndex: number) {
  const { getSectionState, updateSectionState } = usePinning();

  const state = getSectionState(sectionIndex);

  const updateState = useCallback(
    (partialState: Partial<SectionPinningState>) => {
      updateSectionState(sectionIndex, partialState);
    },
    [sectionIndex, updateSectionState]
  );

  return { state, updateState };
}

// Global PinningProvider 컴포넌트
interface PinningProviderProps {
  children: ReactNode;
  initialSectionCount?: number;
}

export function PinningProvider({
  children,
  initialSectionCount = 0,
}: PinningProviderProps) {
  const [states, setStates] = useState<SectionPinningState[]>(
    Array(initialSectionCount)
      .fill(null)
      .map(() => ({ ...defaultState }))
  );

  const updateSectionState = useCallback(
    (index: number, partialState: Partial<SectionPinningState>) => {
      setStates((prev) => {
        if (index < 0 || index >= prev.length) return prev;

        const newStates = [...prev];
        newStates[index] = { ...newStates[index], ...partialState };
        return newStates;
      });
    },
    []
  );

  const getSectionState = useCallback(
    (index: number): SectionPinningState => {
      if (index < 0 || index >= states.length) return defaultState;
      return states[index];
    },
    [states]
  );

  const initializeSections = useCallback((count: number) => {
    setStates(
      Array(count)
        .fill(null)
        .map(() => ({ ...defaultState }))
    );
  }, []);

  const contextValue: PinningContextType = {
    states,
    updateSectionState,
    getSectionState,
    initializeSections,
  };

  return (
    <PinningContext.Provider value={contextValue}>
      {children}
    </PinningContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode } from 'react';

// Pinning 상태를 위한 Context
export interface PinningContextType {
  isPinned: boolean;
  isEntering: boolean;
  isLeaving: boolean;
}

export const PinningContext = createContext<PinningContextType>({
  isPinned: false,
  isEntering: false,
  isLeaving: false,
});

// PinningProvider 컴포넌트 (선택사항)
interface PinningProviderProps {
  children: ReactNode;
  value: PinningContextType;
}

export function PinningProvider({ children, value }: PinningProviderProps) {
  return (
    <PinningContext.Provider value={value}>
      {children}
    </PinningContext.Provider>
  );
}
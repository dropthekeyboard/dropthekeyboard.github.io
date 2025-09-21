import { useContext } from 'react';
import { PinningContext } from '@/contexts/pinning';

export const usePinning = () => useContext(PinningContext);

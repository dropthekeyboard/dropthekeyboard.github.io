import { useState, useRef, useCallback } from 'react';

interface UseSimpleAudioReturn {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export const useSimpleAudio = (src?: string): UseSimpleAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(src);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    
    audioRef.current = audio;
    audio.play().catch(console.error);
  }, [src]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return {
    isPlaying,
    play,
    pause,
    toggle,
  };
};
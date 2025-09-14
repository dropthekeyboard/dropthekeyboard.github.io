import { useState, useRef, useCallback, useMemo } from 'react';

interface RecorderOptions {
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  mimeType?: string;
}

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordedChunks: Blob[];
  error: string | null;
  duration: number;
}

export function useRecorder(
  targetElementId: string,
  options: RecorderOptions = {}
) {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    recordedChunks: [],
    error: null,
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSupportedMimeType = useCallback((): string => {
    const types = [
      'video/mp4; codecs=h264',
      'video/mp4; codecs=avc1.42E01E',
      'video/mp4',
      'video/webm; codecs=vp9',
      'video/webm; codecs=vp8',
      'video/webm',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm'; // Fallback
  }, []);

  const defaultOptions: RecorderOptions = useMemo(
    () => ({
      videoBitsPerSecond: 2500000, // 2.5 Mbps for 1080p
      audioBitsPerSecond: 128000, // 128 kbps
      mimeType: getSupportedMimeType(),
      ...options,
    }),
    [options, getSupportedMimeType]
  );

  // Get the best supported MIME type

  // Get display media with specific constraints for 16:9 recording
  const getDisplayMedia = useCallback(async () => {
    try {
      const targetElement = document.getElementById(targetElementId);
      if (!targetElement) {
        throw new Error(
          `Target element with id "${targetElementId}" not found`
        );
      }

      // Get element dimensions and calculate 16:9 bounds
      const rect = targetElement.getBoundingClientRect();
      const aspectRatio = 16 / 9;

      let width = Math.floor(rect.width);
      let height = Math.floor(rect.height);

      // Ensure dimensions are even numbers (required by some encoders)
      width = width % 2 === 0 ? width : width - 1;
      height = height % 2 === 0 ? height : height - 1;

      // Prefer screen capture for better quality
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: width, max: 1920 },
          height: { ideal: height, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
          aspectRatio: { ideal: aspectRatio },
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      return stream;
    } catch (error) {
      // Fallback to basic screen capture if specific constraints fail
      console.warn('Falling back to basic display media:', error);
      return navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
    }
  }, [targetElementId]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Stop recording
  const stopRecording = useCallback(async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording to stop'));
        return;
      }

      const handleStop = () => {
        try {
          const blob = new Blob(chunksRef.current, {
            type: defaultOptions.mimeType || 'video/webm',
          });

          cleanup();
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      };

      if (
        mediaRecorder.state === 'recording' ||
        mediaRecorder.state === 'paused'
      ) {
        mediaRecorder.addEventListener('stop', handleStop, { once: true });
        mediaRecorder.stop();
      } else {
        handleStop();
      }
    });
  }, [defaultOptions.mimeType, cleanup]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const stream = await getDisplayMedia();
      streamRef.current = stream;

      // Create MediaRecorder with optimized settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: defaultOptions.mimeType,
        videoBitsPerSecond: defaultOptions.videoBitsPerSecond,
        audioBitsPerSecond: defaultOptions.audioBitsPerSecond,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        startTimeRef.current = Date.now();
        setState((prev) => ({
          ...prev,
          isRecording: true,
          isPaused: false,
          duration: 0,
        }));

        // Start duration tracking
        durationIntervalRef.current = setInterval(() => {
          setState((prev) => ({
            ...prev,
            duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
          }));
        }, 1000);
      };

      mediaRecorder.onpause = () => {
        setState((prev) => ({ ...prev, isPaused: true }));
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };

      mediaRecorder.onresume = () => {
        setState((prev) => ({ ...prev, isPaused: false }));
        startTimeRef.current = Date.now() - state.duration * 1000;

        durationIntervalRef.current = setInterval(() => {
          setState((prev) => ({
            ...prev,
            duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
          }));
        }, 1000);
      };

      mediaRecorder.onstop = () => {
        setState((prev) => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          recordedChunks: [...chunksRef.current],
        }));

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setState((prev) => ({
          ...prev,
          error: 'Recording failed. Please try again.',
          isRecording: false,
        }));
        cleanup();
      };

      // Handle stream ending (user stops screen share)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      });

      // Start recording with 1-second chunks for better memory management
      mediaRecorder.start(1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to start recording',
      }));
      cleanup();
    }
  }, [defaultOptions, getDisplayMedia, state.duration, cleanup, stopRecording]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
    }
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
    }
  }, []);

  // Download recording
  const downloadRecording = useCallback((blob: Blob, filename?: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download =
        filename ||
        `a2a-demo-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, '-')}.mp4`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to download recording:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to download recording',
      }));
    }
  }, []);

  // Get recording info
  const getRecordingInfo = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    return {
      state: mediaRecorder?.state || 'inactive',
      mimeType: defaultOptions.mimeType,
      videoBitsPerSecond: defaultOptions.videoBitsPerSecond,
      audioBitsPerSecond: defaultOptions.audioBitsPerSecond,
      isSupported: typeof MediaRecorder !== 'undefined',
      supportedMimeTypes: [
        'video/mp4; codecs=h264',
        'video/mp4; codecs=avc1.42E01E',
        'video/mp4',
        'video/webm; codecs=vp9',
        'video/webm; codecs=vp8',
        'video/webm',
      ].filter((type) => MediaRecorder.isTypeSupported(type)),
    };
  }, [defaultOptions]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Cleanup on unmount
  useState(() => {
    return () => {
      cleanup();
    };
  });

  return {
    // State
    isRecording: state.isRecording,
    isPaused: state.isPaused,
    recordedChunks: state.recordedChunks,
    error: state.error,
    duration: state.duration,

    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    downloadRecording,
    clearError,

    // Utilities
    getRecordingInfo,
    cleanup,

    // Computed
    canRecord: !state.isRecording && !state.error,
    canStop: state.isRecording,
    canPause: state.isRecording && !state.isPaused,
    canResume: state.isRecording && state.isPaused,
    hasRecording: state.recordedChunks.length > 0,
  };
}

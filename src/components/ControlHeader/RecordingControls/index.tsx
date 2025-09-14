import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { useRecorder } from '@/hooks/useRecorder';
import {
  Circle,
  Square,
  Download,
  AlertCircle,
  Video,
  FileVideo,
  Loader2,
} from 'lucide-react';

interface RecordingState {
  isRecording: boolean;
  duration: number;
  isProcessing: boolean;
  hasRecording: boolean;
  error?: string;
}

export function RecordingControls() {
  const { startRecording, stopRecording, downloadRecording } =
    useRecorder('demoview');

  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    isProcessing: false,
    hasRecording: false,
  });

  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  // Timer effect for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (recordingState.isRecording) {
      interval = setInterval(() => {
        setRecordingState((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recordingState.isRecording]);

  const handleStartRecording = async () => {
    try {
      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        error: undefined,
      }));

      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        error:
          'Failed to start recording. Please check your browser permissions.',
      }));
    }
  };

  const handleStopRecording = async () => {
    try {
      setRecordingState((prev) => ({
        ...prev,
        isProcessing: true,
      }));

      const blob = await stopRecording();
      setRecordingBlob(blob);

      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
        hasRecording: true,
      }));
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
        error: 'Failed to stop recording.',
      }));
    }
  };

  const handleDownload = () => {
    if (recordingBlob) {
      downloadRecording(recordingBlob);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileSizeEstimate = (duration: number) => {
    // Rough estimate: ~2MB per minute for 1080p 30fps
    const mbPerMinute = 2;
    const estimatedMB = Math.round((duration / 60) * mbPerMinute * 10) / 10;
    return estimatedMB > 0 ? `~${estimatedMB}MB` : '';
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Recording button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          variant={recordingState.isRecording ? 'destructive' : 'outline'}
          onClick={
            recordingState.isRecording
              ? handleStopRecording
              : handleStartRecording
          }
          disabled={recordingState.isProcessing}
          className={cn(
            'h-8 px-3 space-x-1.5',
            recordingState.isRecording && 'bg-red-600 hover:bg-red-700'
          )}
        >
          {recordingState.isProcessing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Processing...</span>
            </>
          ) : recordingState.isRecording ? (
            <>
              <Square className="w-3 h-3" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Circle className="w-3 h-3" />
              <span>Record</span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Recording status and duration */}
      <AnimatePresence>
        {(recordingState.isRecording || recordingState.isProcessing) && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            {/* Recording indicator */}
            <div className="flex items-center space-x-1.5">
              <motion.div
                animate={{
                  scale: recordingState.isRecording ? [1, 1.3, 1] : 1,
                  opacity: recordingState.isRecording ? [0.7, 1, 0.7] : 0.7,
                }}
                transition={{
                  duration: 1,
                  repeat: recordingState.isRecording ? Infinity : 0,
                }}
                className={cn(
                  'w-2 h-2 rounded-full',
                  recordingState.isRecording ? 'bg-red-500' : 'bg-orange-500'
                )}
              />

              <div className="text-xs font-mono text-muted-foreground">
                {formatDuration(recordingState.duration)}
              </div>

              {/* File size estimate */}
              {recordingState.duration > 0 && (
                <div className="text-xs text-muted-foreground">
                  {getFileSizeEstimate(recordingState.duration)}
                </div>
              )}
            </div>

            {/* Recording quality indicator */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Video className="w-3 h-3" />
              <span>1080p</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download button */}
      <AnimatePresence>
        {recordingState.hasRecording && recordingBlob && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="h-8 px-3 space-x-1.5 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error indicator */}
      <AnimatePresence>
        {recordingState.error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center space-x-1 text-xs text-destructive"
          >
            <AlertCircle className="w-3 h-3" />
            <span className="max-w-[120px] truncate">
              {recordingState.error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording format info */}
      {!recordingState.isRecording &&
        !recordingState.hasRecording &&
        !recordingState.error && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <FileVideo className="w-3 h-3" />
            <span>MP4</span>
          </div>
        )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  initialTime?: number; // in seconds
  countDown?: boolean;
  onComplete?: () => void;
}

export default function Timer({
  initialTime = 0,
  countDown = false,
  onComplete,
}: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (countDown) {
            if (prev <= 1) {
              setIsRunning(false);
              onComplete?.();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, countDown, onComplete]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="text-4xl font-bold font-mono tabular-nums">
        {formatTime(time)}
      </div>

      <div className="flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          title={isRunning ? 'توقف' : 'شروع'}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={handleReset}
          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          title="ریست"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}

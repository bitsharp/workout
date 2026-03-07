import { useEffect, useRef, useState } from 'react';

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2min', seconds: 120 },
  { label: '3min', seconds: 180 },
];

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  selectedPreset: number;
}

interface TimerProps {
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
}

// Alarm sound (longer, louder beeps)
const ALARM_SOUND = 'data:audio/wav;base64,UklGRrQFAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YZAFAACAf3x4dHBsaGRgXFhUUE1JSUZDR0tPU1dbaG90fIGGi5GWm6CkqKyvsrW4ur2/wMLDxcXGxsbGxcXDwsC+vLm2s7Csp6SfmpaQioWAent2cm1pZWFdWlZTUE5LSUhIR0hJSk1QVFhcYGRobXF1eX2Ch4uQlJmdn6KlqKqtr7GztLa3uLm5urq6urm4t7a0sq+sqqeko5+bmJSQjImEgH15dXJuamZjX1xZVlRRUE5NTExMTU1OUFFTVVZZXF5hZGdqbXBzdnl8f4KFiIqNj5KUlpiZmpucnZ6en5+fnp6dnJuamJaVk5GPjYuJh4WDgX9+fHp5d3Z1dHNycXFxcXFxcnJzdHV2d3h5e3x+f4GCg4WHiImKjI2Oj5CRkpOUlJWVlpaWlpaWlZWUk5OSkZCPjo2Mi4qJiIeGhYSDgoGAgH9+fn19fHx8fHx8fHx8fX1+fn9/gIGBgoKDhIWFhoaHh4iIiYmJiYqKioqKiomJiYiIh4eGhoWEg4OCgYGAgICAf39/f39/f39/f4CAgIGBgoKDg4SFhoaHiImJi4uMjY2Oj5CQkZGSk5OUlJWVlpaWl5eXl5eXlpaWlZWUk5OSkZCQj46NjIuKiomIh4aFhIOCgYCAfn59fHt6eXl4d3Z2dXV0dHRzc3NzdHR0dXV2dnh5ent8fn+BgoSGiImLjY+QkpSVl5iZmpudnZ6fn6ChoaGhoaCgn56dnJuZmJaVk5GQjo2LiYiGhYOCgH9+fXx7enp5eXh4eHh4eXl6e3x9f4CCg4WGiImLjI6PkJKTlJWWl5iZmZqam5ubm5uampqZmJeWlZSTkpGQj42Mi4qJiIeGhYSDgoCAfn18e3p5eHd2dnV1dHR0dHR0dXV2d3h5ent9foCAgoOFhoeJioyNj5CRkpSVlpeYmZqam5ubnJycnJycnJubmpmYmJeWlZOSkJCPjoyLioiHhoWEg4KBgIB/fn59fXx8fHx8fHx9fX5+f4CAgYKDhIWGh4iJioqLjI2Njo+PkJCQkZGRkZGRkZCQkI+Pjo6NjYyLi4qJiIiHhoaFhIODgoGBgIB/f35+fX19fHx8fHx8fH19fX5+f3+AgIGBgoODhIWFhoaHh4iIiImJiYmJiYmJiYmIiIeHhoaFhYSEg4OCgoGAgICAgICAgICAgICAgYGCgoODhIWFhoaHiImJiouMjI2OjpGRk5SVl5iZmpucnZ6foKGhoqKjo6OjoqKhoaCfnp2cm5mYlpWTkpCPjYyKiYeGhIOCgYB/fn18e3p6eXh4d3d3d3d3d3h4eXp7fH1/gIKDhYeIiouNjpCRk5SWl5iZmpucnZ2en5+goKCgoJ+fn56dnJybmpmYl5aVlJKRkI+OjYuKiYeGhYSDgoGAf35+fXx7e3p6enl5eXl5eXl6ent7fH19fn+AgYKDhIWGh4iJiouMjI2Ojo+PkJCRkZGRkZGRkZGQkJCPj46OjY2MjIuLiomJiIiHh4aGhYWFhISDg4ODg4ODg4OEhISFhYWGhoeHiIiJiYqKi4uMjI2NjY6Ojo+Pj4+Pj4+Pj4+Pjo6OjY2NjIyLi4uKiomJiIiIh4eGhoaFhYWEhISDg4ODgoKCgoKCgoKCgoKCg4ODg4OEhIWFhYaGh4eHiIiIiYmJiYqKioqKioqKiYmJiYiIiIeHhoaGhYWEhISEg4ODgoKCgoGBgYGBgYCAgA==';

export function Timer({ timerState, setTimerState }: TimerProps) {
  const { timeLeft, isRunning, selectedPreset } = timerState;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  // Wake Lock - keep screen on during workout
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
      setWakeLockActive(false);
    }
  };

  // Auto wake lock when timer starts
  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => releaseWakeLock();
  }, [isRunning]);

  // Preload audio for iOS
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimerState({ ...timerState, timeLeft: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setTimerState({ ...timerState, isRunning: false });
      
      // Play alarm sound (works on iOS if user interacted)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      
      // Vibrate pattern
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetClick = (seconds: number) => {
    // Play silent sound to enable audio on iOS
    if (audioRef.current && isIOS) {
      audioRef.current.volume = 0.01;
      audioRef.current.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.volume = 1;
      }).catch(() => {});
    }
    
    setTimerState({
      timeLeft: seconds,
      isRunning: false,
      selectedPreset: seconds,
    });
  };

  const handleStartStop = () => {
    // Enable audio on iOS with user interaction
    if (audioRef.current && isIOS && !isRunning) {
      audioRef.current.volume = 0.01;
      audioRef.current.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
        audioRef.current!.volume = 1;
      }).catch(() => {});
    }

    if (timeLeft === 0) {
      setTimerState({ ...timerState, timeLeft: selectedPreset, isRunning: true });
    } else {
      setTimerState({ ...timerState, isRunning: !isRunning });
    }
  };

  const handleReset = () => {
    setTimerState({
      ...timerState,
      isRunning: false,
      timeLeft: selectedPreset,
    });
  };

  const progress = ((selectedPreset - timeLeft) / selectedPreset) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-300 text-center">
        ⏱️ Rest Timer
      </h2>

      {/* iOS Instructions */}
      {isIOS && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-sm text-blue-200">
          <strong>📱 iPhone:</strong> Tieni l'app aperta durante il rest. 
          {wakeLockActive ? (
            <span className="text-green-400"> ✅ Schermo attivo</span>
          ) : (
            <span> Lo schermo resterà acceso.</span>
          )}
        </div>
      )}

      {/* Timer Display */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Progress Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke={timeLeft === 0 ? '#22c55e' : '#6366f1'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-5xl font-bold ${timeLeft === 0 ? 'text-green-500 animate-pulse' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
          {isRunning && (
            <span className="text-xs text-gray-400 mt-2">
              {wakeLockActive ? '🔓 Schermo attivo' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="flex justify-center gap-2 flex-wrap">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            onClick={() => handlePresetClick(preset.seconds)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              selectedPreset === preset.seconds
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 flex items-center justify-center text-2xl transition-colors"
        >
          ↺
        </button>
        <button
          onClick={handleStartStop}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-colors shadow-lg ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
              : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
          }`}
        >
          {isRunning ? '⏸' : '▶'}
        </button>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={ALARM_SOUND}
        preload="auto"
      />
      
      {timeLeft === 0 && (
        <div className="text-center text-green-500 font-bold text-xl animate-pulse">
          ⏰ TEMPO SCADUTO!<br/>
          <span className="text-lg">Via con la prossima serie! 💪</span>
        </div>
      )}
    </div>
  );
}

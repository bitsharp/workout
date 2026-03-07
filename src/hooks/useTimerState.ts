import { useState, useEffect } from 'react';

const TIMER_STATE_KEY = 'timer_state';
const TIMER_END_TIME_KEY = 'timer_end_time';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  selectedPreset: number;
}

const DEFAULT_TIMER: TimerState = { timeLeft: 60, isRunning: false, selectedPreset: 60 };

export function useTimerState() {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const saved = localStorage.getItem(TIMER_STATE_KEY);
    const endTime = localStorage.getItem(TIMER_END_TIME_KEY);

    if (saved) {
      try {
        const state = JSON.parse(saved) as TimerState;

        if (endTime && state.isRunning) {
          const remaining = Math.max(0, Math.ceil((parseInt(endTime) - Date.now()) / 1000));
          if (remaining > 0) {
            return { ...state, timeLeft: remaining };
          }
          return { ...state, timeLeft: 0, isRunning: false };
        }
        return state;
      } catch {
        return DEFAULT_TIMER;
      }
    }
    return DEFAULT_TIMER;
  });

  // Persist timer state + end time
  useEffect(() => {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(timerState));

    if (timerState.isRunning && timerState.timeLeft > 0) {
      const endTime = Date.now() + (timerState.timeLeft * 1000);
      localStorage.setItem(TIMER_END_TIME_KEY, endTime.toString());
    } else {
      localStorage.removeItem(TIMER_END_TIME_KEY);
    }
  }, [timerState]);

  return { timerState, setTimerState };
}

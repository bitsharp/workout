import { useState, useEffect } from 'react';
import type { WorkoutLog } from '../types';
import { storage } from '../utils/storage';
import { workoutPlan } from '../data/workoutPlan';

const CURRENT_LOG_KEY = 'current_workout_log';
const SELECTED_DAY_KEY = 'selected_day';

export function useWorkoutState() {
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_DAY_KEY) || null;
  });

  const [currentLog, setCurrentLog] = useState<WorkoutLog | null>(() => {
    const saved = localStorage.getItem(CURRENT_LOG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Persist selected day
  useEffect(() => {
    if (selectedDay) {
      localStorage.setItem(SELECTED_DAY_KEY, selectedDay);
    } else {
      localStorage.removeItem(SELECTED_DAY_KEY);
    }
  }, [selectedDay]);

  // Persist and save current log
  useEffect(() => {
    if (currentLog) {
      localStorage.setItem(CURRENT_LOG_KEY, JSON.stringify(currentLog));
      storage.saveWorkoutLog(currentLog);
    }
  }, [currentLog]);

  // Create or load log when day changes
  useEffect(() => {
    if (selectedDay && (!currentLog || currentLog.dayId !== selectedDay)) {
      const today = new Date().toISOString().split('T')[0];
      const existingLogs = storage.getWorkoutLogs();
      const todayLog = existingLogs.find(
        l => l.date === today && l.dayId === selectedDay
      );

      if (todayLog) {
        setCurrentLog(todayLog);
      } else {
        const day = workoutPlan.find(d => d.id === selectedDay);
        if (day) {
          const newLog: WorkoutLog = {
            id: `${today}-${day.id}`,
            date: today,
            dayId: day.id,
            startTime: Date.now(),
            exercises: day.exercises.map(ex => ({
              exerciseId: ex.id,
              sets: Array(ex.sets).fill(null).map(() => ({
                reps: parseInt(ex.reps.split('-')[0]) || 12,
                weight: ex.weight,
                completed: false,
              })),
            })),
          };
          setCurrentLog(newLog);
        }
      }
    }
  }, [selectedDay, currentLog]);

  const startWorkout = (dayId: string) => {
    if (selectedDay !== dayId) {
      setCurrentLog(null);
    }
    setSelectedDay(dayId);
  };

  const finishWorkout = () => {
    if (currentLog) {
      const endTime = Date.now();
      const duration = currentLog.startTime
        ? Math.round((endTime - currentLog.startTime) / 60000)
        : undefined;
      const finishedLog: WorkoutLog = { ...currentLog, endTime, duration };
      storage.saveWorkoutLog(finishedLog);
    }
    setCurrentLog(null);
    setSelectedDay(null);
    localStorage.removeItem(CURRENT_LOG_KEY);
    localStorage.removeItem(SELECTED_DAY_KEY);
  };

  return {
    selectedDay,
    setSelectedDay,
    currentLog,
    setCurrentLog,
    startWorkout,
    finishWorkout,
  };
}

import type { WorkoutLog, NinjutsuLog } from '../types';

const WORKOUT_LOGS_KEY = 'workout_logs';
const NINJUTSU_LOGS_KEY = 'ninjutsu_logs';

export const storage = {
  getWorkoutLogs: (): WorkoutLog[] => {
    const data = localStorage.getItem(WORKOUT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveWorkoutLog: (log: WorkoutLog) => {
    const logs = storage.getWorkoutLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
  },

  deleteWorkoutLog: (id: string) => {
    const logs = storage.getWorkoutLogs().filter(l => l.id !== id);
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
  },

  getNinjutsuLogs: (): NinjutsuLog[] => {
    const data = localStorage.getItem(NINJUTSU_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNinjutsuLog: (log: NinjutsuLog) => {
    const logs = storage.getNinjutsuLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(NINJUTSU_LOGS_KEY, JSON.stringify(logs));
  },

  getExerciseHistory: (exerciseId: string): { date: string; weight: number; maxReps: number }[] => {
    const logs = storage.getWorkoutLogs();
    const history: { date: string; weight: number; maxReps: number }[] = [];
    
    logs.forEach(log => {
      const exercise = log.exercises.find(e => e.exerciseId === exerciseId);
      if (exercise && exercise.sets.length > 0) {
        const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
        const maxReps = Math.max(...exercise.sets.filter(s => s.weight === maxWeight).map(s => s.reps));
        history.push({ date: log.date, weight: maxWeight, maxReps });
      }
    });
    
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
};

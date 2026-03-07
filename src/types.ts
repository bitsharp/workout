export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // "12-15" format
  weight: number;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: string;
  emoji: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  dayId: string;
  exercises: ExerciseLog[];
  notes?: string;
  startTime?: number; // Unix timestamp ms
  endTime?: number;   // Unix timestamp ms
  duration?: number;  // Duration in minutes
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface SetLog {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface NinjutsuLog {
  id: string;
  date: string;
  techniques?: string[];
  notes?: string;
  duration?: number;
}

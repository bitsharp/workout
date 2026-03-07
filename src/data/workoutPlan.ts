import type { WorkoutDay } from '../types';

export const workoutPlan: WorkoutDay[] = [
  {
    id: 'tuesday',
    name: 'Petto & Tricipiti',
    dayOfWeek: 'Martedì',
    emoji: '🔴',
    exercises: [
      { id: 't1', name: 'Flessioni (riscaldamento)', sets: 2, reps: '10-12', weight: 0, notes: 'Bodyweight' },
      { id: 't2', name: 'Estensioni frontale barra retta', sets: 1, reps: '15', weight: 27 },
      { id: 't3', name: 'Estensioni invertita barra retta', sets: 1, reps: '15', weight: 27 },
      { id: 't4', name: 'Dips', sets: 1, reps: '15', weight: 0, notes: 'Bodyweight' },
      { id: 't5', name: 'Pullover con manubrio', sets: 3, reps: '12-15', weight: 15 },
      { id: 't6', name: 'Panca inclinata 30° aperture', sets: 3, reps: '12', weight: 7.5 },
      { id: 't7', name: 'Panca inclinata 30°', sets: 3, reps: '12-15', weight: 15 },
      { id: 't8', name: 'Panca plana', sets: 3, reps: '12-15', weight: 10 },
    ],
  },
  {
    id: 'thursday',
    name: 'Spalle & Bicipiti + Dorso',
    dayOfWeek: 'Giovedì',
    emoji: '🟡',
    exercises: [
      { id: 'th1', name: 'Hyperextension (lombare)', sets: 2, reps: '15', weight: 0, notes: 'Bodyweight' },
      { id: 'th2', name: 'Bicipiti barra retta', sets: 3, reps: '12-15', weight: 5 },
      { id: 'th3', name: 'Bicipiti da seduto', sets: 2, reps: '15', weight: 5 },
      { id: 'th4', name: 'Bicipiti martello', sets: 3, reps: '12-15', weight: 10 },
      { id: 'th5', name: 'Rematore', sets: 3, reps: '12-15', weight: 32 },
      { id: 'th6', name: 'Pushdown tricipiti barra', sets: 3, reps: '15', weight: 27 },
      { id: 'th7', name: 'Lat machine (dorsale)', sets: 3, reps: '12-15', weight: 32 },
      { id: 'th8', name: 'Trazioni assistite', sets: 3, reps: '10', weight: -27, notes: 'Assistenza -27/-20kg' },
    ],
  },
  {
    id: 'saturday',
    name: 'Gambe & Deltoidi',
    dayOfWeek: 'Sabato',
    emoji: '🟢',
    exercises: [
      { id: 's1', name: 'Polpacci con peso', sets: 3, reps: '15', weight: 15 },
      { id: 's2', name: 'Alzate laterali (drop set)', sets: 4, reps: '12-10', weight: 7.5, notes: 'Drop 7.5→5kg' },
      { id: 's3', name: 'Squat (riscaldamento)', sets: 3, reps: '15', weight: 0, notes: 'Bodyweight' },
      { id: 's4', name: 'Adductor machine', sets: 3, reps: '15', weight: 23 },
      { id: 's5', name: 'Stacco da terra', sets: 3, reps: '15', weight: 15 },
      { id: 's6', name: 'Scrollate trapezio', sets: 2, reps: '15', weight: 20 },
      { id: 's7', name: 'Alzate frontali (drop set)', sets: 2, reps: '12-10', weight: 7.5, notes: 'Drop 7.5→5kg' },
      { id: 's8', name: 'Leg extension (tempo)', sets: 3, reps: '12', weight: 57, notes: 'Pausa 1-2s in alto' },
      { id: 's9', name: 'Hack squat (Jaca)', sets: 3, reps: '15', weight: 30 },
    ],
  },
];

export const ninjutsuInfo = {
  level: 'Primo Kyu',
  belt: 'Marrone',
  days: ['Mercoledì', 'Venerdì'],
  emoji: '🥷',
};

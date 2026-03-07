import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { workoutPlan } from '../data/workoutPlan';
import type { WorkoutLog } from '../types';

export function History() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadLogs = () => {
    setLogs(storage.getWorkoutLogs().sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleDelete = (id: string) => {
    storage.deleteWorkoutLog(id);
    setConfirmDeleteId(null);
    loadLogs();
  };

  const getEstimatedMinutes = (dayId: string) => {
    const day = workoutPlan.find(d => d.id === dayId);
    if (!day) return null;
    const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    return totalSets * 2;
  };

  const allExercises = workoutPlan.flatMap(day => 
    day.exercises.map(ex => ({ ...ex, dayName: day.name, dayEmoji: day.emoji }))
  );

  const getExerciseProgress = (exerciseId: string) => {
    return storage.getExerciseHistory(exerciseId);
  };

  const getDayInfo = (dayId: string) => {
    return workoutPlan.find(d => d.id === dayId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (selectedExercise) {
    const exercise = allExercises.find(e => e.id === selectedExercise);
    const history = getExerciseProgress(selectedExercise);
    const maxWeight = Math.max(...history.map(h => h.weight), 1);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedExercise(null)}
          className="text-gray-400 hover:text-white"
        >
          ← Indietro
        </button>

        <div className="card">
          <h2 className="font-bold text-lg">{exercise?.name}</h2>
          <p className="text-sm text-gray-400">{exercise?.dayEmoji} {exercise?.dayName}</p>
        </div>

        {history.length > 0 ? (
          <>
            <div className="card">
              <h3 className="text-sm text-gray-400 mb-3">Progressione Peso</h3>
              <div className="h-32 flex items-end gap-1">
                {history.slice(-10).map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">{h.weight}</span>
                    <div
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${(h.weight / maxWeight) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm text-gray-400 mb-3">Storico</h3>
              <div className="space-y-2">
                {history.slice().reverse().map((h, i) => (
                  <div key={i} className="flex justify-between text-sm bg-gray-700/50 rounded px-3 py-2">
                    <span>{formatDate(h.date)}</span>
                    <span className="text-indigo-400">{h.weight}kg × {h.maxReps} reps</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center text-gray-400">
            Nessun dato ancora. Inizia ad allenarti! 💪
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-300">Storico Allenamenti</h2>

      {/* Recent Workouts */}
      <div className="space-y-2">
        <h3 className="text-sm text-gray-400">Ultimi Workout</h3>
        {logs.length > 0 ? (
          logs.slice(0, 5).map((log) => {
            const day = getDayInfo(log.dayId);
            const completedSets = log.exercises.reduce(
              (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
              0
            );
            const totalSets = log.exercises.reduce(
              (acc, ex) => acc + ex.sets.length,
              0
            );

            const estimated = getEstimatedMinutes(log.dayId);
            const actual = log.endTime && log.startTime
              ? Math.round((log.endTime - log.startTime) / 60000)
              : null;

            return (
              <div key={log.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl mr-2">{day?.emoji}</span>
                    <span className="font-semibold">{day?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{formatDate(log.date)}</span>
                    {confirmDeleteId === log.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          Sì
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(log.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Elimina workout"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center gap-4">
                  <span>{completedSets}/{totalSets} set</span>
                  {estimated && <span>⏱ Stimato: ~{estimated} min</span>}
                  {actual !== null && <span className="text-indigo-400">✅ Effettuato: {actual} min</span>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card text-center text-gray-400">
            Nessun workout registrato ancora
          </div>
        )}
      </div>

      {/* Exercise Progress */}
      <div className="space-y-2">
        <h3 className="text-sm text-gray-400">Progressi per Esercizio</h3>
        {workoutPlan.map((day) => (
          <div key={day.id} className="card">
            <h4 className="font-semibold mb-2">
              {day.emoji} {day.name}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {day.exercises.slice(0, 4).map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex.id)}
                  className="text-left text-sm bg-gray-700/50 rounded px-2 py-1.5 hover:bg-gray-700 transition-colors truncate"
                >
                  {ex.name}
                </button>
              ))}
              {day.exercises.length > 4 && (
                <span className="text-xs text-gray-500 col-span-2">
                  +{day.exercises.length - 4} altri
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

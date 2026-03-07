import { workoutPlan } from '../data/workoutPlan';
import type { WorkoutLog, SetLog } from '../types';

interface LogWorkoutProps {
  selectedDayId: string | null;
  onSelectDay: (dayId: string | null) => void;
  currentLog: WorkoutLog | null;
  setCurrentLog: (log: WorkoutLog | null) => void;
  onFinishWorkout: () => void;
}

export function LogWorkout({ selectedDayId, onSelectDay, currentLog, setCurrentLog, onFinishWorkout }: LogWorkoutProps) {
  const today = new Date().toISOString().split('T')[0];
  const selectedDay = workoutPlan.find(d => d.id === selectedDayId);

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<SetLog>) => {
    if (!currentLog) return;
    
    const newLog = { ...currentLog };
    newLog.exercises = [...newLog.exercises];
    newLog.exercises[exerciseIndex] = { ...newLog.exercises[exerciseIndex] };
    newLog.exercises[exerciseIndex].sets = [...newLog.exercises[exerciseIndex].sets];
    newLog.exercises[exerciseIndex].sets[setIndex] = {
      ...newLog.exercises[exerciseIndex].sets[setIndex],
      ...updates,
    };
    setCurrentLog(newLog);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (!currentLog) return;
    const currentSet = currentLog.exercises[exerciseIndex].sets[setIndex];
    updateSet(exerciseIndex, setIndex, { completed: !currentSet.completed });
  };

  if (!selectedDayId) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Seleziona giorno</h2>
        {workoutPlan.map((day) => (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className="card w-full text-left hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mr-2">{day.emoji}</span>
            <span className="font-bold">{day.dayOfWeek}</span>
            <span className="text-gray-400 ml-2">— {day.name}</span>
          </button>
        ))}
      </div>
    );
  }

  if (!selectedDay || !currentLog) {
    return <div>Caricamento...</div>;
  }

  const completedSets = currentLog.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
    0
  );
  const totalSets = currentLog.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectDay(null)}
          className="text-gray-400 hover:text-white"
        >
          ← Cambia giorno
        </button>
        <span className="text-sm text-gray-400">{today}</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl mr-2">{selectedDay.emoji}</span>
            <span className="font-bold">{selectedDay.name}</span>
          </div>
          <div className="text-sm text-gray-400">
            {completedSets}/{totalSets} set
          </div>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-green-500 mt-2">
          💾 Salvataggio automatico attivo
        </div>
      </div>

      {selectedDay.exercises.map((exercise, exIndex) => (
        <div key={exercise.id} className="card">
          <h3 className="font-semibold mb-2">{exercise.name}</h3>
          {exercise.notes && (
            <p className="text-xs text-gray-400 mb-2">{exercise.notes}</p>
          )}
          
          <div className="space-y-2">
            {currentLog.exercises[exIndex].sets.map((set, setIndex) => (
              <div
                key={setIndex}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  set.completed ? 'bg-green-900/30' : 'bg-gray-700/50'
                }`}
              >
                <button
                  onClick={() => toggleSetComplete(exIndex, setIndex)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    set.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {set.completed ? '✓' : setIndex + 1}
                </button>
                
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(exIndex, setIndex, { reps: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 bg-gray-700 rounded px-2 py-2 text-center text-lg"
                  placeholder="Reps"
                />
                <span className="text-gray-400">×</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={set.weight}
                  onChange={(e) =>
                    updateSet(exIndex, setIndex, { weight: parseFloat(e.target.value) || 0 })
                  }
                  className="w-20 bg-gray-700 rounded px-2 py-2 text-center text-lg"
                  placeholder="Kg"
                />
                <span className="text-gray-400 text-sm">kg</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="space-y-2 pt-4">
        {progress === 100 && (
          <button
            onClick={onFinishWorkout}
            className="w-full py-4 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            ✅ Termina Workout
          </button>
        )}
        {progress < 100 && progress > 0 && (
          <button
            onClick={onFinishWorkout}
            className="w-full py-3 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl"
          >
            Termina comunque ({completedSets}/{totalSets} completati)
          </button>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 pb-4">
        Puoi chiudere l'app — i progressi sono salvati automaticamente
      </div>
    </div>
  );
}

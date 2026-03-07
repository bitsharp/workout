import { workoutPlan, ninjutsuInfo } from '../data/workoutPlan';

interface ScheduleProps {
  onStartWorkout: (dayId: string) => void;
}

export function Schedule({ onStartWorkout }: ScheduleProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-300">Scheda Palestra - Javi</h2>
      
      {workoutPlan.map((day) => (
        <div key={day.id} className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl mr-2">{day.emoji}</span>
              <span className="font-bold">{day.dayOfWeek}</span>
              <span className="text-gray-400 ml-2">— {day.name}</span>
            </div>
            <button
              onClick={() => onStartWorkout(day.id)}
              className="btn-primary text-sm"
            >
              Inizia
            </button>
          </div>
          
          <div className="space-y-2">
            {day.exercises.map((ex) => (
              <div
                key={ex.id}
                className="flex justify-between items-center text-sm bg-gray-700/50 rounded-lg px-3 py-2"
              >
                <span className="text-gray-200">{ex.name}</span>
                <span className="text-gray-400">
                  {ex.sets}×{ex.reps} {ex.weight > 0 ? `@ ${ex.weight}kg` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Ninjutsu Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl mr-2">{ninjutsuInfo.emoji}</span>
            <span className="font-bold">Ninjutsu</span>
            <span className="text-gray-400 ml-2">— {ninjutsuInfo.days.join(' / ')}</span>
          </div>
        </div>
        <div className="text-sm text-gray-300">
          <span className="bg-amber-700/50 px-2 py-1 rounded">
            {ninjutsuInfo.belt} ({ninjutsuInfo.level})
          </span>
        </div>
      </div>
    </div>
  );
}

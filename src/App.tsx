import { useState } from 'react';
import { Schedule } from './components/Schedule';
import { LogWorkout } from './components/LogWorkout';
import { History } from './components/History';
import { Timer } from './components/Timer';
import { useWorkoutState } from './hooks/useWorkoutState';
import { useTimerState } from './hooks/useTimerState';

type Tab = 'schedule' | 'log' | 'history' | 'timer';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');

  const {
    selectedDay,
    setSelectedDay,
    currentLog,
    setCurrentLog,
    startWorkout,
    finishWorkout,
  } = useWorkoutState();

  const { timerState, setTimerState } = useTimerState();

  const handleStartWorkout = (dayId: string) => {
    startWorkout(dayId);
    setActiveTab('log');
  };

  const handleFinishWorkout = () => {
    finishWorkout();
    setActiveTab('history');
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'schedule', label: 'Scheda', icon: 'fas fa-list' },
    { id: 'log', label: 'Log', icon: 'fas fa-pen' },
    { id: 'history', label: 'Storico', icon: 'fas fa-chart-line' },
    { id: 'timer', label: 'Timer', icon: 'fas fa-stopwatch' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
          <i className="fas fa-dumbbell mr-2"></i> Luca Workout Tracker
        </h1>
        {currentLog && (
          <div className="text-center text-xs text-emerald-400 mt-2">
            <i className="fas fa-check-circle mr-1"></i> Auto-save attivo
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto">
        {activeTab === 'schedule' && (
          <Schedule onStartWorkout={handleStartWorkout} />
        )}
        {activeTab === 'log' && (
          <LogWorkout 
            selectedDayId={selectedDay} 
            onSelectDay={setSelectedDay}
            currentLog={currentLog}
            setCurrentLog={setCurrentLog}
            onFinishWorkout={handleFinishWorkout}
          />
        )}
        {activeTab === 'history' && <History />}
        {activeTab === 'timer' && (
          <Timer 
            timerState={timerState}
            setTimerState={setTimerState}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="nav-glass max-w-lg mx-auto">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === tab.id
                  ? 'text-indigo-300 border-t-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className={`${tab.icon} text-xl block`}></i>
              <span className="block text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Versione UI */}
      <footer className="text-center text-xs text-slate-400 mt-4">
        Versione: 1.0.0
      </footer>
    </div>
  );
}

export default App;

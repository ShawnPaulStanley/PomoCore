import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, BatteryCharging, Settings, Check } from 'lucide-react';
import { Button } from './Button';
import { TimerMode } from '../types';
import { saveSession } from '../services/supabase';

interface TimerProps {
  onSessionComplete: (minutes: number) => void;
}

interface TimerDurations {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export const Timer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [durations, setDurations] = useState<TimerDurations>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [initialDuration, setInitialDuration] = useState(durations.focus * 60);
  const [showSettings, setShowSettings] = useState(false);
  
  const [endTime, setEndTime] = useState<number | null>(null);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setEndTime(null);
    setMode(newMode);
    const newTime = durations[newMode] * 60;
    setInitialDuration(newTime);
    setTimeLeft(newTime);
  };

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    setEndTime(null);
    const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
    sound.volume = 0.5;
    sound.play().catch(() => {});
    
    if (mode === 'focus') {
      const completedMinutes = initialDuration / 60;
      onSessionComplete(completedMinutes);
      
      // Save to Supabase
      try {
        await saveSession(completedMinutes, mode);
      } catch (error) {
        console.error('Failed to save session:', error);
      }
    }
  }, [mode, initialDuration, onSessionComplete]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      setEndTime(null);
    } else {
      setIsActive(true);
      setEndTime(Date.now() + timeLeft * 1000);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((endTime - now) / 1000);

        if (diff <= 0) {
          setTimeLeft(0);
          handleComplete();
          clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }
      }, 200); 
    }

    return () => clearInterval(interval);
  }, [isActive, endTime, handleComplete]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const modeNames = {
      focus: 'Focus',
      shortBreak: 'Short Break',
      longBreak: 'Long Break'
    };
    
    document.title = `${timeStr} · ${modeNames[mode]}`;
    
    return () => { document.title = 'PomoCore'; };
  }, [timeLeft, mode]);

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
    setIsActive(false);
    setEndTime(null);
    const newTime = durations[mode] * 60;
    setInitialDuration(newTime);
    setTimeLeft(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (timeLeft / initialDuration) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,0.1)] p-8 border-2 border-pastel-lavender dark:border-indigo-900 flex flex-col items-center relative overflow-hidden transition-all duration-300 w-full group hover:shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
      
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pastel-peach transition-colors z-20"
      >
        <Settings size={20} />
      </button>

      {showSettings ? (
        <form onSubmit={handleSettingsSave} className="w-full h-full flex flex-col items-center justify-center gap-4 py-8 animate-breathe">
          <h3 className="font-hand text-2xl mb-2 text-pastel-text dark:text-pastel-darkText">Timer Settings (min)</h3>
          
          <div className="grid grid-cols-3 gap-4 w-full px-4">
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Focus</label>
                <input 
                  type="number" 
                  min="1" 
                  max="90"
                  value={durations.focus} 
                  onChange={(e) => setDurations({...durations, focus: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-peach"
                />
             </div>
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Short</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={durations.shortBreak} 
                  onChange={(e) => setDurations({...durations, shortBreak: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-mint"
                />
             </div>
             <div className="flex flex-col items-center">
                <label className="text-xs font-bold uppercase text-gray-400 mb-1">Long</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60"
                  value={durations.longBreak} 
                  onChange={(e) => setDurations({...durations, longBreak: parseInt(e.target.value) || 1})}
                  className="w-full text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900 font-hand text-xl focus:outline-none focus:ring-2 ring-pastel-blue"
                />
             </div>
          </div>

          <Button type="submit" className="mt-4" size="sm">
            <Check size={18} /> Save Changes
          </Button>
        </form>
      ) : (
        <>
          <div className="flex justify-center gap-2 mb-8 w-full z-10">
            <Button 
              variant={mode === 'focus' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('focus')}
              size="sm"
              active={mode === 'focus'}
            >
              <Brain size={18} /> Focus
            </Button>
            <Button 
              variant={mode === 'shortBreak' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('shortBreak')}
              size="sm"
              active={mode === 'shortBreak'}
            >
              <Coffee size={18} /> Short
            </Button>
            <Button 
              variant={mode === 'longBreak' ? 'primary' : 'ghost'} 
              onClick={() => switchMode('longBreak')}
              size="sm"
              active={mode === 'longBreak'}
            >
              <BatteryCharging size={18} /> Long
            </Button>
          </div>

          <div className="my-8 flex items-center justify-center relative z-10">
             <span className="relative text-[6rem] md:text-[8rem] leading-none font-hand text-gray-800 dark:text-gray-100 tracking-widest drop-shadow-sm select-none transition-all duration-300">
                {formatTime(timeLeft)}
             </span>
          </div>

          <div className="flex justify-center gap-4 w-full z-10">
            <Button onClick={toggleTimer} size="lg" className="w-32 shadow-md">
              {isActive ? <Pause /> : <Play />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" onClick={() => {
                setIsActive(false);
                setEndTime(null);
                setInitialDuration(durations[mode] * 60);
                setTimeLeft(durations[mode] * 60);
            }} className="shadow-md">
              <RotateCcw />
            </Button>
          </div>
        </>
      )}

      {/* Progress Line */}
      {!showSettings && (
        <div className="absolute bottom-0 left-0 h-2 bg-gray-100 dark:bg-gray-700 w-full">
            <div 
              className="h-full bg-pastel-peach transition-all ease-linear duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
      )}
    </div>
  );
};
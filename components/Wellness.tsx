import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause } from 'lucide-react';

export const Wellness: React.FC = () => {
  const [breatheState, setBreatheState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [isActive, setIsActive] = useState(false);

  // Breathing Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let isMounted = true;

    const cycle = async () => {
      if (!isMounted || !isActive) return;

      setBreatheState('Inhale');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;
      
      setBreatheState('Hold');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;
      
      setBreatheState('Exhale');
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted || !isActive) return;
    };

    if (isActive) {
      cycle();
      interval = setInterval(() => {
         cycle();
      }, 12000); 
    } else {
      setBreatheState('Ready');
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,0.1)] p-6 border-2 border-pastel-mint dark:border-teal-900 flex flex-col items-center justify-center h-64 relative overflow-hidden group hover:shadow-[6px_6px_0px_rgba(0,0,0,0.1)] transition-all">
      
      <div className="flex items-center gap-2 text-teal-700 dark:text-teal-200 mb-6 z-10">
        <Wind size={20} />
        <h3 className="font-hand text-2xl font-bold">Box Breathing</h3>
      </div>

      <button 
        onClick={() => setIsActive(!isActive)}
        className="relative w-40 h-40 flex items-center justify-center cursor-pointer outline-none group/circle"
      >
        {/* Outer Ripple 2 */}
        <div className={`
           absolute inset-0 rounded-full border-2 border-pastel-mint dark:border-teal-800 transition-all duration-[4000ms] ease-in-out
           ${isActive && breatheState === 'Inhale' ? 'scale-150 opacity-100' : isActive && breatheState === 'Exhale' ? 'scale-75 opacity-100' : 'scale-100 opacity-30'}
        `}></div>

        {/* Outer Ripple 1 */}
        <div className={`
           absolute inset-4 rounded-full border-2 border-pastel-mint dark:border-teal-700 transition-all duration-[4000ms] ease-in-out
           ${isActive && breatheState === 'Inhale' ? 'scale-125 opacity-100' : isActive && breatheState === 'Exhale' ? 'scale-90 opacity-100' : 'scale-100 opacity-60'}
        `}></div>
        
        {/* Core Circle */}
        <div className={`
          w-24 h-24 rounded-full bg-pastel-mint/30 dark:bg-teal-900/30 border-4 border-pastel-mint dark:border-teal-600 flex items-center justify-center transition-all duration-[4000ms] ease-in-out relative z-10 shadow-sm
          ${isActive ? (breatheState === 'Inhale' ? 'scale-110 bg-pastel-mint/50' : breatheState === 'Exhale' ? 'scale-90 bg-pastel-mint/20' : 'scale-110') : 'scale-100 group-hover/circle:scale-105 group-hover/circle:bg-pastel-mint/40'}
        `}>
           {isActive ? (
               <div className="text-center">
                 <span className="font-hand text-xl text-teal-800 dark:text-teal-100 font-bold block animate-pulse">
                   {breatheState}
                 </span>
                 <Pause size={16} className="mx-auto mt-1 text-teal-600 dark:text-teal-400 opacity-0 group-hover/circle:opacity-100 transition-opacity absolute bottom-2 left-0 right-0" />
               </div>
           ) : (
               <Play className="text-teal-600 dark:text-teal-200 ml-1" size={32} fill="currentColor" />
           )}
        </div>
      </button>

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-sans uppercase tracking-widest font-bold mt-4">
        {isActive ? 'Tap to pause' : 'Tap to start'}
      </p>
    </div>
  );
};
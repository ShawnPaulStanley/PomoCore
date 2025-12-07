import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Flame, Eye, EyeOff, Linkedin, Palette, Check, X, Star, Zap, Sparkles } from 'lucide-react';
import { Timer } from './components/Timer';
import { Tasks } from './components/Tasks';
import { Stats } from './components/Stats';
import { SpotifyPlayer } from './components/Spotify';
import { QuoteGen } from './components/QuoteGen';
import { Wellness } from './components/Wellness';
import { ScribbleBoard } from './components/ScribbleBoard';
import { Auth } from './components/Auth';
import { AppTheme, DailyStats } from './types';
import { getTodayStats, updateStats, getStats } from './services/storage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.PAPER);
  
  // Persistence State
  const [statsData, setStatsData] = useState<DailyStats[]>([]);
  const [todayStats, setTodayStats] = useState<DailyStats>({ 
    date: '', focusMinutes: 0, tasksCompleted: 0, sessionsCompleted: 0 
  });
  
  // Animation States
  const [moveLogo, setMoveLogo] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [logoDocked, setLogoDocked] = useState(false);
  
  const [focusMode, setFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const loadData = () => {
      setStatsData(getStats());
      setTodayStats(getTodayStats());
    };
    loadData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // 1. Start moving logo up after delay
    const moveTimer = setTimeout(() => {
      setMoveLogo(true);
      window.scrollTo(0, 0); 
    }, 2200);

    // 2. Reveal main content after movement completes
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 3200);

    // 3. Swap the startup logo for the real header logo
    const dockTimer = setTimeout(() => {
      setLogoDocked(true);
    }, 3250);

    return () => { clearTimeout(moveTimer); clearTimeout(contentTimer); clearTimeout(dockTimer); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSessionComplete = (minutes: number) => {
    const newStats = updateStats(minutes, 0, 1); // +Minutes, +0 Tasks, +1 Session
    setStatsData(newStats);
    setTodayStats(getTodayStats());
  };

  const handleTaskActivity = (completed: boolean) => {
    const change = completed ? 1 : -1;
    const newStats = updateStats(0, change, 0); // +0 Minutes, +/-1 Task, +0 Session
    setStatsData(newStats);
    setTodayStats(getTodayStats());
  };

  const getBackgroundClass = () => {
    switch (theme) {
      case AppTheme.PAPER: return 'paper-pattern';
      case AppTheme.GRID: return 'grid-pattern';
      case AppTheme.POLKA: return 'polka-pattern';
      case AppTheme.STRIPES: return 'stripe-pattern';
      case AppTheme.DOODLE: return 'doodle-pattern';
      case AppTheme.GRADIENT: return 'bg-gradient-to-br from-pastel-lavender via-pastel-cream to-pastel-blue dark:from-slate-900 dark:via-slate-800 dark:to-slate-900';
      case AppTheme.FOREST: return 'bg-[#E8F5E9] dark:bg-[#1a2f1c]';
      case AppTheme.SUNSET: return 'bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f] dark:from-[#432c3a] dark:to-[#2c1a23]';
      case AppTheme.CHERRY: return 'bg-[#fce4ec] dark:bg-[#3e2723]';
      case AppTheme.OCEAN: return 'bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb] dark:from-[#0d47a1] dark:to-[#1565c0]';
      case AppTheme.COFFEE: return 'bg-[#efebe9] dark:bg-[#3e2723]';
      case AppTheme.GALAXY: return 'bg-[#301934] dark:bg-[#120024]';
      case AppTheme.MATCHA: return 'bg-[#dcedc8] dark:bg-[#33691e]';
      case AppTheme.CLAY: return 'bg-[#d7ccc8] dark:bg-[#4e342e]';
      default: return 'bg-gray-50';
    }
  };

  const getThemePreviewStyle = (t: AppTheme) => {
    switch (t) {
      case AppTheme.PAPER: return 'paper-pattern';
      case AppTheme.GRID: return 'grid-pattern';
      case AppTheme.POLKA: return 'polka-pattern';
      case AppTheme.STRIPES: return 'stripe-pattern';
      case AppTheme.DOODLE: return 'doodle-pattern';
      case AppTheme.GRADIENT: return 'bg-gradient-to-br from-pastel-lavender via-pastel-cream to-pastel-blue';
      case AppTheme.FOREST: return 'bg-[#E8F5E9]';
      case AppTheme.SUNSET: return 'bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]';
      case AppTheme.CHERRY: return 'bg-[#fce4ec]';
      case AppTheme.OCEAN: return 'bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb]';
      case AppTheme.COFFEE: return 'bg-[#efebe9]';
      case AppTheme.GALAXY: return 'bg-[#301934]';
      case AppTheme.MATCHA: return 'bg-[#dcedc8]';
      case AppTheme.CLAY: return 'bg-[#d7ccc8]';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getBackgroundClass()} ${darkMode ? 'text-pastel-darkText' : 'text-pastel-text'} overflow-x-hidden`}>
      
      {/* Startup Overlay - Animated Transition */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${logoDocked ? 'pointer-events-none' : 'pointer-events-auto'}`}>
         {/* Background Layer - Fades Out */}
         <div className={`absolute inset-0 bg-pastel-cream dark:bg-[#0f0c29] transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pastel-lavender/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pastel-peach/30 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]"></div>
            </div>
         </div>

         {/* Content Layer - Moves Up */}
         <div 
           className={`relative z-10 flex flex-col items-center justify-center transition-all duration-[1000ms] cubic-bezier(0.76, 0, 0.24, 1) ${logoDocked ? 'opacity-0' : 'opacity-100'}`}
           style={{
             transform: moveLogo ? 'translateY(calc(-50vh + 115px))' : 'translateY(0) scale(1.5)',
           }}
         >
            {/* Doodle Icons - Only visible initially */}
            <div className={`absolute -top-12 -left-16 text-pastel-peach transition-opacity duration-300 ${moveLogo ? 'opacity-0' : 'opacity-100 animate-[popIn_0.5s_ease-out_forwards]'}`} style={{animationDelay: '0.2s'}}>
               <Star size={48} fill="currentColor" />
            </div>
            <div className={`absolute -bottom-8 -right-12 text-pastel-lavender transition-opacity duration-300 ${moveLogo ? 'opacity-0' : 'opacity-100 animate-[popIn_0.5s_ease-out_forwards]'}`} style={{animationDelay: '0.4s'}}>
               <Zap size={40} fill="currentColor" />
            </div>
            <div className={`absolute top-0 right-[-60px] text-pastel-mint transition-opacity duration-300 ${moveLogo ? 'opacity-0' : 'opacity-100 animate-[popIn_0.5s_ease-out_forwards]'}`} style={{animationDelay: '0.6s'}}>
               <Sparkles size={32} />
            </div>

            <h1 className={`flex items-center gap-1 sm:gap-4 font-title text-6xl md:text-8xl font-bold tracking-widest text-pastel-text dark:text-white drop-shadow-lg whitespace-nowrap transition-transform duration-1000 ${moveLogo ? '-rotate-2' : 'rotate-0'}`}>
              <span className={moveLogo ? '' : "animate-[slideInLeft_0.8s_ease-out_forwards] opacity-0"}>Pomo</span>
              <span className={`text-pastel-peach inline-block transform transition-transform duration-1000 ${moveLogo ? 'rotate-3' : '-rotate-6'} ${moveLogo ? '' : "animate-[bounceIn_0.8s_cubic-bezier(0.68,-0.55,0.27,1.55)_forwards] opacity-0"}`} style={{animationDelay: '0.3s'}}>Core</span>
            </h1>
            
            <div className={`mt-6 overflow-hidden transition-all duration-500 ${moveLogo ? 'opacity-0 h-0 mt-0' : 'opacity-100 h-auto'}`}>
               <p className="font-sans text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 animate-[slideUpFade_1s_ease-out_forwards] opacity-0" style={{animationDelay: '0.8s'}}>
                 Calm AF. Smart AF.
               </p>
            </div>
         </div>
      </div>

      {/* Header Section */}
      <header className={`relative pt-12 pb-6 px-6 flex flex-col items-center justify-center transition-all duration-1000 ${showContent ? (focusMode ? 'opacity-50 hover:opacity-100' : 'opacity-100') : 'opacity-0'}`}>
        
        {/* Left Controls */}
        <div className="absolute top-6 left-6 hidden md:flex flex-col gap-3 z-40 items-start">
          <a 
              href="https://www.linkedin.com/in/shawn-paul-stanley/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-pastel-peach hover:text-white dark:hover:text-black transition-all shadow-sm group border-2 border-transparent hover:border-pastel-peach/50"
          >
              <Linkedin size={16} />
              <span className="font-hand font-bold text-sm">Made by Shawn</span>
          </a>
          
          <div className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-2xl min-w-[130px] shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between gap-4">
                  <span className="text-orange-500 dark:text-orange-400 font-extrabold">IST</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold">EST</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">UTC</span>
                  <span className="font-sans font-bold text-gray-800 dark:text-gray-100">{currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
               </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-all ${focusMode ? 'bg-pastel-peach text-white shadow-md scale-105' : 'bg-white dark:bg-gray-800 opacity-90 hover:opacity-100 border border-gray-200 dark:border-gray-700'}`}
            >
              {focusMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden md:inline">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>

            <div className="hidden md:flex items-center gap-2 mr-2 text-sm font-bold opacity-90 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
              <span>{Math.floor(todayStats.focusMinutes)}m</span>
              <Flame size={14} className="text-pastel-peach" />
            </div>
            
            {/* Theme Selector */}
            <div className="relative" ref={themeMenuRef}>
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${showThemeMenu ? 'bg-pastel-peach text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
              >
                <Palette size={16} />
                <span className="text-xs font-bold uppercase hidden md:inline">Theme</span>
              </button>

              {showThemeMenu && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-50 animate-[slideUpFade_0.2s_ease-out]">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Select Theme</span>
                     <button onClick={() => setShowThemeMenu(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                       <X size={14} />
                     </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {Object.values(AppTheme).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === t ? 'bg-pastel-peach/10 ring-2 ring-pastel-peach' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full shadow-inner border border-black/5 dark:border-white/10 ${getThemePreviewStyle(t)} flex items-center justify-center`}>
                          {theme === t && <Check size={14} className="text-gray-700 dark:text-white drop-shadow-md" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 truncate w-full text-center">
                          {t}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <Auth />
        </div>

        {/* Centered Title - Only appears after startup animation swaps */}
        <div className={`transition-all duration-500 ${focusMode ? 'scale-75 opacity-50 blur-sm hover:blur-none' : 'scale-100'} ${logoDocked ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="font-title text-6xl md:text-8xl font-bold tracking-widest transform -rotate-2 select-none drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all hover:scale-105 duration-500 text-center text-gray-800 dark:text-white">
            Pomo<span className="text-pastel-peach inline-block transform rotate-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">Core</span>
          </h1>
          <p className="font-sans text-sm md:text-base opacity-60 mt-2 tracking-widest uppercase font-bold text-center">
            Calm AF. Smart AF.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 transition-all duration-1000 delay-300 ${focusMode ? 'justify-center' : ''} ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className={`lg:col-span-4 space-y-6 flex flex-col transition-all duration-500 order-2 lg:order-1 ${focusMode ? 'hidden opacity-0 translate-x-[-50px]' : 'opacity-100 translate-x-0'}`}>
          <SpotifyPlayer />
          <QuoteGen />
          <ScribbleBoard />
          {/* ChatBot removed */}
        </div>

        <div className={`space-y-6 transition-all duration-700 order-1 lg:order-2 ${focusMode ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-8'}`}>
          <Timer onSessionComplete={handleSessionComplete} />
          
          <div className={`grid gap-6 transition-all duration-500 ${focusMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] border border-white/50 dark:border-white/5 min-h-[400px]">
              <Tasks onTaskActivity={handleTaskActivity} />
            </div>
            
            <div className={`flex flex-col gap-6 transition-all duration-300 ${focusMode ? 'hidden opacity-0' : 'opacity-100'}`}>
               <Wellness />
               <Stats data={statsData} />
               <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-3xl h-64 flex flex-col justify-center items-center text-center border-2 border-dashed border-purple-200 dark:border-purple-800">
                  <h3 className="font-hand text-xl mb-2 text-purple-900 dark:text-purple-100">Today's Focus</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-hand font-bold text-purple-600 dark:text-purple-300">{Math.floor(todayStats.focusMinutes)}</p>
                    <span className="text-sm font-sans text-gray-500 uppercase font-bold tracking-widest">minutes</span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans mt-2">{todayStats.sessionsCompleted} sessions crushed</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
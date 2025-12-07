import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp, Target, Flame, Trophy } from 'lucide-react';
import { DailyStats } from '../types';
import { getStreakData, getTotalFocusTime, getWeeklyStats, supabase } from '../services/supabase';

interface StatsProps {
  data: DailyStats[];
}

export const Stats: React.FC<StatsProps> = ({ data }) => {
  const [view, setView] = useState<'bar' | 'line'>('bar');
  const [user, setUser] = useState<any>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0, totalSessions: 0 });
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserStats();
    } else {
      // Reset data when logged out
      setWeeklyData([]);
    }
  }, [user]);

  const loadUserStats = async () => {
    const streaks = await getStreakData();
    const totalTime = await getTotalFocusTime();
    const weekly = await getWeeklyStats();
    console.log('Weekly stats loaded:', JSON.stringify(weekly, null, 2));
    setStreakData(streaks);
    setTotalFocusTime(totalTime);
    setWeeklyData(weekly as DailyStats[]);
  };

  // Format date for chart (e.g. "Mon" or "10/24")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' }); 
  };

  // Use Supabase data if user is logged in, otherwise use localStorage data
  let chartData: any[] = user ? weeklyData : data;
  
  console.log('Chart data:', JSON.stringify(chartData, null, 2), 'User:', !!user, 'Weekly data length:', weeklyData.length);
  
  // Fill with last 7 days if we have some data but not enough
  if (chartData.length > 0 && chartData.length < 7) {
    const today = new Date();
    const filledData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const existingData = chartData.find(item => item.date === dateStr);
      filledData.push(existingData || {
        date: dateStr,
        focusMinutes: 0,
        tasksCompleted: 0
      });
    }
    
    chartData = filledData;
  }
  
  // Basic filler if data is totally empty
  if (chartData.length === 0) {
      const today = new Date();
      chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        return {
           date: d.toISOString().split('T')[0],
           focusMinutes: 0,
           tasksCompleted: 0
        };
      });
  } else {
    // Ensure we show at least a few bars if data exists but is sparse? 
    // For now, raw data is fine, but let's take last 7 entries max to keep chart clean
    chartData = chartData.slice(-7);
  }



  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg flex flex-col gap-6">
      {user && streakData.totalSessions > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-hand text-2xl text-pastel-text dark:text-pastel-darkText">Your Stats</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={18} className="text-orange-500" />
                <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Current Streak</span>
              </div>
              <p className="text-3xl font-hand font-bold text-orange-600 dark:text-orange-400">{streakData.currentStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="text-purple-500" />
                <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Best Streak</span>
              </div>
              <p className="text-3xl font-hand font-bold text-purple-600 dark:text-purple-400">{streakData.longestStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-blue-500" />
                <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Total Sessions</span>
              </div>
              <p className="text-3xl font-hand font-bold text-blue-600 dark:text-blue-400">{streakData.totalSessions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">completed</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={18} className="text-pink-500" />
                <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Total Time</span>
              </div>
              <p className="text-3xl font-hand font-bold text-pink-600 dark:text-pink-400">{totalFocusTime}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">minutes</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-hand text-2xl text-pastel-text dark:text-pastel-darkText">
            {view === 'bar' ? 'Weekly Focus' : 'Focus Trend'}
          </h3>
          <div className="flex bg-pastel-lavender/30 dark:bg-black/20 rounded-xl p-1 gap-1">
            <button 
              onClick={() => setView('bar')}
              className={`p-1.5 rounded-lg transition-all ${view === 'bar' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
              title="Bar Chart"
            >
              <BarChart2 size={16} />
            </button>
            <button 
              onClick={() => setView('line')}
              className={`p-1.5 rounded-lg transition-all ${view === 'line' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
              title="Line Chart"
            >
              <TrendingUp size={16} />
            </button>
          </div>
        </div>

        <div className="w-full min-h-[160px]">
          {!user ? (
            <div className="h-full flex items-center justify-center text-gray-400 font-hand text-lg opacity-60">
              Sign in to see your stats!
            </div>
          ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 font-hand text-lg opacity-60">
                  No data yet. Start a timer!
              </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            {view === 'bar' ? (
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                  interval={0}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Bar dataKey="focusMinutes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#E6E6FA', '#FFDAB9', '#E0F2F1', '#E0F7FA'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                  padding={{ left: 10, right: 10 }}
                  interval={0}
                />
                <Tooltip 
                  cursor={{ stroke: '#FFDAB9', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="focusMinutes" 
                  stroke="#FFDAB9" 
                  strokeWidth={3} 
                  dot={{ fill: '#E6E6FA', stroke: '#FFDAB9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#FFDAB9' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg h-64 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-hand text-2xl text-pastel-text dark:text-pastel-darkText">
          {view === 'bar' ? 'Weekly Focus' : 'Focus Trend'}
        </h3>
        <div className="flex bg-pastel-lavender/30 dark:bg-black/20 rounded-xl p-1 gap-1">
          <button 
            onClick={() => setView('bar')}
            className={`p-1.5 rounded-lg transition-all ${view === 'bar' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
            title="Bar Chart"
          >
            <BarChart2 size={16} />
          </button>
          <button 
            onClick={() => setView('line')}
            className={`p-1.5 rounded-lg transition-all ${view === 'line' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
            title="Line Chart"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[160px]">
        {!user ? (
          <div className="h-full flex items-center justify-center text-gray-400 font-hand text-lg opacity-60">
            Sign in to see your stats!
          </div>
        ) : chartData.every(d => d.focusMinutes === 0) ? (
            <div className="h-full flex items-center justify-center text-gray-400 font-hand text-lg opacity-60">
                No data yet. Start a timer!
            </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          {view === 'bar' ? (
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                interval={0}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar dataKey="focusMinutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#E6E6FA', '#FFDAB9', '#E0F2F1', '#E0F7FA'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                padding={{ left: 10, right: 10 }}
                interval={0}
              />
              <Tooltip 
                cursor={{ stroke: '#FFDAB9', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="focusMinutes" 
                stroke="#FFDAB9" 
                strokeWidth={3} 
                dot={{ fill: '#E6E6FA', stroke: '#FFDAB9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFDAB9' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
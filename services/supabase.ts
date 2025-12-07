/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Session helpers
export const saveSession = async (duration: number, mode: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        user_id: user.id,
        duration_minutes: duration,
        mode: mode,
      }
    ])
    .select()
    .single();

  return { data, error };
};

export const getUserSessions = async (limit = 50) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
};

export const getStreakData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { currentStreak: 0, longestStreak: 0, totalSessions: 0 };

  const { data: sessions } = await supabase
    .from('sessions')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalSessions: 0 };
  }

  // Calculate streaks
  const dates = sessions.map(s => new Date(s.created_at).toDateString());
  const uniqueDates = [...new Set(dates)];
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check if current streak is active
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
      
      if (diffDays === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  longestStreak = currentStreak;
  tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalSessions: sessions.length,
  };
};

export const getTotalFocusTime = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from('sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .eq('mode', 'focus');

  if (!data) return 0;
  
  return data.reduce((total, session) => total + session.duration_minutes, 0);
};

export const getWeeklyStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Calculate the date 7 days ago
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: sessions } = await supabase
    .from('sessions')
    .select('created_at, duration_minutes, mode')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (!sessions || sessions.length === 0) {
    // Return last 7 days with zero data
    const emptyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      emptyStats.push({
        date: d.toISOString().split('T')[0],
        focusMinutes: 0,
        tasksCompleted: 0
      });
    }
    return emptyStats;
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc: any, session) => {
    const date = new Date(session.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, focusMinutes: 0, tasksCompleted: 0 };
    }
    if (session.mode === 'focus') {
      acc[date].focusMinutes += session.duration_minutes;
    }
    return acc;
  }, {});

  // Fill in missing days with zero data for the last 7 days
  const filledStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    filledStats.push(sessionsByDate[dateStr] || {
      date: dateStr,
      focusMinutes: 0,
      tasksCompleted: 0
    });
  }

  return filledStats;
};

export const getTodayFocusTime = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .eq('mode', 'focus')
    .gte('created_at', today)
    .lt('created_at', new Date(new Date(today).getTime() + 86400000).toISOString());

  if (!data) return 0;
  
  return data.reduce((total, session) => total + session.duration_minutes, 0);
};

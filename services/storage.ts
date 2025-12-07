import { DailyStats } from '../types';

const STORAGE_KEY = 'pomocore-stats';

// Get local date string YYYY-MM-DD
export const getTodayDateString = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export const getStats = (): DailyStats[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Failed to parse stats", e);
    return [];
  }
};

export const saveStats = (stats: DailyStats[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn("Failed to save stats", e);
  }
};

export const getTodayStats = (): DailyStats => {
  const date = getTodayDateString();
  const stats = getStats();
  const today = stats.find(s => s.date === date);
  return today || { date, focusMinutes: 0, tasksCompleted: 0, sessionsCompleted: 0 };
};

export const updateStats = (
  minutesDelta: number = 0, 
  tasksDelta: number = 0, 
  sessionsDelta: number = 0
): DailyStats[] => {
  const date = getTodayDateString();
  const stats = getStats();
  const existingIndex = stats.findIndex(s => s.date === date);

  if (existingIndex >= 0) {
    stats[existingIndex].focusMinutes += minutesDelta;
    stats[existingIndex].tasksCompleted = Math.max(0, stats[existingIndex].tasksCompleted + tasksDelta);
    stats[existingIndex].sessionsCompleted += sessionsDelta;
  } else {
    stats.push({ 
      date, 
      focusMinutes: minutesDelta, 
      tasksCompleted: Math.max(0, tasksDelta),
      sessionsCompleted: sessionsDelta 
    });
  }
  
  // Sort by date to ensure graphs look right
  stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  saveStats(stats);
  return stats;
};

// Helper to fill in missing days for the last 7 days for the chart
export const getWeeklyStats = (): DailyStats[] => {
  const stats = getStats();
  const result: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // Using simplified ISO for loop
    // Ideally we match the timezone logic of getTodayDateString but for simple chart filling this is usually close enough
    // To be precise:
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    const localDateStr = localDate.toISOString().split('T')[0];
    
    const found = stats.find(s => s.date === localDateStr);
    
    // Format date for display (e.g., "Mon")
    // We store the full date in the object for logic, but UI might format it later
    result.push(found || { date: localDateStr, focusMinutes: 0, tasksCompleted: 0, sessionsCompleted: 0 });
  }
  return result;
};
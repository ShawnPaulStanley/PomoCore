import React from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  color: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface AmbientSound {
  id: string;
  name: string;
  icon: React.ElementType;
  volume: number; // 0-100
  isPlaying: boolean;
  type: 'noise' | 'url';
  src?: string; // For URL based
  noiseType?: 'white' | 'pink' | 'brown'; // For web audio API generation
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  tasksCompleted: number;
  sessionsCompleted: number;
}

export enum AppTheme {
  PAPER = 'paper',
  GRID = 'grid',
  POLKA = 'polka',
  STRIPES = 'stripes',
  DOODLE = 'doodle',
  GRADIENT = 'gradient',
  FOREST = 'forest',
  SUNSET = 'sunset',
  CHERRY = 'cherry',
  OCEAN = 'ocean',
  COFFEE = 'coffee',
  GALAXY = 'galaxy',
  MATCHA = 'matcha',
  CLAY = 'clay'
}
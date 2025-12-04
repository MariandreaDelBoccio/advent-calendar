export interface User {
  id: string;
  email: string;
  name: string;
  redeemedCalendars: string[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

export interface Calendar {
  id: string;
  code: string;
  redeemedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface CalendarDay {
  day: number;
  unlocked: boolean;
  completed: boolean;
  prize?: string;
  gameType: 'car' | 'snake' | 'memory' | 'puzzle';
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: number; // en minutos
}

export interface GameProgress {
  day: number;
  completed: boolean;
  score: number;
  points: number;
  completedAt: Date;
}

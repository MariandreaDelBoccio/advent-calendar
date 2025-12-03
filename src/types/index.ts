export interface User {
  id: string;
  email: string;
  name: string;
  redeemedCalendars: string[];
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
}

export interface GameProgress {
  day: number;
  completed: boolean;
  score: number;
}

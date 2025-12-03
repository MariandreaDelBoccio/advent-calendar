import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarDay, GameProgress, Achievement } from '../types';

interface GameState {
  calendarDays: CalendarDay[];
  gameProgress: GameProgress[];
  achievements: Achievement[];
  boxerLevel: number;
  initializeCalendar: () => void;
  completeDay: (day: number, prize: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateBoxerLevel: (level: number) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-calendar', title: 'Tu primer calendario', description: 'Has canjeado tu primer calendario', icon: '🎄', unlocked: false },
  { id: 'double-chance', title: 'El doble de oportunidades', description: 'Has canjeado dos calendarios', icon: '🎁', unlocked: false },
  { id: 'chocolate-lover', title: 'Chocolate lover', description: 'Canjea 5 calendarios', icon: '🍫', unlocked: false },
  { id: 'curious', title: 'Que es? Que es?', description: 'Has desvelado 2 sorteos', icon: '🔍', unlocked: false },
  { id: 'fifth-reveal', title: 'El quinto', description: 'Desvela 5 sorteos', icon: '⭐', unlocked: false },
  { id: 'all-reveals', title: 'El ansia viva', description: 'Desvela todos los sorteos', icon: '🏆', unlocked: false },
  { id: 'car-complete', title: 'A todo gas', description: 'Has completado el juego de coche', icon: '🏎️', unlocked: false },
  { id: 'boxer-novice', title: 'Pugil Novato', description: 'Completa el primer nivel de choco boxer', icon: '🥊', unlocked: false },
  { id: 'boxer-expert', title: 'Pugil experto', description: 'Llega al nivel 5 en choco boxer', icon: '👑', unlocked: false },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      calendarDays: [],
      gameProgress: [],
      achievements: ACHIEVEMENTS,
      boxerLevel: 0,

      initializeCalendar: () => {
        const days: CalendarDay[] = Array.from({ length: 24 }, (_, i) => {
          const day = i + 1;
          const currentDate = new Date();
          const currentDay = currentDate.getDate();
          const currentMonth = currentDate.getMonth();
          
          // Desbloquear días en diciembre según la fecha actual
          const unlocked = currentMonth === 11 && currentDay >= day;
          
          return {
            day,
            unlocked,
            completed: false,
            gameType: ['car', 'snake', 'memory', 'puzzle'][Math.floor(Math.random() * 4)] as any,
          };
        });
        set({ calendarDays: days });
      },

      completeDay: (day: number, prize: string) => {
        const { calendarDays, gameProgress } = get();
        const updatedDays = calendarDays.map(d =>
          d.day === day ? { ...d, completed: true, prize } : d
        );
        const updatedProgress = [...gameProgress, { day, completed: true, score: 100 }];
        set({ calendarDays: updatedDays, gameProgress: updatedProgress });
      },

      unlockAchievement: (achievementId: string) => {
        const { achievements } = get();
        const updated = achievements.map(a =>
          a.id === achievementId ? { ...a, unlocked: true } : a
        );
        set({ achievements: updated });
      },

      updateBoxerLevel: (level: number) => {
        set({ boxerLevel: level });
      },
    }),
    {
      name: 'game-storage',
    }
  )
);

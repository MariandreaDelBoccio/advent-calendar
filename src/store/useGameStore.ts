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
  unlockRandomAchievements?: () => void;
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
        const gameTypes = ['car', 'snake', 'memory', 'puzzle'] as const;
        const difficulties = ['easy', 'medium', 'hard'] as const;
        const estimatedTimes = [2, 3, 4, 5]; // minutos

        const days: CalendarDay[] = Array.from({ length: 24 }, (_, i) => {
          const day = i + 1;
          const currentDate = new Date();
          const currentDay = currentDate.getDate();
          const currentMonth = currentDate.getMonth();
          
          // Desbloquear días según la fecha actual
          // En desarrollo: desbloquear hasta el día actual del mes
          const isDevelopment = import.meta.env.DEV;
          const unlocked = isDevelopment 
            ? day <= currentDay // En desarrollo, desbloquear hasta el día actual
            : currentMonth === 11 && currentDay >= day; // En producción, solo en diciembre
          
          // Asignar dificultad progresiva
          const difficulty = day <= 8 ? 'easy' : day <= 16 ? 'medium' : 'hard';
          
          return {
            day,
            unlocked,
            completed: false,
            gameType: gameTypes[Math.floor(Math.random() * gameTypes.length)],
            difficulty,
            estimatedTime: estimatedTimes[Math.floor(Math.random() * estimatedTimes.length)],
          };
        });
        set({ calendarDays: days });
      },

      completeDay: (day: number, prize: string) => {
        const { calendarDays, gameProgress, unlockAchievement } = get();
        const updatedDays = calendarDays.map(d =>
          d.day === day ? { ...d, completed: true, prize } : d
        );
        const updatedProgress = [...gameProgress, { day, completed: true, score: 100 }];
        set({ calendarDays: updatedDays, gameProgress: updatedProgress });

        // Desbloquear logros según días completados
        const completedCount = updatedDays.filter(d => d.completed).length;
        if (completedCount >= 2) unlockAchievement('curious');
        if (completedCount >= 5) unlockAchievement('fifth-reveal');
        if (completedCount >= 24) unlockAchievement('all-reveals');

        // Desbloquear logro específico del juego de coche
        const completedDay = updatedDays.find(d => d.day === day);
        if (completedDay?.gameType === 'car') {
          unlockAchievement('car-complete');
        }
      },

      unlockAchievement: (achievementId: string) => {
        const { achievements } = get();
        const achievement = achievements.find(a => a.id === achievementId);
        
        // Solo desbloquear si no estaba desbloqueado antes
        if (achievement && !achievement.unlocked) {
          const updated = achievements.map(a =>
            a.id === achievementId ? { ...a, unlocked: true } : a
          );
          set({ achievements: updated });

          // Notificar al usuario (se importará dinámicamente para evitar dependencias circulares)
          import('../hooks/useToast').then(({ useToastStore }) => {
            useToastStore.getState().addToast({
              type: 'achievement',
              title: `¡Logro Desbloqueado! ${achievement.icon}`,
              message: achievement.title,
              duration: 7000,
            });
          });
        }
      },

      // Helper para desarrollo: desbloquear logros aleatorios
      unlockRandomAchievements: () => {
        const { achievements } = get();
        const updated = achievements.map(a => ({
          ...a,
          unlocked: Math.random() > 0.5
        }));
        set({ achievements: updated });
      },

      updateBoxerLevel: (level: number) => {
        const { unlockAchievement } = get();
        set({ boxerLevel: level });

        // Desbloquear logros según nivel de Choco Boxer
        if (level >= 1) unlockAchievement('boxer-novice');
        if (level >= 5) unlockAchievement('boxer-expert');
      },
    }),
    {
      name: 'game-storage',
    }
  )
);

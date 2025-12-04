import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  redeemCalendar: (code: string) => Promise<void>;
  addPoints: (points: number) => void;
  updateStreak: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // TODO: Implementar llamada a API
        // Por ahora simulamos el login
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          redeemedCalendars: [],
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      register: async (email: string, _password: string, name: string) => {
        // TODO: Implementar llamada a API
        const mockUser: User = {
          id: '1',
          email,
          name,
          redeemedCalendars: [],
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      redeemCalendar: async (code: string) => {
        const { user } = get();
        if (!user) throw new Error('Usuario no autenticado');
        
        // TODO: Validar código con API
        const updatedUser = {
          ...user,
          redeemedCalendars: [...user.redeemedCalendars, code],
        };
        set({ user: updatedUser });

        // Desbloquear logros según cantidad de calendarios
        const count = updatedUser.redeemedCalendars.length;
        const { useGameStore } = await import('./useGameStore');
        const { unlockAchievement } = useGameStore.getState();

        if (count >= 1) unlockAchievement('first-calendar');
        if (count >= 2) unlockAchievement('double-chance');
        if (count >= 5) unlockAchievement('chocolate-lover');
      },

      addPoints: (points: number) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            totalPoints: user.totalPoints + points,
          },
        });
      },

      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        const today = new Date().toDateString();
        const lastPlayed = user.lastPlayedDate ? new Date(user.lastPlayedDate).toDateString() : null;
        
        if (lastPlayed === today) {
          // Ya jugó hoy, no actualizar racha
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = user.currentStreak;
        
        if (lastPlayed === yesterdayStr) {
          // Jugó ayer, continuar racha
          newStreak = user.currentStreak + 1;
        } else if (lastPlayed === null || lastPlayed !== yesterdayStr) {
          // Primera vez o rompió la racha
          newStreak = 1;
        }

        const newLongestStreak = Math.max(user.longestStreak, newStreak);

        set({
          user: {
            ...user,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastPlayedDate: today,
          },
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

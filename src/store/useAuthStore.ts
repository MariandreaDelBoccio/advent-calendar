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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // TODO: Implementar llamada a API
        // Por ahora simulamos el login
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          redeemedCalendars: [],
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      register: async (email: string, password: string, name: string) => {
        // TODO: Implementar llamada a API
        const mockUser: User = {
          id: '1',
          email,
          name,
          redeemedCalendars: [],
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
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

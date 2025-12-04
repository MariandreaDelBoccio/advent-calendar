import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  darkMode: boolean;
  setHasSeenTutorial: (seen: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  resetTutorial: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      hasSeenTutorial: false,
      showTutorial: false,
      darkMode: false,

      setHasSeenTutorial: (seen: boolean) => {
        set({ hasSeenTutorial: seen, showTutorial: false });
      },

      setShowTutorial: (show: boolean) => {
        set({ showTutorial: show });
      },

      resetTutorial: () => {
        set({ hasSeenTutorial: false, showTutorial: true });
      },

      toggleDarkMode: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        // Aplicar clase al documento
        if (newMode) {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }
      },

      setDarkMode: (dark: boolean) => {
        set({ darkMode: dark });
        if (dark) {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);

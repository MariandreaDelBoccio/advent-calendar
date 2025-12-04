import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  setHasSeenTutorial: (seen: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  resetTutorial: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      showTutorial: false,

      setHasSeenTutorial: (seen: boolean) => {
        set({ hasSeenTutorial: seen, showTutorial: false });
      },

      setShowTutorial: (show: boolean) => {
        set({ showTutorial: show });
      },

      resetTutorial: () => {
        set({ hasSeenTutorial: false, showTutorial: true });
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);

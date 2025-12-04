import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useEffect } from 'react';

export const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useUIStore();

  // Aplicar modo oscuro al cargar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors p-0.5 sm:p-1 flex items-center"
      aria-label="Toggle dark mode"
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(251, 191, 36, 0.3)',
        }}
      />

      {/* Thumb */}
      <motion.div
        className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
        animate={{
          x: darkMode ? 24 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {darkMode ? (
          <Moon size={12} className="text-blue-600 sm:w-3.5 sm:h-3.5" />
        ) : (
          <Sun size={12} className="text-yellow-600 sm:w-3.5 sm:h-3.5" />
        )}
      </motion.div>
    </button>
  );
};

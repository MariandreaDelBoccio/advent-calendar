import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const SoundToggle = () => {
  const { soundEnabled, toggleSound } = useUIStore();

  return (
    <button
      onClick={toggleSound}
      className="relative w-16 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors p-1 flex items-center"
      aria-label="Toggle sound"
      title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: soundEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        }}
      />

      {/* Thumb */}
      <motion.div
        className="relative w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
        animate={{
          x: soundEnabled ? 32 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {soundEnabled ? (
          <Volume2 size={14} className="text-green-600" />
        ) : (
          <VolumeX size={14} className="text-red-600" />
        )}
      </motion.div>
    </button>
  );
};

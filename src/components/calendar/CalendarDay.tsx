import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle } from 'lucide-react';
import type { CalendarDay as CalendarDayType } from '../../types';

interface CalendarDayProps {
  day: CalendarDayType;
  onClick: () => void;
}

export const CalendarDay = ({ day, onClick }: CalendarDayProps) => {
  const getStatusIcon = () => {
    if (day.completed) return <CheckCircle className="text-green-400" size={24} />;
    if (!day.unlocked) return <Lock className="text-white/50" size={20} />;
    return <Star className="text-yellow-400 animate-pulse" size={24} />;
  };

  const getStatusColor = () => {
    if (day.completed) return 'from-green-600 to-green-700 border-green-400';
    if (!day.unlocked) return 'from-gray-600 to-gray-700 border-gray-500';
    return 'from-primary-500 to-primary-700 border-primary-300';
  };

  return (
    <motion.button
      onClick={day.unlocked ? onClick : undefined}
      disabled={!day.unlocked}
      whileHover={day.unlocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={day.unlocked ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: day.day * 0.02 }}
      className={`
        relative aspect-square rounded-2xl p-4
        bg-gradient-to-br ${getStatusColor()}
        border-2 shadow-lg
        ${day.unlocked ? 'cursor-pointer hover:shadow-2xl' : 'cursor-not-allowed opacity-60'}
        transition-all duration-300
      `}
    >
      {/* Número del día */}
      <div className="absolute top-2 left-2 text-2xl font-bold text-white/90">
        {day.day}
      </div>

      {/* Icono de estado */}
      <div className="absolute top-2 right-2">
        {getStatusIcon()}
      </div>

      {/* Emoji de chocolatina */}
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={day.unlocked && !day.completed ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-4xl"
        >
          🍫
        </motion.div>
      </div>

      {/* Brillo para días desbloqueados */}
      {day.unlocked && !day.completed && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}

      {/* Badge de completado */}
      {day.completed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold bg-green-500 px-2 py-1 rounded-full">
          ¡Completado!
        </div>
      )}
    </motion.button>
  );
};

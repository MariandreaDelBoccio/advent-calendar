import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

export const AchievementCard = ({ achievement, index }: AchievementCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={achievement.unlocked ? { scale: 1.05, y: -5 } : {}}
      className={`
        relative rounded-2xl p-6 overflow-hidden
        ${achievement.unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50' 
          : 'bg-gradient-to-br from-gray-700/30 to-gray-800/30 border-2 border-gray-600/30'
        }
        transition-all duration-300
        group
      `}
    >
      {/* Badge de desbloqueado */}
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 border-2 border-white"
        >
          ✓
        </motion.div>
      )}

      {/* Icono principal */}
      <div className="text-center mb-4">
        <motion.div
          animate={achievement.unlocked ? {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 0.5, repeat: achievement.unlocked ? Infinity : 0, repeatDelay: 3 }}
          className={`text-6xl mb-3 ${achievement.unlocked ? '' : 'grayscale opacity-40'}`}
        >
          {achievement.icon}
        </motion.div>

        {/* Lock overlay para bloqueados */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="text-gray-500" size={32} />
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className={`text-lg font-bold text-center mb-2 ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
        {achievement.title}
      </h3>

      {/* Descripción - Tooltip */}
      <div className={`
        text-sm text-center transition-all duration-300
        ${achievement.unlocked ? 'text-white/80' : 'text-gray-500'}
      `}>
        {achievement.description}
      </div>

      {/* Efecto de brillo para desbloqueados */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </motion.div>
  );
};

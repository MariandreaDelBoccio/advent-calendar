import { motion } from 'framer-motion';
import { Gift, Calendar, Trophy, Lock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';

export const PrizesPage = () => {
  const { calendarDays, gameProgress } = useGameStore();
  const { user } = useAuthStore();

  // Obtener días completados con premios
  const completedDays = calendarDays
    .filter(day => day.completed && day.prize)
    .sort((a, b) => a.day - b.day);

  const totalPrizes = completedDays.length;
  const totalDays = 24;
  const progress = Math.round((totalPrizes / totalDays) * 100);

  // Calcular puntos totales
  const totalPoints = gameProgress.reduce((sum, game) => sum + (game.points || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift size={48} className="text-pink-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-shadow">
            Premios
          </h1>
        </div>
        <p className="text-xl text-white/80 mb-6">
          Todos los premios que has revelado
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          <div className="glass-effect rounded-xl px-4 py-3 text-center">
            <Gift className="inline-block mb-1 text-pink-400" size={24} />
            <div className="text-2xl font-bold text-pink-400">{totalPrizes}</div>
            <div className="text-sm text-white/70">Premios</div>
          </div>
          <div className="glass-effect rounded-xl px-4 py-3 text-center">
            <Calendar className="inline-block mb-1 text-blue-400" size={24} />
            <div className="text-2xl font-bold text-blue-400">{totalDays - totalPrizes}</div>
            <div className="text-sm text-white/70">Pendientes</div>
          </div>
          <div className="glass-effect rounded-xl px-4 py-3 text-center">
            <Trophy className="inline-block mb-1 text-yellow-400" size={24} />
            <div className="text-2xl font-bold text-yellow-400">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-white/70">Puntos</div>
          </div>
          <div className="glass-effect rounded-xl px-4 py-3 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-orange-400">{user?.currentStreak || 0}</div>
            <div className="text-sm text-white/70">Racha</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progreso del Calendario</span>
            <span className="text-sm font-semibold text-pink-400">
              {totalPrizes}/{totalDays} ({progress}%)
            </span>
          </div>
          <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Prizes Grid */}
      {completedDays.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {completedDays.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-effect rounded-2xl p-6 border-2 border-pink-400/30 hover:border-pink-400/60 transition-all overflow-hidden relative group"
              >
                {/* Día badge */}
                <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Día {day.day}
                </div>

                {/* Icono del premio */}
                <div className="text-center mb-4">
                  <motion.div
                    animate={{
                      rotate: [0, -5, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-6xl mb-3"
                  >
                    🎁
                  </motion.div>
                </div>

                {/* Nombre del premio */}
                <h3 className="text-lg font-bold text-center mb-2 text-pink-300">
                  {day.prize}
                </h3>

                {/* Info adicional */}
                <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Día {day.day}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={14} />
                    {gameProgress.find(g => g.day === day.day)?.points || 0} pts
                  </span>
                </div>

                {/* Efecto de brillo */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-pink-400/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Mensaje motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-2xl p-6 text-center"
          >
            {progress === 100 ? (
              <>
                <Trophy className="inline-block mb-3 text-yellow-400" size={48} />
                <h3 className="text-2xl font-bold mb-2 text-yellow-400">
                  ¡Calendario Completo! 🎉
                </h3>
                <p className="text-white/80">
                  Has revelado todos los premios del calendario. ¡Increíble trabajo!
                </p>
              </>
            ) : progress >= 50 ? (
              <>
                <Gift className="inline-block mb-3 text-pink-400" size={48} />
                <h3 className="text-2xl font-bold mb-2">¡Más de la mitad! 🌟</h3>
                <p className="text-white/80">
                  Ya has revelado {totalPrizes} premios. ¡Sigue jugando para descubrir más!
                </p>
              </>
            ) : (
              <>
                <Gift className="inline-block mb-3 text-pink-400" size={48} />
                <h3 className="text-2xl font-bold mb-2">¡Sigue coleccionando! 🎁</h3>
                <p className="text-white/80">
                  Has revelado {totalPrizes} {totalPrizes === 1 ? 'premio' : 'premios'}. ¡Completa más días para descubrir todos los premios!
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-12 text-center max-w-2xl mx-auto"
        >
          <Lock className="inline-block mb-4 text-gray-400" size={64} />
          <h3 className="text-2xl font-bold mb-3">Aún no has revelado premios</h3>
          <p className="text-white/70 mb-6">
            Completa los días del calendario para descubrir increíbles premios
          </p>
          <a
            href="/calendar"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg font-semibold transition-colors"
          >
            Ir al Calendario
          </a>
        </motion.div>
      )}
    </div>
  );
};

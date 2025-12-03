import { motion } from 'framer-motion';
import { Trophy, Star, Lock, TestTube } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { AchievementCard } from '../components/achievements/AchievementCard';

export const AchievementsPage = () => {
  const { achievements } = useGameStore();
  const { redeemCalendar } = useAuthStore();

  // Función de prueba para desarrollo
  const handleTestCalendar = async () => {
    const testCode = `TEST-${Date.now()}`;
    try {
      await redeemCalendar(testCode);
      alert('¡Calendario de prueba canjeado! Revisa tus logros.');
    } catch (error) {
      console.error(error);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={48} className="text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-shadow">
            Mis Logros
          </h1>
        </div>
        <p className="text-xl text-white/80 mb-6">
          Desbloquea todos los logros completando desafíos
        </p>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progreso Total</span>
            <span className="text-sm font-semibold text-yellow-400">
              {unlockedCount}/{totalCount} ({progress}%)
            </span>
          </div>
          <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="glass-effect rounded-xl px-6 py-3">
            <Star className="inline-block mb-1 text-yellow-400" size={24} />
            <div className="text-2xl font-bold text-yellow-400">{unlockedCount}</div>
            <div className="text-sm text-white/70">Desbloqueados</div>
          </div>
          <div className="glass-effect rounded-xl px-6 py-3">
            <Lock className="inline-block mb-1 text-gray-400" size={24} />
            <div className="text-2xl font-bold text-gray-400">{totalCount - unlockedCount}</div>
            <div className="text-sm text-white/70">Bloqueados</div>
          </div>
          <div className="glass-effect rounded-xl px-6 py-3">
            <Trophy className="inline-block mb-1 text-primary-300" size={24} />
            <div className="text-2xl font-bold text-primary-300">{totalCount}</div>
            <div className="text-sm text-white/70">Total</div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>

        {/* Botón de prueba (solo en desarrollo) */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 text-center"
          >
            <button
              onClick={handleTestCalendar}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <TestTube size={16} />
              Canjear Calendario de Prueba
            </button>
          </motion.div>
        )}

        {/* Motivational Message */}
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
                ¡Eres un Maestro del Chocolate! 🎉
              </h3>
              <p className="text-white/80">
                Has desbloqueado todos los logros. ¡Increíble trabajo!
              </p>
            </>
          ) : progress >= 50 ? (
            <>
              <Star className="inline-block mb-3 text-yellow-400" size={48} />
              <h3 className="text-2xl font-bold mb-2">¡Vas por buen camino! 🌟</h3>
              <p className="text-white/80">
                Ya has desbloqueado más de la mitad de los logros. ¡Sigue así!
              </p>
            </>
          ) : unlockedCount > 0 ? (
            <>
              <Trophy className="inline-block mb-3 text-primary-300" size={48} />
              <h3 className="text-2xl font-bold mb-2">¡Buen comienzo! 🚀</h3>
              <p className="text-white/80">
                Has desbloqueado {unlockedCount} {unlockedCount === 1 ? 'logro' : 'logros'}. ¡Continúa jugando para desbloquear más!
              </p>
            </>
          ) : (
            <>
              <Lock className="inline-block mb-3 text-gray-400" size={48} />
              <h3 className="text-2xl font-bold mb-2">¡Empieza tu aventura! 🎮</h3>
              <p className="text-white/80">
                Completa desafíos del calendario y juega para desbloquear logros increíbles.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { User, Mail, Calendar, Trophy, Gift, Star } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { calendarDays, achievements } = useGameStore();

  if (!user) return null;

  const completedDays = calendarDays.filter(d => d.completed).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const calendarsCount = user.redeemedCalendars.length;

  const stats = [
    { icon: Star, label: 'Puntos Totales', value: user.totalPoints.toLocaleString(), color: 'text-yellow-400' },
    { icon: Calendar, label: 'Días Completados', value: `${completedDays}/24`, color: 'text-green-400' },
    { icon: Trophy, label: 'Logros Desbloqueados', value: `${unlockedAchievements}/9`, color: 'text-yellow-400' },
    { icon: Gift, label: 'Racha Actual', value: `${user.currentStreak} 🔥`, color: 'text-orange-400' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl"
        >
          {user.name.charAt(0).toUpperCase()}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-shadow mb-2">
          {user.name}
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Mail size={16} />
          <p>{user.email}</p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-effect rounded-xl p-6 text-center hover:bg-white/15 transition-colors"
            >
              <stat.icon className={`inline-block mb-3 ${stat.color}`} size={32} />
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Streak Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            Racha de Días
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                {user.currentStreak}
              </div>
              <div className="text-sm text-white/70">Racha Actual</div>
              <p className="text-xs text-white/50 mt-2">
                {user.currentStreak > 0 ? '¡Sigue así!' : 'Juega hoy para comenzar'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {user.longestStreak}
              </div>
              <div className="text-sm text-white/70">Mejor Racha</div>
              <p className="text-xs text-white/50 mt-2">
                {user.longestStreak > 0 ? 'Tu récord personal' : 'Aún no tienes récord'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            Tu Progreso
          </h2>

          <div className="space-y-6">
            {/* Calendario Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Calendario de Adviento</span>
                <span className="text-sm text-green-400">
                  {Math.round((completedDays / 24) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedDays / 24) * 100}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                />
              </div>
            </div>

            {/* Logros Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Logros</span>
                <span className="text-sm text-yellow-400">
                  {Math.round((unlockedAchievements / 9) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedAchievements / 9) * 100}%` }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Star className="text-primary-300" size={28} />
            Actividad Reciente
          </h2>

          {completedDays === 0 && unlockedAchievements === 0 && calendarsCount === 0 ? (
            <div className="text-center py-8">
              <User className="inline-block mb-4 text-white/30" size={64} />
              <p className="text-white/60 mb-2">Aún no tienes actividad</p>
              <p className="text-sm text-white/40">
                Empieza a jugar para ver tu progreso aquí
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {calendarsCount > 0 && (
                <div className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Calendarios Canjeados</p>
                    <p className="text-sm text-white/60">
                      {calendarsCount} {calendarsCount === 1 ? 'calendario' : 'calendarios'}
                    </p>
                  </div>
                </div>
              )}

              {completedDays > 0 && (
                <div className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Días Completados</p>
                    <p className="text-sm text-white/60">
                      {completedDays} de 24 días
                    </p>
                  </div>
                </div>
              )}

              {unlockedAchievements > 0 && (
                <div className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Logros Desbloqueados</p>
                    <p className="text-sm text-white/60">
                      {unlockedAchievements} de 9 logros
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

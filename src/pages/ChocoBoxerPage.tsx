import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { ChocoBoxerGame } from '../components/games/ChocoBoxerGame';

export const ChocoBoxerPage = () => {
  const { boxerLevel } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const levels = [
    { level: 1, name: 'Principiante', unlocked: true, emoji: '🍪' },
    { level: 2, name: 'Intermedio', unlocked: boxerLevel >= 1, emoji: '🍦' },
    { level: 3, name: 'Avanzado', unlocked: boxerLevel >= 2, emoji: '🍫' },
    { level: 4, name: 'Experto', unlocked: boxerLevel >= 3, emoji: '🥐' },
    { level: 5, name: 'Maestro', unlocked: boxerLevel >= 4, emoji: '👑' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-8xl mb-4">🥊</div>
        <h1 className="text-4xl md:text-5xl font-bold text-shadow mb-4">
          Choco Boxer
        </h1>
        <p className="text-xl text-white/80 mb-6">
          Derrota enemigos dulces con tu guante de chocolate
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="glass-effect rounded-xl px-6 py-3">
            <Trophy className="inline-block mb-1 text-yellow-400" size={24} />
            <div className="text-2xl font-bold text-yellow-400">{boxerLevel || 0}</div>
            <div className="text-sm text-white/70">Nivel Máximo</div>
          </div>
          <div className="glass-effect rounded-xl px-6 py-3">
            <Star className="inline-block mb-1 text-primary-300" size={24} />
            <div className="text-2xl font-bold text-primary-300">
              {levels.filter(l => l.unlocked).length}/5
            </div>
            <div className="text-sm text-white/70">Niveles Desbloqueados</div>
          </div>
        </div>
      </motion.div>

      {/* Levels Grid */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {levels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`
                glass-effect rounded-2xl p-6 text-center
                ${level.unlocked ? 'cursor-pointer hover:bg-white/20' : 'opacity-60'}
                transition-all
              `}
            >
              <div className="text-6xl mb-4">{level.emoji}</div>
              <h3 className="text-xl font-bold mb-2">Nivel {level.level}</h3>
              <p className="text-white/70 mb-4">{level.name}</p>
              
              {level.unlocked ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Star size={16} />
                  <span className="text-sm font-semibold">Desbloqueado</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Lock size={16} />
                  <span className="text-sm">Completa nivel {level.level - 1}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setIsPlaying(true)}
            className="px-12 py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl"
          >
            🥊 ¡JUGAR AHORA!
          </button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">📖 Cómo jugar:</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🥊</span>
              <div>
                <p className="font-semibold">Ataca a los enemigos</p>
                <p className="text-sm text-white/60">Haz click en ATACAR para golpear</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-semibold">Cuida tu salud</p>
                <p className="text-sm text-white/60">Los enemigos contraatacan después de cada golpe</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-semibold">Completa niveles</p>
                <p className="text-sm text-white/60">Derrota 4-5 enemigos por nivel para avanzar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <p className="font-semibold">Conviértete en campeón</p>
                <p className="text-sm text-white/60">Completa los 5 niveles para ser el maestro</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Game Modal */}
      {isPlaying && <ChocoBoxerGame onClose={() => setIsPlaying(false)} />}
    </div>
  );
};

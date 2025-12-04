import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Gamepad2 } from 'lucide-react';
import type { CalendarDay } from '../../types';

interface DayModalProps {
  day: CalendarDay | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayGame: () => void;
}

export const DayModal = ({ day, isOpen, onClose, onPlayGame }: DayModalProps) => {
  if (!day) return null;

  const getGameName = (gameType: string) => {
    const games = {
      car: '🏎️ Carrera Loca',
      snake: '🐍 Snake Chocolate',
      memory: '🃏 Memoria Dulce',
      puzzle: '🧩 Puzzle de Chocolatinas',
      target: '🎯 Práctica de Puntería',
      simon: '⚡ Simon Dice',
    };
    return games[gameType as keyof typeof games] || 'Juego';
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-effect rounded-3xl p-8 max-w-md w-full relative">
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              {/* Contenido */}
              <div className="text-center">
                {/* Número del día */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-6xl font-bold mb-4 text-primary-300"
                >
                  Día {day.day}
                </motion.div>

                {/* Emoji grande */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-8xl mb-6"
                >
                  🍫
                </motion.div>

                {day.completed ? (
                  // Ya completado
                  <>
                    <div className="mb-6">
                      <Trophy className="inline-block text-yellow-400 mb-2" size={48} />
                      <h3 className="text-2xl font-bold mb-2">¡Ya completado!</h3>
                      <p className="text-white/70 mb-4">
                        Ya descubriste el premio de este día
                      </p>
                      {day.prize && (
                        <div className="glass-effect rounded-xl p-4 mb-4">
                          <p className="text-sm text-white/60 mb-1">Tu premio:</p>
                          <p className="text-xl font-bold text-yellow-300">{day.prize}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={onPlayGame}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors mb-2"
                    >
                      Jugar de nuevo
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                ) : (
                  // Nuevo desafío
                  <>
                    <h3 className="text-2xl font-bold mb-2">¡Nuevo Desafío!</h3>
                    <p className="text-white/70 mb-6">
                      Completa el juego para descubrir tu premio
                    </p>

                    <div className="glass-effect rounded-xl p-4 mb-6">
                      <Gamepad2 className="inline-block mb-2" size={32} />
                      <p className="text-lg font-semibold mb-3">
                        {getGameName(day.gameType)}
                      </p>
                      <div className="flex justify-center gap-4 text-sm">
                        {day.difficulty && (
                          <div className="flex items-center gap-1">
                            <span className="text-white/60">Dificultad:</span>
                            <span className={`font-semibold ${getDifficultyColor(day.difficulty)}`}>
                              {getDifficultyText(day.difficulty)}
                            </span>
                          </div>
                        )}
                        {day.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <span className="text-white/60">Tiempo:</span>
                            <span className="font-semibold text-blue-400">
                              ~{day.estimatedTime} min
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={onPlayGame}
                      className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg font-bold text-lg transition-all transform hover:scale-105 mb-2"
                    >
                      ¡Jugar Ahora! 🎮
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                      Más tarde
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

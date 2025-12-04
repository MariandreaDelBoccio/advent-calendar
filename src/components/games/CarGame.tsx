import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, RotateCcw } from 'lucide-react';
import { useVictoryEffects } from '../../hooks/useVictoryEffects';

interface CarGameProps {
  onComplete: (prize: string) => void;
  onClose: () => void;
  dayNumber: number;
}

interface Position {
  lane: number; // 0, 1, 2 (izquierda, centro, derecha)
  y: number;
}

interface Obstacle extends Position {
  id: number;
}

interface Gem extends Position {
  id: number;
  collected: boolean;
}

const LANES = [0, 1, 2];
const LANE_WIDTH = 33.33; // porcentaje
const GAME_HEIGHT = 500;
const CAR_SIZE = 60;
const OBSTACLE_SIZE = 50;
const GEM_SIZE = 30;
const SPEED = 3;
const GEMS_TO_WIN = 7;

export const CarGame = ({ onComplete, onClose, dayNumber }: CarGameProps) => {
  const { triggerConfettiCannon, playVictorySound, playDefeatSound, playCollectSound } = useVictoryEffects();
  const [carLane, setCarLane] = useState(1); // Empieza en el centro
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gems, setGems] = useState<Gem[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [obstacleIdCounter, setObstacleIdCounter] = useState(0);
  const [gemIdCounter, setGemIdCounter] = useState(0);

  // Mover el coche
  const moveCar = useCallback((direction: 'left' | 'right') => {
    setCarLane((prev) => {
      if (direction === 'left' && prev > 0) return prev - 1;
      if (direction === 'right' && prev < 2) return prev + 1;
      return prev;
    });
  }, []);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveCar('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveCar('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveCar, gameOver, gameWon]);

  // Generar obstáculos y gemas
  useEffect(() => {
    if (gameOver || gameWon) return;

    const interval = setInterval(() => {
      // Generar obstáculo
      if (Math.random() > 0.5) {
        setObstacles((prev) => [
          ...prev,
          {
            id: obstacleIdCounter,
            lane: Math.floor(Math.random() * 3),
            y: -OBSTACLE_SIZE,
          },
        ]);
        setObstacleIdCounter((prev) => prev + 1);
      }

      // Generar gema
      if (Math.random() > 0.7 && score < GEMS_TO_WIN) {
        setGems((prev) => [
          ...prev,
          {
            id: gemIdCounter,
            lane: Math.floor(Math.random() * 3),
            y: -GEM_SIZE,
            collected: false,
          },
        ]);
        setGemIdCounter((prev) => prev + 1);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [gameOver, gameWon, obstacleIdCounter, gemIdCounter, score]);

  // Mover obstáculos y gemas
  useEffect(() => {
    if (gameOver || gameWon) return;

    const interval = setInterval(() => {
      // Mover obstáculos
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + SPEED }))
          .filter((obs) => obs.y < GAME_HEIGHT + OBSTACLE_SIZE)
      );

      // Mover gemas
      setGems((prev) =>
        prev
          .map((gem) => ({ ...gem, y: gem.y + SPEED }))
          .filter((gem) => gem.y < GAME_HEIGHT + GEM_SIZE)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [gameOver, gameWon]);

  // Detectar colisiones
  useEffect(() => {
    if (gameOver || gameWon) return;

    const carY = GAME_HEIGHT - 100;

    // Colisión con obstáculos
    obstacles.forEach((obs) => {
      if (
        obs.lane === carLane &&
        obs.y > carY - OBSTACLE_SIZE &&
        obs.y < carY + CAR_SIZE
      ) {
        setGameOver(true);
        playDefeatSound();
      }
    });

    // Colisión con gemas
    gems.forEach((gem) => {
      if (
        !gem.collected &&
        gem.lane === carLane &&
        gem.y > carY - GEM_SIZE &&
        gem.y < carY + CAR_SIZE
      ) {
        setGems((prev) =>
          prev.map((g) => (g.id === gem.id ? { ...g, collected: true } : g))
        );
        setScore((prev) => prev + 1);
        playCollectSound();
      }
    });
  }, [obstacles, gems, carLane, gameOver, gameWon]);

  // Verificar victoria
  useEffect(() => {
    if (score >= GEMS_TO_WIN && !gameWon) {
      setGameWon(true);
      playVictorySound();
      triggerConfettiCannon();
      const prizes = [
        '🎁 Descuento 20% en tu próxima compra',
        '🍫 Chocolatina Premium Gratis',
        '🎉 Entrada para sorteo especial',
        '⭐ 100 puntos bonus',
        '🎊 Pack de chocolates exclusivo',
      ];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setTimeout(() => onComplete(prize), 1500);
    }
  }, [score, gameWon, onComplete, playVictorySound, triggerConfettiCannon]);

  const resetGame = () => {
    setCarLane(1);
    setObstacles([]);
    setGems([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setObstacleIdCounter(0);
    setGemIdCounter(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-effect rounded-2xl p-6 max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">🏎️ Carrera Loca</h2>
            <p className="text-sm text-white/70">Día {dayNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Score */}
        <div className="flex justify-between mb-4">
          <div className="glass-effect rounded-lg px-4 py-2">
            <span className="text-sm text-white/70">Gemas:</span>
            <span className="ml-2 text-xl font-bold text-yellow-400">
              {score}/{GEMS_TO_WIN}
            </span>
          </div>
          <div className="text-2xl">
            {'💎'.repeat(Math.min(score, GEMS_TO_WIN))}
          </div>
        </div>

        {/* Game Area */}
        <div
          className="relative bg-gray-900 rounded-xl overflow-hidden mb-4"
          style={{ height: GAME_HEIGHT }}
        >
          {/* Carriles */}
          <div className="absolute inset-0 flex">
            {LANES.map((lane) => (
              <div
                key={lane}
                className="flex-1 border-r border-white/10 last:border-r-0"
              />
            ))}
          </div>

          {/* Líneas de carretera animadas */}
          <div className="absolute inset-0 flex">
            {LANES.map((lane) => (
              <div key={lane} className="flex-1 relative">
                <motion.div
                  animate={{ y: [0, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-20 bg-white/30"
                  style={{ top: -20 }}
                />
                <motion.div
                  animate={{ y: [0, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-20 bg-white/30"
                  style={{ top: -70 }}
                />
              </div>
            ))}
          </div>

          {/* Obstáculos */}
          <AnimatePresence>
            {obstacles.map((obs) => (
              <motion.div
                key={obs.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute text-4xl"
                style={{
                  left: `${obs.lane * LANE_WIDTH + LANE_WIDTH / 2}%`,
                  top: obs.y,
                  transform: 'translateX(-50%)',
                }}
              >
                🚗
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Gemas */}
          <AnimatePresence>
            {gems
              .filter((gem) => !gem.collected)
              .map((gem) => (
                <motion.div
                  key={gem.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute text-2xl"
                  style={{
                    left: `${gem.lane * LANE_WIDTH + LANE_WIDTH / 2}%`,
                    top: gem.y,
                    transform: 'translateX(-50%)',
                  }}
                >
                  💎
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Coche del jugador */}
          <motion.div
            animate={{ left: `${carLane * LANE_WIDTH + LANE_WIDTH / 2}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute text-5xl"
            style={{
              bottom: 100,
              transform: 'translateX(-50%)',
            }}
          >
            🏎️
          </motion.div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">💥</div>
                  <h3 className="text-3xl font-bold mb-2">¡Choque!</h3>
                  <p className="text-white/70 mb-4">
                    Gemas recolectadas: {score}/{GEMS_TO_WIN}
                  </p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Intentar de nuevo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Victory Overlay */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl mb-4"
                  >
                    <Trophy className="inline-block text-yellow-400" size={64} />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2">¡Victoria! 🎉</h3>
                  <p className="text-white/90 mb-2">
                    ¡Recolectaste todas las gemas!
                  </p>
                  <p className="text-sm text-white/70">Revelando tu premio...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => moveCar('left')}
              disabled={gameOver || gameWon}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ← Izquierda
            </button>
            <button
              onClick={() => moveCar('right')}
              disabled={gameOver || gameWon}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Derecha →
            </button>
          </div>
          <p className="text-xs text-center text-white/60">
            También puedes usar las flechas del teclado o A/D
          </p>
        </div>
      </motion.div>
    </div>
  );
};

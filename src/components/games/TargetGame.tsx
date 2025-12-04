import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import { useVictoryEffects } from '../../hooks/useVictoryEffects';

interface TargetGameProps {
  onWin: () => void;
  onLose: () => void;
}

interface TargetType {
  id: number;
  x: number;
  y: number;
  size: number;
  points: number;
}

export const TargetGame = ({ onWin, onLose }: TargetGameProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [hits, setHits] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { playCollectSound, playVictorySound, playDefeatSound } = useVictoryEffects();

  const TARGET_GOAL = 15; // Necesita 15 aciertos para ganar

  // Generar nuevo target
  const spawnTarget = () => {
    if (!gameAreaRef.current) return;
    
    const area = gameAreaRef.current.getBoundingClientRect();
    const size = Math.random() * 40 + 30; // 30-70px
    const points = Math.round(100 / size); // Más pequeño = más puntos
    
    const newTarget: TargetType = {
      id: Date.now(),
      x: Math.random() * (area.width - size),
      y: Math.random() * (area.height - size),
      size,
      points,
    };
    
    setTargets(prev => [...prev, newTarget]);
    
    // Remover target después de 2 segundos
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  };

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setHits(0);
    setTimeLeft(30);
    setTargets([]);
  };

  // Timer
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (hits >= TARGET_GOAL) {
            playVictorySound();
            onWin();
          } else {
            playDefeatSound();
            onLose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, hits, onWin, onLose, playVictorySound, playDefeatSound]);

  // Spawn targets
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      spawnTarget();
    }, 800);

    return () => clearInterval(interval);
  }, [gameStarted]);

  // Verificar victoria
  useEffect(() => {
    if (hits >= TARGET_GOAL && gameStarted) {
      playVictorySound();
      onWin();
    }
  }, [hits, gameStarted, onWin, playVictorySound]);

  const handleTargetClick = (target: TargetType) => {
    playCollectSound();
    setScore(prev => prev + target.points);
    setHits(prev => prev + 1);
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-red-500" size={24} />
          <h3 className="text-xl font-bold">Práctica de Puntería</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{hits}/{TARGET_GOAL}</div>
            <div className="text-xs text-white/60">Aciertos</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
              {timeLeft}s
            </div>
            <div className="text-xs text-white/60">Tiempo</div>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Puntuación</span>
          <span className="text-sm font-semibold text-yellow-400">{score} pts</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(hits / TARGET_GOAL) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden cursor-crosshair"
        style={{ minHeight: '400px' }}
      >
        {!gameStarted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-xl"
            >
              🎯 Comenzar
            </motion.button>
          </div>
        ) : (
          <>
            {/* Targets */}
            <AnimatePresence>
              {targets.map(target => (
                <motion.button
                  key={target.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleTargetClick(target)}
                  className="absolute rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-4 border-white shadow-lg flex items-center justify-center font-bold text-white"
                  style={{
                    left: target.x,
                    top: target.y,
                    width: target.size,
                    height: target.size,
                  }}
                >
                  <span className="text-xs">+{target.points}</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-8 h-8">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-white/60">
        Haz click en los objetivos antes de que desaparezcan • Objetivos más pequeños = más puntos
      </div>
    </div>
  );
};

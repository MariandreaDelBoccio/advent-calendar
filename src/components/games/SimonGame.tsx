import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useVictoryEffects } from '../../hooks/useVictoryEffects';

interface SimonGameProps {
  onWin: () => void;
  onLose: () => void;
}

const COLORS = [
  { id: 0, name: 'Rojo', color: 'bg-red-500', activeColor: 'bg-red-300' },
  { id: 1, name: 'Azul', color: 'bg-blue-500', activeColor: 'bg-blue-300' },
  { id: 2, name: 'Verde', color: 'bg-green-500', activeColor: 'bg-green-300' },
  { id: 3, name: 'Amarillo', color: 'bg-yellow-500', activeColor: 'bg-yellow-300' },
];

export const SimonGame = ({ onWin, onLose }: SimonGameProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const { playClickSound, playVictorySound, playDefeatSound, playCollectSound } = useVictoryEffects();

  const WIN_LEVEL = 8; // Necesita llegar al nivel 8 para ganar

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
    addToSequence();
  };

  // Agregar nuevo color a la secuencia
  const addToSequence = () => {
    const newColor = Math.floor(Math.random() * 4);
    setSequence(prev => [...prev, newColor]);
  };

  // Reproducir secuencia
  useEffect(() => {
    if (sequence.length === 0 || !gameStarted) return;

    setIsPlaying(true);
    setUserSequence([]);

    let index = 0;
    const interval = setInterval(() => {
      if (index < sequence.length) {
        playClickSound();
        setActiveButton(sequence[index]);
        setTimeout(() => setActiveButton(null), 400);
        index++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [sequence, gameStarted, playClickSound]);

  // Manejar click del usuario
  const handleButtonClick = (colorId: number) => {
    if (isPlaying) return;

    playCollectSound();
    setActiveButton(colorId);
    setTimeout(() => setActiveButton(null), 200);

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Verificar si es correcto
    if (colorId !== sequence[newUserSequence.length - 1]) {
      // Error
      playDefeatSound();
      onLose();
      return;
    }

    // Verificar si completó la secuencia
    if (newUserSequence.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);

      if (nextLevel > WIN_LEVEL) {
        // Victoria
        playVictorySound();
        onWin();
      } else {
        // Siguiente nivel
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-500" size={24} />
          <h3 className="text-xl font-bold">Simon Dice</h3>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">Nivel {level}</div>
          <div className="text-xs text-white/60">{level}/{WIN_LEVEL}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(level / WIN_LEVEL) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        {!gameStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-bold text-xl"
          >
            ⚡ Comenzar
          </motion.button>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {COLORS.map(color => (
              <motion.button
                key={color.id}
                whileHover={!isPlaying ? { scale: 1.05 } : {}}
                whileTap={!isPlaying ? { scale: 0.95 } : {}}
                onClick={() => handleButtonClick(color.id)}
                disabled={isPlaying}
                className={`
                  aspect-square rounded-2xl transition-all duration-200
                  ${activeButton === color.id ? color.activeColor : color.color}
                  ${isPlaying ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-2xl'}
                  disabled:cursor-not-allowed
                  flex items-center justify-center font-bold text-white text-xl
                `}
              >
                {color.name}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-4 text-center">
        {isPlaying ? (
          <div className="text-yellow-400 font-semibold animate-pulse">
            👀 Observa la secuencia...
          </div>
        ) : gameStarted ? (
          <div className="text-green-400 font-semibold">
            ✨ Tu turno - Repite la secuencia ({userSequence.length}/{sequence.length})
          </div>
        ) : null}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-white/60">
        Memoriza y repite la secuencia de colores • Llega al nivel {WIN_LEVEL} para ganar
      </div>
    </div>
  );
};

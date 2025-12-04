import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Shuffle } from 'lucide-react';

interface PuzzleGameProps {
  onComplete: (prize: string) => void;
  onClose: () => void;
  dayNumber: number;
}

const GRID_SIZE = 3; // 3x3 puzzle
const TILE_EMOJIS = ['🍫', '🎄', '⭐', '🎁', '🔔', '❄️', '🕯️', '🎅', ''];

export const PuzzleGame = ({ onComplete, onClose, dayNumber }: PuzzleGameProps) => {
  const [tiles, setTiles] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Inicializar el juego
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Crear puzzle ordenado
    const orderedTiles = [...TILE_EMOJIS];
    
    // Mezclar el puzzle
    const shuffled = shufflePuzzle(orderedTiles);
    setTiles(shuffled);
    setMoves(0);
    setGameWon(false);
  };

  const shufflePuzzle = (tiles: string[]): string[] => {
    const shuffled = [...tiles];
    // Hacer movimientos aleatorios válidos para asegurar que sea resoluble
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf('');
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    return shuffled;
  };

  const getValidMoves = (emptyIndex: number): number[] => {
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;
    const moves: number[] = [];

    // Arriba
    if (row > 0) moves.push(emptyIndex - GRID_SIZE);
    // Abajo
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
    // Izquierda
    if (col > 0) moves.push(emptyIndex - 1);
    // Derecha
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);

    return moves;
  };

  const handleTileClick = (index: number) => {
    if (gameWon || isShuffling) return;

    const emptyIndex = tiles.indexOf('');
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    const shuffled = shufflePuzzle(tiles);
    setTiles(shuffled);
    setMoves(0);
    setTimeout(() => setIsShuffling(false), 500);
  };

  // Verificar si el puzzle está resuelto
  useEffect(() => {
    if (moves === 0) return;

    const isSolved = tiles.every((tile, index) => tile === TILE_EMOJIS[index]);
    
    if (isSolved && !gameWon) {
      setGameWon(true);
      const prizes = [
        '🎁 Descuento 35% en tu compra',
        '🍫 Mega pack de chocolates',
        '🎉 Entrada triple para sorteo',
        '⭐ 250 puntos bonus',
        '🎊 Colección completa de chocolates',
      ];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setTimeout(() => onComplete(prize), 1500);
    }
  }, [tiles, moves, gameWon, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-effect rounded-2xl p-6 max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">🧩 Puzzle de Chocolatinas</h2>
            <p className="text-sm text-white/70">Día {dayNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="glass-effect rounded-lg px-6 py-2">
            <span className="text-sm text-white/70">Movimientos:</span>
            <span className="ml-2 text-2xl font-bold text-blue-400">{moves}</span>
          </div>
          <button
            onClick={handleShuffle}
            disabled={isShuffling || gameWon}
            className="px-4 py-2 bg-yellow-600/50 hover:bg-yellow-600/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            <Shuffle size={18} />
            Mezclar
          </button>
        </div>

        {/* Puzzle Grid */}
        <div className="relative mb-4">
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 mx-auto"
            style={{ width: 'fit-content' }}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: GRID_SIZE * 90,
              }}
            >
              {tiles.map((tile, index) => {
                const isEmpty = tile === '';

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    disabled={isEmpty || gameWon}
                    layout
                    whileHover={!isEmpty && !gameWon ? { scale: 1.05 } : {}}
                    whileTap={!isEmpty && !gameWon ? { scale: 0.95 } : {}}
                    className={`
                      relative rounded-lg transition-all
                      ${
                        isEmpty
                          ? 'bg-gray-800/50 cursor-default'
                          : 'bg-gradient-to-br from-primary-600 to-primary-800 border-2 border-primary-400 cursor-pointer hover:border-primary-300'
                      }
                    `}
                    style={{
                      width: 86,
                      height: 86,
                    }}
                  >
                    {!isEmpty && (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-5xl">{tile}</span>
                      </div>
                    )}

                    {/* Número de posición (ayuda visual) */}
                    {!isEmpty && (
                      <div className="absolute top-1 left-1 text-xs text-white/30 font-bold">
                        {index + 1}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Victory Overlay */}
            <AnimatePresence>
              {gameWon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="text-6xl mb-4"
                    >
                      <Trophy className="inline-block text-yellow-400" size={64} />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-2">¡Resuelto! 🎉</h3>
                    <p className="text-white/90 mb-2">
                      ¡Completaste el puzzle!
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      Movimientos: {moves}
                    </p>
                    <p className="text-sm text-white/70">Revelando tu premio...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Solution Preview */}
        <div className="glass-effect rounded-xl p-4 mb-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <span>🎯</span>
            <span>Solución:</span>
          </h3>
          <div
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: GRID_SIZE * 30,
            }}
          >
            {TILE_EMOJIS.map((emoji, index) => (
              <div
                key={index}
                className={`
                  w-7 h-7 rounded flex items-center justify-center text-sm
                  ${emoji === '' ? 'bg-gray-700/30' : 'bg-primary-600/30'}
                `}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-effect rounded-xl p-4">
          <h3 className="font-bold mb-2 text-sm">📖 Cómo jugar:</h3>
          <ul className="text-xs text-white/80 space-y-1">
            <li>• Haz click en las piezas adyacentes al espacio vacío</li>
            <li>• Ordena todas las piezas según la solución mostrada</li>
            <li>• Intenta resolverlo en la menor cantidad de movimientos</li>
            <li>• Usa el botón "Mezclar" si quieres empezar de nuevo</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

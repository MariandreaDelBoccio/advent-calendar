import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onComplete: (prize: string) => void;
  onClose: () => void;
  dayNumber: number;
}

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 15;
const CELL_SIZE = 25;
const INITIAL_SPEED = 150;
const CHOCOLATES_TO_WIN = 10;

export const SnakeGame = ({ onComplete, onClose, dayNumber }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [chocolate, setChocolate] = useState<Position>({ x: 10, y: 7 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Generar posición aleatoria para el chocolate
  const generateChocolate = useCallback((snakeBody: Position[]) => {
    let newPos: Position;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some((segment) => segment.x === newPos.x && segment.y === newPos.y)
    );
    return newPos;
  }, []);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || gameWon || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, gameWon, isPaused]);

  // Game loop
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;

    const gameLoop = setInterval(() => {
      setDirection(nextDirection);

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Position;

        // Calcular nueva posición de la cabeza
        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Verificar colisión con paredes
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Verificar colisión con el cuerpo
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Verificar si comió chocolate
        if (newHead.x === chocolate.x && newHead.y === chocolate.y) {
          setScore((prev) => prev + 1);
          setChocolate(generateChocolate(newSnake));
          // Aumentar velocidad gradualmente
          setSpeed((prev) => Math.max(80, prev - 5));
          return newSnake; // La serpiente crece
        }

        // Remover la cola si no comió
        newSnake.pop();
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [nextDirection, chocolate, gameOver, gameWon, isPaused, speed, generateChocolate]);

  // Verificar victoria
  useEffect(() => {
    if (score >= CHOCOLATES_TO_WIN && !gameWon) {
      setGameWon(true);
      const prizes = [
        '🎁 Cupón de descuento 25%',
        '🍫 Caja de chocolates premium',
        '🎉 Participación en sorteo VIP',
        '⭐ 150 puntos bonus',
        '🎊 Set de chocolates exclusivos',
      ];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setTimeout(() => onComplete(prize), 1500);
    }
  }, [score, gameWon, onComplete]);

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setChocolate({ x: 10, y: 7 });
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const handleDirectionClick = (newDirection: Direction) => {
    if (gameOver || gameWon || isPaused) return;
    
    if (
      (newDirection === 'UP' && direction !== 'DOWN') ||
      (newDirection === 'DOWN' && direction !== 'UP') ||
      (newDirection === 'LEFT' && direction !== 'RIGHT') ||
      (newDirection === 'RIGHT' && direction !== 'LEFT')
    ) {
      setNextDirection(newDirection);
    }
  };

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
            <h2 className="text-2xl font-bold">🐍 Snake Chocolate</h2>
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
        <div className="flex justify-between items-center mb-4">
          <div className="glass-effect rounded-lg px-4 py-2">
            <span className="text-sm text-white/70">Chocolates:</span>
            <span className="ml-2 text-xl font-bold text-yellow-400">
              {score}/{CHOCOLATES_TO_WIN}
            </span>
          </div>
          <div className="glass-effect rounded-lg px-4 py-2">
            <span className="text-sm text-white/70">Longitud:</span>
            <span className="ml-2 text-xl font-bold text-green-400">
              {snake.length}
            </span>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative mb-4 mx-auto" style={{ width: GRID_SIZE * CELL_SIZE }}>
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-white/10"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
            }}
          >
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: GRID_SIZE }).map((_, y) =>
                Array.from({ length: GRID_SIZE }).map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="absolute border border-white/5"
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ))
              )}
            </div>

            {/* Snake */}
            {snake.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute rounded-sm ${
                  index === 0
                    ? 'bg-green-500 border-2 border-green-300'
                    : 'bg-green-600 border border-green-400'
                }`}
                style={{
                  left: segment.x * CELL_SIZE + 2,
                  top: segment.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                }}
              >
                {index === 0 && (
                  <div className="flex items-center justify-center h-full text-xs">
                    {direction === 'UP' && '⬆️'}
                    {direction === 'DOWN' && '⬇️'}
                    {direction === 'LEFT' && '⬅️'}
                    {direction === 'RIGHT' && '➡️'}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Chocolate */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute flex items-center justify-center"
              style={{
                left: chocolate.x * CELL_SIZE,
                top: chocolate.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              🍫
            </motion.div>

            {/* Pause Overlay */}
            <AnimatePresence>
              {isPaused && !gameOver && !gameWon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏸️</div>
                    <p className="text-white font-semibold">Pausado</p>
                    <p className="text-xs text-white/60 mt-1">Presiona ESPACIO</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <h3 className="text-3xl font-bold mb-2">¡Game Over!</h3>
                    <p className="text-white/70 mb-4">
                      Chocolates: {score}/{CHOCOLATES_TO_WIN}
                    </p>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Reintentar
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
                      ¡Comiste {CHOCOLATES_TO_WIN} chocolates!
                    </p>
                    <p className="text-sm text-white/70">Revelando tu premio...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button
              onClick={() => handleDirectionClick('UP')}
              disabled={gameOver || gameWon}
              className="py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ⬆️
            </button>
            <div />
            <button
              onClick={() => handleDirectionClick('LEFT')}
              disabled={gameOver || gameWon}
              className="py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ⬅️
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={gameOver || gameWon}
              className="py-3 bg-yellow-600/50 hover:bg-yellow-600/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={() => handleDirectionClick('RIGHT')}
              disabled={gameOver || gameWon}
              className="py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ➡️
            </button>
            <div />
            <button
              onClick={() => handleDirectionClick('DOWN')}
              disabled={gameOver || gameWon}
              className="py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ⬇️
            </button>
            <div />
          </div>
          <p className="text-xs text-center text-white/60">
            Usa las flechas del teclado, WASD o los botones • ESPACIO para pausar
          </p>
        </div>
      </motion.div>
    </div>
  );
};

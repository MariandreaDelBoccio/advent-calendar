import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, RotateCcw, Clock } from 'lucide-react';

interface MemoryGameProps {
  onComplete: (prize: string) => void;
  onClose: () => void;
  dayNumber: number;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🍫', '🎄', '⭐', '🎁', '🔔', '❄️', '🕯️', '🎅'];
const TOTAL_PAIRS = 8;
const TIME_LIMIT = 90; // segundos

export const MemoryGame = ({ onComplete, onClose, dayNumber }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isChecking, setIsChecking] = useState(false);

  // Inicializar el juego
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Crear pares de cartas
    const cardPairs = EMOJIS.flatMap((emoji, index) => [
      { id: index * 2, emoji, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false },
    ]);

    // Mezclar las cartas
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setGameOver(false);
    setTimeLeft(TIME_LIMIT);
  };

  // Timer
  useEffect(() => {
    if (gameWon || gameOver || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameWon, gameOver, timeLeft]);

  // Manejar click en carta
  const handleCardClick = (cardId: number) => {
    if (isChecking || gameWon || gameOver) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Si ya hay 2 cartas volteadas, no permitir más
    if (flippedCards.length >= 2) return;

    // Voltear la carta
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, cardId]);
  };

  // Verificar coincidencias
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setIsChecking(true);
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (!firstCard || !secondCard) return;

    setMoves((prev) => prev + 1);

    if (firstCard.emoji === secondCard.emoji) {
      // ¡Coincidencia!
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
        setIsChecking(false);
      }, 500);
    } else {
      // No coinciden
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [flippedCards, cards]);

  // Verificar victoria
  useEffect(() => {
    if (matches === TOTAL_PAIRS && !gameWon) {
      setGameWon(true);
      const prizes = [
        '🎁 Vale de 30% de descuento',
        '🍫 Set de chocolates gourmet',
        '🎉 Entrada doble para sorteo',
        '⭐ 200 puntos bonus',
        '🎊 Caja de chocolates navideños',
      ];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setTimeout(() => onComplete(prize), 1500);
    }
  }, [matches, gameWon, onComplete]);

  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-400';
    if (timeLeft > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-effect rounded-2xl p-6 max-w-2xl w-full my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">🃏 Memoria Dulce</h2>
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
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="glass-effect rounded-lg px-4 py-2 text-center">
            <Clock className={`inline-block mb-1 ${getTimeColor()}`} size={20} />
            <div className={`text-xl font-bold ${getTimeColor()}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-white/70">Tiempo</div>
          </div>
          <div className="glass-effect rounded-lg px-4 py-2 text-center">
            <div className="text-xl font-bold text-blue-400">{moves}</div>
            <div className="text-xs text-white/70">Movimientos</div>
          </div>
          <div className="glass-effect rounded-lg px-4 py-2 text-center">
            <div className="text-xl font-bold text-yellow-400">
              {matches}/{TOTAL_PAIRS}
            </div>
            <div className="text-xs text-white/70">Parejas</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative mb-4">
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || isChecking}
                whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Parte trasera */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center border-2 border-primary-400"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-4xl">🎁</div>
                  </div>

                  {/* Parte delantera */}
                  <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center border-2 ${
                      card.isMatched
                        ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-400'
                        : 'bg-gradient-to-br from-white/20 to-white/10 border-white/30'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-5xl">{card.emoji}</div>
                  </div>
                </motion.div>

                {/* Efecto de brillo para cartas emparejadas */}
                {card.isMatched && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-green-400/30 rounded-xl"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">⏰</div>
                  <h3 className="text-3xl font-bold mb-2">¡Tiempo agotado!</h3>
                  <p className="text-white/70 mb-4">
                    Parejas encontradas: {matches}/{TOTAL_PAIRS}
                  </p>
                  <button
                    onClick={initializeGame}
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
                  <h3 className="text-3xl font-bold mb-2">¡Excelente! 🎉</h3>
                  <p className="text-white/90 mb-2">
                    ¡Encontraste todas las parejas!
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

        {/* Instructions */}
        <div className="glass-effect rounded-xl p-4">
          <h3 className="font-bold mb-2 text-sm">📖 Cómo jugar:</h3>
          <ul className="text-xs text-white/80 space-y-1">
            <li>• Haz click en las cartas para voltearlas</li>
            <li>• Encuentra las {TOTAL_PAIRS} parejas antes de que se acabe el tiempo</li>
            <li>• Intenta hacerlo en la menor cantidad de movimientos</li>
            <li>• ¡Cada pareja encontrada suma puntos!</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

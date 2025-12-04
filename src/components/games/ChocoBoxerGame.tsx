import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Heart, Zap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useVictoryEffects } from '../../hooks/useVictoryEffects';

interface ChocoBoxerGameProps {
  onClose: () => void;
}

interface Enemy {
  id: number;
  name: string;
  emoji: string;
  health: number;
  maxHealth: number;
  damage: number;
}

const LEVELS = [
  {
    level: 1,
    enemies: [
      { id: 1, name: 'Galleta Blanda', emoji: '🍪', health: 40, maxHealth: 40, damage: 4 },
      { id: 2, name: 'Caramelo Pegajoso', emoji: '🍬', health: 45, maxHealth: 45, damage: 5 },
      { id: 3, name: 'Donut Rebelde', emoji: '🍩', health: 50, maxHealth: 50, damage: 6 },
      { id: 4, name: 'Cupcake Feroz', emoji: '🧁', health: 55, maxHealth: 55, damage: 7 },
    ],
  },
  {
    level: 2,
    enemies: [
      { id: 5, name: 'Helado Congelado', emoji: '🍦', health: 60, maxHealth: 60, damage: 8 },
      { id: 6, name: 'Pastel Explosivo', emoji: '🎂', health: 65, maxHealth: 65, damage: 9 },
      { id: 7, name: 'Piruleta Giratoria', emoji: '🍭', health: 70, maxHealth: 70, damage: 10 },
      { id: 8, name: 'Tarta Vengativa', emoji: '🥧', health: 75, maxHealth: 75, damage: 11 },
    ],
  },
  {
    level: 3,
    enemies: [
      { id: 9, name: 'Brownie Oscuro', emoji: '🍫', health: 80, maxHealth: 80, damage: 12 },
      { id: 10, name: 'Macaron Mágico', emoji: '🍡', health: 85, maxHealth: 85, damage: 13 },
      { id: 11, name: 'Churro Luchador', emoji: '🥨', health: 90, maxHealth: 90, damage: 14 },
      { id: 12, name: 'Waffle Guerrero', emoji: '🧇', health: 95, maxHealth: 95, damage: 15 },
    ],
  },
  {
    level: 4,
    enemies: [
      { id: 13, name: 'Croissant Ninja', emoji: '🥐', health: 100, maxHealth: 100, damage: 16 },
      { id: 14, name: 'Pretzel Retorcido', emoji: '🥨', health: 105, maxHealth: 105, damage: 17 },
      { id: 15, name: 'Bagel Blindado', emoji: '🥯', health: 110, maxHealth: 110, damage: 18 },
      { id: 16, name: 'Pan Dulce Supremo', emoji: '🍞', health: 120, maxHealth: 120, damage: 19 },
    ],
  },
  {
    level: 5,
    enemies: [
      { id: 17, name: 'Emperador Chocolate', emoji: '👑', health: 110, maxHealth: 110, damage: 18 },
      { id: 18, name: 'Rey Caramelo', emoji: '🤴', health: 120, maxHealth: 120, damage: 19 },
      { id: 19, name: 'Señor Azúcar', emoji: '🦹', health: 130, maxHealth: 130, damage: 20 },
      { id: 20, name: 'Jefe Final Dulce', emoji: '👹', health: 150, maxHealth: 150, damage: 22 },
    ],
  },
];

export const ChocoBoxerGame = ({ onClose }: ChocoBoxerGameProps) => {
  const { boxerLevel, updateBoxerLevel } = useGameStore();
  const { triggerFireworks, playVictorySound, playDefeatSound, playClickSound } = useVictoryEffects();
  const [currentLevel, setCurrentLevel] = useState(boxerLevel || 1);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>(LEVELS[currentLevel - 1].enemies);
  const [playerHealth, setPlayerHealth] = useState(150);
  const [maxPlayerHealth] = useState(150);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const currentEnemy = enemies[currentEnemyIndex];

  // Ataque del jugador
  const handleAttack = () => {
    if (isAttacking || isEnemyAttacking || gameOver || levelComplete) return;

    setIsAttacking(true);
    playClickSound();
    const damage = Math.floor(Math.random() * 16) + 20; // 20-35 de daño

    // Actualizar salud del enemigo
    setEnemies((prev) =>
      prev.map((enemy, idx) =>
        idx === currentEnemyIndex
          ? { ...enemy, health: Math.max(0, enemy.health - damage) }
          : enemy
      )
    );

    setTimeout(() => {
      setIsAttacking(false);
      
      // Verificar si el enemigo fue derrotado
      if (enemies[currentEnemyIndex].health - damage <= 0) {
        handleEnemyDefeated();
      } else {
        // Contraataque del enemigo
        enemyAttack();
      }
    }, 500);
  };

  // Ataque del enemigo
  const enemyAttack = () => {
    setIsEnemyAttacking(true);
    const damage = currentEnemy.damage;

    setTimeout(() => {
      setPlayerHealth((prev) => {
        const newHealth = Math.max(0, prev - damage);
        if (newHealth === 0) {
          setGameOver(true);
          playDefeatSound();
        }
        return newHealth;
      });
      setIsEnemyAttacking(false);
    }, 500);
  };

  // Enemigo derrotado
  const handleEnemyDefeated = () => {
    if (currentEnemyIndex < enemies.length - 1) {
      // Curar un poco al jugador entre enemigos (20 HP)
      setPlayerHealth((prev) => Math.min(maxPlayerHealth, prev + 20));
      
      // Siguiente enemigo
      setTimeout(() => {
        setCurrentEnemyIndex((prev) => prev + 1);
      }, 1000);
    } else {
      // Nivel completado
      setLevelComplete(true);
      playVictorySound();
      
      // Actualizar nivel máximo alcanzado
      if (currentLevel > boxerLevel) {
        updateBoxerLevel(currentLevel);
      }

      // Verificar si completó todos los niveles
      if (currentLevel === 5) {
        setAllLevelsComplete(true);
        triggerFireworks();
      }
    }
  };

  // Siguiente nivel
  const handleNextLevel = () => {
    if (currentLevel < 5) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setEnemies(LEVELS[nextLevel - 1].enemies);
      setCurrentEnemyIndex(0);
      setPlayerHealth(150);
      setLevelComplete(false);
    }
  };

  // Reiniciar nivel
  const handleRetry = () => {
    setEnemies(LEVELS[currentLevel - 1].enemies);
    setCurrentEnemyIndex(0);
    setPlayerHealth(150);
    setGameOver(false);
    setLevelComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-effect rounded-2xl p-6 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold">🥊 Choco Boxer</h2>
            <p className="text-sm text-white/70">Nivel {currentLevel} de 5</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Enemigo {currentEnemyIndex + 1}/{enemies.length}</span>
            <span className="text-yellow-400">Nivel {currentLevel}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentEnemyIndex + 1) / enemies.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
        </div>

        {/* Battle Area */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 mb-6 min-h-[400px]">
          {/* Player */}
          <div className="absolute bottom-8 left-8">
            <motion.div
              animate={isAttacking ? { x: [0, 50, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="text-8xl"
            >
              🥊
            </motion.div>
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="text-red-500" size={16} />
                <span className="text-sm font-bold">Tú</span>
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(playerHealth / maxPlayerHealth) * 100}%` }}
                  className={`h-full ${
                    playerHealth > 50 ? 'bg-green-500' : playerHealth > 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div className="text-xs text-white/70 mt-1">{playerHealth}/{maxPlayerHealth} HP</div>
            </div>
          </div>

          {/* Enemy */}
          {currentEnemy && (
            <div className="absolute top-8 right-8">
              <motion.div
                animate={isEnemyAttacking ? { x: [0, -50, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="text-8xl"
              >
                {currentEnemy.emoji}
              </motion.div>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-yellow-500" size={16} />
                  <span className="text-sm font-bold">{currentEnemy.name}</span>
                </div>
                <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  />
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {currentEnemy.health}/{currentEnemy.maxHealth} HP
                </div>
              </div>
            </div>
          )}

          {/* Attack Effects */}
          <AnimatePresence>
            {isAttacking && (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
                animate={{ opacity: 1, scale: 2, x: 300, y: 50 }}
                exit={{ opacity: 0 }}
                className="absolute text-6xl pointer-events-none"
              >
                💥
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isEnemyAttacking && (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 300, y: 50 }}
                animate={{ opacity: 1, scale: 2, x: 100, y: 100 }}
                exit={{ opacity: 0 }}
                className="absolute text-6xl pointer-events-none"
              >
                💢
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">😵</div>
                  <h3 className="text-3xl font-bold mb-2">¡Derrotado!</h3>
                  <p className="text-white/70 mb-6">
                    Llegaste al enemigo {currentEnemyIndex + 1} del nivel {currentLevel}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
                  >
                    Reintentar Nivel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level Complete Overlay */}
          <AnimatePresence>
            {levelComplete && !allLevelsComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Trophy className="inline-block text-yellow-400 mb-4" size={64} />
                  <h3 className="text-3xl font-bold mb-2">¡Nivel {currentLevel} Completado!</h3>
                  <p className="text-white/90 mb-6">
                    Derrotaste a todos los enemigos
                  </p>
                  {currentLevel < 5 ? (
                    <button
                      onClick={handleNextLevel}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                    >
                      Siguiente Nivel →
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All Levels Complete */}
          <AnimatePresence>
            {allLevelsComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl mb-4"
                  >
                    👑
                  </motion.div>
                  <h3 className="text-4xl font-bold mb-2">¡CAMPEÓN!</h3>
                  <p className="text-white/90 mb-2">
                    ¡Completaste todos los niveles!
                  </p>
                  <p className="text-yellow-400 font-bold mb-6">
                    Eres el Maestro del Choco Boxer 🥊
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-colors"
                  >
                    ¡Increíble!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <button
            onClick={handleAttack}
            disabled={isAttacking || isEnemyAttacking || gameOver || levelComplete}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-xl transition-all transform hover:scale-105"
          >
            {isAttacking ? '💥 ¡GOLPE!' : '🥊 ATACAR'}
          </button>
          <p className="text-xs text-center text-white/60">
            Haz click en ATACAR para golpear al enemigo • Daño: 20-35 HP
          </p>
        </div>
      </motion.div>
    </div>
  );
};

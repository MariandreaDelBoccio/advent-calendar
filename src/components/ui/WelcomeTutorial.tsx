import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useVictoryEffects } from '../../hooks/useVictoryEffects';

interface WelcomeTutorialProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: '¡Bienvenido al Calendario de Adviento! 🎄',
    description: 'Descubre premios increíbles cada día de diciembre jugando divertidos juegos.',
    emoji: '🍫',
    highlight: 'Este es tu calendario mágico de chocolate',
  },
  {
    title: 'Desbloquea Días 📅',
    description: 'Cada día de diciembre se desbloquea automáticamente. Hoy puedes jugar los días disponibles.',
    emoji: '🔓',
    highlight: 'Los días se desbloquean progresivamente',
  },
  {
    title: 'Juega y Gana 🎮',
    description: 'Cada día tiene un juego único: carreras, snake, memoria o puzzle. ¡Completa el juego para revelar tu premio!',
    emoji: '🏆',
    highlight: '4 juegos diferentes te esperan',
  },
  {
    title: 'Colecciona Logros 🏅',
    description: 'Desbloquea 9 logros especiales completando desafíos. ¡Conviértete en el maestro del chocolate!',
    emoji: '⭐',
    highlight: 'Cada logro cuenta tu historia',
  },
  {
    title: 'Choco Boxer 🥊',
    description: 'Nuestro juego principal: 5 niveles épicos con 20 enemigos. ¡Derrota al Jefe Final Dulce!',
    emoji: '👑',
    highlight: 'El desafío definitivo te espera',
  },
  {
    title: 'Canjea Calendarios 🎁',
    description: 'Ingresa códigos de tus calendarios físicos para desbloquear más contenido y logros.',
    emoji: '🔑',
    highlight: 'Cada código es único',
  },
  {
    title: '¡Listo para Empezar! 🚀',
    description: 'Ya conoces todo lo necesario. ¡Es hora de comenzar tu aventura chocolatera!',
    emoji: '🎉',
    highlight: '¡Que comience la diversión!',
  },
];

export const WelcomeTutorial = ({ onComplete }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { triggerConfetti, playClickSound } = useVictoryEffects();

  const handleNext = () => {
    playClickSound();
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      triggerConfetti();
      setTimeout(() => onComplete(), 500);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    playClickSound();
    onComplete();
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-3xl p-8 max-w-2xl w-full relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white group"
          title="Cerrar tutorial"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white/90">
              Paso {currentStep + 1} de {tutorialSteps.length}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-700"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="text-8xl mb-6"
            >
              {step.emoji}
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-shadow">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-white/80 mb-6 max-w-xl mx-auto">
              {step.description}
            </p>

            {/* Highlight */}
            <div className="glass-effect rounded-xl p-4 inline-block">
              <p className="text-sm text-primary-300 font-semibold">
                💡 {step.highlight}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                playClickSound();
                setCurrentStep(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary-500'
                  : index < currentStep
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>
          <button
            onClick={handleNext}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isLastStep
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
            }`}
          >
            {isLastStep ? (
              <>
                ¡Comenzar!
                <Check size={20} />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      </motion.div>
    </div>
  );
};

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, MapPin, Gift, HelpCircle } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { WelcomeTutorial } from '../components/ui/WelcomeTutorial';

export const Home = () => {
  const { hasSeenTutorial, showTutorial, setHasSeenTutorial, setShowTutorial } = useUIStore();

  // Mostrar tutorial en el primer login
  useEffect(() => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [hasSeenTutorial, setShowTutorial]);

  const handleTutorialComplete = () => {
    setHasSeenTutorial(true);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };
  return (
    <>
      {/* Tutorial Modal */}
      {showTutorial && <WelcomeTutorial onComplete={handleTutorialComplete} />}

      <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
          🍫 Calendario de Adviento 🎄
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-8">
          Descubre premios increíbles cada día de diciembre
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/calendar"
            className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
          >
            Ver Calendario
          </Link>
          <button
            onClick={handleShowTutorial}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
          >
            <HelpCircle size={24} />
            Ver Tutorial
          </button>
        </div>
      </motion.div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <QuickLink
          to="/calendar"
          icon={<Calendar size={32} />}
          title="Calendario"
          description="Abre las casillas"
        />
        <QuickLink
          to="/achievements"
          icon={<Trophy size={32} />}
          title="Mis Logros"
          description="9 logros disponibles"
        />
        <QuickLink
          to="/where-to-buy"
          icon={<MapPin size={32} />}
          title="Dónde Comprar"
          description="Encuentra tu tienda"
        />
        <QuickLink
          to="/calendars"
          icon={<Gift size={32} />}
          title="Mis Calendarios"
          description="Canjea más códigos"
        />
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-2xl p-8 mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            number="1"
            title="Compra tu calendario"
            description="Encuentra tu calendario físico en tiendas participantes"
          />
          <Step
            number="2"
            title="Registra tu código"
            description="Escanea el QR o ingresa el código único de tu calendario"
          />
          <Step
            number="3"
            title="Juega y gana"
            description="Abre una casilla cada día, juega y descubre premios increíbles"
          />
        </div>
      </motion.div>

      {/* Choco Boxer Teaser */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-effect rounded-2xl p-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">🥊 Choco Boxer</h2>
        <p className="text-white/80 mb-6">
          ¡Desafía a enemigos épicos con tu guante de chocolate!
        </p>
        <Link
          to="/choco-boxer"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
        >
          Jugar Ahora
        </Link>
      </motion.div>
      </div>
    </>
  );
};

const QuickLink = ({ to, icon, title, description }: any) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-effect rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
    >
      <div className="flex justify-center mb-4 text-primary-300">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </motion.div>
  </Link>
);

const Step = ({ number, title, description }: any) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

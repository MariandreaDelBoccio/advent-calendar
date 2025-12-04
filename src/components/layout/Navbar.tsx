import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Gift, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { DarkModeToggle } from '../ui/DarkModeToggle';
import { SoundToggle } from '../ui/SoundToggle';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-1 sm:gap-2 text-lg sm:text-xl font-bold flex-shrink-0">
            <span className="text-xl sm:text-2xl">🍫</span>
            <span className="hidden md:inline">Calendario de Adviento</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <SoundToggle />
              <DarkModeToggle />
            </div>
            
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Inicio</span>
            </Link>

            <Link
              to="/calendars"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Gift size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">
                Calendarios ({user.redeemedCalendars.length})
              </span>
              <span className="md:hidden text-sm">{user.redeemedCalendars.length}</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <User size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">{user.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-300"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Salir</span>
            </button>
            
            {/* Toggles en móvil al final */}
            <div className="flex sm:hidden items-center gap-1 ml-1 border-l border-white/20 pl-1">
              <SoundToggle />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

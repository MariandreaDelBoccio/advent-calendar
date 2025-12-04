import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Gift, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { DarkModeToggle } from '../ui/DarkModeToggle';

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🍫</span>
            <span className="hidden sm:inline">Calendario de Adviento</span>
          </Link>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Inicio</span>
            </Link>

            <Link
              to="/calendars"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Gift size={20} />
              <span className="hidden sm:inline">
                Calendarios ({user.redeemedCalendars.length})
              </span>
              <span className="sm:hidden">{user.redeemedCalendars.length}</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <User size={20} />
              <span className="hidden sm:inline">{user.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-300"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

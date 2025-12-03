import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Gift } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { CalendarDay } from '../components/calendar/CalendarDay';
import { DayModal } from '../components/calendar/DayModal';
import type { CalendarDay as CalendarDayType } from '../types';

export const CalendarPage = () => {
  const { calendarDays, initializeCalendar } = useGameStore();
  const [selectedDay, setSelectedDay] = useState<CalendarDayType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (calendarDays.length === 0) {
      initializeCalendar();
    }
  }, [calendarDays.length, initializeCalendar]);

  const handleDayClick = (day: CalendarDayType) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handlePlayGame = () => {
    if (selectedDay) {
      // TODO: Navegar al juego específico
      setIsModalOpen(false);
      // Por ahora mostramos un alert
      alert(`Próximamente: ${selectedDay.gameType} - Día ${selectedDay.day}`);
    }
  };

  const completedDays = calendarDays.filter(d => d.completed).length;
  const unlockedDays = calendarDays.filter(d => d.unlocked).length;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <CalendarIcon size={48} className="text-primary-300" />
          <h1 className="text-4xl md:text-5xl font-bold text-shadow">
            Calendario de Adviento
          </h1>
        </div>
        <p className="text-xl text-white/80 mb-6">
          Abre una casilla cada día de diciembre
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="glass-effect rounded-xl px-6 py-3">
            <div className="text-2xl font-bold text-primary-300">{unlockedDays}/24</div>
            <div className="text-sm text-white/70">Días Desbloqueados</div>
          </div>
          <div className="glass-effect rounded-xl px-6 py-3">
            <div className="text-2xl font-bold text-green-400">{completedDays}/24</div>
            <div className="text-sm text-white/70">Días Completados</div>
          </div>
          <div className="glass-effect rounded-xl px-6 py-3">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round((completedDays / 24) * 100)}%
            </div>
            <div className="text-sm text-white/70">Progreso</div>
          </div>
        </div>
      </motion.div>

      {/* Calendario Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {calendarDays.map((day) => (
            <CalendarDay
              key={day.day}
              day={day}
              onClick={() => handleDayClick(day)}
            />
          ))}
        </div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6 text-center"
        >
          <Gift className="inline-block mb-3 text-primary-300" size={32} />
          <h3 className="text-xl font-bold mb-2">¿Cómo funciona?</h3>
          <div className="text-white/80 space-y-2 max-w-2xl mx-auto">
            <p>🔒 Los días se desbloquean automáticamente cada día de diciembre</p>
            <p>🎮 Completa el juego de cada día para descubrir tu premio</p>
            <p>⭐ Puedes volver a jugar cuando quieras, pero el premio ya está revelado</p>
            <p>🏆 ¡Completa todos los días para desbloquear logros especiales!</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal del día */}
      <DayModal
        day={selectedDay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlayGame={handlePlayGame}
      />
    </div>
  );
};

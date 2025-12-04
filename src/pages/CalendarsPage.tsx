import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Plus, Check, Calendar, QrCode } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../hooks/useToast';

export const CalendarsPage = () => {
  const { user, redeemCalendar } = useAuthStore();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsRedeeming(true);

    try {
      // Validar formato del código (ejemplo: CHOCO-2024-XXXX)
      if (code.length < 8) {
        throw new Error('El código debe tener al menos 8 caracteres');
      }

      await redeemCalendar(code);
      setSuccess(true);
      setCode('');
      
      // Notificación de éxito
      toast.success(
        '¡Calendario Canjeado! 🎁',
        'Tu nuevo calendario ha sido agregado exitosamente',
        5000
      );
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al canjear el código');
      toast.error('Error al Canjear', err.message || 'Código inválido');
    } finally {
      setIsRedeeming(false);
    }
  };

  const calendarsCount = user?.redeemedCalendars.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift size={48} className="text-primary-300" />
          <h1 className="text-4xl md:text-5xl font-bold text-shadow">
            Mis Calendarios
          </h1>
        </div>
        <p className="text-xl text-white/80 mb-6">
          Canjea códigos y gestiona tus calendarios
        </p>

        {/* Stats */}
        <div className="glass-effect rounded-xl px-8 py-4 inline-block">
          <div className="text-4xl font-bold text-primary-300">{calendarsCount}</div>
          <div className="text-sm text-white/70">
            {calendarsCount === 1 ? 'Calendario Canjeado' : 'Calendarios Canjeados'}
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Formulario de canje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Plus className="text-primary-300" size={32} />
            <h2 className="text-2xl font-bold">Canjear Nuevo Código</h2>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Código del Calendario
              </label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="CHOCO-2024-XXXX"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-white placeholder-white/50 uppercase"
                  disabled={isRedeeming}
                  required
                />
              </div>
              <p className="text-xs text-white/60 mt-2">
                Encuentra el código en tu calendario físico o escanea el QR
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-sm text-green-200 flex items-center gap-2"
              >
                <Check size={20} />
                ¡Código canjeado exitosamente!
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isRedeeming || !code}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {isRedeeming ? 'Canjeando...' : 'Canjear Código'}
            </button>
          </form>
        </motion.div>

        {/* Lista de calendarios canjeados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-primary-300" size={32} />
            <h2 className="text-2xl font-bold">Calendarios Canjeados</h2>
          </div>

          {calendarsCount === 0 ? (
            <div className="text-center py-12">
              <Gift className="inline-block mb-4 text-white/30" size={64} />
              <p className="text-white/60 mb-2">Aún no has canjeado ningún calendario</p>
              <p className="text-sm text-white/40">
                Ingresa tu primer código arriba para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {user?.redeemedCalendars.map((calendarCode, index) => (
                <motion.div
                  key={calendarCode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-2xl">
                      🍫
                    </div>
                    <div>
                      <p className="font-semibold">Calendario #{index + 1}</p>
                      <p className="text-sm text-white/60 font-mono">{calendarCode}</p>
                    </div>
                  </div>
                  <Check className="text-green-400" size={24} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 glass-effect rounded-xl p-6"
        >
          <h3 className="font-bold mb-3">💡 ¿Dónde encuentro mi código?</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• Busca el código en la parte posterior de tu calendario físico</li>
            <li>• Escanea el código QR con tu cámara</li>
            <li>• Cada calendario tiene un código único</li>
            <li>• Puedes canjear múltiples calendarios</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

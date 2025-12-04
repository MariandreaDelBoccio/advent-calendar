import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Gift } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'achievement';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={24} />;
      case 'achievement':
        return <Gift className="text-yellow-400" size={24} />;
      default:
        return <Info className="text-blue-400" size={24} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-600/90 to-green-700/90 border-green-400/50';
      case 'error':
        return 'from-red-600/90 to-red-700/90 border-red-400/50';
      case 'achievement':
        return 'from-yellow-600/90 to-orange-600/90 border-yellow-400/50';
      default:
        return 'from-blue-600/90 to-blue-700/90 border-blue-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`
        relative flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border-2
        bg-gradient-to-r ${getColors()}
        min-w-[300px] max-w-md
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white mb-1">{title}</h4>
        {message && <p className="text-sm text-white/90">{message}</p>}
      </div>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X size={18} className="text-white/70 hover:text-white" />
      </button>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

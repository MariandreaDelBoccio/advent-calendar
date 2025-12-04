import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export const AudioUnlockPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && !audioUnlocked) {
      // Mostrar prompt después de 1 segundo
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [audioUnlocked]);

  const handleUnlock = () => {
    // Crear y reproducir un sonido silencioso para desbloquear
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Crear buffer silencioso
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    
    // Resumir contexto
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    setAudioUnlocked(true);
    setShowPrompt(false);
    
    // Guardar en localStorage
    localStorage.setItem('audioUnlocked', 'true');
  };

  // Verificar si ya se desbloqueó antes
  useEffect(() => {
    const unlocked = localStorage.getItem('audioUnlocked');
    if (unlocked === 'true') {
      setAudioUnlocked(true);
      setShowPrompt(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
        >
          <button
            onClick={handleUnlock}
            className="glass-effect px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <Volume2 className="text-green-400" size={24} />
            <div className="text-left">
              <div className="font-bold text-white">Activar Sonido</div>
              <div className="text-xs text-white/70">Toca para habilitar efectos de audio</div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

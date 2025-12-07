import { Heart, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto py-8 px-4 border-t border-white/10 bg-black/20">
      <div className="container mx-auto max-w-6xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              🍫 Calendario de Adviento
            </h3>
            <p className="text-sm text-white/70 mb-2">
              Proyecto educativo de portfolio creado para demostrar habilidades en desarrollo frontend moderno.
            </p>
          </div>

          {/* Inspiration */}
          <div>
            <h3 className="text-lg font-bold mb-3">💡 Inspiración</h3>
            <p className="text-sm text-white/70 mb-2">
              Inspirado por el{' '}
              <a
                href="https://calendariodeadviento.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-primary-200 underline"
              >
                Calendario de Adviento de Ibai Llanos
              </a>
            </p>
            <p className="text-xs text-white/50">
              Proyecto educativo sin afiliación oficial
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">🔗 Enlaces</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/MariandreaDelBoccio/advent-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Github size={16} />
                Código Fuente
              </a>
              <a
                href="https://www.linkedin.com/in/mariandreadelboccio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              © {currentYear} Mariandrea Del Boccio. Hecho con{' '}
              <Heart size={14} className="text-red-400 inline" fill="currentColor" /> para aprender.
            </div>
            <div className="text-xs text-center md:text-right">
              Proyecto educativo • MIT License
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-white/40 text-center">
            Este proyecto no está afiliado, asociado, autorizado, respaldado por, o de ninguna manera
            oficialmente conectado con Ibai Llanos o cualquiera de sus subsidiarias o afiliados.
          </div>
        </div>
      </div>
    </footer>
  );
};

# 🎄 Calendario de Adviento Interactivo

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

Una aplicación web interactiva de calendario de adviento con 5 juegos únicos, sistema de gamificación completo y experiencia de usuario excepcional.

[Demo en Vivo](https://tu-usuario.github.io/advent-calendar/) • [Reportar Bug](https://github.com/tu-usuario/advent-calendar/issues)

</div>

---

## ✨ Características Principales

### 🎮 5 Juegos Completos
- **🏎️ Carrera Loca** - Esquiva obstáculos y recolecta gemas
- **🐍 Snake Chocolate** - Clásico Snake con temática navideña
- **🃏 Memoria Dulce** - Encuentra pares de cartas contra el tiempo
- **🧩 Puzzle de Chocolatinas** - Rompecabezas deslizante 3x3
- **🥊 Choco Boxer** - Juego de combate por turnos con 5 niveles épicos

### 🏆 Sistema de Gamificación
- Sistema de puntos (100-150 por dificultad)
- Rachas diarias con tracking automático
- 9 logros desbloqueables
- Historial completo de premios
- Estadísticas detalladas por tipo de juego

### 🎨 Experiencia de Usuario
- Confetti y efectos visuales en victorias
- Sistema de sonidos con Web Audio API
- Tutorial interactivo de 7 pasos
- Modo oscuro con toggle animado
- Notificaciones toast (4 tipos)
- Animaciones fluidas con Framer Motion

### 📱 Diseño Responsive
- Mobile-first approach
- Controles táctiles en juegos
- Optimizado para móvil, tablet y desktop
- Grid adaptativo y navbar colapsable

### 🗺️ Funcionalidades Adicionales
- Mapa interactivo con Leaflet
- Geolocalización del usuario
- Sistema de canje de códigos QR
- Calendario de 24 días con dificultad progresiva
- Perfil de usuario con estadísticas completas

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool moderno y rápido

### Estilos y Animaciones
- **Tailwind CSS v3** - Utility-first CSS
- **Framer Motion** - Animaciones fluidas
- **Canvas Confetti** - Efectos de celebración

### State Management
- **Zustand** - Estado global ligero
- **React Hooks** - Estado local
- **localStorage** - Persistencia de datos

### Mapas y Geolocalización
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración con React

### Formularios y Validación
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/advent-calendar.git

# Entrar al directorio
cd advent-calendar

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

---

## 📂 Estructura del Proyecto

```
advent-calendar/
├── src/
│   ├── components/
│   │   ├── calendar/      # Componentes del calendario
│   │   ├── games/         # 5 juegos completos
│   │   ├── ui/            # Componentes UI reutilizables
│   │   └── layout/        # Layout y navegación
│   ├── pages/             # 9 páginas funcionales
│   ├── store/             # Zustand stores
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utilidades
├── public/                # Assets estáticos
└── ...config files
```

---

## 🎮 Juegos Implementados

### 1. 🏎️ Carrera Loca
- 3 carriles con movimiento fluido
- Sistema de obstáculos dinámicos
- Recolección de 7 gemas para ganar
- Controles: teclado (flechas/WASD) + táctiles

### 2. 🐍 Snake Chocolate
- Grid de 15x15 con movimiento en 4 direcciones
- Objetivo: comer 10 chocolates
- Velocidad progresiva
- Sistema de pausa

### 3. 🃏 Memoria Dulce
- 8 pares de cartas navideñas
- Límite de tiempo: 90 segundos
- Animaciones 3D de volteo
- Contador de movimientos

### 4. 🧩 Puzzle de Chocolatinas
- Rompecabezas deslizante 3x3
- Algoritmo que garantiza solución
- Vista previa de la solución
- Detección automática de victoria

### 5. 🥊 Choco Boxer
- 5 niveles épicos de dificultad
- 20 enemigos únicos con nombres creativos
- Sistema de combate por turnos
- Barras de vida animadas
- Progresión guardada

---

## 🎯 Características Técnicas Destacadas

### Arquitectura
- Componentes modulares y reutilizables
- Hooks personalizados para lógica compartida
- Separación clara de responsabilidades
- TypeScript para type safety completo

### Performance
- Lazy loading de componentes
- Optimización de re-renders
- Memoización estratégica
- Animaciones a 60fps

### Seguridad y Validación
- Validación de formularios con Zod
- Rutas protegidas
- Sanitización de inputs
- Manejo robusto de errores

---

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

---

## 🎨 Paleta de Colores

```css
--primary: #5752a9;      /* Morado principal */
--primary-50: #f5f3ff;   /* Muy claro */
--primary-900: #2e1065;  /* Muy oscuro */
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

---

## 🙏 Agradecimientos

- Iconos por [Lucide React](https://lucide.dev/)
- Mapas por [Leaflet](https://leafletjs.com/)
- Animaciones por [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐

</div>

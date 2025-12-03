import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Background } from './components/layout/Background';
import { Navbar } from './components/layout/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';

// Placeholder components - crearemos estos después
const CalendarPage = () => <div className="pt-24 text-center">Calendario (próximamente)</div>;
const AchievementsPage = () => <div className="pt-24 text-center">Logros (próximamente)</div>;
const WhereToBuyPage = () => <div className="pt-24 text-center">Dónde Comprar (próximamente)</div>;
const CalendarsPage = () => <div className="pt-24 text-center">Mis Calendarios (próximamente)</div>;
const ProfilePage = () => <div className="pt-24 text-center">Perfil (próximamente)</div>;
const ChocoBoxerPage = () => <div className="pt-24 text-center">Choco Boxer (próximamente)</div>;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Background />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/where-to-buy"
          element={
            <ProtectedRoute>
              <WhereToBuyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendars"
          element={
            <ProtectedRoute>
              <CalendarsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/choco-boxer"
          element={
            <ProtectedRoute>
              <ChocoBoxerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

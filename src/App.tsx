import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Background } from './components/layout/Background';
import { Navbar } from './components/layout/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { CalendarPage } from './pages/CalendarPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { CalendarsPage } from './pages/CalendarsPage';
import { ProfilePage } from './pages/ProfilePage';
import { WhereToBuyPage } from './pages/WhereToBuyPage';
import { ChocoBoxerPage } from './pages/ChocoBoxerPage';
import { ToastContainer } from './components/ui/Toast';
import { useToastStore } from './hooks/useToast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <BrowserRouter basename="/advent-calendar">
      <Background />
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
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

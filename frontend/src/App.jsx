import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NoteEditorPage from './pages/NoteEditorPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * Komponen root aplikasi yang mengatur semua routing.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor/:noteId" element={<NoteEditorPage />} />
        </Route>

        {/* Redirect otomatis ke login jika rute tidak ditemukan atau user belum login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
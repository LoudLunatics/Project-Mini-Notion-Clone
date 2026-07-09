import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Komponen untuk melindungi rute.
 * Jika pengguna tidak login, ia akan diarahkan ke halaman login.
 * Jika sudah login, ia akan menampilkan konten rute yang diminta (Outlet).
 */
export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
}

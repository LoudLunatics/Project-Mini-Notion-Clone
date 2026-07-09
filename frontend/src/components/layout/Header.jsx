import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../api/axios.instance';

/**
 * Komponen Header aplikasi.
 * Menampilkan nama workspace, info edit terakhir, dan tombol logout.
 * @param {{ lastEditedInfo: object }} props
 */
export default function Header({ lastEditedInfo }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  // Tips Debugging: Buka Inspect Element -> Console di browser untuk melihat apa isi sebenarnya dari objek 'user'
  console.log("Data User Login:", user); 
  console.log("Data Last Edited:", lastEditedInfo);

  /**
   * Menangani proses logout pengguna.
   */
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 h-[65px] border-b border-gray-200 bg-white shrink-0">
      <div className="flex items-center gap-4">
        {location.pathname !== '/dashboard' && (
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Dashboard
          </Link>
        )}
        
        <div className="text-sm text-gray-500 font-medium px-2 py-1 rounded">
          {/* UBAH DI SINI: Gunakan .username atau .email (sesuaikan dengan database) */}
          {user?.username || user?.email ? `${user.username || user.email.split('@')[0]}'s Workspace` : 'My Workspace'}
        </div>
        
        {/* Tampilkan info editor terakhir jika ada */}
        {lastEditedInfo?.user && (
          <div className="text-xs text-gray-400">
            Terakhir diedit oleh{' '}
            <span className="font-medium text-gray-500">
              {/* UBAH DI SINI: Gunakan .email karena backend hanya mengirimkan email */}
              {lastEditedInfo.user.id === user?.id ? 'Anda' : (lastEditedInfo.user.username || lastEditedInfo.user.email)}
            </span>
            {' pada '}{new Date(lastEditedInfo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleLogout}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
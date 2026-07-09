import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useNoteStore from '../../store/noteStore';

/**
 * Komponen layout utama aplikasi.
 * Terdiri dari Sidebar, Header, dan area konten utama.
 * @param {{ children: React.ReactNode, lastEditedInfo: object }} props
 */
export default function AppLayout({ children, lastEditedInfo }) { // Terima prop baru
  const fetchNotes = useNoteStore((state) => state.fetchNotes);

  /**
   * Mengambil semua catatan dari server saat komponen pertama kali dimuat.
   */
  // Ambil semua catatan saat layout pertama kali dimuat
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header lastEditedInfo={lastEditedInfo} /> {/* Teruskan ke Header */}
        <main className="flex-1 overflow-y-auto p-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
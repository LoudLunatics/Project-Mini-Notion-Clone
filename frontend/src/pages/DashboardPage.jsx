import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import axiosInstance from '../api/axios.instance';
import useNoteStore from '../store/noteStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const allNotes = useNoteStore((state) => state.notes);
  const recentNotes = allNotes.slice(0, 4);
  const addNoteToStore = useNoteStore((state) => state.addNote);

  /**
   * Menangani pembuatan catatan baru.
   */
  const handleCreateNewNote = async () => {
    setIsCreating(true);
    try {
      const response = await axiosInstance.post('/notes', { title: 'Tanpa Judul' });
      const newNote = response.data;
      addNoteToStore(newNote); 
      navigate(`/editor/${newNote.id}`); 
    } catch (error) {
      console.error("Gagal membuat catatan baru:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mt-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Selamat Datang</h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Ini adalah ruang kerjamu. Pilih catatan yang ada di sidebar atau mulai tuangkan ide baru sekarang.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <Button onClick={handleCreateNewNote} disabled={isCreating}>
            <span className="text-lg leading-none">+</span> {isCreating ? 'Membuat...' : 'Buat Catatan Baru'}
          </Button>
        </div>

        <hr className="w-full border-gray-200 my-10" />

        {/* Daftar Catatan Realtime */}
        <div className="w-full">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Terakhir Dibuka</h3>
          
          {recentNotes.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Belum ada catatan yang dibuat.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <div 
                  key={note.id}
                  onClick={() => navigate(`/editor/${note.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">📄</span>
                    <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Klik untuk membuka catatan ini...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AppLayout from '../components/layout/AppLayout';
import BlockEditor from '../components/editor/BlockEditor';
import useAutosave from '../hooks/useAutosave';
import useNoteStore from '../store/noteStore';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios.instance';
import { io } from 'socket.io-client';
 
/**
 * Halaman utama untuk mengedit sebuah catatan.
 * Mengelola state editor, autosave, dan koneksi WebSocket untuk kolaborasi real-time.
 */
export default function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const deleteNoteFromStore = useNoteStore((state) => state.deleteNote);
  const currentUser = useAuthStore(state => state.user);
  const updateNoteInStore = useNoteStore((state) => state.updateNote);
  const noteFromStore = useNoteStore(state => state.notes.find(n => n.id === parseInt(noteId, 10)));

  const [isLoading, setIsLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [lastEditedInfo, setLastEditedInfo] = useState(null);
  const lastSavedContent = useRef(null);
  const [isReadyForAutosave, setIsReadyForAutosave] = useState(false);
  const socketRef = useRef(null);

  const { control, handleSubmit, reset, watch } = useForm();

  /**
   * Efek untuk mengelola koneksi WebSocket.
   * Bergabung ke ruangan note dan mendengarkan pembaruan dari pengguna lain.
   */
  useEffect(() => {
    socketRef.current = io('http://localhost:4000'); 

    socketRef.current.on('connect', () => {
      console.log('Terhubung ke server WebSocket dengan ID:', socketRef.current.id);
      socketRef.current.emit('note:join', noteId);
    });

    socketRef.current.on('note:updated', (updatedData) => {
      console.log('Menerima pembaruan dari pengguna lain:', updatedData);
      reset(updatedData);
      lastSavedContent.current = JSON.stringify(updatedData);
    });

    return () => {
      if (socketRef.current) {
        console.log('Memutuskan koneksi WebSocket...');
        socketRef.current.emit('note:leave', noteId);
        socketRef.current.disconnect();
      }
    };
  }, [noteId, reset]);

  /**
   * Efek untuk memuat data catatan dari state global (Zustand)
   * dan menyinkronkannya dengan state form lokal.
   */
  useEffect(() => {
    if (noteFromStore) {
      const formContent = watch();
      const storeContentString = JSON.stringify({ title: noteFromStore.title, blocks: noteFromStore.blocks });
      const formContentString = JSON.stringify(formContent);
      if (storeContentString !== formContentString) {
        const newContent = { title: noteFromStore.title, blocks: noteFromStore.blocks };
        reset(newContent);
        lastSavedContent.current = JSON.stringify(newContent);
      }

      setLastEditedInfo({
        user: noteFromStore.lastEditedBy,
        date: noteFromStore.updatedAt,
      });
      setIsLoading(false);
      setIsReadyForAutosave(true);
    }
  }, [noteFromStore, reset, watch]);

  const documentContent = watch();

  /**
   * Fungsi callback yang dipanggil oleh `useAutosave`.
   * Menyimpan data terbaru ke server dan menyiarkannya melalui WebSocket.
   */
  const handleSave = useCallback(async (latestData) => {
    try {
      if (JSON.stringify(latestData) === lastSavedContent.current) {
        return;
      }

      const response = await axiosInstance.put(`/notes/${noteId}`, latestData);
      const updatedNoteFromServer = response.data; 

      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 4000); 

      setLastEditedInfo({ 
        user: currentUser, 
        date: new Date().toISOString() 
      });
      lastSavedContent.current = JSON.stringify(latestData); 

      const numericNoteId = parseInt(noteId, 10);
      updateNoteInStore({ id: numericNoteId, ...latestData });
      if (socketRef.current) {
        socketRef.current.emit('note:update', { room: noteId, data: latestData });
      }
    } catch (error) {
      console.error("Gagal menyimpan catatan:", error);
    }
  }, [noteId, currentUser, updateNoteInStore]);

  const isSaving = useAutosave(documentContent, 1500, handleSave, isReadyForAutosave);

  /**
   * Menangani penghapusan catatan yang sedang dibuka.
   */
  const handleDeleteNote = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat diurungkan.")) {
      try {
        await axiosInstance.delete(`/notes/${noteId}`);
        deleteNoteFromStore(noteId); 
        navigate('/dashboard'); 
      } catch (error) {
        console.error("Gagal menghapus catatan:", error);
        alert("Gagal menghapus catatan. Silakan coba lagi.");
      }
    }
  };

  if (isLoading) {
    return <AppLayout><div>Memuat catatan...</div></AppLayout>;
  }

  return (
    <AppLayout lastEditedInfo={lastEditedInfo}> {/* Teruskan info ke AppLayout */}
      {/* Indikator status penyimpanan di pojok kanan atas editor */}
      <div className="flex justify-end items-center gap-4 mb-4">
        <span className="text-xs text-gray-400">
          {isSaving ? 'Menyimpan...' : ''}
          {showSaved && !isSaving ? 'Tersimpan' : ''}
        </span>
        <button 
          onClick={handleDeleteNote}
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          Hapus Catatan
        </button>
      </div>
      
      {/* Memanggil komponen editor utama */}
      <BlockEditor control={control} />
    </AppLayout>
  );
}
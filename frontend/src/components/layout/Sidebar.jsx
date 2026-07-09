import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import useNoteStore from '../../store/noteStore';
// WAJIB IMPORT AXIOS UNTUK MENGHUBUNGI BACKEND
import axiosInstance from '../../api/axios.instance';

/**
 * Komponen untuk setiap item catatan di sidebar.
 * Dapat diperluas untuk menampilkan daftar blok di dalamnya.
 * @param {{ note: object, onDeleteNote: Function, onDeleteBlock: Function }} props
 */
const SidebarItem = ({ note, onDeleteNote, onDeleteBlock }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const blocks = note.blocks || [];
  const hasBlocks = blocks.length > 0;

  const handleDeleteNote = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (window.confirm(`Yakin ingin menghapus catatan "${note.title || 'Tanpa Judul'}"?`)) {
      onDeleteNote(note.id);
    }
  };

  return (
    <div className="mb-0.5">
      {/* BARIS JUDUL CATATAN */}
      <div className="group flex items-center justify-between px-2 py-1 hover:bg-gray-200 rounded-md transition-colors text-sm text-gray-600">
        
        <div className="flex items-center gap-1 overflow-hidden flex-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`w-5 h-5 flex items-center justify-center rounded hover:bg-gray-300 text-gray-400 shrink-0 transition-transform ${
              !hasBlocks ? 'opacity-0 cursor-default' : ''
            } ${isExpanded ? 'rotate-90' : ''}`}
            disabled={!hasBlocks}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <NavLink
            to={`/editor/${note.id}`}
            className={({ isActive }) =>
              `flex-1 flex items-center gap-2 truncate py-1 ${isActive ? 'font-semibold text-gray-900 bg-gray-200 rounded px-1' : ''}`
            }
          >
            <span className="truncate">{note.title || 'Tanpa Judul'}</span>
          </NavLink>
        </div>

        {/* Tombol Delete Catatan */}
        <button
          onClick={handleDeleteNote}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded transition-all shrink-0"
          title="Hapus Catatan"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {/* AREA DROPDOWN: DAFTAR BLOK */}
      {isExpanded && hasBlocks && (
        <div className="pl-8 pr-2 flex flex-col gap-1 mt-1 pb-1">
          {blocks.map((block) => (
            <div 
              key={block.id} 
              className="group/block text-xs text-gray-500 flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded cursor-default border-l-2 border-transparent hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[9px] font-bold bg-gray-200 px-1 rounded uppercase tracking-wider text-gray-400 shrink-0">
                  {block.type.substring(0, 3)}
                </span>
                <span className="truncate">
                  {getPreviewText(block) || <i className="text-gray-400">Blok Kosong</i>}
                </span>
              </div>

              {/* Tombol Delete Blok Khusus */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if(window.confirm('Yakin ingin menghapus blok ini dari sidebar?')) {
                    onDeleteBlock(note.id, block.id);
                  }
                }}
                className="opacity-0 group-hover/block:opacity-100 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded transition-all shrink-0"
                title="Hapus Blok"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Fungsi bantuan untuk mendapatkan teks pratinjau dari berbagai jenis blok.
 * @param {object} block - Objek blok konten.
 * @returns {string} Teks pratinjau.
 */
function getPreviewText(block) {
  if (!block.content) return '';

  switch (block.type) {
    case 'text':
      // Ekstrak teks dari node Tiptap yang mungkin bersarang
      return block.content.content?.[0]?.content?.[0]?.text || '';
    case 'image':
      // Tampilkan URL gambar sebagai pratinjau jika tidak ada teks lain
      return block.content.src ? 'Gambar' : '';
    case 'checklist':
    case 'code':
      // Ini sudah benar untuk checklist dan code
      return block.content.content || '';
    default:
      return '';
  }
}

/**
 * Komponen Sidebar utama.
 * Menampilkan daftar semua catatan dan memungkinkan interaksi seperti menghapus catatan atau blok.
 */
export default function Sidebar() {
  const notes = useNoteStore((state) => state.notes);
  const deleteNoteFromStore = useNoteStore((state) => state.deleteNote);
  const updateNoteInStore = useNoteStore((state) => state.updateNote);
  const navigate = useNavigate();

  /**
   * Menangani penghapusan catatan secara permanen dari UI dan database.
   */
  // MENGHAPUS CATATAN PERMANEN (Hingga ke Database)
  const handleDeleteNote = async (noteId) => {
    try {
      // 1. Tembak API untuk menghapus di database
      await axiosInstance.delete(`/notes/${noteId}`);
      
      // 2. Jika sukses, hapus dari tampilan UI (Sidebar)
      deleteNoteFromStore(noteId);
      
      // 3. Arahkan user ke halaman kosong (dashboard) agar tidak melihat catatan yang sudah dihapus
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Gagal menghapus catatan di server:", error);
      alert("Terjadi kesalahan saat menghapus catatan.");
    }
  };

  /**
   * Menangani penghapusan satu blok dari sebuah catatan.
   * Melakukan pembaruan optimis di UI terlebih dahulu, lalu mengirim perubahan ke server.
   */
  // MENGHAPUS BLOK PERMANEN (Hingga ke Database)
  const handleDeleteBlock = async (noteId, blockId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // 1. Buat susunan blok baru tanpa blok yang dihapus
    const updatedBlocks = note.blocks.filter(b => b.id !== blockId);
    
    // 2. Langsung hapus dari tampilan UI agar terasa cepat (Optimistic Update)
    updateNoteInStore({ ...note, blocks: updatedBlocks });

    try {
      // 3. Tembak API Auto-Save milikmu untuk menimpa blok di database
      await axiosInstance.put(`/notes/${noteId}`, {
        title: note.title, // Kirim ulang judul aslinya
        blocks: updatedBlocks // Kirim susunan blok yang baru (yang sudah dikurangi)
      });
    } catch (error) {
      console.error("Gagal menyimpan perubahan hapus blok ke server:", error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 font-semibold text-gray-700 flex items-center gap-2 shrink-0 h-[65px]">
        <div className="w-6 h-6 bg-blue-500 rounded text-white flex items-center justify-center text-xs">N</div>
        Mini Notion
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {notes.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-400 italic">Belum ada catatan...</div>
        ) : (
          notes.map((note) => (
            <SidebarItem 
              key={note.id} 
              note={note} 
              onDeleteNote={handleDeleteNote}
              onDeleteBlock={handleDeleteBlock}
            />
          ))
        )}
      </div>
    </aside>
  );
}
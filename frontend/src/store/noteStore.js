import { create } from 'zustand';
import axiosInstance from '../api/axios.instance';

/**
 * State management global untuk semua data yang terkait dengan catatan (notes) menggunakan Zustand.
 */
const useNoteStore = create((set) => ({
  notes: [], 
  activeNote: null, 
  blocks: [], 

  setNotes: (notes) => set({ notes }),
  setActiveNote: (note) => set((state) => {
    const blocks = note ? note.blocks || [] : [];
    return { activeNote: note, blocks };
  }),
  setActiveNoteById: (noteId) => set((state) => {
    const note = state.notes.find(n => n.id === noteId) || null;
    const blocks = note ? note.blocks || [] : [];
    return { activeNote: note, blocks };
  }),

  /**
   * Mengambil semua catatan milik pengguna dari server.
   */
  fetchNotes: async () => {
    try {
      const response = await axiosInstance.get('/notes');
      set({ notes: response.data });
    } catch (error) {
      console.error("Gagal mengambil catatan:", error);
      set({ notes: [] }); 
    }
  },

  /**
   * Menghapus catatan dari state lokal berdasarkan ID.
   */
  deleteNote: (noteId) => set((state) => ({
    notes: state.notes.filter(note => note.id !== noteId)
  })),

  /**
   * Memperbarui satu catatan dalam state lokal.
   */
  updateNote: (updatedNote) => set((state) => ({
    notes: state.notes.map(note => note.id === updatedNote.id ? updatedNote : note)
  })),

  setBlocks: (blocks) => set({ blocks }),
  
  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(block => 
      block.id === id ? { ...block, content: newContent } : block
    )
  })),

  /**
   * Menambahkan catatan baru ke awal daftar di state lokal.
   */
  addNote: (newNote) => set((state) => ({
    notes: [newNote, ...state.notes]
  })),
}));

export default useNoteStore;
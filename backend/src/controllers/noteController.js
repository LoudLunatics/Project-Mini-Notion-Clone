import prisma from '../config/db.js';

/**
 * Memformat objek note untuk dikirim ke klien.
 * Mengubah content block dari string JSON menjadi objek dan format tanggal ke ISO string.
 * @param {object} note - Objek note dari Prisma.
 * @returns {object|null} Objek note yang sudah diformat atau null.
 */
// Fungsi utilitas untuk memformat note sebelum dikirim ke frontend
const formatNoteForClient = (note) => {
  if (!note) return null;
  return {
    ...note,
    // Pastikan timestamp dikirim dalam format ISO 8601 (UTC) yang konsisten
    updated_at: note.updated_at.toISOString(),
    created_at: note.created_at.toISOString(),
    blocks: note.blocks?.map(block => ({
      ...block,
      content: block.content ? JSON.parse(block.content) : {}
    }))
  };
};

/**
 * Mengambil semua catatan milik pengguna yang sedang login.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// GET ALL NOTES (Milik User yang Login)
export const getMyNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await prisma.note.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
      
      // 🔥 TAMBAHAN KUNCI: Tarik data blocks agar Sidebar bisa melihatnya
      include: {
        blocks: {
          orderBy: { order_index: 'asc' }
        },
        LastEditedBy: { select: { id: true, email: true } }
      },
    });

    // Format semua catatan agar string JSON berubah jadi Object kembali
    const formattedNotes = notes.map(note => formatNoteForClient(note));

    res.status(200).json(formattedNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar catatan." });
  }
};

/**
 * Mengambil satu catatan spesifik berdasarkan ID.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// GET SINGLE NOTE DENGAN BLOK-BLOKNYA
export const getNoteById = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const userId = req.user.id;

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        blocks: {
          orderBy: { order_index: 'asc' }
        },
        LastEditedBy: { select: { id: true, email: true } }
      },
    });

    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan." });
    if (note.user_id != userId) return res.status(403).json({ message: "Akses ditolak." });

    const formattedNote = formatNoteForClient(note);
    res.status(200).json(formattedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuka catatan." });
  }
};

/**
 * Membuat sebuah catatan baru dengan satu blok teks default.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// CREATE NOTE BARU
export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const newNote = await prisma.note.create({
      data: {
        user_id: userId,
        title: title || "Untitled Document",
        blocks: {
          create: [
            // STRINGIFY: Karena Frontend butuh object { content: "" }
            { type: "text", content: JSON.stringify({ content: "" }), order_index: 0 }
          ]
        }
      },
      include: { blocks: true }
    });

    const formattedNote = formatNoteForClient(newNote);
    res.status(201).json(formattedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat catatan baru." });
  }
};

/**
 * Memperbarui judul dan/atau isi blok dari sebuah catatan (untuk fitur Auto-Save).
 * Menggunakan strategi "hapus dan buat ulang" untuk sinkronisasi blok.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// UPDATE JUDUL NOTE & BLOK-BLOKNYA (Auto-Save)
export const updateNote = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const { title, blocks } = req.body;

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.user_id != req.user.id) {
      return res.status(403).json({ message: "Akses ditolak. Ini bukan catatan Anda." });
    }

    const updatedNote = await prisma.$transaction(async (tx) => {
      // 1. Update Judul Catatan
      await tx.note.update({
        where: { id: noteId },
        data: { 
          title: title || "Untitled",
          updated_at: new Date(), // Selalu perbarui timestamp saat ada perubahan
          last_edited_by_id: req.user.id // Simpan siapa yang terakhir mengedit
        }
      });

      // 2. Sinkronisasi blok: Hapus semua blok lama dan buat yang baru.
      if (blocks && blocks.length > 0) {
        // Hapus blok lama hanya jika ada blok baru yang dikirim
        await tx.block.deleteMany({
          where: { note_id: noteId }
        });
        
        // Buat blok baru
        const newBlocks = blocks.map((block, index) => ({
          note_id: noteId,
          type: block.type,
          content: JSON.stringify(block.content),   
          order_index: index,
        }));
        
        await tx.block.createMany({
          data: newBlocks
        });
      }

      // 4. Ambil data terbaru
      return tx.note.findUnique({
        where: { id: noteId },
        include: {
          blocks: { orderBy: { order_index: 'asc' } },
          LastEditedBy: { select: { id: true, email: true } } // Ambil juga data user setelah update
        }
      });
    });

    const formattedUpdatedNote = formatNoteForClient(updatedNote);
    res.status(200).json(formattedUpdatedNote);
  } catch (error) {
    console.error("Gagal proses Auto-Save:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server saat menyimpan data." });
  }
};

/**
 * Menghapus sebuah catatan berdasarkan ID.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// DELETE NOTE
export const deleteNote = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    
    if (!note || note.user_id != req.user.id) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    await prisma.note.delete({ where: { id: noteId } });
    res.status(200).json({ message: "Catatan beserta isinya berhasil dihapus." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus catatan." });
  }
};
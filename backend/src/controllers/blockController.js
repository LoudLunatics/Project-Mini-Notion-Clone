import prisma from '../config/db.js';

/**
 * Helper untuk memverifikasi bahwa pengguna yang login adalah pemilik catatan.
 * @param {number} noteId - ID dari catatan.
 * @param {number} userId - ID dari pengguna.
 * @throws {Error} Lempar error jika pengguna bukan pemilik.
 */
const verifyNoteOwnership = async (noteId, userId) => {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.user_id !== userId) {
    throw new Error("Forbidden");
  }
};

/**
 * Sinkronisasi massal semua blok untuk sebuah catatan.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
export const syncBlocks = async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId);
    const userId = req.user.id;
    const { blocks } = req.body; 

    try {
      await verifyNoteOwnership(noteId, userId);
    } catch (err) {
      return res.status(403).json({ message: "Anda tidak berhak mengedit catatan ini." });
    }

    await prisma.$transaction(async (tx) => {
      await tx.block.deleteMany({ where: { note_id: noteId } });

      // Jika ada blok yang dikirim dari frontend, proses satu per satu
      if (blocks && blocks.length > 0) {
        let previousBlockId = null; // Variabel untuk menyimpan ID dari blok sebelumnya

        // Gunakan loop `for...of` untuk memproses blok secara berurutan
        for (const [index, block] of blocks.entries()) {
          const newBlock = await tx.block.create({
            data: {
              note_id: noteId,
              // LOGIKA BARU: parent_id adalah ID dari blok yang dibuat sebelumnya.
              // Untuk blok pertama, nilainya akan null.
              parent_id: previousBlockId,
              order_index: block.order_index ?? index,
              type: block.type || 'text',
              content: (block.content !== undefined && block.content !== null)
                ? JSON.stringify(block.content) : '{}',
              checked: (block.type === 'checklist') ? block.checked || false : null,
              url: (block.type === 'image') ? block.url : null,
            }
          });
          // Simpan ID blok yang baru dibuat untuk iterasi berikutnya
          previousBlockId = newBlock.id;
        }
      }
      
      await tx.note.update({
        where: { id: noteId },
        data: { updated_at: new Date() }
      });
    });

    res.status(200).json({ message: "Blok berhasil disinkronisasi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menyimpan perubahan blok." });
  }
};
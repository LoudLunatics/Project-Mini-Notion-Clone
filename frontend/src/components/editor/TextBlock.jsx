import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useMemo } from 'react';

/**
 * Mengonversi konten blok teks dari format lama (string) menjadi format JSON yang valid untuk Tiptap.
 * @param {object | { content: string }} value - Konten yang akan divalidasi.
 * @returns {object} Konten JSON yang valid untuk Tiptap.
 */
const getValidTiptapContent = (value) => {
  // Jika value sudah dalam format Tiptap (memiliki 'type'), gunakan langsung.
  if (value && value.type === 'doc') {
    return value;
  }
  // Jika value adalah format lama (misal: { content: "teks" }), ubah menjadi format Tiptap.
  const textContent = value?.content || '';
  return {
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: textContent ? [{ type: 'text', text: textContent }] : [],
    }],
  };
};

/**
 * Komponen untuk blok teks dengan dukungan rich text menggunakan Tiptap.
 * Menerima `value` dan `onChange` dari React Hook Form Controller.
 * @param {{ value: object, onChange: Function }} props
 */
export default function TextBlock({ value, onChange }) {
  const editor = useEditor({
    // Ekstensi Tiptap
    extensions: [
      StarterKit.configure({
        // Kita tidak butuh beberapa node default karena ini adalah bagian dari blok
        heading: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: 'Ketik paragraf di sini...',})
    ],
    // Konten awal dari react-hook-form
    content: getValidTiptapContent(value),
    // Dipanggil setiap kali ada perubahan di editor
    onUpdate: ({ editor }) => {
      // Dapatkan konten sebagai JSON dan kirim ke react-hook-form
      const json = editor.getJSON();
      onChange(json);
    },
  });

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}

// Anda perlu menambahkan beberapa CSS dasar untuk Tiptap, misalnya di index.css
/*
 .tiptap-editor .ProseMirror { outline: none; min-height: 1.5rem; }
 .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #adb5bd; pointer-events: none; height: 0; }
*/
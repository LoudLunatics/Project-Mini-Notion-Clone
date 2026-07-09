import { useState } from 'react';

export default function ImageBlock({ value, onChange }) {
  const { src } = value;
  
  // State lokal untuk input URL
  const [urlInput, setUrlInput] = useState(src || '');
  // State untuk menentukan apakah kita sedang dalam mode input atau mode tampilan gambar
  const [isEditing, setIsEditing] = useState(!src);

  /**
   * Menyimpan URL gambar baru dan menutup mode edit.
   */
  const handleSave = () => {
    // Hanya panggil onChange jika nilainya berbeda
    if (urlInput !== src) {
      onChange({ ...value, src: urlInput });
    }
    
    // Tutup mode edit jika input tidak kosong
    if (urlInput.trim() !== '') {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group w-full">
      {!isEditing && src ? (
        <div className="relative">
          <img src={src} alt="Konten gambar" className="w-full h-auto rounded-md" />
          
          {/* Tombol edit muncul saat gambar di-hover */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-90"
          >
            Ganti Gambar
          </button>
        </div>
      ) : (
        <div className="w-full bg-gray-100 p-4 rounded-md flex gap-2">
          <input
            type="text"
            placeholder="Tempelkan URL gambar di sini..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
            autoFocus
          />
          
          {/* Tombol batal jika user berubah pikiran dan ingin kembali ke gambar lama */}
          {src && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
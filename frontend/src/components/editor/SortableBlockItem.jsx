import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Controller } from 'react-hook-form';

import TextBlock from './TextBlock.jsx';
import ChecklistBlock from './ChecklistBlock';
import ImageBlock from './ImageBlock';
import CodeBlock from './CodeBlock';

const blockComponents = {
  text: TextBlock,
  checklist: ChecklistBlock,
  image: ImageBlock,
  code: CodeBlock,
};

export default function SortableBlockItem({ field, index, control, onRemove }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const confirmTimeoutRef = useRef(null);

  /**
   * Efek untuk mengelola state konfirmasi hapus.
   * Jika pengguna mengklik tombol hapus, tombol akan berubah menjadi "Yakin?".
   * Jika tidak ada tindakan lebih lanjut dalam 3 detik, tombol akan kembali normal.
   */
  // Efek untuk mereset konfirmasi jika pengguna tidak melakukan apa-apa
  useEffect(() => {
    if (isConfirmingDelete) {
      confirmTimeoutRef.current = setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 3000); // Reset setelah 3 detik
    }

    return () => {
      clearTimeout(confirmTimeoutRef.current);
    };
  }, [isConfirmingDelete]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const BlockComponent = blockComponents[field.type];

  if (!BlockComponent) {
    return <div ref={setNodeRef} style={style} className="p-2 text-red-500">Blok tidak dikenal: {field.type}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center -ml-8 mb-2">
      {/* Tombol Drag Handle di Kiri */}
      <div className="w-10 opacity-0 group-hover:opacity-100 flex items-center justify-start transition-opacity">
        <div {...attributes} {...listeners} className="cursor-grab p-1 rounded hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="5" cy="5" r="1"></circle><circle cx="5" cy="12" r="1"></circle><circle cx="5" cy="19" r="1"></circle></svg>
        </div>
      </div>

      {/* Ini adalah "card" yang membungkus setiap blok */}
      <div className="relative flex-1 bg-white border border-transparent group-hover:border-gray-200 rounded-lg transition-all shadow-sm group-hover:shadow-md">
        {/* Tombol Hapus Blok di Kanan Atas */}
        <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100">
        {isConfirmingDelete ? (
          <button
            onClick={() => onRemove(index)}
            className="cursor-pointer px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold transition-all"
            title="Konfirmasi Hapus"
          >
            Yakin?
          </button>
        ) : (
          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
            title="Hapus Blok"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-red-500">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        </div>
        <Controller
          name={`blocks.${index}.content`}
          control={control}
          defaultValue={field.content}
          render={({ field: controllerField }) => (
            <div className="p-2"> {/* Padding di dalam card */}
              <BlockComponent {...controllerField} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
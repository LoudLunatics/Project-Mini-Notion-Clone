import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { useFieldArray, Controller } from 'react-hook-form';
import SortableBlockItem from './SortableBlockItem';

/**
 * Komponen editor utama yang mengelola semua blok konten.
 * Menggunakan Dnd-Kit untuk drag & drop dan React Hook Form untuk manajemen state.
 * @param {{ control: object }} props - Menerima `control` dari `useForm`.
 */
export default function BlockEditor({ control }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'blocks',
    keyName: 'fieldId' 
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Menangani akhir dari operasi drag & drop.
   * Memindahkan blok ke posisi baru dalam array form.
   */
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      // Gunakan fungsi 'move' dari useFieldArray
      move(oldIndex, newIndex);
    }
  }

  /**
   * Menambahkan blok baru dengan tipe tertentu ke akhir daftar.
   * @param {'text' | 'checklist' | 'image' | 'code'} type - Tipe blok yang akan ditambahkan.
   */
  function addBlock(type) {
    let content = {};
    if (type === 'checklist') {
      content = { checked: false, content: '' };
    }
    if (type === 'code') {
      content = { content: '' };
    }
    if (type === 'text') {
      content = { type: 'doc', content: [{ type: 'paragraph' }] };
    }
    append({ id: nanoid(), type, content });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="w-full relative">
        {/* Input Judul */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Untitled"
              className="w-full text-5xl font-bold mb-8 outline-none text-gray-800 placeholder-gray-300"
            />
          )}
        />

        {/* List Blok yang bisa di-drag */}
        <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
          {/* Placeholder akan muncul hanya jika tidak ada blok sama sekali */}
          {fields.length === 0 && (
            <div className="text-gray-400 pb-8">Mulai tulis dengan menambahkan blok di bawah
              
            </div>
          )}
          {fields.map((field, index) => (
            <SortableBlockItem 
              key={field.fieldId} 
              field={field}
              index={index}
              control={control}
              onRemove={remove}
            />
          ))}
        </SortableContext>

        {/* Tombol Tambah Blok */}
        <div className="mt-8 flex gap-2">
          <button onClick={() => addBlock('text')} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">+ Teks</button>
          <button onClick={() => addBlock('checklist')} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">+ Checklist</button>
          <button onClick={() => addBlock('image')} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">+ Gambar</button>
          <button onClick={() => addBlock('code')} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">+ Kode</button>
        </div>
      </div>
    </DndContext>
  );
}
import { useRef } from 'react';
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextarea';

/**
 * Komponen untuk blok checklist.
 * Menampilkan sebuah checkbox dan area teks yang tingginya dapat menyesuaikan otomatis.
 * @param {{ value: { checked: boolean, content: string }, onChange: Function }} props
 */
export default function ChecklistBlock({ value, onChange }) {
  const textareaRef = useRef(null);
  useAutoResizeTextarea(textareaRef, value.content);

  return (
    <div className="flex items-start">
      {/* Area Checkbox */}
      <div className="pt-1.5 pr-3">
        <input 
          type="checkbox" 
          checked={value.checked || false}
          onChange={(e) => onChange({ ...value, checked: e.target.checked })}
          className="w-4 h-4 text-gray-800 bg-gray-100 border-gray-300 rounded focus:ring-gray-800 cursor-pointer transition-all"
        />
      </div>

      {/* Area Input Teks Checklist */}
      <textarea
        ref={textareaRef}
        value={value.content || ''}
        onChange={(e) => onChange({ ...value, content: e.target.value })}
        placeholder="Ketik item untuk checklist..."
        className={`flex-1 outline-none min-h-[1.5rem] py-1.5 transition-all ${
          value.checked ? 'line-through text-gray-400' : 'text-gray-800'
        } bg-transparent resize-none w-full`}
        rows={1}
      />
    </div>
  );
}
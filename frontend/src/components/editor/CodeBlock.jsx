/**
 * Komponen untuk blok kode.
 * Menampilkan sebuah textarea dengan gaya monospasi untuk menulis kode.
 */
export default function CodeBlock({ value, onChange }) {
  return (
    <textarea
      placeholder="// Tulis kodemu di sini..."
      value={value.content || ''}
      onChange={(e) => onChange({ ...value, content: e.target.value })}
      className="w-full p-3 font-mono text-sm bg-gray-900 text-gray-200 rounded-md focus:outline-none resize-y"
      rows={5}
    />
  );
}
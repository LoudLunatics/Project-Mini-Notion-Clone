export default function Input({ placeholder, value, onChange, type = 'text', className = '', ...props }) {
  return (
    <input
      {...props}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition-all ${className}`}
    />
  );
}
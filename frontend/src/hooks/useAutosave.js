import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook untuk menyimpan data secara otomatis setelah jeda waktu tertentu (debounce).
 * @param {*} value - Nilai (data) yang akan dipantau perubahannya.
 * @param {number} delay - Jeda waktu dalam milidetik sebelum penyimpanan dilakukan.
 * @param {Function} saveCallback - Fungsi yang akan dipanggil untuk menyimpan data.
 * @param {boolean} enabled - Flag untuk mengaktifkan atau menonaktifkan hook ini.
 */
export default function useAutosave(value, delay = 1000, saveCallback, enabled = true) {
  const [isSaving, setIsSaving] = useState(false);
  const previousValueRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!isMounted.current) {
      isMounted.current = true;
      if (value && value.blocks) {
        previousValueRef.current = JSON.stringify(value);
      }
      return;
    }

    const currentValueString = JSON.stringify(value);
    if (currentValueString === previousValueRef.current) {
      return;
    }

    const handler = setTimeout(async () => {
      setIsSaving(true);
      await saveCallback(value);
      setIsSaving(false);
      previousValueRef.current = currentValueString;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, saveCallback, enabled]);

  return isSaving;
}
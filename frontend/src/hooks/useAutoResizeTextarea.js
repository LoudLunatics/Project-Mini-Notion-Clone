import { useEffect } from 'react';

export default function useAutoResizeTextarea(ref, value) {
  useEffect(() => {
    if (ref.current) {
      const { style } = ref.current;
      style.height = 'auto'; 
      style.height = `${ref.current.scrollHeight}px`; 
    }
  }, [ref, value]); 
}
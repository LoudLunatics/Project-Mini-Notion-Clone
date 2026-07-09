import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user-info')),
  
  login: (userData) => {
    localStorage.setItem('user-info', JSON.stringify(userData));
    set({ user: userData });
  },
  
  logout: () => {
    localStorage.removeItem('user-info');
    set({ user: null });
  },
}));

export default useAuthStore;
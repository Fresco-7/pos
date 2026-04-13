import { create } from 'zustand';

interface ApiModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useApiModal = create<ApiModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useApiModal;

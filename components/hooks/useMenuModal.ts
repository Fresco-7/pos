import { create } from 'zustand';

interface MenuModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMenuModal = create<MenuModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useMenuModal;

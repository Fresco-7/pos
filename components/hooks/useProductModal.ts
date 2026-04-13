import { create } from 'zustand';

interface ProductModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProductModal = create<ProductModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useProductModal;

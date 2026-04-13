import { create } from 'zustand';

interface SideModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSideModal = create<SideModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useSideModal;

import { create } from 'zustand';

interface RestaurantModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRestaurantModal = create<RestaurantModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useRestaurantModal;

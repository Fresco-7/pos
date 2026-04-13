import { Stock, Side } from '@prisma/client';
import { create } from 'zustand';
interface EditProductModal {
  isOpen: boolean;
  onOpen: (side : Side & {Stock : Stock | null}) => void;
  onClose: () => void;
  side : (Side & {Stock : Stock | null}) | null

}


const useAddStockModal = create<EditProductModal>((set) => ({
  isOpen: false, 
  onOpen: (side) => set({ isOpen: true, side }),
  onClose: () => set({ isOpen: false, side: null }),
  side: null,
}));

export default useAddStockModal;
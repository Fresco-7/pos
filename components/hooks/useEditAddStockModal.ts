import { db } from '@/lib/db';
import { Category, Side_Product, Product, Restrictions, Restrictions_Product, Stock, Side } from '@prisma/client';
import { create } from 'zustand';
interface EditMenuModal {
    isOpen: boolean;
    onOpen: (side: Side & { Stock: Stock | null }) => void;
    onClose: () => void;
    side: Side & {
        Stock: Stock | null
    } | null

}
const useEditAddStockModalModal = create<EditMenuModal>((set) => ({
    isOpen: false,
    onOpen: (side) => set({ isOpen: true, side }),
    onClose: () => set({ isOpen: false, side: null }),
    side: null,
}));
export default useEditAddStockModalModal;
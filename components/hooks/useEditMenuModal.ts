import { db } from '@/lib/db';
import { Category, Menu, Product, Restrictions, Restrictions_Product, Stock } from '@prisma/client';
import { create } from 'zustand';
import { MenuWithProduct } from '../tabels/menu/menuColumns';
interface EditMenuModal {
  isOpen: boolean;
  onOpen: (menu : MenuWithProduct) => void;
  onClose: () => void;
  menu : MenuWithProduct | null
  
}
const useEditMenuModal = create<EditMenuModal>((set) => ({
  isOpen: false, 
  onOpen: (menu) => set({ isOpen: true, menu }),
  onClose: () => set({ isOpen: false, menu: null }),
  menu: null,
}));

export default useEditMenuModal;
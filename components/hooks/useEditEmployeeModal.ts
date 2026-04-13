import { db } from '@/lib/db';
import { Category, Employee, Product, Restrictions, Restrictions_Product, Stock, User } from '@prisma/client';
import { create } from 'zustand';
interface EditProductModal {
  isOpen: boolean;
  onOpen: (employee :(Employee & { user: User })) => void;
  onClose: () => void;
  employee : (Employee & { user: User })  | null
  
}
const useEditProductModal = create<EditProductModal>((set) => ({
  isOpen: false, 
  onOpen: (employee) => set({ isOpen: true, employee }),
  onClose: () => set({ isOpen: false, employee: null }),
  employee: null,
}));

export default useEditProductModal;
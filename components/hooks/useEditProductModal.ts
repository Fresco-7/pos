import { db } from '@/lib/db';
import { Category, Side_Product, Product, Restrictions, Restrictions_Product, Stock } from '@prisma/client';
import { create } from 'zustand';
interface EditProductModal {
  isOpen: boolean;
  onOpen: (product : (Product & {  category : Category, Restrictions_Product : Restrictions_Product[], 'Side_Product' : Side_Product[]})) => void;
  onClose: () => void;
  product : (Product & { category : Category, Restrictions_Product : Restrictions_Product[], 'Side_Product' : Side_Product[]}) | null
  
}
const useEditProductModal = create<EditProductModal>((set) => ({
  isOpen: false, 
  onOpen: (product) => set({ isOpen: true, product }),
  onClose: () => set({ isOpen: false, product: null }),
  product: null,
}));

export default useEditProductModal;

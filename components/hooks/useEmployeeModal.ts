import { create } from 'zustand';

interface EmployeeModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEmployeeModal = create<EmployeeModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useEmployeeModal;

"use client"
import useMenuModal from '@/components/hooks/useMenuModal';
import { Button } from '@/components/ui/button';

const MenuActions = () => {
  const menuModal = useMenuModal();

  return (
    <>
      <div className='md:flex gap-2 flex-1'>
        <Button className='w-full mt-2 md:mt-0' onClick={() => menuModal.onOpen()}>Create Menu</Button>
      </div>
    </>
  )
}

export default MenuActions;
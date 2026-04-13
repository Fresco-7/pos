"use client"
import useEmployeeModal from '@/components/hooks/useEmployeeModal';
import { Button } from '@/components/ui/button';

const EmployeeActions = () => {
  const employeeModal = useEmployeeModal();

  return (
    <>
      <div className='md:flex gap-2 flex-1'>
        <Button className='w-full mt-2 md:mt-0' onClick={() => employeeModal.onOpen()}>Add Employee</Button>
      </div>
    </>
  )
}

export default EmployeeActions;
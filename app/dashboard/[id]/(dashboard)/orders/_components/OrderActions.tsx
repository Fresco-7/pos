"use client"


import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OrderActions = ({ params }: { params: { id: string } }) => {

  return (
    <>
      <div className='md:flex gap-2 flex-1'>
        <Link href={`/dashboard/${params.id}/order-mode`}><Button className='w-full mt-2 md:mt-0'>Order Mode</Button></Link>
      </div>
    </>
  )
}

export default OrderActions;
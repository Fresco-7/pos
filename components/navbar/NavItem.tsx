'use client'

import { NAVBAR_LINKS } from '@/config/routes'
import { Button } from '../ui/button'
import Link from 'next/link'

type Category = (typeof NAVBAR_LINKS)[number]

interface NavItemProps {
  category: Category
}

const NavItem = ({
  category,
}: NavItemProps) => {
  return (
    <div className='flex'>
      <div className='relative flex items-center '>
        <Link href={category.value}>
          <Button
            className='lg:gap-1.5 text-foreground'
            variant={'link'}>
            {category.label}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NavItem
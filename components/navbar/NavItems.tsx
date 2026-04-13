'use client'

import { useRef } from 'react'
import NavItem from './NavItem'

const NavItems = ( {navLinks} : {navLinks : navbarLink[]}) => {
  const navRef = useRef<HTMLDivElement | null>(null)
  return (
    <div className='flex gap-1 h-full items-center ' ref={navRef}>
        {navLinks.map((category) => {
        return (  
            <NavItem
              category={category}
              key={category.value}
            />
        )
        })}
    </div>
    )
}  

export default NavItems
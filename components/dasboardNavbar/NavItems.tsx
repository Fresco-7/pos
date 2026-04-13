'use client'

import { usePathname } from 'next/navigation'
import { useRef } from 'react'

const NavItems = () => {
  const navRef = useRef<HTMLDivElement | null>(null)
  const urlPath = usePathname();
  return (
    <>


    </>
  )
}

export default NavItems
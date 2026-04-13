
import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWithWrapper'
const Footer = () => {
  return (
    <footer className='bg-card px-4 border-t border-muted-foreground/20 z-50' >
      <MaxWidthWrapper className='py-8'>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <a href="https://kitchenpos.online/" className="flex items-center mb-4 sm:mb-0 md:mb-0 space-x-3 rtl:space-x-reverse">

            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">POS Kitchen</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">

            <li>
              <Link href={'/terms'}><span className='hover:underline me-4 md:me-6'>Terms</span></Link>
            </li>
            <li>
              <Link href={'/privacy'}><span className='hover:underline me-4 md:me-6'>Privacy</span></Link>
            </li>
            <li>
              <Link href={'/contacts'}><span className='hover:underline'>Contact</span></Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto border-t border-muted-foreground/20" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">© 2023 <a href={`${process.env.BASE_URL}`} className="hover:underline">POS Kitchen</a>. All Rights Reserved.</span>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer